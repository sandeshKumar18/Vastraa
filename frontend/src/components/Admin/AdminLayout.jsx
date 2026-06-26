import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20 items-center justify-between">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* --- Sidebar --- */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform transition-transform duration-300 z-20 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <AdminSidebar />
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;