import Link from 'next/link';
import TypeBadge from '@/components/TypeBadge';
import TypeMiniCalculator from '@/components/TypeMiniCalculator';
import {
  CounterRow,
  SingleTypeGuideModel,
  TypingRow,
  displayType,
  formatChartMultiplier,
  formatTypeList,
} from '@/lib/singleTypeGuide';

function TypeList({ typeIds }: { typeIds: string[] }) {
  if (typeIds.length === 0) return <span className="text-gray-500">None</span>;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {typeIds.map(typeId => (
        <Link key={typeId} href={`/types/${typeId}`}>
          <TypeBadge typeId={typeId as SingleTypeGuideModel['typeId']} size="sm" clickable />
        </Link>
      ))}
    </span>
  );
}

function counterMoveText(row: CounterRow): string {
  if (row.moves.length > 0) {
    return row.moves.map(move => `${move.name} (${displayType(move.type)})`).join(', ');
  }
  return `Typing includes ${formatTypeList(row.stabTypes)}; no matching attack is stored in recommended moves.`;
}

function SpeciesNames({ row }: { row: TypingRow }) {
  return (
    <span>
      {row.species.map((species, index) => (
        <span key={species.name}>
          {index > 0 && ', '}
          {species.href ? (
            <Link href={species.href} className="text-blue-700 hover:underline">{species.name}</Link>
          ) : (
            species.name
          )}
        </span>
      ))}
    </span>
  );
}

