import Link from 'next/link';
import type { TypeId } from '@/lib/types';
import attackData from '@/data/typeChart.json';
import defenseData from '@/data/defensiveTypeChart.json';

const types: TypeId[] = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
const attack = attackData as Record<TypeId,{superEffective:string[];notVeryEffective:string[];noEffect:string[]}>;
const defense = defenseData as Record<TypeId,{weakTo:string[];resistsTo:string[];immuneTo:string[]}>;
const label = (t:string) => t[0].toUpperCase()+t.slice(1);
function factor(a:TypeId,d:TypeId):number {
  const r=defense[d];
  return r.immuneTo.includes(a)?0:r.weakTo.includes(a)?2:r.resistsTo.includes(a)?0.5:1;
}
const fmt=(n:number)=>n===0.5?'½×':n===0.25?'¼×':n+'×';
const list=(a:string[])=>a.length?a.map(label).join(', '):'None';
const weak=defense.psychic.weakTo;
const interactions=types.filter(t=>t!=='psychic').flatMap(second=>weak.map(a=>({second,attacker:a as TypeId,result:factor(a as TypeId,'psychic')*factor(a as TypeId,second),partnerFactor:factor(a as TypeId,second)})).filter(x=>x.result<=1));
const neutral=interactions.filter(x=>x.result===1).length;
const immune=interactions.filter(x=>x.result===0).length;
export const PSYCHIC_FAQS=[
{question:'What is a Psychic Pokémon weak to?',answer:'Pure Psychic Pokémon take 2× damage from Bug, Ghost and Dark attacks. A second defending type can change the result.'},
{question:'Are Dark moves strong against Psychic?',answer:'Yes. Dark attacks deal 2× to pure Psychic. In the other direction, Psychic moves do 0× against pure Dark.'},
{question:'What does Psychic resist?',answer:'Pure Psychic resists Fighting and Psychic attacks, taking ½× from each, and has no type-based immunity.'},
{question:'What does Psychic hit super effectively?',answer:'Psychic moves deal 2× to pure Fighting and Poison, ½× to Psychic and Steel, and 0× to Dark.'},
{question:'Can a secondary type cancel a Psychic weakness?',answer:'Yes. Psychic/Fairy takes 1× from Dark (2× multiplied by ½×), and Psychic/Normal takes 0× from Ghost (2× multiplied by 0×).'}
];
export default function PsychicWeaknessGuide(){
 const o=attack.psychic,d=defense.psychic;
 const grouped:[string,string,string[]][]=[
 ['Psychic attacking','2×',o.superEffective],['Psychic attacking','½×',o.notVeryEffective],['Psychic attacking','0×',o.noEffect],
 ['Psychic defending','2×',d.weakTo],['Psychic defending','½×',d.resistsTo],['Psychic defending','0×',d.immuneTo]];
 return <article className="mb-6 rounded-lg bg-white p-6 shadow-lg text-gray-800">
 <h2 className="mb-3 text-2xl font-bold">Psychic weakness: complete 18-type chart</h2>
 <p className="mb-4">Pure Psychic Pokémon take 2× damage from Bug, Ghost and Dark moves, resist Fighting and Psychic moves at ½×, and have no type-based immunity. Psychic attacks deal 2× to Fighting and Poison, ½× to Psychic and Steel, and 0× to Dark. These are standard main-series type interactions before abilities, items or special battle mechanics.</p>
 <div className="overflow-x-auto mb-6"><table className="w-full text-left text-sm border-collapse"><caption className="text-left py-2">All 18 pure types, both attack directions (1× = neutral)</caption><thead><tr><th scope="col">Type</th><th scope="col">Psychic attack → type</th><th scope="col">Type attack → Psychic</th></tr></thead><tbody>{types.map(t=><tr key={t} className="border-t"><th scope="row" className="py-2">{label(t)}</th><td>{fmt(factor('psychic',t))}</td><td>{fmt(factor(t,'psychic'))}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Attack and defense outcomes</h2>
 <div className="overflow-x-auto mb-6"><table className="w-full text-left text-sm"><thead><tr><th>Direction</th><th>Multiplier</th><th>Types</th></tr></thead><tbody>{grouped.map(([direction,multiplier,targets])=><tr key={direction+multiplier} className="border-t"><td className="py-2">{direction}</td><td>{multiplier}</td><td>{list(targets)}</td></tr>)}</tbody></table></div>
 <h2 className="mb-3 text-xl font-bold">Reproducible Psychic matchup statistics</h2>
 <p className="mb-3">Among 18 pure defending types, Psychic attacks hit {o.superEffective.length} for 2×, {o.notVeryEffective.length} for ½×, {o.noEffect.length} for 0×, and {18-o.superEffective.length-o.notVeryEffective.length-o.noEffect.length} for neutral 1×. Pure Psychic defense has {d.weakTo.length} weaknesses, {d.resistsTo.length} resistances, {d.immuneTo.length} immunities and {18-d.weakTo.length-d.resistsTo.length-d.immuneTo.length} neutral matchups.</p>
 <p className="mb-4">For each of 17 distinct Psychic/second-type combinations and each original Psychic 2× weakness, multiply the Psychic defensive factor by the second type's defensive factor. This yields {neutral} 1× cancellations and {immune} 0× immunities across {interactions.length} changed attack–defender interactions. These are interaction counts, not Pokémon species counts. All figures derive from data/typeChart.json and data/defensiveTypeChart.json.</p>
 <div className="overflow-x-auto mb-6"><table className="w-full text-left text-sm"><thead><tr><th>Defender</th><th>Attack</th><th>Calculation</th></tr></thead><tbody>{interactions.map(x=><tr key={x.second+x.attacker} className="border-t"><td className="py-2">Psychic/{label(x.second)}</td><td>{label(x.attacker)}</td><td>2× × {fmt(x.partnerFactor)} = {fmt(x.result)}</td></tr>)}</tbody></table></div>
 <p className="mb-5 text-sm">Ability, move, item and Terastallization exceptions can alter individual battles; they are excluded from the type-only calculations.</p>
 <h2 className="mb-3 text-xl font-bold">Psychic weakness FAQ</h2><div className="space-y-4 mb-6">{PSYCHIC_FAQS.map(f=><section key={f.question}><h3 className="font-semibold">{f.question}</h3><p>{f.answer}</p></section>)}</div>
 <nav aria-label="Related Psychic matchup resources" className="flex flex-wrap gap-4 text-blue-700 underline"><Link href="/pokemon/type-chart">Complete Pokémon type chart</Link><Link href="/calculator?type1=psychic">Psychic calculator</Link><Link href="/dual-type-chart">Dual-type chart</Link><Link href="/types/ghost">Ghost weakness guide</Link><Link href="/types/dark">Dark weakness guide</Link></nav>
 </article>;
}