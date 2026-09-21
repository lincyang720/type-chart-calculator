import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pokemon Type Matchups: Full 18-Type Chart & Calculator',
  description:
    'Look up any Pokemon type matchup in seconds. Interactive type calculator, the full 18-type effectiveness chart, dual-type math, STAB, and how the chart changed across generations.',
};

const STYLE = `
  :root{--bg:#fff;--fg:#1a1a1a;--muted:#666;--line:#e2e2e2;--accent:#3b5bdb;--good:#1f9d55;--bad:#d64545;--card:#f7f8fa}
  *{box-sizing:border-box}
  body{margin:0;font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif;color:var(--fg);background:var(--bg)}
  .wrap{max-width:960px;margin:0 auto;padding:24px 18px 64px}
  h1{font-size:30px;line-height:1.2;margin:0 0 6px}
  h2{font-size:22px;margin:40px 0 10px;border-top:1px solid var(--line);padding-top:24px}
  h3{font-size:17px;margin:22px 0 8px}
  p{margin:8px 0}
  a{color:var(--accent);text-decoration:none}
  a:hover{text-decoration:underline}
  .lede{color:var(--muted);font-size:17px;margin:6px 0 0}
  .nav{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
  .nav a{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:14px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;margin:14px 0}
  .tool{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .tool label{display:block;font-size:13px;color:var(--muted);margin-bottom:4px}
  select{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:15px;background:#fff}
  .result{grid-column:1/-1;text-align:center;padding:16px;border-radius:10px;background:#fff;border:1px solid var(--line)}
  .mult{font-size:34px;font-weight:700}
  .mult.hi{color:var(--good)} .mult.lo{color:var(--bad)} .mult.none{color:var(--bad)}
  .key{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--muted);margin-top:8px}
  table{border-collapse:collapse;width:100%;font-size:12px;margin-top:10px}
  th,td{border:1px solid var(--line);padding:5px 4px;text-align:center}
  th{background:var(--card);position:sticky;top:0}
  td.rowh{background:var(--card);font-weight:600;text-align:left;white-space:nowrap}
  .v2{background:#e7f7ee;color:#157a40;font-weight:600}
  .v05{background:#fdeaea;color:#b53030;font-weight:600}
  .v0{background:#fbe3e3;color:#a32020;font-weight:700}
  .v025{background:#fbdada;color:#9c1d1d;font-weight:700}
  .scroll{overflow-x:auto}
  .small{font-size:13px;color:var(--muted)}
  footer{border-top:1px solid var(--line);margin-top:48px;padding-top:20px;font-size:13px;color:var(--muted)}
  code{background:var(--card);padding:1px 5px;border-radius:4px}
  @media(max-width:560px){.tool{grid-template-columns:1fr}.mult{font-size:28px}}
`;

