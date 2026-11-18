import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

const title = 'Eeveelutions: All 8 Eevee Evolutions, Types & Weaknesses';
const description = 'All 8 Eeveelutions with their types, weaknesses and how to evolve Eevee in Gen 9. Compare Vaporeon, Jolteon, Flareon, Espeon, Umbreon and more.';
const heading = 'Eeveelutions: All 8 Eevee Evolutions and Their Types';
const url = `${SITE_URL}/eeveelutions`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: SITE_NAME, type: 'website' },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.svg'] },
};

const evolutions = [
  ['Vaporeon', 'Water', 'Electric, Grass', 'Fire, Water, Ice, Steel', 'Use a Water Stone'],
  ['Jolteon', 'Electric', 'Ground', 'Electric, Flying, Steel', 'Use a Thunder Stone'],
  ['Flareon', 'Fire', 'Water, Ground, Rock', 'Fire, Grass, Ice, Bug, Steel, Fairy', 'Use a Fire Stone'],
  ['Espeon', 'Psychic', 'Bug, Ghost, Dark', 'Fighting, Psychic', 'Level up with high friendship during the day and without a Fairy-type move'],
  ['Umbreon', 'Dark', 'Fighting, Bug, Fairy', 'Ghost, Dark', 'Level up with high friendship at night and without a Fairy-type move'],
  ['Leafeon', 'Grass', 'Fire, Ice, Poison, Flying, Bug', 'Water, Electric, Grass, Ground', 'Use a Leaf Stone'],
  ['Glaceon', 'Ice', 'Fire, Fighting, Rock, Steel', 'Ice', 'Use an Ice Stone'],
  ['Sylveon', 'Fairy', 'Poison, Steel', 'Fighting, Bug, Dark', 'Level up with high friendship while knowing a Fairy-type move'],
];

const faq = [
  ['What are the 8 Eeveelutions in order?', 'In National Pokédex order, the eight are Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, and Sylveon. This also groups them by debut generation: the first three debuted in Generation 1, the next two in Generation 2, Leafeon and Glaceon in Generation 4, and Sylveon in Generation 6.'],
  ['Is there a 9th Eeveelution?', 'Pokémon Scarlet and Violet have eight Eeveelutions and introduced no ninth evolution for Eevee. Eevee itself is the Normal-type base form, so counting it gives nine members of the family.'],
  ['What is the easiest Eeveelution to get?', 'If you have the matching stone, Vaporeon, Jolteon, Flareon, Leafeon, and Glaceon all evolve immediately from the Bag. Vaporeon is an easy first pick once you can buy a Water Stone. No friendship training or level-up is required for any of those five.'],
  ['Which Eeveelution is the strongest?', 'All eight have a base stat total of 525, distributed differently. Espeon and Glaceon tie for the highest base Special Attack at 130, Flareon has the highest base Attack at 130, and Jolteon leads in base Speed at 130. For a defensive role, Umbreon is better suited to repeated switch-ins than those offensive choices.'],
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Eeveelutions', item: url },
      ],
    },
  ],
};

const linkClass = 'text-blue-700 underline underline-offset-2';

