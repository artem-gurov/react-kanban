import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import BoardList from "./pages/BoardList";
import Board from "./pages/Board";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<BoardList />} />
          <Route path="/boards/:boardId" element={<Board />} />
          <Route path="/boards/:boardId/tasks/:taskId" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;