/**
 * Levenshtein distance is a metric for measuring the amount of difference between two sequences.
 *  - http://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * The code has been adapted from the WikiBooks project and is being redistributed
 * under the terms of that license.
 *  - http://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Levenshtein_distance
 *
 */
/**
 * @param [{Object}] a
 * @param [{Object}] b
 * @param {function} equal a function returning boolean depending on its aguments are equal or not.
 * @return {number} The minimum number of operations needed to transform one sequence into the other.
 */
export default function levenshteinDistance (a, b, equal) {
  var matrix = []

  if (a.length === 0) {
    return b.length
  }
  if (b.length === 0) {
    return a.length
  }

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (equal(b[i - 1], a[j - 1])) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)) // deletion
      }
    }
  }

  return matrix[b.length][a.length]
}
