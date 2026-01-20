# Kanban Backend API

Express + TypeScript REST API for the Kanban board.

## Getting started
- Install deps: `npm install`
- Dev server: `npm run dev` (defaults to http://localhost:5000)
- Tests: `npm test`
- Build: `npm run build`

Config (see src/config.ts):
- `PORT` (default 5000)
- `CORS_ORIGIN` (default http://localhost:5173)

All API routes are under `/api`. All responses follow a discriminated union format:
- **Success**: `{ success: true, data: T }`
- **Error**: `{ success: false, error: string }`

## Health Check

### `GET /health`
Basic health check endpoint.

**Response** (200):
```json
{ "status": "ok" }
```

## Boards

### `GET /api/boards`
List all boards.

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "board-1",
      "name": "My Project",
      "columns": [
        { "id": "col-1", "title": "To Do", "taskIds": ["task-1", "task-2"] },
        { "id": "col-2", "title": "In Progress", "taskIds": [] }
      ],
      "tasks": {
        "task-1": { "id": "task-1", "title": "Setup", "priority": "high" },
        "task-2": { "id": "task-2", "title": "Design", "priority": "medium" }
      }
    }
  ]
}
```

### `GET /api/boards/:boardId`
Fetch a single board by ID.

**Parameters**:
- `boardId` (path, required): Board ID

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [...],
    "tasks": {...}
  }
}
```

**Error** (404): `{ "success": false, "error": "Board not found" }`

### `POST /api/boards`
Create a new board.

**Request** (201):
```json
{ "name": "New Board" }
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "board-new",
    "name": "New Board",
    "columns": [],
    "tasks": {}
  }
}
```

**Error** (400): `{ "success": false, "error": "Board name is required" }`

### `PATCH /api/boards/:boardId`
Update board name.

**Parameters**:
- `boardId` (path, required): Board ID

**Request**:
```json
{ "name": "Updated Name" }
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "Updated Name",
    "columns": [...],
    "tasks": {...}
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "Board name is required" }`
- (404): `{ "success": false, "error": "Board not found" }`

### `DELETE /api/boards/:boardId`
Delete a board and all its columns/tasks.

**Parameters**:
- `boardId` (path, required): Board ID

**Response** (200):
```json
{
  "success": true,
  "data": { "id": "board-1" }
}
```

**Error** (404): `{ "success": false, "error": "Board not found" }`

## Columns

### `POST /api/boards/:boardId/columns`
Add a column to a board.

**Parameters**:
- `boardId` (path, required): Board ID

**Request** (201):
```json
{ "title": "Done" }
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1"] },
      { "id": "col-3", "title": "Done", "taskIds": [] }
    ],
    "tasks": {...}
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "Column title is required" }`
- (404): `{ "success": false, "error": "Board not found" }`

### `PATCH /api/boards/:boardId/columns/reorder`
Reorder columns within a board.

**Parameters**:
- `boardId` (path, required): Board ID

**Request**:
```json
{ "columnIds": ["col-2", "col-1", "col-3"] }
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-2", "title": "In Progress", "taskIds": [] },
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1"] },
      { "id": "col-3", "title": "Done", "taskIds": [] }
    ],
    "tasks": {...}
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "columnIds array is required" }`
- (404): `{ "success": false, "error": "Board not found" }`

### `PATCH /api/boards/:boardId/columns/:columnId`
Update column title.

**Parameters**:
- `boardId` (path, required): Board ID
- `columnId` (path, required): Column ID

**Request**:
```json
{ "title": "Review" }
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "col-2",
    "title": "Review",
    "taskIds": ["task-3"]
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "Column title is required" }`
- (404): `{ "success": false, "error": "Board or column not found" }`

### `DELETE /api/boards/:boardId/columns/:columnId`
Delete a column and remove all its tasks.

**Parameters**:
- `boardId` (path, required): Board ID
- `columnId` (path, required): Column ID

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1"] }
    ],
    "tasks": {...}
  }
}
```

**Error** (404): `{ "success": false, "error": "Board or column not found" }`

## Tasks

### `POST /api/boards/:boardId/columns/:columnId/tasks`
Add a task to a column.

**Parameters**:
- `boardId` (path, required): Board ID
- `columnId` (path, required): Column ID

**Request** (201):
```json
{
  "title": "Fix login bug",
  "description": "User cannot reset password",
  "dueDate": "2026-01-25",
  "priority": "high"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1", "task-99"] }
    ],
    "tasks": {
      "task-1": {...},
      "task-99": { "id": "task-99", "title": "Fix login bug", "description": "User cannot reset password", "dueDate": "2026-01-25", "priority": "high" }
    }
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "Task title is required" }`
- (404): `{ "success": false, "error": "Board or column not found" }`

### `PATCH /api/boards/:boardId/tasks/:taskId`
Update task fields (title, description, dueDate, priority).

**Parameters**:
- `boardId` (path, required): Board ID
- `taskId` (path, required): Task ID

**Request**:
```json
{
  "title": "Fix login bug",
  "priority": "medium"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "task-99",
    "title": "Fix login bug",
    "description": "User cannot reset password",
    "dueDate": "2026-01-25",
    "priority": "medium"
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "Task title is required" }`
- (404): `{ "success": false, "error": "Board or task not found" }`

### `DELETE /api/boards/:boardId/tasks/:taskId`
Delete a task.

**Parameters**:
- `boardId` (path, required): Board ID
- `taskId` (path, required): Task ID

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1"] }
    ],
    "tasks": {
      "task-1": {...}
    }
  }
}
```

**Error** (404): `{ "success": false, "error": "Board or task not found" }`

### `PATCH /api/boards/:boardId/tasks/:taskId/move`
Move a task between columns.

**Parameters**:
- `boardId` (path, required): Board ID
- `taskId` (path, required): Task ID

**Request**:
```json
{
  "sourceColumnId": "col-1",
  "destinationColumnId": "col-2",
  "destinationIndex": 0
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "board-1",
    "name": "My Project",
    "columns": [
      { "id": "col-1", "title": "To Do", "taskIds": ["task-1"] },
      { "id": "col-2", "title": "In Progress", "taskIds": ["task-99", "task-3"] }
    ],
    "tasks": {...}
  }
}
```

**Errors**:
- (400): `{ "success": false, "error": "sourceColumnId, destinationColumnId, and destinationIndex are required" }`
- (404): `{ "success": false, "error": "Board, task, or column not found" }`
