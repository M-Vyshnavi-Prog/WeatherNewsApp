/**
 * Weather-based news filtering logic.
 * cold  -> 'depressing' topics
 * hot   -> 'fear' topics
 * cool  -> 'winning'/'happiness' topics
 *
 * Note: NewsAPI doesn't provide sentiment directly, so we approximate by querying keywords.
 */

export type Mood = 'cold' | 'hot' | 'cool';

export function moodFromTemp(tempCelsius: number): Mood {
  if (tempCelsius < 15) return 'cold';
  if (tempCelsius > 30) return 'hot';
  return 'cool';
}

export function keywordsForMood(mood: Mood): string[] {
  switch (mood) {
    case 'cold':
      return ['recession OR crisis', 'inflation OR layoffs', 'pollution OR disaster'];
    case 'hot':
      return ['crime OR violence', 'war OR conflict', 'scam OR fraud'];
    case 'cool':
    default:
      return ['victory OR won', 'innovation OR breakthrough', 'celebration OR happiness'];
  }
}
