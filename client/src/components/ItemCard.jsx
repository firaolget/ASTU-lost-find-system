import React from 'react';
import { motion } from 'framer-motion';
import { Camera, User } from 'lucide-react';

const ItemCard = ({ item, user, setSelectedItem, setShowModal }) => (
    <motion.div layout className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/[0.04] transition-all relative">
        <div className="aspect-video bg-white/5 rounded-[1.5rem] mb-6 overflow-hidden flex items-center justify-center border border-white/5">
            {item.image_url ? (
                <img src={`http://localhost:5000${item.image_url}`} className="w-full h-full object-cover" alt="item" />
            ) : (
                <Camera className="text-white/5" size={48} />
            )}
        </div>
        <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{item.item_name}</h3>
        <p className="text-cyan-400 text-[10px] font-bold uppercase mb-4 tracking-widest">{item.category}</p>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
        
        {user.isAdmin && (
            <div className="mb-6 flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl">
                <User size={14}/> <span className="font-bold">By: {item.reporter_name}</span>
            </div>
        )}

        <button 
            onClick={() => {setSelectedItem(item); setShowModal('claim')}} 
            className="w-full py-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all uppercase"
        >
            Submit Claim
        </button>
    </motion.div>
);

export default ItemCard;