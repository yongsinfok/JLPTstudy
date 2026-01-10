import type { QuizQuestion } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer?: string | null;
  showResult?: boolean;
  onAnswerSelect: (answer: string) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  showResult = false,
  onAnswerSelect,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'border-primary bg-blue-50 border-2'
        : 'border-gray-200 hover:border-gray-300';
    }
    if (option === question.correctAnswer) {
      return 'border-success bg-success-light border-2';
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'border-error bg-error-light border-2';
    }
    return 'border-gray-200 opacity-60';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">请选择正确的答案填入空白处：</h3>
        <p className="text-2xl text-gray-900 leading-relaxed">
          {question.sentence}
        </p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          const style = getOptionStyle(option);

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswerSelect(option)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${style} ${
                showResult ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">
                  {option}
                </span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-error" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-success-light' : 'bg-error-light'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-gray-800 mb-2">
                {isCorrect ? '正确！' : '不正确'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">完整句子：</span>
                <span className="text-gray-900">
                  {question.sentence.replace('______', question.correctAnswer)}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">翻译：</span>
                {question.translation}
              </p>
              {question.explanation && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">解析：</span>
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
