# nimble-dice

Dice notation parser, roller, and exact roll statistics for the
[Nimble](https://nimblerpg.com) TTRPG. Used by
[nimble.nexus](https://nimble.nexus).

```ts
import { calculateDiceStats, parseDiceNotation, simulateRoll } from "nimble-dice";

const roll = parseDiceNotation("2d8v+3");
if (roll) {
  simulateRoll(roll); // { results, modifier, primaryMod, total }
  calculateDiceStats(roll); // { distribution, averageRoll, totalAverageRoll, missProbability }
}
```

The package ships TypeScript source, so consumers need a bundler or runtime
that compiles TypeScript in dependencies (for Next.js, add `nimble-dice` to
`transpilePackages`).

See the comment at the top of [`src/dice.ts`](src/dice.ts) for the supported
notation and the primary-die rules (crit misses, explosions, vicious,
advantage/disadvantage, tens/ones dice, and compound rolls).

Exact statistics can be expensive for large pools with advantage; run
`calculateDiceStats` in a Web Worker in browsers.

## Development

```sh
pnpm install
pnpm check
pnpm test
```
