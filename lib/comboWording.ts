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
      'Steel Fairy Pokemon pair two of the strongest defensive types available. Players also search this pairing as Fairy Steel Pokemon. Below you can check the Steel Fairy weakness list, its resistances, and how to counter it.',
    faq: [
      {
        q: 'What is the Steel Fairy Pokémon weakness?',
        a: 'The Steel Fairy weakness list is shown in the defensive matchups above. Both types contribute, so any attack either type is weak to becomes a real threat.',
      },
      {
        q: 'What is the Fairy Steel weakness?',
        a: 'Fairy Steel weakness is the same matchup written in the other order — Fairy/Steel and Steel/Fairy share one defensive profile, so the weaknesses are identical.',
      },
      {
        q: 'Is Steel/Fairy weakness different from Steel Fairy weakness?',
        a: 'No. Steel/Fairy weakness and Steel Fairy weakness describe the same combination; the slash is only a different way of writing it.',
      },
      {
        q: 'Which Steel Fairy Pokemon weakness matters most in battle?',
        a: 'Start with any 4x weakness, because both types amplify that attack. After that, plan around the 2x weaknesses listed above.',
      },
      {
        q: 'Where can I see the Fairy Steel weaknesses in full?',
        a: 'The defensive matchups table above lists every Fairy Steel weakness with its exact damage multiplier.',
      },
      {
        q: 'How do I read the Fairy Steel type chart?',
        a: 'The Fairy Steel type chart multiplies both types together: two weaknesses make 4x, a weakness and a resistance cancel to 1x, and one immunity makes 0x.',
      },
    ],
  },
  'water-ground': {
    h1: 'Water Ground Weakness',
    title: 'Water Ground Weakness — Resistances & Best Counters',
    description:
      'Water Ground weakness explained: what Water/Ground is weak to, what it resists, what it is immune to, and the best counters.',
    intro:
      'Water Ground weakness is unusually short, which is why this pairing is so common. Check the full defensive profile and counters below.',
    faq: [
      {
        q: 'What is the Water Ground weakness?',
        a: 'The Water Ground weakness list is in the defensive matchups above. The combination removes several of Water-type’s usual problems.',
      },
      {
        q: 'How many weaknesses does Water/Ground have?',
        a: 'See the defensive matchups table above for the exact list and multipliers — this pairing is known for having very few.',
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
