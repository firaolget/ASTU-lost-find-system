import React from "react";
import { Search, Package, LayoutDashboard, LogOut } from "lucide-react";

const Sidebar = ({
  view,
  setView,
  activeTab,
  setActiveTab,
  user,
  setShowModal,
}) => (
  <nav className="w-72 border-r border-white/10 p-6 flex flex-col gap-6 bg-white/[0.01] sticky top-0 h-screen">
    <div className="flex items-center gap-3 px-2 mb-4">
      <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-bold text-black shadow-lg">
        A
      </div>
      <span className="font-bold tracking-tight text-xl italic uppercase">
        ASTU Find
      </span>
    </div>

    <div className="space-y-2">
      <button
        onClick={() => {
          setView("found");
          setActiveTab("feed");
        }}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === "found" && activeTab === "feed" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500"}`}
      >
        <Search size={20} /> Found Items
      </button>
      <button
        onClick={() => {
          setView("lost");
          setActiveTab("feed");
        }}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === "lost" && activeTab === "feed" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-gray-500"}`}
      >
        <Package size={20} /> Lost Items
      </button>
      {user.isAdmin && (
        <button
          onClick={() => setActiveTab("admin-panel")}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === "admin-panel" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-gray-500"}`}
        >
          <LayoutDashboard size={20} /> Admin Panel
        </button>
      )}
    </div>

    <button
      onClick={() => setShowModal("report")}
      className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all text-xs tracking-widest uppercase shadow-xl"
    >
      + REPORT {view.toUpperCase()}
    </button>

    <div className="mt-auto space-y-4">
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs">
        <p className="text-gray-500 mb-1">User Profile</p>
        <p className="font-bold text-cyan-400 truncate">{user.name}</p>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  </nav>
);

export default Sidebar;
