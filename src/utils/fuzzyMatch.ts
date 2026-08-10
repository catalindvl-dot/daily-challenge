function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function levenshteinDistance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

export function fuzzyMatch(input: string, acceptedAnswers: string[]) {
  const normalizedInput = normalizeAnswer(input);

  if (!normalizedInput) return false;

  return acceptedAnswers.some((answer) => {
    const normalizedAnswer = normalizeAnswer(answer);
    const distance = levenshteinDistance(
      normalizedInput,
      normalizedAnswer,
    );

    const answerLength = normalizedAnswer.length;

    // Short answers need stricter matching to avoid false positives.
    if (answerLength <= 7) {
      return (
        normalizedInput.length === normalizedAnswer.length &&
        distance <= 1
      );
    }

    // Medium answers can tolerate one missing/extra/wrong character.
    if (answerLength <= 12) {
      return distance <= 1;
    }

    // Longer answers can tolerate up to two small typos.
    return distance <= 2;
  });
}