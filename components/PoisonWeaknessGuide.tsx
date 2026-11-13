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
const weaknesses=defense.poison.weakTo as TypeId[];
const changes=TYPES.filter(t=>t!=='poison').flatMap(second=>weaknesses.map(attack=>({second,attack,secondary:multiplier(attack,second),total:multiplier(attack,'poison')*multiplier(attack,second)})).filter(x=>x.total<=1));
const neutralCount=changes.filter(x=>x.total===1).length;
const immunityCount=changes.filter(x=>x.total===0).length;
export const POISON_FAQS=[
 {question:'What is Poison-type Pokémon weak to?',answer:'Pure Poison Pokémon take 2× damage from Ground and Psychic attacks. Dual typing can alter either multiplier.'},
 {question:'Does Ground beat Poison Pokémon?',answer:'Yes. Ground moves deal 2× damage to pure Poison Pokémon. Poison/Flying is immune to Ground (0×) under normal type rules.'},
 {question:'Does Psychic beat Poison Pokémon?',answer:'Yes. Psychic moves deal 2× damage to pure Poison Pokémon, but Poison/Dark is immune to Psychic (0×).'},
 {question:'What types does Poison resist?',answer:'Pure Poison resists Fighting, Poison, Bug, Grass and Fairy attacks (½× each), with no type immunities.'},
 {question:'What does Poison hit super effectively?',answer:'Poison attacks deal 2× to pure Grass and Fairy, ½× to Poison, Ground, Rock and Ghost, and 0× to Steel.'}
];
export default function PoisonWeaknessGuide(){
 const o=offense.poison,d=defense.poison;
 const rows:[string,string,string[]][]=[['Poison attacking','2×',o.superEffective],['Poison attacking','½×',o.notVeryEffective],['Poison attacking','0×',o.noEffect],['Poison defending','2×',d.weakTo],['Poison defending','½×',d.resistsTo],['Poison defending','0×',d.immuneTo]];
 return <article className="mb-6 rounded-lg bg-white p-6 shadow-lg text-gray-800">
 <h2 className="mb-3 text-2xl font-bold">Poison weakness: complete 18-type matchups</h2>
 <p className="mb-4">Poison is weak to Ground and Psychic attacks (2× each), resists Fighting, Poison, Bug, Grass and Fairy (½× each), and has no type immunities. Poison attacks are super effective against Grass and Fairy. These are standard modern main-series type matchups before abilities, items and battle-specific mechanics.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><caption className="py-2 text-left">All 18 pure types, both attack directions (1× is neutral)</caption><thead><tr><th scope="col">Type</th><th scope="col">Poison attack → type</th><th scope="col">Type attack → Poison</th></tr></thead><tbody>{TYPES.map(t=><tr key={t} className="border-t"><th scope="row" className="py-2">{name(t)}</th><td>{fmt(multiplier('poison',t))}</td><td>{fmt(multiplier(t,'poison'))}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Poison offense and defense</h2>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Direction</th><th>Multiplier</th><th>Types</th></tr></thead><tbody>{rows.map(([direction,factor,targets])=><tr key={direction+factor} className="border-t"><td className="py-2">{direction}</td><td>{factor}</td><td>{names(targets)}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Original, reproducible Poison matchup statistics</h2>
 <p className="mb-3">Against 18 pure defending types, Poison attacks are super effective against {o.superEffective.length}, resisted by {o.notVeryEffective.length}, blocked by {o.noEffect.length}, and neutral against {18-o.superEffective.length-o.notVeryEffective.length-o.noEffect.length}. Pure Poison defense has {d.weakTo.length} weaknesses, {d.resistsTo.length} resistances, {d.immuneTo.length} immunities and {18-d.weakTo.length-d.resistsTo.length-d.immuneTo.length} neutral matchups.</p>
 <p className="mb-4">For each of 17 Poison/secondary-type combinations and each of Poison's two original 2× weaknesses, multiply the Poison defensive factor by the second type's factor. This yields {neutralCount} cases reduced to 1× and {immunityCount} reduced to 0×, across {17*weaknesses.length} evaluated attack–defender interactions. These are matchup counts, not species counts. Figures derive from data/typeChart.json and data/defensiveTypeChart.json.</p>
 <div className="mb-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Defender</th><th>Attack</th><th>Calculation</th></tr></thead><tbody>{changes.map(x=><tr key={x.second+x.attack} className="border-t"><td className="py-2">Poison/{name(x.second)}</td><td>{name(x.attack)}</td><td>2× × {fmt(x.secondary)} = {fmt(x.total)}</td></tr>)}</tbody></table></div>
 <p className="mb-5 text-sm">Ground and Psychic both hit pure Poison for 2×; Poison/Flying negates Ground (0×), and Poison/Dark negates Psychic (0×). Steel is immune to Poison-type attacks (0×), but that does not make Steel an attacking weakness of Poison. Terastallization and other special mechanics can change the matchup.</p>
 <h2 className="mb-3 text-xl font-bold">Poison weakness FAQ</h2><div className="mb-6 space-y-4">{POISON_FAQS.map(f=><section key={f.question}><h3 className="font-semibold">{f.question}</h3><p>{f.answer}</p></section>)}</div>
 <nav aria-label="Related Poison matchup resources" className="flex flex-wrap gap-4 text-blue-700 underline"><Link href="/pokemon/type-chart">Full Pokémon type chart</Link><Link href="/calculator?type1=poison">Poison calculator</Link><Link href="/dual-type-chart">Dual-type chart</Link><Link href="/types/steel">Steel weakness guide</Link><Link href="/types/psychic">Psychic weakness guide</Link></nav>
 </article>;
}