const BODY = `<div class="wrap">

  <h1>Pokémon Type Matchups</h1>
  <p class="lede">The full 18-type effectiveness chart, an interactive calculator, the dual-type math, and how the chart evolved — on one page.</p>

  <nav class="nav" aria-label="Jump to section">
    <a href="#tool">Calculator</a>
    <a href="#about">How matchups work</a>
    <a href="#chart">Full type chart</a>
    <a href="#dual">Dual-type math</a>
    <a href="#history">How the chart changed</a>
    <a href="#archive">Dead-site archive note</a>
    <a href="#who">Who made this</a>
  </nav>

  <h2 id="tool">Type matchup calculator</h2>
  <div class="card">
    <div class="tool">
      <div>
        <label for="atk">Attacking type (the move's type)</label>
        <select id="atk"></select>
      </div>
      <div>
        <label for="def1">Defending type 1</label>
        <select id="def1"></select>
      </div>
      <div>
        <label for="def2">Defending type 2 (optional, for dual-types)</label>
        <select id="def2"><option value="-1">— none —</option></select>
      </div>
      <div>
        <label for="stab">Add STAB?</label>
        <select id="stab"><option value="1">No</option><option value="1.5">Yes (+50%)</option></select>
      </div>
      <div class="result">
        <div class="mult" id="mult">1×</div>
        <div class="small" id="multnote">Pick a move type and a defending type.</div>
      </div>
    </div>
    <div class="key">
      <span><b>2×</b> super-effective</span><span><b>1×</b> neutral</span>
      <span><b>½×</b> not very effective</span><span><b>0×</b> no effect</span>
      <span>Dual-types multiply (e.g. 2× × ½× = 1×)</span>
    </div>
  </div>

  <h2 id="about">How type matchups work</h2>
  <div class="card">
    <p>Every Pokémon and every move belongs to one (or two) <b>types</b>. When a move hits a Pokémon, the game multiplies the damage by a fixed <b>effectiveness</b> value based on the move's type versus the defender's type(s):</p>
    <ul>
      <li><b>2×</b> — super-effective (the message "It's super effective!")</li>
      <li><b>1×</b> — neutral</li>
      <li><b>½×</b> — not very effective ("It's not very effective…")</li>
      <li><b>0×</b> — no effect at all</li>
    </ul>
    <p>A Pokémon with two types takes the product of both. A Water move into a Ground/Rock defender is <b>2× × 2× = 4×</b> (quadruple). A Grass move into a Water/Poison defender is <b>2× × ½× = 1×</b> — "super-effective" on screen, but mathematically neutral. Always multiply, don't trust the label.</p>
    <p><b>STAB</b> (Same-Type Attack Bonus) adds <b>×1.5</b> when the user shares a type with the move. STAB stacks with type effectiveness: a Water Pokémon using a Water move into a Ground/Rock target is <b>1.5 × 2 × 2 = 6×</b>.</p>
  </div>

  <h2 id="chart">Full 18-type effectiveness chart</h2>
  <p class="small">Rows = attacking type. Columns = defending type. Values are the damage multiplier. This is the Generation 6+ chart (18 types).</p>
  <div class="card scroll">
    <table id="chartTable"></table>
  </div>

  <h2 id="dual">Dual-type interactions, quickly</h2>
  <div class="card">
    <p>Only the combinations matter, not the order. A few that trip people up:</p>
    <ul>
      <li><b>Steel/Fairy</b> defends at ¼× versus Fire (Fire is ½× to both) — one of the best defensive pairs.</li>
      <li><b>Water/Ground</b> is 4× weak to Grass, but resists Fire, Water, Electric (Ground takes 0× from Electric) and Poison.</li>
      <li><b>Flying/Fire</b> is 4× weak to Rock — the classic Charizard problem.</li>
      <li><b>Dark/Ghost</b> offensively hits Psychic and Ghost at 2×, and only Fairy resists it (½×).</li>
    </ul>
  </div>

  <h2 id="history">How the chart changed across generations</h2>
  <div class="card">
    <p>Most of the chart is stable, but three moments matter:</p>
    <ul>
      <li><b>Generation 2</b> added <b>Dark</b> and <b>Steel</b>. From Gen 6 on, Ghost and Dark moves hit Steel neutrally; before that they were resisted.</li>
      <li><b>Generation 6</b> added <b>Fairy</b>, which is super-effective on Dragon, Dark, and Fighting, and resists Bug, Dark, and Fighting. This was the last structural change to the chart.</li>
      <li><b>Generation 1 quirks</b> (long fixed): Ghost was <i>not</i> effective on Psychic (later corrected to 2×); Bug was super-effective on Poison and vice-versa (later Bug resists Poison); Ice was neutral on Fire (later ½×).</li>
    </ul>
  </div>

  <h2 id="archive">Dead-site archive note (historical curiosity)</h2>
  <div class="card">
    <p>Before Generation 4, the game split moves into <b>physical</b> and <b>special</b> by the move's <i>type</i>, not by the move itself. A 2009 fan chart (archived from the now-dead site <a href="https://web.archive.org/web/2009id_/http://www.azureheights.com/compendium/typechart.htm" rel="nofollow">azureheights.com</a>) still lists only 15 types and groups them as Special = Fire/Water/Grass/Electric/Ice/Psychic, Physical = Normal/Fighting/Flying/Ground/Rock/Bug/Poison/Ghost/Dragon. That type-based split was replaced in Gen 4 (2006) when the physical/special split moved to individual moves. It's a tidy reminder that "the type chart" is itself a moving target — the 18-type, move-based version above is what current games use.</p>
    <p class="small">Source: archived dead-site snapshot, Wayback Machine, 2009-01-07. Included as original historical context, not as a current reference.</p>
  </div>

  <h2 id="who">Who made this, and why</h2>
  <div class="card">
    <p>This is a <b>fan-made reference page</b>, put together so a single lookup doesn't mean opening five tabs. No ads, no tracking, no account.</p>
    <p>The effectiveness values follow the <b>official games' defined type chart</b> — public and generation-stable. The page was written and built by a human operator; the chart is the game's documented mechanic, presented here as an original layout. If you spot a discrepancy, the in-game values always win.</p>
  </div>

  <footer>
    <p>Data: official Pokémon type-chart mechanics (Generation 6+, 18 types; publicly documented and generation-stable). Layout and text are original to this page. Not affiliated with Nintendo / Game Freak / The Pokémon Company.</p>
    <p>Historical note sourced from an archived dead-site snapshot (Wayback Machine, 2009-01-07).</p>
  </footer>

</div>`;

export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div dangerouslySetInnerHTML={{ __html: BODY }} />
      <Script src="/type-matchup-chart.js" strategy="afterInteractive" />
    </>
  );
}
