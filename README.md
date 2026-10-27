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

## Syntax

Notation is case-insensitive. `parseDiceNotation` returns `null` for anything
it does not accept.

### Basic rolls

`XdY+Z` rolls X dice of size Y and adds modifier Z (or subtracts it, `-Z`).
Valid die sizes are `d4`, `d6`, `d8`, `d10`, `d12`, and `d20`; see below for
`d44`, `d66`, `d88`, and `d100`.

- `1d8`, `3d6+2`, `2d6-1`

### The primary die

Unless a roll is normal (see below), the first kept die is the **primary die**:

- **Miss:** if it rolls a 1, the whole roll is 0 and modifiers are not added.
- **Critical hit:** if it rolls its maximum, it explodes: roll it again and add
  the result, repeating while it keeps rolling the maximum.
- Other dice in the pool never miss or explode.

### Flags

Flags go right after the die size and can be combined, e.g. `1d8av`.

| Flag | Meaning | Example |
| --- | --- | --- |
| `v` | **Vicious:** each explosion (including the first max roll) adds one extra non-exploding die | `1d8v` |
| `a` / `aN` | **Advantage:** roll N extra dice (default 1) and keep the highest | `2d20a`, `3d6a2` |
| `d` / `dN` | **Disadvantage:** roll N extra dice (default 1) and keep the lowest | `3d6d2-1` |
| `n` | **Normal:** no misses or exploding crits; just add the dice | `3d6n+2`, `2d20an` |

- Advantage and disadvantage cannot be combined, and N must be 6 or less.
- Ties are broken left to right (the earlier die is kept), and the primary die is
  the first *kept* die, which may not be the first one rolled.
- `n` cannot be combined with `v`, `^N`, or a crit bonus.

### Primary die modifier: `^N` / `^-N`

Shifts the primary die's effective value, which moves the miss and crit
thresholds. It goes after the flags and before the modifier. An effective value
of 1 or less is a miss. An effective value at or above the die size is a crit,
which explodes starting from the die's maximum.

- `1d6^2`: raw rolls 1–3 hit for 3–5, and raw rolls 4–6 crit.
- `1d20^-1`: raw rolls of 1 or 2 miss, and it can never crit (a 20 counts as 19).

### Crit bonus: `+Nc`

Adds N only on a critical hit, once per roll rather than once per explosion. It
must come last and cannot be used with normal, compound, or tens/ones rolls.

- `1d10+5c`: +5 on a crit.
- `1d10+2+5c`: +2 on every hit, plus another 5 on a crit.
- `1d8v^1+2+3c`: everything together.

### Tens/ones dice: `d44`, `d66`, `d88`, `d100`

Roll two d4s, d6s, or d8s and read them as tens and ones digits, so `[3, 5]` on
a `d66` is 35.

`d100` (or `1d100`) is percentile: two d10s whose faces are the digits 0–9, read
as tens and ones. `[3, 5]` is 35, `[0, 7]` is 7, and `[0, 0]` is 100, so every
result from 1 to 100 is equally likely. Rolled dice report their digit (0–9)
with a `dieSize` of 10.

These never miss or explode. They accept only advantage or disadvantage: roll
extra dice, drop the lowest or highest, and read the two kept dice in their
original order.

- `d66`, `d44a`, `d88d2`, `d100`, `1d100a`

### Compound rolls

Two or more dice pools added or subtracted, with an optional trailing numeric
modifier. Compound rolls are always normal, take no flags, and only use the
standard die sizes.

- `1d20+1d10+3`, `2d6-1d4`

### Limits

To keep parsing and rolling cheap, notation is limited to 256 characters, 10
dice pools, and 100 dice in total. Statistics model at most 4 explosions per
crit, while `simulateRoll` keeps exploding for as long as the dice roll their
maximum.

## Statistics

Exact statistics can be expensive for large pools with advantage; run
`calculateDiceStats` in a Web Worker in browsers.

## Development

```sh
pnpm install
pnpm check
pnpm test
```
