/**
 * High-performance Fuzzy String Matching Engine for Chatbot & Course Search
 * Provides Damerau-Levenshtein distance, tokenized multi-word alignment, and adaptive thresholding.
 */

/**
 * Calculates the Damerau-Levenshtein distance between two strings.
 * Accounts for insertions, deletions, substitutions, and adjacent character transpositions (swaps).
 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const s = source.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  const n = s.length;
  const m = t.length;

  if (n === 0) return m;
  if (m === 0) return n;

  // 2D distance matrix
  const matrix: number[][] = [];

  for (let i = 0; i <= n; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= m; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition / swap (e.g. "ptyhon" vs "python")
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[n][m];
}

/**
 * Calculates similarity ratio between 0.0 (no match) and 1.0 (exact match)
 * based on normalized Damerau-Levenshtein distance.
 */
export function stringSimilarity(source: string, target: string): number {
  const s = source.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  if (s === t) return 1.0;
  if (!s || !t) return 0.0;

  const maxLength = Math.max(s.length, t.length);
  const distance = damerauLevenshteinDistance(s, t);

  return Math.max(0, 1 - distance / maxLength);
}

/**
 * Calculates Jaro-Winkler similarity (favors common prefixes).
 */
export function jaroWinklerSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();

  if (a === b) return 1.0;
  if (!a || !b) return 0.0;

  const matchWindow = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  const aMatches = new Array(a.length).fill(false);
  const bMatches = new Array(b.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, b.length);

    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue;
      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }

  const jaro =
    (matches / a.length + matches / b.length + (matches - transpositions / 2) / matches) / 3;

  // Winkler prefix scale (up to 4 chars)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(a.length, b.length)); i++) {
    if (a[i] === b[i]) prefix++;
    else break;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}

/**
 * Combined high-accuracy similarity score combining Damerau-Levenshtein and Jaro-Winkler.
 * Prevents false positives on distinct short words (e.g. "phone" vs "python").
 */
export function calculateHybridSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();

  if (a === b) return 1.0;
  if (!a || !b) return 0.0;

  const levDist = damerauLevenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  const levSim = Math.max(0, 1 - levDist / maxLen);

  // If edit distance is too large (> 2 for short words <= 6 chars), reject early
  if (maxLen <= 6 && levDist > 2) {
    return levSim;
  }
  if (maxLen <= 4 && levDist > 1) {
    return levSim;
  }

  const jwSim = jaroWinklerSimilarity(a, b);
  // Weight edit distance 70% and Jaro-Winkler 30%
  return (levSim * 0.7) + (jwSim * 0.3);
}

export interface FuzzyMatchResult {
  similarity: number;
  rankScore: number;
  isMatch: boolean;
  matchType: 'exact' | 'prefix' | 'contains' | 'fuzzy' | 'none';
  matchedTarget?: string;
}

/**
 * Normalizes search text (removes symbols, extra spaces, trims, lowercases).
 */
