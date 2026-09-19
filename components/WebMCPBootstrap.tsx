/**
 * WebMCP bootstrap.
 *
 * Registers read-only browser tools through `navigator.modelContext` so an in-page
 * agent can answer type-matchup questions without scraping the DOM.
 *
 * Design constraints:
 *  - Runs synchronously at parse time (no hydration wait) so tools exist on load.
 *  - Never touches the DOM and never blocks rendering; the whole thing is wrapped in
 *    try/catch so a browser without support (or with it locked down) is unaffected.
 *  - Every tool delegates to the real MCP server, so results match the site's data.
 */

const WEBMCP_SCRIPT = `
(function () {
  try {
    var MCP = 'https://www.typematchup.org/api/mcp';

    if (!navigator.modelContext) {
      var ctx = {
        tools: [],
        registerTool: function (t) { ctx.tools.push(t); return t; },
        provideContext: function (c) {
          var list = (c && c.tools) || [];
          for (var i = 0; i < list.length; i++) { ctx.registerTool(list[i]); }
        },
        unregisterTool: function (n) {
          ctx.tools = ctx.tools.filter(function (t) { return t.name !== n; });
        },
        clearContext: function () { ctx.tools = []; }
      };
      try {
        Object.defineProperty(navigator, 'modelContext', {
          value: ctx, configurable: true, writable: true
        });
      } catch (e) {
        navigator.modelContext = ctx;
      }
    }

    function callTool(name, args) {
      return fetch(MCP, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1, method: 'tools/call',
          params: { name: name, arguments: args || {} }
        })
      }).then(function (r) { return r.json(); }).then(function (j) {
        var sc = j && j.result && j.result.structuredContent;
        return sc ? JSON.stringify(sc) : JSON.stringify(j);
      });
    }

    var tools = [
      {
        name: 'typematchup_calculate_matchup',
        description: 'Damage multiplier when an attacking Pokemon type hits one or two defending types (0x/0.25x/0.5x/1x/2x/4x).',
        inputSchema: {
          type: 'object',
          properties: {
            attacking: { type: 'string', description: 'Attacking type id, e.g. "ice".' },
            defending: { type: 'array', items: { type: 'string' }, description: 'One or two defending type ids.' }
          },
          required: ['attacking', 'defending']
        },
        execute: function (a) {
          return callTool('calculate_matchup', { attacking: a.attacking, defending: a.defending });
        }
      },
      {
        name: 'typematchup_defensive_profile',
        description: 'Weaknesses, resistances and immunities for a single or dual Pokemon type.',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'First defending type id, e.g. "water".' },
            type2: { type: 'string', description: 'Optional second defending type id.' }
          },
          required: ['type']
        },
        execute: function (a) {
          return callTool('get_defensive_profile', { type: a.type, type2: a.type2 });
        }
      },
      {
        name: 'typematchup_list_types',
        description: 'List the 18 Pokemon types with a short description of each.',
        inputSchema: { type: 'object', properties: {} },
        execute: function () { return callTool('list_types', {}); }
      }
    ];

    var mc = navigator.modelContext;
    if (typeof mc.provideContext === 'function') {
      mc.provideContext({ tools: tools });
    }
    if (mc.tools && typeof mc.registerTool === 'function') {
      for (var i = 0; i < tools.length; i++) {
        if (mc.tools.indexOf(tools[i]) === -1) { mc.registerTool(tools[i]); }
      }
    }
  } catch (e) {
    /* WebMCP is best-effort: never break the page for humans. */
  }
})();
`;

export default function WebMCPBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: WEBMCP_SCRIPT }} />;
}
