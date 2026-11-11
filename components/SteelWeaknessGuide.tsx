import Link from 'next/link';
import type { TypeId } from '@/lib/types';
import offenseJson from '@/data/typeChart.json';
import defenseJson from '@/data/defensiveTypeChart.json';

const TYPES:TypeId[]=['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
const offense=offenseJson as Record<TypeId,{superEffective:string[];notVeryEffective:string[];noEffect:string[]}>;
const defense=defenseJson as Record<TypeId,{weakTo:string[];resistsTo:string[];immuneTo:string[]}>;
const name=(t:string)=>t.charAt(0).toUpperCase()+t.slice(1);
const multiplier=(a:TypeId,d:TypeId):number=>defense[d].immuneTo.includes(a)?0:defense[d].weakTo.includes(a)?2:defense[d].resistsTo.includes(a)?0.5:1;
const fmt=(n:number)=>n===0.5?'½×':n===0.25?'¼×':n+'×';
const names=(a:string[])=>a.length?a.map(name).join(', '):'None';
const weaknesses=defense.steel.weakTo as TypeId[];
const changes=TYPES.filter(t=>t!=='steel').flatMap(second=>weaknesses.map(attack=>({second,attack,secondary:multiplier(attack,second),total:multiplier(attack,'steel')*multiplier(attack,second)})).filter(x=>x.total<=1));
const neutralCount=changes.filter(x=>x.total===1).length;
const immunityCount=changes.filter(x=>x.total===0).length;
export const STEEL_FAQS=[
 {question:'What is Steel-type Pokémon weak to?',answer:'Pure Steel Pokémon take 2× damage from Fire, Fighting and Ground moves. Secondary typing can increase, reduce or cancel these weaknesses.'},
 {question:'Does Fairy beat Steel Pokémon?',answer:'No. Steel resists Fairy attacks and takes ½× damage from them. Steel attacks are super effective against Fairy and deal 2× to pure Fairy.'},
 {question:'What types does Steel resist?',answer:'Pure Steel resists Normal, Grass, Ice, Flying, Psychic, Bug, Rock, Dragon, Steel and Fairy moves (½× each), and is immune to Poison (0×). Electric is neutral.'},
 {question:'What does Steel hit super effectively?',answer:'Steel moves deal 2× damage to pure Ice, Rock and Fairy, and ½× to Fire, Water, Electric and Steel.'},
 {question:'Can dual typing remove a Steel weakness?',answer:'Yes. Steel/Flying is immune to Ground (2× × 0× = 0×), while Steel/Dragon takes neutral damage from Fire (2× × ½× = 1×).'},
 {question:'What beats Steel-type Pokémon?',answer:'Fire, Fighting, and Ground moves beat a pure Steel defender at 2×. Fairy does not: Steel resists Fairy at ½× and is immune to Poison. The counter table names dataset Pokémon whose stored moves include Fire, Fighting, or Ground attacks.'}
];
export default function SteelWeaknessGuide(){
 const o=offense.steel,d=defense.steel;
 const rows:[string,string,string[]][]=[['Steel attacking','2×',o.superEffective],['Steel attacking','½×',o.notVeryEffective],['Steel attacking','0×',o.noEffect],['Steel defending','2×',d.weakTo],['Steel defending','½×',d.resistsTo],['Steel defending','0×',d.immuneTo]];
 return <article className="mb-6 rounded-lg bg-white p-6 shadow-lg text-gray-800">
 <h2 className="mb-3 text-2xl font-bold">Steel weakness: complete 18-type matchups</h2>
 <p className="mb-4">Steel is weak to Fire, Fighting and Ground (2× each), resists ten attack types (½×), and is immune to Poison (0×). Electric is neutral into Steel. Steel attacks hit Ice, Rock and Fairy for 2×. The chart below uses standard modern type effectiveness, before abilities, items or battle-specific exceptions.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><caption className="py-2 text-left">All 18 pure types, in both directions (1× is neutral)</caption><thead><tr><th scope="col">Type</th><th scope="col">Steel attack → type</th><th scope="col">Type attack → Steel</th></tr></thead><tbody>{TYPES.map(t=><tr key={t} className="border-t"><th scope="row" className="py-2">{name(t)}</th><td>{fmt(multiplier('steel',t))}</td><td>{fmt(multiplier(t,'steel'))}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Steel offense and defense</h2>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Direction</th><th>Multiplier</th><th>Types</th></tr></thead><tbody>{rows.map(([direction,factor,targets])=><tr key={direction+factor} className="border-t"><td className="py-2">{direction}</td><td>{factor}</td><td>{names(targets)}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Original, reproducible Steel matchup statistics</h2>
 <p className="mb-3">Against the 18 pure defending types, Steel attacks are super effective against {o.superEffective.length}, resisted by {o.notVeryEffective.length}, blocked by {o.noEffect.length}, and neutral against {18-o.superEffective.length-o.notVeryEffective.length-o.noEffect.length}. Pure Steel defense has {d.weakTo.length} weaknesses, {d.resistsTo.length} resistances, {d.immuneTo.length} immunities and {18-d.weakTo.length-d.resistsTo.length-d.immuneTo.length} neutral matchups.</p>
 <p className="mb-4">Across 17 different Steel/secondary-type combinations, multiply each of Steel's three original 2× weakness factors by the second type's defense factor. This yields {neutralCount} cases reduced to 1× and {immunityCount} reduced to 0×, out of {17*weaknesses.length} evaluated attack–defender interactions. These are matchup counts, not species counts. Values are derived from data/typeChart.json and data/defensiveTypeChart.json.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Defender</th><th>Attacking move</th><th>Calculation</th></tr></thead><tbody>{changes.map(x=><tr key={x.second+x.attack} className="border-t"><td className="py-2">Steel/{name(x.second)}</td><td>{name(x.attack)}</td><td>2× × {fmt(x.secondary)} = {fmt(x.total)}</td></tr>)}</tbody></table></div>
 <p className="mb-5 text-sm">Steel lost its Ghost and Dark resistances in Generation 6; both are now neutral. Fairy attacks are resisted by Steel, not super effective against it. Older-generation charts and special mechanics may differ.</p>
 <h2 id="faq" className="mb-3 scroll-mt-6 text-xl font-bold">Steel weakness FAQ</h2><div className="mb-6 space-y-4">{STEEL_FAQS.map(f=><section key={f.question}><h3 className="font-semibold">{f.question}</h3><p>{f.answer}</p></section>)}</div>
 <nav aria-label="Related Steel matchup resources" className="flex flex-wrap gap-4 text-blue-700 underline"><Link href="/pokemon/type-chart">Full Pokémon type chart</Link><Link href="/calculator?type1=steel">Steel calculator</Link><Link href="/dual-type-chart">Dual-type chart</Link><Link href="/types/psychic">Psychic weakness guide</Link><Link href="/types/ghost">Ghost weakness guide</Link></nav>
 </article>;
}