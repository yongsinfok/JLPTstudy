export interface Sentence {
  id: string;
  lessonNumber: number;
  grammarPoint: string;
  sentence: string;
  furigana: string;
  translation: string;
  audioPath: string;
  grammarConnection: string;
  grammarExplanation: string;
  wordByWord: string;
  tags: string[];
}
