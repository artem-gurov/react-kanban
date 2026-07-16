import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBoardContext } from "../context/useBoardContext";
import InputDialog from "../components/InputDialog";

function BoardList() {
  const boardContext = useBoardContext();
  const { boards, loadBoards, handleAddBoard } = boardContext;
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return (
    <section className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Boards</h2>
        <p className="text-gray-600">Select a board to get started</p>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-700 mb-6 text-lg">No boards yet. Create your first board to get started!</p>
          <button
            onClick={() => setIsAddBoardOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-semibold"
          >
            Create Your First Board
          </button>
        </div>
      ) : (
        <>
          <div data-testid="board-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {boards.map((board) => (
              <Link
                key={board.id}
                to={`/boards/${board.id}`}
                data-testid={`board-card-${board.id}`}
                className="group relative min-h-28 max-h-40 p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden flex items-center"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all"></div>
                <div className="relative z-10 w-full">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-3 break-all">{board.name}</h3>
                  <p className="text-gray-500 text-sm">Click to open</p>
                </div>
              </Link>
            ))}
            <button
              onClick={() => setIsAddBoardOpen(true)}
              className="min-h-28 max-h-40 p-4 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-100 transition-all flex flex-col items-center justify-center text-gray-600 hover:text-gray-800 group"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-semibold">Create new board</span>
            </button>
          </div>
        </>
      )}

      <InputDialog
        isOpen={isAddBoardOpen}
        onClose={() => setIsAddBoardOpen(false)}
        onSubmit={handleAddBoard}
        title="Create New Board"
        label="Board Name"
        placeholder="Enter board name"
        submitText="Create Board"
      />
    </section>
  )
}

export default BoardList;