export default function SingleTypeGuide({ model }: { model: SingleTypeGuideModel }) {
  const { typeName, typeId } = model;

  return (
    <div className="mb-6 space-y-6">
      <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-gray-800 sm:p-5" aria-labelledby="quick-answer-heading">
        <h2 id="quick-answer-heading" className="text-lg font-bold text-gray-900">Quick answer</h2>
        <p className="mt-2">{model.shortAnswer}</p>
        <p className="mt-2">
          {model.resistsTo.length > 0
            ? `Resists ${formatTypeList(model.resistsTo)}.`
            : 'No resistances.'}
          {' '}
          {model.immuneTo.length > 0
            ? `Immune to ${formatTypeList(model.immuneTo)}.`
            : 'No immunities.'}
          {' '}
          {model.superEffective.length > 0
            ? `${typeName} moves are super effective against ${formatTypeList(model.superEffective)}.`
            : `${typeName} moves are not super effective against any type.`}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Counter Pokémon, 4× dual typings, and every {typeName} species in this dataset are below. An overview that only names the weaknesses does not list them.
        </p>
        <nav aria-label="On this page" className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-blue-800">
          <a href="#type-calculator" className="hover:underline">Calculator</a>
          <a href="#counters" className="hover:underline">Counters</a>
          <a href="#species" className="hover:underline">Species weaknesses</a>
          <a href="#exceptions" className="hover:underline">Dual-type exceptions</a>
          <a href="#faq" className="hover:underline">FAQ</a>
        </nav>
      </section>

      <TypeMiniCalculator typeId={typeId} typeName={typeName} />

      <section id="counters" className="scroll-mt-6 rounded-lg bg-white p-4 shadow-lg sm:p-6" aria-labelledby="counters-heading">
        <h2 id="counters-heading" className="text-2xl font-bold">Best {typeName} counters in this dataset</h2>
        <p className="mt-2 text-gray-700">
          These are Pokémon from the TypeMatchup dataset, not a usage ranking. For each weakness, the table prefers species whose stored recommended moves include an attack of that type, then sorts by the higher of Attack and Special Attack. Abilities and items are not applied.
        </p>
        {model.counters.length === 0 ? (
          <p className="mt-4 text-gray-700">No dataset Pokémon carries {formatTypeList(model.weakTo)} as a type or as a stored move.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="pb-2 text-left text-gray-600">
                Counter Pokémon and the stored moves that hit {typeName} super effectively
              </caption>
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-3 py-2">Pokémon</th>
                  <th scope="col" className="px-3 py-2">Typing</th>
                  <th scope="col" className="px-3 py-2">Super-effective move</th>
                  <th scope="col" className="px-3 py-2">Higher attack stat</th>
                </tr>
              </thead>
              <tbody>
                {model.counters.map(row => (
                  <tr key={row.id} className="border-t border-slate-200 align-top">
                    <th scope="row" className="px-3 py-2 text-left font-medium">
                      <Link href={row.href} className="text-blue-700 hover:underline">{row.name}</Link>
                    </th>
                    <td className="px-3 py-2">{row.types.map(displayType).join(' / ')}</td>
                    <td className="px-3 py-2">{counterMoveText(row)}</td>
                    <td className="px-3 py-2">{row.stat} {row.statLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="species" className="scroll-mt-6 rounded-lg bg-white p-4 shadow-lg sm:p-6" aria-labelledby="species-heading">
        <h2 id="species-heading" className="text-2xl font-bold">{typeName} Pokémon and their real weaknesses</h2>
        <p className="mt-2 text-gray-700">
          Every species below includes {typeName} in the TypeMatchup dataset ({model.typings.reduce((sum, row) => sum + row.species.length, 0)} names across {model.typings.length} typings). Weaknesses are calculated from the Generation 6–9 chart. This is not a complete national dex. A linked name has a species guide on this site.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="pb-2 text-left text-gray-600">
              {typeName} typings with 4× and 2× weaknesses
            </caption>
            <thead className="bg-slate-100">
              <tr>
                <th scope="col" className="px-3 py-2">Typing</th>
                <th scope="col" className="px-3 py-2">Pokémon</th>
                <th scope="col" className="px-3 py-2">4× weak</th>
                <th scope="col" className="px-3 py-2">2× weak</th>
              </tr>
            </thead>
            <tbody>
              {model.typings.map(row => (
                <tr key={row.key} className="border-t border-slate-200 align-top">
                  <th scope="row" className="px-3 py-2 text-left font-medium">
                    {row.types.length === 2 && row.indexable ? (
                      <Link href={`/types/${row.key}`} className="text-blue-700 hover:underline">{row.label}</Link>
                    ) : (
                      row.label
                    )}
                  </th>
                  <td className="px-3 py-2"><SpeciesNames row={row} /></td>
                  <td className="px-3 py-2"><TypeList typeIds={row.quadWeak} /></td>
                  <td className="px-3 py-2"><TypeList typeIds={row.doubleWeak} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="exceptions" className="scroll-mt-6 rounded-lg bg-white p-4 shadow-lg sm:p-6" aria-labelledby="exceptions-heading">
        <h2 id="exceptions-heading" className="text-2xl font-bold">Dual-type exceptions for {typeName}</h2>
        <p className="mt-2 text-gray-700">
          A pure {typeName} weakness stays 2× unless the second type resists it (2× × ½× = 1×), is immune to it (2× × 0× = 0×), or is also weak to it (2× × 2× = 4×). {model.exceptions.length} partner {model.exceptions.length === 1 ? 'type changes' : 'types change'} at least one weakness. {model.unchangedPartnerCount} leave every pure weakness at 2×.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="pb-2 text-left text-gray-600">
              Second types that change a pure {typeName} weakness
            </caption>
            <thead className="bg-slate-100">
              <tr>
                <th scope="col" className="px-3 py-2">Second type</th>
                <th scope="col" className="px-3 py-2">What changes</th>
                <th scope="col" className="px-3 py-2">Examples</th>
              </tr>
            </thead>
            <tbody>
              {model.exceptions.map(row => (
                <tr key={row.partner} className="border-t border-slate-200 align-top">
                  <th scope="row" className="px-3 py-2 text-left font-medium">
                    {row.indexable ? (
                      <Link href={`/types/${row.slug}`} className="text-blue-700 hover:underline">
                        {typeName}/{displayType(row.partner)}
                      </Link>
                    ) : (
                      `${typeName}/${displayType(row.partner)}`
                    )}
                  </th>
                  <td className="px-3 py-2">
                    {row.changes.map(change => (
                      <span key={change.attack} className="block">
                        {displayType(change.attack)} becomes {formatChartMultiplier(change.total)} (2× × {formatChartMultiplier(change.partnerFactor)})
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2">
                    {row.examples.length > 0
                      ? row.examples.map(example => example.name).join(', ')
                      : 'No example in this dataset'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
