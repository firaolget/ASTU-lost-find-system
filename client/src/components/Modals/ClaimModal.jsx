import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ClaimModal = ({ selectedItem, user, setShowModal }) => {
  const [claimData, setClaimData] = useState({
    telegram: "",
    gmail: "",
    proof: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL UPDATED TO MATCH MODULAR BACKEND
      await axios.post("http://localhost:5000/api/admin/claims/submit", {
        ...claimData,
        itemId: selectedItem.id,
        userId: user.id,
      });
      setShowModal(null);
      alert("Your claim has been sent to Admin for review!");
    } catch (err) {
      alert("Error submitting claim. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
      <motion.form
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onSubmit={onSubmit}
        className="bg-[#0f172a] p-10 rounded-[3rem] w-full max-w-lg space-y-6 border border-white/10"
      >
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Submit Claim
        </h2>
        <p className="text-xs text-gray-500 uppercase">
          Item: <span className="text-white">{selectedItem?.item_name}</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            placeholder="Telegram @user"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none"
            onChange={(e) =>
              setClaimData({ ...claimData, telegram: e.target.value })
            }
          />
          <input
            required
            type="email"
            placeholder="Gmail"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none"
            onChange={(e) =>
              setClaimData({ ...claimData, gmail: e.target.value })
            }
          />
        </div>
        <textarea
          required
          placeholder="Provide proof of ownership..."
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl h-40 text-sm outline-none"
          onChange={(e) =>
            setClaimData({ ...claimData, proof: e.target.value })
          }
        ></textarea>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setShowModal(null)}
            className="flex-1 text-gray-500 text-[10px] font-black uppercase"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-2 py-4 bg-green-500 text-black font-black rounded-2xl text-[10px] uppercase"
          >
            Send to Admin
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ClaimModal;
