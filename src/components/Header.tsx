import { Link } from "react-router-dom";
import Icon from "./Icon";

function Header() {
  return (
    <header data-testid="app-header" className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto">
        <Link to="/" className="inline-block">
          <h1 className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors flex items-center gap-2">
            <Icon type="kanban" size="lg" className="text-blue-600" />
            Kanban Boards
          </h1>
        </Link>
      </div>
    </header>
  );
}

export default Header;