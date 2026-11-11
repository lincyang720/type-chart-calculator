#!/usr/bin/env python3
"""Append a traceable, finalized GSC two-week SEO comparison. Read-only GSC API.

No credentials and no finalized two-week window => no file changes.
Only operations/weekly-reviews.md may be written.
"""
from __future__ import annotations

import argparse
from datetime import date, datetime, timedelta
from decimal import Decimal, InvalidOperation
import json
import os
from pathlib import Path
import sys
from urllib.parse import quote
from zoneinfo import ZoneInfo

PAGES = ("ghost", "poison", "dark", "psychic")
KEYWORDS = {
    "ghost": ("ghost type weakness", "ghost weakness"),
    "poison": ("poison type weakness", "poison weakness"),
    "dark": ("dark type weakness", "dark weakness"),
    "psychic": ("psychic type weakness", "psychic weakness", "what is psychic weak to"),
}
PROPERTY = "https://www.typematchup.org/"
OUTPUT = Path("operations/weekly-reviews.md")
SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"


def windows(today: date):
    """Two complete Monday-Sunday weeks immediately before the current week."""
    end = today - timedelta(days=today.weekday() + 1)
    current = (end - timedelta(days=6), end)
    previous = (end - timedelta(days=13), end - timedelta(days=7))
    return previous, current


def as_number(value, *, name: str) -> Decimal:
    if isinstance(value, bool):
        raise ValueError(f"Invalid {name}: boolean")
    try:
        result = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError(f"Invalid {name}") from exc
    if not result.is_finite() or result < 0:
        raise ValueError(f"Invalid {name}: nonfinite or negative")
    return result


def read_metrics(response: dict, expected_key: str | None = None):
    rows = response.get("rows", [])
    if not isinstance(rows, list):
        raise ValueError("GSC rows must be a list")
    if not rows:
        return None  # No reported row; not equivalent to measured zero.
    if len(rows) != 1:
        raise ValueError("Expected one GSC row for an exact filter")
    row = rows[0]
    if expected_key is not None and row.get("keys") != [expected_key]:
        raise ValueError("GSC returned a nonmatching row key")
    clicks = as_number(row.get("clicks"), name="clicks")
    impressions = as_number(row.get("impressions"), name="impressions")
    if clicks != clicks.to_integral_value() or impressions != impressions.to_integral_value() or clicks > impressions:
        raise ValueError("Invalid click/impression counts")
    position = as_number(row.get("position"), name="position") if impressions else None
    if position is not None and position < 1:
        raise ValueError("GSC average position must be >=1")
    return {"clicks": int(clicks), "impressions": int(impressions), "position": position}


def display_metrics(metrics):
    if metrics is None:
        return ["未返回", "未返回", "未返回", "未返回"]
    clicks, impressions = metrics["clicks"], metrics["impressions"]
    ctr = f"{(Decimal(clicks) / Decimal(impressions) * 100):.3f}%" if impressions else "无定义"
    position = f"{metrics['position']:.2f}" if metrics["position"] is not None else "无定义"
    return [str(impressions), str(clicks), ctr, position]


def compare_sentence(old, new):
    if old is None or new is None:
        return "有区间未返回记录，不能判断趋势"
    imp_change = new["impressions"] - old["impressions"]
    click_change = new["clicks"] - old["clicks"]
    return f"曝光 {imp_change:+,}；点击 {click_change:+,}；排名/CTR 变化仍需结合搜索需求与 SERP 判断"


def validate_date_coverage(response, start, end):
    rows = response.get("rows", [])
    expected = {(start + timedelta(days=n)).isoformat() for n in range((end - start).days + 1)}
    if not isinstance(rows, list):
        raise ValueError("GSC date rows malformed")
    got = set()
    for row in rows:
        keys = row.get("keys", [])
        if not isinstance(keys, list) or len(keys) != 1:
            raise ValueError("GSC date keys malformed")
        got.add(keys[0])
    if got != expected or len(rows) != len(expected):
        missing = sorted(expected - got)
        raise RuntimeError(f"Missing finalized GSC date rows ({len(missing)} days). No write; missing: {', '.join(missing)}")


class SearchConsole:
    def __init__(self, service_account_json: str, property_url: str):
        import google.auth.transport.requests
        from google.oauth2 import service_account
        import requests

        info = json.loads(service_account_json)
        if info.get("type") != "service_account":
            raise ValueError("Expected a Google service account JSON key")
        self.credentials = service_account.Credentials.from_service_account_info(info, scopes=[SCOPE])
        self.credentials.refresh(google.auth.transport.requests.Request())
        self.session = requests.Session()
        self.url = "https://www.googleapis.com/webmasters/v3/sites/" + quote(property_url, safe="") + "/searchAnalytics/query"

    def query(self, start: date, end: date, dimensions, filters=None):
        body = {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "type": "web",
            "dataState": "final",
            "dimensions": list(dimensions),
            "rowLimit": 25000,
        }
        if filters:
            body["aggregationType"] = "byPage"
            body["dimensionFilterGroups"] = [{"groupType": "and", "filters": [
                {"dimension": key, "operator": "equals", "expression": value}
                for key, value in filters
            ]}]
        else:
            body["aggregationType"] = "byProperty"
        response = self.session.post(
            self.url,
            headers={"Authorization": f"Bearer {self.credentials.token}", "Content-Type": "application/json"},
            json=body,
            timeout=35,
        )
        response.raise_for_status()
        data = response.json()
        if not isinstance(data, dict):
            raise ValueError("Unexpected GSC API response")
        return data


