type AwardLike = {
  title?: string | null;
  organization?: string | null;
};

function isFeaturedAward(award: AwardLike): boolean {
  const text = `${award.title ?? ""} ${award.organization ?? ""}`.toLowerCase();
  return text.includes("ieee") && text.includes("senior member");
}

/**
 * Pins the IEEE Senior Member award to the top while preserving the
 * existing (year-descending) order of every other award.
 */
export function sortAwardsWithFeaturedFirst<T extends AwardLike>(awards: T[]): T[] {
  return [...awards].sort(
    (a, b) => Number(isFeaturedAward(b)) - Number(isFeaturedAward(a))
  );
}
