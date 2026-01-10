// Data processing utilities
// Will be expanded in later phases

export function groupByLesson<T extends { lessonNumber: number }>(items: T[]): Map<number, T[]> {
  const map = new Map<number, T[]>();
  items.forEach(item => {
    if (!map.has(item.lessonNumber)) {
      map.set(item.lessonNumber, []);
    }
    map.get(item.lessonNumber)!.push(item);
  });
  return map;
}

export function groupByGrammarPoint<T extends { grammarPoint: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  items.forEach(item => {
    if (!map.has(item.grammarPoint)) {
      map.set(item.grammarPoint, []);
    }
    map.get(item.grammarPoint)!.push(item);
  });
  return map;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
