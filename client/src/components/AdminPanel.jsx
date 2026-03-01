import React from "react";
import axios from "axios";

const AdminPanel = ({ items, adminClaims, fetchData }) => {
  const stats = {
    lost: items.filter((i) => i.type === "lost").length,
    found: items.filter((i) => i.type === "found").length,
    claimed: adminClaims.length,
  };

  const processClaim = async (claimId, itemId, action) => {
    try {
      await axios.post(
        "https://astu-lost-find-system.onrender.com/api/admin/process-claim",
        {
          claimId,
          itemId,
          action,
        },
      );
      alert(
        action === "approve"
          ? "Approved! Item Removed from Feed."
          : "Rejected.",
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl space-y-10">
      {/* STATS BARS */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]">
          <p className="text-[10px] text-gray-500 uppercase mb-1">Lost Items</p>
          <p className="text-3xl font-black text-orange-400">{stats.lost}</p>
        </div>
        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]">
          <p className="text-[10px] text-gray-500 uppercase mb-1">
            Found Items
          </p>
          <p className="text-3xl font-black text-cyan-400">{stats.found}</p>
        </div>
        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]">
          <p className="text-[10px] text-gray-500 uppercase mb-1">
            Claims Pending
          </p>
          <p className="text-3xl font-black text-green-400">{stats.claimed}</p>
        </div>
      </div>

      <h2 className="text-3xl font-black mb-8">Pending Claims</h2>
      <div className="space-y-6">
        {adminClaims.map((c) => (
          <div
            key={c.id}
            className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row gap-6 justify-between items-start"
          >
            <div className="space-y-4 flex-1">
              <h4 className="font-black text-xl uppercase text-cyan-400">
                {c.item_name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/5 p-3 rounded-xl">
                  👤 Claimant: {c.claimant_name}
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  📧 Email: {c.gmail}
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  📱 Telegram: {c.telegram_user}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl text-sm italic text-gray-400 leading-relaxed">
                "{c.proof_text}"
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-48">
              <button
                onClick={() => processClaim(c.id, c.item_id, "approve")}
                className="py-4 bg-green-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg"
              >
                Approve
              </button>
              <button
                onClick={() => processClaim(c.id, c.item_id, "reject")}
                className="py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
