import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, CreditCard, Info, Users } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', id: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Validation for ASTU ID
        const astuRegex = /^UGR\/\d{5}\/\d{2}$/;
        if (!astuRegex.test(formData.id)) {
            setError('Invalid ID format. Use UGR/XXXXX/XX');
            setLoading(false);
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await axios.post(`https://astu-lost-find-system.onrender.com${endpoint}`, {
                name: formData.name,
                id: formData.id,
                password: formData.password
            });

            if (isLogin) {
                // Handle Login Success
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            } else {
                // Handle Registration Success
                alert("Registration Successful! Please login now.");
                setIsLogin(true); // Switch to login view
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.response?.data?.error || "Server connection failed. Is server.js running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
                {/* Background Glows */}
                <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#050810]">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md backdrop-blur-xl bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl mb-4 text-cyan-400">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">ASTU Digital Portal</h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            {isLogin ? "Welcome back, scholar" : "Create your student account"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <CreditCard className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                required
                                type="text"
                                placeholder="UGR/XXXXX/XX"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                value={formData.id}
                                onChange={(e) => setFormData({...formData, id: e.target.value.toUpperCase()})}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                required
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        {error && <p className="text-red-400 text-xs bg-red-400/10 p-2 rounded-lg text-center">{error}</p>}

                        <button 
                            disabled={loading}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (isLogin ? "Sign In" : "Register Now")}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="w-full mt-6 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        {isLogin ? "New to ASTU? Create an account" : "Already have an account? Login"}
                    </button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 flex flex-col items-center text-gray-500">
                    <span className="text-[10px] uppercase tracking-[0.3em] mb-2">About ASTU</span>
                    <div className="w-px h-10 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                </motion.div>
            </div>

            {/* About Section */}
            <div className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-cyan-400 font-medium tracking-widest text-sm uppercase"><Info className="w-4 h-4" /> Integrity & Technology</div>
                    <h2 className="text-4xl font-bold text-white">Adama Science & Technology University</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Our campus is a hub of innovation. To ensure a safe and supportive environment, 
                        the **ASTU Student Union** has pioneered this digital Lost & Found system. 
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
                    <Users className="w-12 h-12 text-cyan-400 mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-4">The Student Union Mission</h3>
                    <p className="text-gray-400">By using your official **UGR** credentials, we maintain a trusted network where every report is verified.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;