import { MapPin } from 'lucide-react';
import type { Lesson } from '@/types';
import LessonCard from './LessonCard';

interface LessonMapProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: number) => void;
}

export default function LessonMap({ lessons, onLessonClick }: LessonMapProps) {
  const SECTION_SIZE = 10;
  const sections: Lesson[][] = [];

  for (let i = 0; i < lessons.length; i += SECTION_SIZE) {
    sections.push(lessons.slice(i, i + SECTION_SIZE));
  }

  const calculateProgress = (lessons: Lesson[]): number => {
    if (lessons.length === 0) return 0;
    return Math.round((lessons.filter(l => l.isCompleted).length / lessons.length) * 100);
  };

  const totalProgress = calculateProgress(lessons);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">N2 学习之路</h1>
        <p className="text-gray-600 mb-4">
          共 {lessons.length} 课 • 已完成 {lessons.filter(l => l.isCompleted).length} 课
        </p>
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>总体进度</span>
            <span className="font-bold text-blue-600">{totalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      </div>

      {sections.map((section, sectionIndex) => {
        const sectionStart = sectionIndex * SECTION_SIZE + 1;
        const sectionEnd = Math.min((sectionIndex + 1) * SECTION_SIZE, lessons.length);
        const sectionProgress = calculateProgress(section);

        return (
          <div key={sectionIndex} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold">
                {sectionIndex + 1}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">第 {sectionIndex + 1} 阶段 (课程 {sectionStart}-{sectionEnd})</h2>
                <p className="text-sm text-gray-600">进度: {sectionProgress}%</p>
              </div>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
              <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 -translate-y-1/2 rounded-full transition-all" style={{ width: `${sectionProgress}%` }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {section.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} onClick={() => onLessonClick(lesson.id)} />
                ))}
              </div>
            </div>

            {sectionProgress === 100 && (
              <div className="mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-full">
                <MapPin className="text-green-600" size={20} />
                <span className="font-medium">第 {sectionIndex + 1} 阶段已完成！</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
