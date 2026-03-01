import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import axios from "axios";

const ReportModal = ({ view, user, setShowModal, fetchData }) => {
  const [imageFile, setImageFile] = useState(null);
  const [reportData, setReportData] = useState({
    name: "",
    category: "Electronics",
    desc: "",
    location: "",
    date: "",
  });

  const handleReport = async (e) => {
    e.preventDefault();
    if (view === "found" && !imageFile)
      return alert("Photo mandatory for found items!");

    const formData = new FormData();
    Object.keys(reportData).forEach((key) =>
      formData.append(key, reportData[key]),
    );
    formData.append("type", view);
    formData.append("userId", user.id);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.post("http://localhost:5000/api/items/report", formData);
      setShowModal(null);
      fetchData();
      alert("Item Posted Successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
      <motion.form
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onSubmit={handleReport}
        className="bg-[#0f172a] p-10 rounded-[3rem] w-full max-w-xl space-y-4 border border-white/10"
      >
        <h2 className="text-3xl font-black mb-4 tracking-tighter">
          Report {view} Item
        </h2>
        <label className="flex flex-col items-center p-8 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-cyan-500/5 transition-all">
          <UploadCloud className="text-gray-500 mb-2" />
          <span className="text-[10px] font-bold uppercase">
            {imageFile
              ? imageFile.name
              : `Upload Photo (${view === "found" ? "Required" : "Optional"})`}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <input
          required
          placeholder="Item Name"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
          onChange={(e) =>
            setReportData({ ...reportData, name: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-gray-400"
            onChange={(e) =>
              setReportData({ ...reportData, category: e.target.value })
            }
          >
            <option>Electronics</option>
            <option>ID</option>
            <option>Textbooks</option>
            <option>Bags</option>
            <option>Other</option>
          </select>
          <input
            required
            type="date"
            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-gray-400"
            onChange={(e) =>
              setReportData({ ...reportData, date: e.target.value })
            }
          />
        </div>
        <input
          required
          placeholder="Location in ASTU"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
          onChange={(e) =>
            setReportData({ ...reportData, location: e.target.value })
          }
        />
        <textarea
          required
          placeholder="Description..."
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl h-32 outline-none"
          onChange={(e) =>
            setReportData({ ...reportData, desc: e.target.value })
          }
        ></textarea>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setShowModal(null)}
            className="flex-1 text-gray-500 text-[10px] font-black uppercase"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-2 px-10 py-4 bg-cyan-500 text-black font-black rounded-2xl text-[10px] uppercase"
          >
            Post Report
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ReportModal;