export function normalizeSearchQuery(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Comprehensive fuzzy match evaluator between a query and a target string or list of aliases.
 * Supports exact match, prefix, substring contains, and multi-word token alignment.
 */
export function evaluateFuzzyMatch(
  query: string,
  target: string,
  aliases: string[] = []
): FuzzyMatchResult {
  const normQuery = normalizeSearchQuery(query);
  const normTarget = normalizeSearchQuery(target);

  if (!normQuery || !normTarget) {
    return { similarity: 0, rankScore: 0, isMatch: false, matchType: 'none' };
  }

  const cleanAliases = aliases.map(normalizeSearchQuery).filter(Boolean);

  // 1. EXACT MATCH (Score: 1000)
  if (normQuery === normTarget || cleanAliases.some((a) => a === normQuery)) {
    return {
      similarity: 1.0,
      rankScore: 1000,
      isMatch: true,
      matchType: 'exact',
      matchedTarget: target
    };
  }

  const queryTokens = normQuery.split(' ').filter(Boolean);
  const targetTokens = normTarget.split(' ').filter(Boolean);

  // 2. EXACT WORD IN TARGET TITLE (Score: 900)
  // e.g., query "python" exactly matches one of the words in "Advanced Executive in Python"
  if (queryTokens.length === 1 && targetTokens.includes(normQuery)) {
    return {
      similarity: 0.98,
      rankScore: 900,
      isMatch: true,
      matchType: 'exact',
      matchedTarget: target
    };
  }

  // 3. PREFIX MATCH (Score: 850)
  // Target starts with query, or any alias starts with query
  if (normTarget.startsWith(normQuery) || cleanAliases.some((a) => a.startsWith(normQuery))) {
    return {
      similarity: 0.95,
      rankScore: 850,
      isMatch: true,
      matchType: 'prefix',
      matchedTarget: target
    };
  }

  // Also check if any word in target starts with single-letter query (e.g. "p" -> "Python")
  if (normQuery.length === 1 && targetTokens.some((t) => t.startsWith(normQuery))) {
    return {
      similarity: 0.90,
      rankScore: 800,
      isMatch: true,
      matchType: 'prefix',
      matchedTarget: target
    };
  }

  // 4. CONTAINS SUBSTRING MATCH (Score: 750)
  if (normTarget.includes(normQuery) || cleanAliases.some((a) => a.includes(normQuery))) {
    return {
      similarity: 0.90,
      rankScore: 750,
      isMatch: true,
      matchType: 'contains',
      matchedTarget: target
    };
  }

  // 5. COMPACT NO-SPACE MATCH (e.g., "powerbi" <-> "power bi", "datascience" <-> "data science")
  const compactQuery = normQuery.replace(/\s+/g, '');
  const compactTarget = normTarget.replace(/\s+/g, '');
  if (compactQuery === compactTarget || compactTarget.includes(compactQuery)) {
    return {
      similarity: 0.94,
      rankScore: 820,
      isMatch: true,
      matchType: 'fuzzy',
      matchedTarget: target
    };
  }

  // 6. MULTI-WORD TOKEN FUZZY MATCHING (e.g. "data scince" -> "data science and ai", "digital markting" -> "digital marketing")
  let bestDirectSimilarity = calculateHybridSimilarity(normQuery, normTarget);

  for (const alias of cleanAliases) {
    const aliasSim = calculateHybridSimilarity(normQuery, alias);
    if (aliasSim > bestDirectSimilarity) {
      bestDirectSimilarity = aliasSim;
    }
  }

  // Token-by-token alignment across target words
  if (queryTokens.length > 0 && targetTokens.length > 0) {
    let matchedTokenScoreSum = 0;

    for (const qToken of queryTokens) {
      let bestTokenSim = 0;
      for (const tToken of targetTokens) {
        if (qToken === tToken) {
          bestTokenSim = 1.0;
          break;
        }
        if (tToken.startsWith(qToken) && qToken.length >= 3) {
          bestTokenSim = Math.max(bestTokenSim, 0.88);
          continue;
        }
        const sim = calculateHybridSimilarity(qToken, tToken);
        if (sim > bestTokenSim) {
          bestTokenSim = sim;
        }
      }
      matchedTokenScoreSum += bestTokenSim;
    }

    const tokenAvgSimilarity = matchedTokenScoreSum / queryTokens.length;
    if (tokenAvgSimilarity > bestDirectSimilarity) {
      bestDirectSimilarity = tokenAvgSimilarity;
    }
  }

  // Dynamic adaptive thresholding based on query length:
  // Short queries (<= 2 chars): very strict (0.95+) to prevent false matches
  // 3-4 chars ("jav", "jvaa", "term"): threshold 0.72
  // >= 5 chars ("ptyhon", "pyhton", "digital markting", "privcy"): threshold 0.68
  let minThreshold = 0.68;
  if (normQuery.length <= 2) {
    minThreshold = 0.95;
  } else if (normQuery.length <= 4) {
    minThreshold = 0.72;
  } else {
    minThreshold = 0.68;
  }

  const isMatch = bestDirectSimilarity >= minThreshold;

  // Rank score calculation for fuzzy matches (600 to 740)
  const rankScore = isMatch ? Math.round(bestDirectSimilarity * 700) : 0;

  return {
    similarity: isMatch ? bestDirectSimilarity : 0,
    rankScore,
    isMatch,
    matchType: isMatch ? 'fuzzy' : 'none',
    matchedTarget: isMatch ? target : undefined
  };
}

