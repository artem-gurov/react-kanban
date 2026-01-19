import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function AppLayout() {
  return (
    <div data-testid="app-layout" className="flex flex-col min-h-screen">
      <Header />
      <main data-testid="main-content" className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;