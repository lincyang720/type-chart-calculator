import { Metadata } from 'next';
import BattleSimulator from '@/components/BattleSimulator';

export const metadata: Metadata = {
  title: 'Battle Simulator - Calculate Type Matchup Damage',
  description: 'Simulate type matchups in battle. Calculate damage multipliers with STAB bonus for competitive battles and strategy planning.',
  keywords: 'battle simulator, type matchup, damage calculator, STAB calculator, battle strategy',
  openGraph: {
    title: 'Battle Simulator',
    description: 'Simulate type matchups and calculate damage multipliers',
  },
};

export default function BattleSimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Battle Simulator</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Simulate type matchups in battle. Calculate damage multipliers and see effectiveness messages
          just like in real battles.
        </p>

        <BattleSimulator />

        <section className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Understanding Battle Mechanics</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Type Effectiveness</h3>
              <p>
                The type of move you use determines how effective it will be against your opponent.
                The battle simulator calculates the exact damage multiplier based on type matchups.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">STAB (Same Type Attack Bonus)</h3>
              <p>
                When a move's type matches the user's type, it receives a 1.5× damage bonus called STAB.
                For example, a Fire-type using a Fire-type move gets STAB, but using a Water-type move doesn't.
              </p>
              <p className="mt-2 text-sm italic">
                Enable the STAB checkbox to include this bonus in your calculations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Dual-Type Defenders</h3>
              <p>
                When attacking a dual-type opponent, the damage multipliers from both types are multiplied together:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Super effective against both types: 2× × 2× = 4× damage</li>
                <li>Super effective against one, normal against other: 2× × 1× = 2× damage</li>
                <li>Super effective against one, not very effective against other: 2× × 0.5× = 1× damage (neutralized)</li>
                <li>Not very effective against both: 0.5× × 0.5× = 0.25× damage</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Battle Strategy Tips</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <h3 className="font-semibold mb-1">1. Coverage Moves</h3>
              <p className="text-sm">
                Carry moves of different types to hit more opponents for super effective damage.
                Don't rely on just one type of move.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. Predict Switches</h3>
              <p className="text-sm">
                If your opponent is weak to your move, they might switch. Use this simulator to plan
                coverage moves that hit common switch-ins.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. STAB Priority</h3>
              <p className="text-sm">
                STAB moves are generally more reliable than coverage moves of the same power.
                A STAB move at 1.5× often outdamages a super effective move at 2× if the base power is higher.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">4. Avoid Immunities</h3>
              <p className="text-sm">
                Some type combinations grant immunity (0× damage). Always have backup moves to handle
                these situations, especially Ghost immunity to Normal/Fighting and Ground immunity to Electric.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
