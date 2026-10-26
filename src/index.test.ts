import { expect, it } from "vitest";
import { calculateDiceStats, parseDiceNotation } from ".";

it("separates on-hit and overall averages when misses are possible", () => {
  // 1d6^-4: raw rolls 1-5 are effective <= 1 (miss); a raw 6 is effective 2,
  // below the crit threshold, so it hits for 2.
  const roll = parseDiceNotation("1d6^-4");
  if (!roll) throw new Error("expected valid notation");
  const stats = calculateDiceStats(roll);
  expect(stats.missProbability).toBeCloseTo(5 / 6);
  expect(stats.averageRoll).toBeCloseTo(2);
  expect(stats.totalAverageRoll).toBeCloseTo(1 / 3);
});

it("reports no misses for normal rolls that total zero", () => {
  const roll = parseDiceNotation("1d4-1d4");
  if (!roll) throw new Error("expected valid notation");
  const stats = calculateDiceStats(roll);
  expect(stats.missProbability).toBe(0);
  expect(stats.distribution.get(0)).toBeCloseTo(4 / 16);
  expect(stats.averageRoll).toBeCloseTo(0);
});
