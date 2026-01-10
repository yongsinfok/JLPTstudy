import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import LessonListPage from './pages/LessonListPage';
import LessonDetailPage from './pages/LessonDetailPage';
import StudyPage from './pages/StudyPage';
import GrammarDetailPage from './pages/GrammarDetailPage';
import PracticePage from './pages/PracticePage';
import QuizPage from './pages/QuizPage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import WrongAnswersPage from './pages/WrongAnswersPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'lessons', element: <LessonListPage /> },
      { path: 'lessons/:lessonId', element: <LessonDetailPage /> },
      { path: 'study/:grammarPoint', element: <StudyPage /> },
      { path: 'grammar/:grammarPoint', element: <GrammarDetailPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'quiz/:type', element: <QuizPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'wrong-answers', element: <WrongAnswersPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
