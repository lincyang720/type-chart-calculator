import importlib.util
from datetime import date, timedelta
from pathlib import Path
import tempfile
import unittest


spec = importlib.util.spec_from_file_location("gsc_weekly", Path(__file__).resolve().parents[1] / "scripts" / "gsc_weekly.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class FakeGsc:
    def __init__(self, missing_day=None, no_page=None):
        self.missing_day = missing_day
        self.no_page = no_page

    def query(self, start, end, dimensions, filters=None):
        if dimensions == ["date"]:
            days = [start + timedelta(days=i) for i in range((end - start).days + 1)]
            return {"rows": [{"keys": [d.isoformat()]} for d in days if d != self.missing_day]}
        filters = dict(filters or [])
        if dimensions == ["page"] and filters.get("page") == self.no_page:
            return {"rows": []}
        key = filters.get("page") if dimensions == ["page"] else filters.get("query")
        return {"rows": [{"keys": [key], "impressions": 40, "clicks": 2, "position": 7.25}]}


class WeeklyReportTests(unittest.TestCase):
    def setUp(self):
        self.previous, self.current = mod.windows(date(2026, 11, 19))

    def test_monday_sunday_two_weeks(self):
        self.assertEqual(self.previous, (date(2026, 11, 2), date(2026, 11, 8)))
        self.assertEqual(self.current, (date(2026, 11, 9), date(2026, 11, 15)))

    def test_missing_site_date_fails_closed(self):
        with self.assertRaisesRegex(RuntimeError, "Missing finalized"):
            mod.collect(FakeGsc(missing_day=date(2026, 11, 15)), self.previous, self.current)

    def test_no_page_row_not_reported_as_zero(self):
        pages, terms = mod.collect(
            FakeGsc(no_page="https://www.typematchup.org/types/ghost"),
            self.previous, self.current,
        )
        self.assertIsNone(pages[("ghost", "current")])
        report = mod.render(self.previous, self.current, pages, terms)
        self.assertIn("未返回", report)
        self.assertIn("GSC_WEEKLY_REPORT:2026-11-09:2026-11-15", report)

    def test_idempotent_append_never_overwrites_history(self):
        pages, terms = mod.collect(FakeGsc(), self.previous, self.current)
        text = mod.render(self.previous, self.current, pages, terms)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "weekly-reviews.md"
            path.write_text("# Historical weekly SEO reviews\n\nOld evidence remains.\n", encoding="utf-8")
            self.assertTrue(mod.append_report(path, text))
            first = path.read_text(encoding="utf-8")
            self.assertIn("Old evidence remains.", first)
            self.assertFalse(mod.append_report(path, text))
            self.assertEqual(first, path.read_text(encoding="utf-8"))

    def test_invalid_gsc_row_is_rejected(self):
        with self.assertRaises(ValueError):
            mod.read_metrics({"rows": [{"keys": ["x"], "clicks": 9, "impressions": 2, "position": 5}]}, "x")


if __name__ == "__main__":
    unittest.main()