export default function EeveelutionsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link className={linkClass} href="/">Home</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">Eeveelutions</span>
      </nav>
      <article className="space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{heading}</h1>
          <p>In Pokémon Scarlet and Violet, <Link className={linkClass} href="/pokemon/eevee">Eevee</Link> can evolve into eight forms. Five use an evolution stone and three need high friendship followed by a level-up. Each evolved form has a single type, which determines which attacks it can take comfortably and which ones should send it back to the bench. Use the table to shortlist a form, then match its stats and evolution requirements to what you need from your team.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Eeveelution type and weakness chart</h2>
          <p>These multipliers describe incoming attacks against each form’s original type. A weakness doubles damage and a resistance halves it. The 4× column is empty of weaknesses for all eight because each has just one defensive type. To see how stacked weaknesses work for other Pokémon, use the <Link className={linkClass} href="/dual-type-chart">dual-type chart</Link>.</p>
          <div className="overflow-x-auto rounded-lg border bg-white" tabIndex={0} role="region" aria-label="Eeveelution comparison">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-blue-50">
                <tr>{['Evolution', 'Type', '2× weaknesses', '4× weaknesses', '½× resistances', 'Evolution method'].map(label => <th key={label} scope="col" className="p-3">{label}</th>)}</tr>
              </thead>
              <tbody>
                {evolutions.map(([name, type, weak, resist, method]) => (
                  <tr key={name} className="border-t align-top">
                    <th scope="row" className="p-3"><Link className={linkClass} href={`/pokemon/${name.toLowerCase()}`}>{name}</Link></th>
                    <td className="p-3">{type}</td>
                    <td className="p-3">{weak}</td>
                    <td className="p-3">None</td>
                    <td className="p-3">{resist}</td>
                    <td className="p-3">{method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Umbreon is immune to Psychic attacks and Sylveon is immune to Dragon attacks. Abilities can supply additional protection, such as Water Absorb on Vaporeon. The chart assumes no Terastallization. If you Terastallize one of these Pokémon into a different type, reassess its defensive matchup before switching it into an attack later in the battle.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Choose an Eeveelution for your team</h2>
          <p><strong>Physical bulk — Vaporeon.</strong> Its large HP pool makes it a worthwhile physical pivot if you invest in Defense and send it into attacks that Water resists. Wish and Protect can give it time to recover, and Wish can heal a teammate on a later turn. Its natural Defense is modest, so reserve it for the physical matchups it can actually handle and bring a teammate to cover Electric and Grass.</p>
          <p><strong>Speed — Jolteon.</strong> Pick it when the team needs to act before opposing attackers. Its base 130 Speed helps it clean up weakened targets or pivot with Volt Switch against a target that can take Electric damage. Ground Pokémon block Volt Switch, so expect to switch manually if they enter. A teammate that can take Ground attacks gives Jolteon more room to use its speed.</p>
          <p><strong>Special offense — Espeon.</strong> Espeon combines base 130 Special Attack with base 110 Speed. It can apply immediate pressure with Psychic attacks, and its hidden ability Magic Bounce can reflect entry hazards and certain status moves. Have an answer for Dark Pokémon, which are immune to Psychic, and consider how you will bring Espeon in safely against a team with strong physical attackers.</p>
          <p><strong>General tanking — Umbreon.</strong> Strong defenses on both sides and access to recovery make Umbreon useful when your team needs a Pokémon that can return to the field repeatedly. Foul Play uses the target’s Attack stat, giving Umbreon a way to punish some physical attackers even with little investment of its own. Pair it with a teammate that can take Fighting and Fairy attacks.</p>
          <p><strong>Disruption — Sylveon.</strong> Use its special bulk and support options when you need to interfere with the opponent’s plan. Yawn forces a choice between switching and risking sleep. In doubles, Helping Hand can boost a partner’s attack, while a Sylveon with Pixilate can spread <Link className={linkClass} href="/types/fairy">Fairy-type</Link> damage with Hyper Voice. Keep it away from strong physical Steel and Poison moves.</p>
          <p>Flareon or Leafeon can fill a physical attacking slot when your existing attackers lean special. Flareon has high Attack and plenty of resistances, while Leafeon has strong physical Defense and can help against Water and Ground. Glaceon suits a team that can bring a slow special attacker in safely. Its <Link className={linkClass} href="/types/ice">Ice typing</Link> leaves it with only one resistance, even though its Ice attacks threaten several common types.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How to evolve Eevee into each form in Scarlet and Violet</h2>
          <p>Put the Eevee you want to evolve in your party. For a stone evolution, select the stone from the Bag, choose to use it, and select that Eevee. For a friendship evolution, keep Eevee in the party and build friendship by spending time with it and washing it at picnics. A Soothe Bell can help it gain friendship faster. The friendship checker in Cascarrafa can help you gauge your progress before you spend an Exp. Candy or earn the next level in battle.</p>
          <ol className="list-decimal space-y-4 pl-6">
            <li><strong>Vaporeon.</strong> Obtain a Water Stone from Delibird Presents after earning three Gym Badges, or use one you have found while exploring Paldea. Open the Bag and apply the stone to Eevee. You can do this at any time of day and in any location where you can use items. The stone is consumed, and Eevee evolves immediately without gaining a level.</li>
            <li><strong>Jolteon.</strong> Get a Thunder Stone from Delibird Presents after three Gym Badges or find one in Paldea. Use it on Eevee from the Bag. You can perform this step wherever the Bag allows item use, during the day or at night. Friendship and Eevee’s current moves do not affect the result.</li>
            <li><strong>Flareon.</strong> Pick up a Fire Stone or buy one at Delibird Presents after three Gym Badges. Select the stone in the Bag and use it on Eevee. There is no special location or time requirement. The evolution triggers directly, so you can save your candy for after the transformation if you want to train Flareon.</li>
            <li><strong>Espeon.</strong> Raise Eevee’s friendship, then inspect its current moves and replace any Fairy-type move. Wait for daytime in the game world. Have Eevee gain a level while it is still daytime, through battle or by using a candy that raises its level. There is no mandatory location or stone. If it reaches the next level before its friendship is high enough, keep raising friendship and try again.</li>
            <li><strong>Umbreon.</strong> Raise friendship and remove any Fairy-type move from Eevee’s current moves. Wait until nighttime in the game world and then have Eevee gain a level. A battle or a candy that causes a level-up works, and there is no location restriction or evolution item. Check the in-game lighting or map time indicator before using a candy, since local clock time is not the condition.</li>
            <li><strong>Leafeon.</strong> Buy a Leaf Stone at Delibird Presents after three Gym Badges or use one found in Paldea. Find it in the Bag and use it on Eevee. This works at any time where you can use the Bag. Scarlet and Violet do not require a Moss Rock, so a forest visit or a level-up beside a landmark is unnecessary.</li>
            <li><strong>Glaceon.</strong> Find an Ice Stone in the Glaseado Mountain area, then select it from the Bag and use it on Eevee. The mountain is a place to search for the item. You can apply the stone elsewhere at any time without building friendship or leveling up. You do not need an Ice Rock to start the evolution.</li>
            <li><strong>Sylveon.</strong> Raise Eevee’s friendship and make sure it currently knows a Fairy-type move such as Baby-Doll Eyes. Check its summary and use the move reminder if it has already learned the move and needs to remember it. With both conditions met, gain a level at any time of day and in any location where you can level up. No stone is required.</li>
          </ol>
          <p>If you are preparing several Eevee at once, check the moves on each individual before the level-up. A Fairy-type move can turn a planned daytime Espeon or nighttime Umbreon into Sylveon. For the five stone evolutions, check the item name before selecting your target. Once a form has evolved, you will need another Eevee to get a different form.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          {faq.map(([question, answer]) => (
            <div key={question} className="space-y-1">
              <h3 className="text-lg font-semibold">{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </section>
      </article>
    </main>
  );
}
