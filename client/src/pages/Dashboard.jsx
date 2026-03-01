import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    PlusCircle, Search, Package, LogOut, Mail, Send, 
    Calendar, MapPin, Camera, CheckCircle, XCircle, LayoutDashboard, UploadCloud, Filter, User
} from 'lucide-react';

const Dashboard = () => {
    const [view, setView] = useState('found'); 
    const [activeTab, setActiveTab] = useState('feed');
    const [showModal, setShowModal] = useState(null);
    const [items, setItems] = useState([]);
    const [adminClaims, setAdminClaims] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [imageFile, setImageFile] = useState(null);
    const [reportData, setReportData] = useState({ name: '', category: 'Electronics', desc: '', location: '', date: '' });
    const [claimData, setClaimData] = useState({ telegram: '', gmail: '', proof: '' });

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/items');
            setItems(res.data);
            if(user.isAdmin) {
                const claimRes = await axios.get('http://localhost:5000/api/admin/claims');
                setAdminClaims(claimRes.data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, [view]);

    const filteredItems = items.filter(item => {
        const matchesType = item.type === view;
        const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCat === 'All' || item.category === filterCat;
        const matchesDate = !filterDate || item.item_date.startsWith(filterDate);
        return matchesType && matchesSearch && matchesCat && matchesDate;
    });

    const stats = {
        lost: items.filter(i => i.type === 'lost').length,
        found: items.filter(i => i.type === 'found').length,
        claimed: adminClaims.length 
    };

    const handleReport = async (e) => {
        e.preventDefault();
        if (view === 'found' && !imageFile) return alert("Photo mandatory for found items!");
        const formData = new FormData();
        Object.keys(reportData).forEach(key => formData.append(key, reportData[key]));
        formData.append('type', view); formData.append('userId', user.id);
        if (imageFile) formData.append('image', imageFile);
        
        await axios.post('http://localhost:5000/api/items/report', formData);
        setShowModal(null); setImageFile(null); fetchData(); alert("Item Posted Successfully!");
    };

    const processClaim = async (claimId, itemId, action) => {
        await axios.post('http://localhost:5000/api/admin/process-claim', { claimId, itemId, action });
        alert(action === 'approve' ? "Approved! Item Removed from Feed." : "Rejected.");
        fetchData();
    };

    return (
        <div className="min-h-screen bg-[#050810] text-white flex">
            
            {/* SIDEBAR */}
            <nav className="w-72 border-r border-white/10 p-6 flex flex-col gap-6 bg-white/[0.01] sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-bold text-black shadow-lg">A</div>
                    <span className="font-bold tracking-tight text-xl italic uppercase">ASTU Find</span>
                </div>
                
                <div className="space-y-2">
                    <button onClick={() => {setView('found'); setActiveTab('feed')}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'found' && activeTab==='feed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-500'}`}><Search size={20} /> Found Items</button>
                    <button onClick={() => {setView('lost'); setActiveTab('feed')}} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'lost' && activeTab==='feed' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-500'}`}><Package size={20} /> Lost Items</button>
                    {user.isAdmin && <button onClick={() => setActiveTab('admin-panel')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'admin-panel' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-500'}`}><LayoutDashboard size={20} /> Admin Panel</button>}
                </div>

                <button onClick={() => setShowModal('report')} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all text-xs tracking-widest uppercase shadow-xl">+ REPORT {view.toUpperCase()}</button>
                
                <div className="mt-auto space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs">
                        <p className="text-gray-500 mb-1">User Profile</p>
                        <p className="font-bold text-cyan-400 truncate">{user.name}</p>
                    </div>
                    <button onClick={() => {localStorage.clear(); window.location.href="/"}} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"><LogOut size={18} /> Logout</button>
                </div>
            </nav>

            <main className="flex-1 p-8 overflow-y-auto">
                {/* STATUS BAR (ADMIN ONLY) */}
                {user.isAdmin && activeTab === 'admin-panel' && (
                    <div className="flex gap-4 mb-10">
                        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]"><p className="text-[10px] text-gray-500 uppercase mb-1">Lost Items</p><p className="text-3xl font-black text-orange-400">{stats.lost}</p></div>
                        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]"><p className="text-[10px] text-gray-500 uppercase mb-1">Found Items</p><p className="text-3xl font-black text-cyan-400">{stats.found}</p></div>
                        <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-[2rem]"><p className="text-[10px] text-gray-500 uppercase mb-1">Claims Pending</p><p className="text-3xl font-black text-green-400">{stats.claimed}</p></div>
                    </div>
                )}

                {activeTab === 'feed' ? (
                    <>
                        <header className="flex flex-wrap items-center justify-between gap-6 mb-12">
                            <h2 className="text-4xl font-black tracking-tighter capitalize">{view} Feed</h2>
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 outline-none w-64" onChange={(e)=>setSearchQuery(e.target.value)} />
                                </div>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 outline-none" onChange={(e)=>setFilterCat(e.target.value)}>
                                    <option value="All">All Categories</option><option>Electronics</option><option>ID</option><option>Textbooks</option><option>Bags</option><option>Other</option>
                                </select>
                                <input type="date" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400" onChange={(e)=>setFilterDate(e.target.value)} />
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredItems.map(item => (
                                <motion.div key={item.id} layout className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/[0.04] transition-all relative">
                                    <div className="aspect-video bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden flex items-center justify-center border border-white/5">
                                        {item.image_url ? <img src={`http://localhost:5000${item.image_url}`} className="w-full h-full object-cover" /> : <Camera className="text-white/5" size={48} />}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{item.item_name}</h3>
                                    <p className="text-cyan-400 text-[10px] font-bold uppercase mb-4 tracking-widest">{item.category}</p>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                                    
                                    {/* POSTED BY (ADMIN ONLY) */}
                                    {user.isAdmin && (
                                        <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl">
                                            <User size={14}/> <span className="font-bold">By: {item.reporter_name}</span>
                                        </div>
                                    )}

                                    <button onClick={() => {setSelectedItem(item); setShowModal('claim')}} className="w-full py-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all uppercase">Submit Claim</button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="max-w-5xl space-y-6">
                        <h2 className="text-3xl font-black mb-8">Pending Claims</h2>
                        {adminClaims.map(c => (
                            <div key={c.id} className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="space-y-4 flex-1">
                                    <h4 className="font-black text-xl uppercase text-cyan-400">{c.item_name}</h4>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="bg-white/5 p-3 rounded-xl">👤 Claimant: {c.claimant_name}</div>
                                        <div className="bg-white/5 p-3 rounded-xl">📧 Email: {c.gmail}</div>
                                        <div className="bg-white/5 p-3 rounded-xl">📱 Telegram: {c.telegram_user}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl text-sm italic text-gray-400 leading-relaxed">" {c.proof_text} "</div>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-48">
                                    <button onClick={() => processClaim(c.id, c.item_id, 'approve')} className="py-4 bg-green-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg">Approve</button>
                                    <button onClick={() => processClaim(c.id, c.item_id, 'reject')} className="py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {showModal === 'report' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
                        <motion.form initial={{scale:0.9}} animate={{scale:1}} onSubmit={handleReport} className="bg-[#0f172a] p-10 rounded-[3rem] w-full max-w-xl space-y-4 border border-white/10">
                            <h2 className="text-3xl font-black mb-4 tracking-tighter">Report {view} Item</h2>
                            <label className="flex flex-col items-center p-8 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-cyan-500/5 transition-all">
                                <UploadCloud className="text-gray-500 mb-2"/><span className="text-[10px] font-bold uppercase">{imageFile ? imageFile.name : `Upload Photo (${view==='found' ? 'Required' : 'Optional'})`}</span>
                                <input type="file" className="hidden" onChange={(e)=>setImageFile(e.target.files[0])} />
                            </label>
                            <input required placeholder="Item Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" onChange={(e)=>setReportData({...reportData, name:e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-white/5 border border-white/10 p-4 rounded-2xl text-gray-400" onChange={(e)=>setReportData({...reportData, category:e.target.value})}>
                                    <option>Electronics</option><option>ID</option><option>Textbooks</option><option>Bags</option><option>Other</option>
                                </select>
                                <input required type="date" className="bg-white/5 border border-white/10 p-4 rounded-2xl text-gray-400" onChange={(e)=>setReportData({...reportData, date:e.target.value})} />
                            </div>
                            <input required placeholder="Location in ASTU" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" onChange={(e)=>setReportData({...reportData, location:e.target.value})} />
                            <textarea required placeholder="Description (Color, special marks)..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl h-32 outline-none" onChange={(e)=>setReportData({...reportData, desc:e.target.value})}></textarea>
                            <div className="flex gap-4 pt-4"><button type="button" onClick={()=>setShowModal(null)} className="flex-1 text-gray-500 text-[10px] font-black uppercase">Cancel</button><button type="submit" className="flex-2 px-10 py-4 bg-cyan-500 text-black font-black rounded-2xl text-[10px] uppercase">Post Report</button></div>
                        </motion.form>
                    </div>
                )}
                
                {showModal === 'claim' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
                        <motion.form initial={{scale:0.9}} animate={{scale:1}} onSubmit={async (e) => {
                            e.preventDefault();
                            await axios.post('http://localhost:5000/api/claims/submit', { ...claimData, itemId: selectedItem.id, userId: user.id });
                            setShowModal(null); alert("Your claim has been sent to Admin for review!");
                        }} className="bg-[#0f172a] p-10 rounded-[3rem] w-full max-w-lg space-y-6 border border-white/10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Submit Claim</h2>
                            <p className="text-xs text-gray-500 uppercase">Item: <span className="text-white">{selectedItem?.item_name}</span></p>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Telegram @user" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none" onChange={(e)=>setClaimData({...claimData, telegram: e.target.value})} />
                                <input required type="email" placeholder="Gmail" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none" onChange={(e)=>setClaimData({...claimData, gmail: e.target.value})} />
                            </div>
                            <textarea required placeholder="Provide proof of ownership (last known location, serial number, description of contents)..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl h-40 text-sm outline-none" onChange={(e)=>setClaimData({...claimData, proof: e.target.value})}></textarea>
                            <div className="flex gap-4"><button type="button" onClick={()=>setShowModal(null)} className="flex-1 text-gray-500 text-[10px] font-black uppercase">Back</button><button type="submit" className="flex-2 py-4 bg-green-500 text-black font-black rounded-2xl text-[10px] uppercase">Send to Admin</button></div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;