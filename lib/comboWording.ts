// Wording alignment for specific dual-type combos, driven by real Search Console queries.
// Scoped to the combos listed below — every other combination keeps its existing template.

export type ComboWording = {
  h1: string;
  title: string;
  description: string;
  intro: string;
  faq: { q: string; a: string }[];
};

export const COMBO_WORDING: Record<string, ComboWording> = {
  'steel-fairy': {
    h1: 'Steel Fairy Pokemon',
    title: 'Steel Fairy Pokemon — Weaknesses, Resistances & Best Counters',
    description:
      'Steel Fairy Pokemon in one place: what Steel/Fairy is weak to, what it resists, what it is immune to, and the best counters to use against it.',
    intro:
      'Steel/Fairy is weak to Fire and Ground, both at 2×, and it has no 4× weakness. Poison and Dragon do 0×. Tinkaton is the Generation 9 Pokémon with this typing. Crowned Zacian and Magearna share the same chart when the format allows them. Players also search this pairing as Fairy Steel.',
    faq: [
      {
        q: 'What is the Steel Fairy Pokémon weakness?',
        a: 'Fire and Ground, each at 2×. There is no 4× weakness. Fighting cancels to 1× because Steel is weak to Fighting and Fairy resists it.',
      },
      {
        q: 'What is the Fairy Steel weakness?',
        a: 'The same two attacks: Fire and Ground at 2×. Fairy/Steel and Steel/Fairy are one defensive profile.',
      },
      {
        q: 'Is Steel/Fairy weakness different from Steel Fairy weakness?',
        a: 'Steel/Fairy and Steel Fairy are the same two types. Fire and Ground are 2× either way you write the name.',
      },
      {
        q: 'Which Steel Fairy Pokemon weakness matters most in battle?',
        a: 'Ground, when Great Tusk or Excadrill is in the game, and Fire, when Heatran or Charizard is. Neither is 4×, so one hit is not automatically a KO, and both still force Tinkaton out.',
      },
      {
        q: 'What is Steel/Fairy immune to?',
        a: 'Poison, through Steel, and Dragon, through Fairy. Draco Meteor and Sludge Bomb both do 0× into Tinkaton.',
      },
      {
        q: 'How do I read the Fairy Steel type chart?',
        a: 'Multiply the two factors. Fire is 2× into Steel and 1× into Fairy, so it stays 2×. Dragon is 0.5× into Steel and 0× into Fairy, so it is 0×. Open the Steel/Fairy preset on the Dual Type Calculator to see every row.',
      },
    ],
  },
  'water-ground': {
    h1: 'Water Ground Weakness',
    title: 'Water Ground Weakness — Resistances & Best Counters',
    description:
      'Water Ground weakness explained: what Water/Ground is weak to, what it resists, what it is immune to, and the best counters.',
    intro:
      'Water/Ground has one weakness: Grass at 4×. Electric does 0×. Fire, Poison, Rock, and Steel are 0.5×. Swampert, Gastrodon, and Quagsire all share that chart, and Freeze-Dry is 4× as well because it treats Water as weak to Ice.',
    faq: [
      {
        q: 'What is the Water Ground weakness?',
        a: 'Grass, at 4×. It is the only super-effective type. Rillaboom’s Grassy Glide is that product at priority. Freeze-Dry is also 4×.',
      },
      {
        q: 'How many weaknesses does Water/Ground have?',
        a: 'One. Grass is 4×. Electric is an immunity, not a weakness. Water and Ice each cancel to 1×.',
      },
    ],
  },
  'grass-poison': {
    h1: 'Grass Poison Weakness',
    title: 'Grass Poison Weakness — Resistances & Best Counters',
    description:
      'Grass Poison weakness explained: what Grass/Poison is weak to, what it resists, what it is immune to, and the best counters.',
    intro:
      'Grass Poison weakness shapes how this pairing is played. Check the full defensive profile, resistances, and counters below.',
    faq: [
      {
        q: 'What is the Grass Poison weakness?',
        a: 'The Grass Poison weakness list is in the defensive matchups above, with exact multipliers for every attacking type.',
      },
      {
        q: 'How do I counter Grass/Poison?',
        a: 'Lead with the attacking types shown as weaknesses above, and prioritise any 4x weakness first.',
      },
    ],
  },
};
