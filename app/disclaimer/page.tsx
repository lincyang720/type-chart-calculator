import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | TypeMatchup',
  description: 'Trademark, affiliation, content, and information disclaimer for TypeMatchup.',
  alternates: {
    canonical: '/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <article className="prose prose-lg max-w-none">
        <h1>Disclaimer</h1>
        <p>
          TypeMatchup is an independent, fan-made reference site. It is not affiliated with, endorsed by, sponsored by,
          or approved by Nintendo, The Pokémon Company, Game Freak, Creatures Inc., or any of their affiliates.
        </p>

        <h2>Trademarks and ownership</h2>
        <p>
          Pokémon, Pokémon character names, and related names and marks are trademarks or registered trademarks of their
          respective owners, including Nintendo, Game Freak, Creatures Inc., and The Pokémon Company. TypeMatchup does
          not claim ownership of those marks or of any official Pokémon intellectual property.
        </p>

        <h2>Independent content and visuals</h2>
        <p>
          TypeMatchup&apos;s interface, written explanations, and site graphics are independently created. The site does not
          use official Pokémon artwork, screenshots, logos, or other official promotional images. References to Pokémon
          names are used only to identify gameplay topics and explain type matchups.
        </p>

        <h2>Information only</h2>
        <p>
          TypeMatchup provides educational and entertainment information based on standard type interactions. Game
          updates, abilities, moves, items, formats, events, and live-service rules may change practical battle results.
          Verify important in-game details with official sources before making decisions or spending resources.
        </p>
      </article>
    </div>
  );
}
