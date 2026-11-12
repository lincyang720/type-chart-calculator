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
const weaknesses=defense.fairy.weakTo as TypeId[];
const changes=TYPES.filter(t=>t!=='fairy').flatMap(second=>weaknesses.map(attack=>({second,attack,secondary:multiplier(attack,second),total:multiplier(attack,'fairy')*multiplier(attack,second)})).filter(x=>x.total<=1));
const neutralCount=changes.filter(x=>x.total===1).length;
const immunityCount=changes.filter(x=>x.total===0).length;
export const FAIRY_FAQS=[
 {question:'What is Fairy-type Pokémon weak to?',answer:'Pure Fairy Pokémon take 2× damage from Poison and Steel attacks. A second defending type can change the final multiplier.'},
 {question:'Does Dragon beat Fairy Pokémon?',answer:'No. Fairy Pokémon are immune to Dragon attacks (0×). Fairy moves deal 2× damage against pure Dragon Pokémon.'},
 {question:'What types does Fairy resist?',answer:'Pure Fairy resists Fighting, Bug and Dark moves (½× each), is immune to Dragon (0×), and is weak to Poison and Steel.'},
 {question:'What does Fairy hit super effectively?',answer:'Fairy attacks deal 2× to pure Fighting, Dragon and Dark Pokémon. Fire, Poison and Steel resist Fairy attacks (½×).'},
 {question:'Can dual typing cancel a Fairy weakness?',answer:'Yes. Fairy/Ghost takes neutral damage from Poison (2× × ½× = 1×), while Fairy/Ground takes neutral damage from Steel (2× × ½× = 1×).'}
];
export default function FairyWeaknessGuide(){
 const o=offense.fairy,d=defense.fairy;
 const rows:[string,string,string[]][]=[['Fairy attacking','2×',o.superEffective],['Fairy attacking','½×',o.notVeryEffective],['Fairy attacking','0×',o.noEffect],['Fairy defending','2×',d.weakTo],['Fairy defending','½×',d.resistsTo],['Fairy defending','0×',d.immuneTo]];
 return <article className="mb-6 rounded-lg bg-white p-6 shadow-lg text-gray-800">
 <h2 className="mb-3 text-2xl font-bold">Fairy weakness: complete 18-type matchups</h2>
 <p className="mb-4">Fairy is weak to Poison and Steel attacks (2× each), resists Fighting, Bug and Dark (½×), and is immune to Dragon (0×). Fairy attacks are super effective against Fighting, Dragon and Dark. These are standard modern main-series type matchups before abilities, items and battle-specific mechanics.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><caption className="py-2 text-left">All 18 pure types, both attack directions (1× is neutral)</caption><thead><tr><th scope="col">Type</th><th scope="col">Fairy attack → type</th><th scope="col">Type attack → Fairy</th></tr></thead><tbody>{TYPES.map(t=><tr key={t} className="border-t"><th scope="row" className="py-2">{name(t)}</th><td>{fmt(multiplier('fairy',t))}</td><td>{fmt(multiplier(t,'fairy'))}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Fairy offense and defense</h2>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Direction</th><th>Multiplier</th><th>Types</th></tr></thead><tbody>{rows.map(([direction,factor,targets])=><tr key={direction+factor} className="border-t"><td className="py-2">{direction}</td><td>{factor}</td><td>{names(targets)}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Original, reproducible Fairy matchup statistics</h2>
 <p className="mb-3">Against 18 pure defending types, Fairy attacks are super effective against {o.superEffective.length}, resisted by {o.notVeryEffective.length}, blocked by {o.noEffect.length}, and neutral against {18-o.superEffective.length-o.notVeryEffective.length-o.noEffect.length}. Pure Fairy defense has {d.weakTo.length} weaknesses, {d.resistsTo.length} resistances, {d.immuneTo.length} immunities and {18-d.weakTo.length-d.resistsTo.length-d.immuneTo.length} neutral matchups.</p>
 <p className="mb-4">For each of 17 Fairy/secondary-type combinations and each of Fairy's two original 2× weaknesses, multiply the Fairy defensive factor by the second type's factor. This yields {neutralCount} cases reduced to 1× and {immunityCount} reduced to 0×, across {17*weaknesses.length} evaluated attack–defender interactions. These are matchup counts, not species counts. Figures derive from data/typeChart.json and data/defensiveTypeChart.json.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Defender</th><th>Attack</th><th>Calculation</th></tr></thead><tbody>{changes.map(x=><tr key={x.second+x.attack} className="border-t"><td className="py-2">Fairy/{name(x.second)}</td><td>{name(x.attack)}</td><td>2× × {fmt(x.secondary)} = {fmt(x.total)}</td></tr>)}</tbody></table></div>
 <p className="mb-5 text-sm">Fairy was introduced in Generation 6. Its immunity to Dragon is defensive; Dragon moves cannot damage a standard Fairy target. Steel resists Fairy moves and deals super-effective damage to Fairy defenders. Terastallization and other special mechanics can change the matchup.</p>
 <h2 className="mb-3 text-xl font-bold">Fairy weakness FAQ</h2><div className="mb-6 space-y-4">{FAIRY_FAQS.map(f=><section key={f.question}><h3 className="font-semibold">{f.question}</h3><p>{f.answer}</p></section>)}</div>
 <nav aria-label="Related Fairy matchup resources" className="flex flex-wrap gap-4 text-blue-700 underline"><Link href="/pokemon/type-chart">Full Pokémon type chart</Link><Link href="/calculator?type1=fairy">Fairy calculator</Link><Link href="/dual-type-chart">Dual-type chart</Link><Link href="/types/steel">Steel weakness guide</Link><Link href="/types/psychic">Psychic weakness guide</Link></nav>
 </article>;
}