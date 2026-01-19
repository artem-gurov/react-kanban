# React Kanban

A simple Kanban board application built with React and TypeScript.

## Features

- Create and manage multiple Kanban boards
- Drag and drop tasks between columns
- Create, edit, and delete tasks
- Assign priority levels to tasks (none, low, medium, high)
- View task details (title, description, due date, priority)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/    # UI components (Column, TaskCard, Modal, etc.)
├── context/       # State management with React Context and reducer
├── pages/         # Page components (Board, BoardList)
├── layouts/       # Layout components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## How It Works

The application uses React Context API with useReducer to manage the global state of boards, columns, and tasks. Components communicate through this shared state, and drag-and-drop functionality allows moving tasks between columns.

## Testing

Run tests with:
```bash
npm test
npm run test:watch    # for continuous testing
```
2. Clear Jest cache: `npx jest --clearCache`
3. Run tests in watch mode to debug: `npm run test:watch`

## 🚀 Deployment

Build the project for production:

```bash
npm run build
```

The optimized build output will be in the `dist/` directory, ready for deployment to any static hosting service.
