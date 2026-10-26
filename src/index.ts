import {
  calculateAverageDamageOnHit,
  calculateMissProbability,
  calculateProbabilityDistribution,
  calculateTotalAverageDamage,
  type DiceRoll,
  type ProbabilityDistribution,
} from "./dice";

export * from "./dice";

export interface DiceStats {
  distribution: ProbabilityDistribution;
  averageRoll: number;
  totalAverageRoll: number;
  missProbability: number;
}

/**
 * Exact statistics for a parsed roll. Large rolls can be expensive to compute;
 * browser callers should run this off the main thread (e.g. in a Web Worker).
 */
export function calculateDiceStats(roll: DiceRoll): DiceStats {
  const distribution = calculateProbabilityDistribution(roll);
  return {
    distribution,
    averageRoll: calculateAverageDamageOnHit(distribution, roll),
    totalAverageRoll: calculateTotalAverageDamage(distribution),
    missProbability: calculateMissProbability(distribution, roll),
  };
}
