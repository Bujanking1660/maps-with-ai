/**
 * Calculates the Levenshtein distance between two strings using Dynamic Programming.
 * This is used for fuzzy string matching.
 *
 * @param {string} str1
 * @param {string} str2
 * @returns {number} The edit distance between str1 and str2
 */
export function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  // Create a 2D array (m+1) x (n+1) initialized with 0
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Initialize the first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1]; // Characters match, no cost
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Deletion
          dp[i][j - 1] + 1, // Insertion
          dp[i - 1][j - 1] + 1, // Substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Performs a fuzzy search on an array of strings based on input.
 * Rank results based on Levenshtein distance.
 *
 * @param {string} query The search query
 * @param {string[]} items The array of strings to search through
 * @param {number} maxDistance Maximum allowed distance to include in results
 * @returns {string[]} Filtered and sorted array of matches
 */
export function fuzzySearch(query, items, maxDistance = 3) {
  if (!query) return [];

  const results = items
    .map((item) => ({
      item,
      distance: levenshteinDistance(query, item),
    }))
    .filter((result) => {
      // Allow exact substring matches to have high priority
      if (result.item.toLowerCase().includes(query.toLowerCase())) {
        result.distance = 0; // Force to top
        return true;
      }
      return result.distance <= maxDistance;
    })
    // Sort by smallest distance, then alphabetically
    .sort((a, b) => {
      if (a.distance === b.distance) {
        return a.item.localeCompare(b.item);
      }
      return a.distance - b.distance;
    });

  return results.map((r) => r.item);
}
