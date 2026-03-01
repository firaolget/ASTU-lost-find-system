import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";
import AdminPanel from "../components/AdminPanel";
import ReportModal from "../components/Modals/ReportModal";
import ClaimModal from "../components/Modals/ClaimModal";
import { Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import API from "../api";

const Dashboard = () => {
  const [view, setView] = useState("found");
  const [activeTab, setActiveTab] = useState("feed");
  const [showModal, setShowModal] = useState(null);
  const [items, setItems] = useState([]);
  const [adminClaims, setAdminClaims] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchData = async () => {
    try {
      // Updated to match modular backend routes
      
      const items = await API.get('/items');
      setItems(items.data);
      if (user.isAdmin) {
        const claimRes = await API.get("/admin/claims");

        setAdminClaims(claimRes.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]); // This ensures when you switch between Lost/Found, it refreshes.

  const filteredItems = items.filter((item) => {
    const matchesType = item.type === view;
    const matchesSearch = item.item_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCat = filterCat === "All" || item.category === filterCat;
    const matchesDate = !filterDate || item.item_date.startsWith(filterDate);
    return matchesType && matchesSearch && matchesCat && matchesDate;
  });

  return (
    <div className="min-h-screen bg-[#050810] text-white flex">
      <Sidebar
        view={view}
        setView={setView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        setShowModal={setShowModal}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "admin-panel" ? (
          <AdminPanel
            items={items}
            adminClaims={adminClaims}
            fetchData={fetchData}
          />
        ) : (
          <>
            <header className="flex flex-wrap items-center justify-between gap-6 mb-12">
              <h2 className="text-4xl font-black tracking-tighter capitalize">
                {view} Feed
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 outline-none w-64"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 outline-none"
                  onChange={(e) => setFilterCat(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option>Electronics</option>
                  <option>ID</option>
                  <option>Textbooks</option>
                  <option>Bags</option>
                  <option>Other</option>
                </select>
                <input
                  type="date"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400"
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  user={user}
                  setSelectedItem={setSelectedItem}
                  setShowModal={setShowModal}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {showModal === "report" && (
          <ReportModal
            view={view}
            user={user}
            setShowModal={setShowModal}
            fetchData={fetchData}
          />
        )}
        {showModal === "claim" && (
          <ClaimModal
            selectedItem={selectedItem}
            user={user}
            setShowModal={setShowModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