def collect(api, previous, current):
    # Fetch all site-wide dates first. A missing day is ambiguous (freshness, true zero,
    # or unavailable), so fail closed instead of silently calling it zero.
    validate_date_coverage(
        api.query(previous[0], current[1], ["date"]),
        previous[0], current[1],
    )
    pages = {}
    terms = {}
    for name in PAGES:
        url = f"{PROPERTY}types/{name}"
        for label, dates in (("previous", previous), ("current", current)):
            page_response = api.query(dates[0], dates[1], ["page"], [("page", url)])
            pages[(name, label)] = read_metrics(page_response, expected_key=url)
            for term in KEYWORDS[name]:
                query_response = api.query(
                    dates[0], dates[1], ["query"],
                    [("page", url), ("query", term)],
                )
                terms[(name, term, label)] = read_metrics(query_response, expected_key=term)
    return pages, terms


def render(previous, current, pages, terms):
    marker = f"<!-- GSC_WEEKLY_REPORT:{current[0]}:{current[1]} -->"
    lines = [
        marker,
        f"## GSC 自动复盘｜{current[0]} 至 {current[1]}",
        "",
        f"- **本期：** {current[0]} 至 {current[1]}（周一至周日）",
        f"- **对比期：** {previous[0]} 至 {previous[1]}（周一至周日）",
        "- **来源：** Google Search Console 官方 Search Analytics API；资源 \`https://www.typematchup.org/\`；搜索类型 \`web\`；\`dataState=final\`；未额外筛选国家或设备",
        "- **口径：** 页面为 \`page\` 精确匹配；查询词为 \`page + query\` 精确匹配。未返回不等于零；不等于所有查询的完整覆盖。",
        "",
        "| 页面 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 | 观察 |",
        "|---|---:|---:|---:|---:|---:|---:|---:|---:|---|",
    ]
    for name in PAGES:
        old, new = pages[(name, "previous")], pages[(name, "current")]
        new_imp, new_click, new_ctr, new_position = display_metrics(new)
        old_imp, old_click, old_ctr, old_position = display_metrics(old)
        lines.append(
            f"| [`{name}`](https://www.typematchup.org/types/{name}) | {new_imp} | {old_imp} "
            f"| {new_click} | {old_click} | {new_ctr} | {old_ctr} | {new_position} | {old_position} "
            f"| {compare_sentence(old, new)} |"
        )
    lines.extend([
        "",
        "### 核心查询（分别按页面与查询词精确筛选）",
        "",
        "| 页面 | 查询词 | 本期曝光 | 上期曝光 | 本期点击 | 上期点击 | 本期 CTR | 上期 CTR | 本期平均排名 | 上期平均排名 |",
        "|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ])
    for name in PAGES:
        for term in KEYWORDS[name]:
            old, new = terms[(name, term, "previous")], terms[(name, term, "current")]
            n_imp, n_click, n_ctr, n_pos = display_metrics(new)
            o_imp, o_click, o_ctr, o_pos = display_metrics(old)
            lines.append(f"| {name} | \`{term}\` | {n_imp} | {o_imp} | {n_click} | {o_click} | {n_ctr} | {o_ctr} | {n_pos} | {o_pos} |")
    lines.extend([
        "",
        "**实验状态：** ⏳ EXP-20261111-01 继续观察（[PR #30](https://github.com/lincyang720/type-chart-calculator/pull/30)，2026-11-11 上线）。",
        "**解释：** 以上是 GSC 观察性数据，不能直接证明变更导致了变化；同周 SERP、搜索需求、抓取时间等因素未受到控制。",
        "",
    ])
    return "\n".join(lines)


def append_report(path: Path, rendered: str):
    marker = rendered.splitlines()[0]
    if path.exists():
        original = path.read_text(encoding="utf-8")
    else:
        raise FileNotFoundError(f"Refusing to create missing source report: {path}")
    if marker in original:
        return False
    new_text = original.rstrip("\n") + "\n\n---\n\n" + rendered.rstrip("\n") + "\n"
    path.write_text(new_text, encoding="utf-8")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print data-backed report; do not write")
    parser.add_argument("--as-of", type=date.fromisoformat, help="Override local date for testing")
    args = parser.parse_args()
    if not os.environ.get("GSC_SERVICE_ACCOUNT_JSON"):
        raise RuntimeError("Missing GSC_SERVICE_ACCOUNT_JSON secret; no report written")
    property_url = os.environ.get("GSC_SITE_URL", PROPERTY)
    if property_url != PROPERTY:
        raise RuntimeError("Unexpected GSC site property; refuse to write")
    today = args.as_of or datetime.now(ZoneInfo("Asia/Taipei")).date()
    previous, current = windows(today)
    report_marker = f"<!-- GSC_WEEKLY_REPORT:{current[0]}:{current[1]} -->"
    if not args.dry_run and OUTPUT.exists() and report_marker in OUTPUT.read_text(encoding="utf-8"):
        print("Already recorded the requested weekly period; nothing to append.")
        return
    api = SearchConsole(os.environ["GSC_SERVICE_ACCOUNT_JSON"], property_url)
    pages, terms = collect(api, previous, current)
    rendered = render(previous, current, pages, terms)
    if args.dry_run:
        print(rendered)
        return
    changed = append_report(OUTPUT, rendered)
    print(f"Appended finalized two-week GSC comparison: {current[0]}..{current[1]}" if changed else "Already recorded")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Never print tokens or full Google API response payloads.
        print(f"GSC weekly report aborted without writing new data: {type(exc).__name__}: {exc}", file=sys.stderr)
        sys.exit(1)
