'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { 
    Bot, Globe, Target, CreditCard, Play, Terminal, CheckCircle2, 
    AlertCircle, Loader2, LayoutDashboard, PlusCircle, BarChart3, 
    TrendingUp, TrendingDown, MousePointer2, Wallet, Wand2, Phone, Link2, 
    Type, ListChecks, Settings2, Eye, ShieldCheck, Search, Sparkles, X, ChevronRight, Check, Users, MapPin, DollarSign,
    Gauge, FileWarning, ExternalLink, LogOut, User as UserIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AIExpertLab from '@/components/AIExpertLab';
import KeywordLab, { ResearchedKeyword } from '@/components/KeywordLab';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { generateDashboardData, type DashboardMockData } from '@/lib/mockDataEngine';

interface LogEntry {
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

interface Campaign {
    campaign: {
        id: string;
        name: string;
        status: string;
    };
    metrics: {
        clicks: number;
        cost_micros: number;
        conversions: number;
    };
}

interface PreScanData {
    theme: string;
    adGroups: {
        name: string;
        keywords: { 
            text: string; 
            avgCpc: number; 
            volume: number; 
            trend: 'up' | 'down' | 'steady';
            category: 'core' | 'suggested';
            selected?: boolean;
        }[];
        headlines: string[];
        descriptions: string[];
    }[];
    globalAssets: {
        sitelinks: { title: string; desc: string }[];
        callout: string[];
    };
}

interface Account {
    id: string;
    name: string;
    descriptiveName: string;
}

// Mock data is now generated dynamically by mockDataEngine based on selected account

export default function Home() {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email ?? null);
            }
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };
    const [activeTab, setActiveTab] = useState<'create' | 'dashboard' | 'keywords'>('dashboard');
    const [selectedCampaign, setSelectedCampaign] = useState<{ id: string, name: string } | null>(null);
    const [approvedKeywords, setApprovedKeywords] = useState<ResearchedKeyword[]>([]);
    const [approvedNegativeKeywords, setApprovedNegativeKeywords] = useState<string[]>([]);
    const [approvedTheme, setApprovedTheme] = useState('');
    const [hasMounted, setHasMounted] = useState(false);
    
    // Accounts & Filtering
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);

    // Form States
    const [url, setUrl] = useState('https://hoanhashi.com');
    const [budget, setBudget] = useState<number>(500000);
    const [location, setLocation] = useState<string>('VN_ALL');
    
    // Extension Toggles
    const [extensions, setExtensions] = useState({
        call: true,
        sitelink: true,
        callout: true,
        structured: true
    });
    const [useAI, setUseAI] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [isPreScanning, setIsPreScanning] = useState(false);
    const [preScanData, setPreScanData] = useState<PreScanData | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isFetchingCampaigns, setIsFetchingCampaigns] = useState(false);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    // Initial Load - Accounts
    useEffect(() => {
        setHasMounted(true);
        fetchAccounts();
    }, []);

    // Load Campaigns when account changes
    useEffect(() => {
        if (selectedAccount) {
            fetchCampaigns();
        }
    }, [selectedAccount]);

    // Context-Aware Mock Data — regenerates when account changes
    const dashboardData: DashboardMockData = useMemo(() => {
        const account = accounts.find(a => a.id === selectedAccount);
        return generateDashboardData(account?.name || 'generic');
    }, [selectedAccount, accounts]);

    const fetchAccounts = async () => {
        setIsFetchingAccounts(true);
        try {
            const response = await fetch('/api/account/list');
            const data = await response.json();
            if (Array.isArray(data)) {
                setAccounts(data);
                // Auto-select first or one from .env if it matches
                if (data.length > 0) setSelectedAccount(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setIsFetchingAccounts(false);
        }
    };

    const fetchCampaigns = async () => {
        if (!selectedAccount) return;
        setIsFetchingCampaigns(true);
        try {
            const response = await fetch(`/api/campaign/list?customerId=${selectedAccount}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCampaigns(data);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setIsFetchingCampaigns(false);
        }
    };

    // Dynamic Campaign Name
    const getCampaignName = () => {
        try {
            const domain = new URL(url).hostname.replace('www.', '').split('.')[0];
            const date = new Date().toLocaleDateString('vi-VN').replace(/\//g, '');
            return `SEARCH - ${domain.toUpperCase()} - ${date}`;
        } catch {
            return `SEARCH - UNKNOWN - ${new Date().getTime()}`;
        }
    };

    const handlePreScan = async () => {
        if (!url) return;
        setIsPreScanning(true);
        setPreScanData(null);
        try {
            const response = await fetch('/api/campaign/pre-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, settings: { useAI } }),
            });
            const data: PreScanData = await response.json();
            
            // Initialize selection: all core are selected, suggested are NOT
            const initializedData = {
                ...data,
                adGroups: data.adGroups.map(group => ({
                    ...group,
                    keywords: group.keywords.map(kw => ({
                        ...kw,
                        selected: kw.category === 'core'
                    }))
                }))
            };
            
            setPreScanData(initializedData);
        } catch (error) {
            console.error("Pre-scan failed", error);
        } finally {
            setIsPreScanning(false);
        }
    };

    const toggleKeyword = (groupIdx: number, kwIdx: number) => {
        if (!preScanData) return;
        const newData = { ...preScanData };
        newData.adGroups[groupIdx].keywords[kwIdx].selected = !newData.adGroups[groupIdx].keywords[kwIdx].selected;
        setPreScanData(newData);
    };

    const handleStart = async () => {
        if (!url || !selectedAccount || !preScanData) return;

        setIsLoading(true);
        setLogs([]);
        
        const campaignName = getCampaignName();

        try {
            const response = await fetch('/api/campaign/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url, 
                    customerId: selectedAccount, 
                    campaignName,
                    budget,
                    locationTargeting: location,
                    negativeKeywords: approvedNegativeKeywords,
                    settings: { extensions, useAI, preGeneratedData: preScanData } 
                }),
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                lines.forEach(line => {
                    try {
                        const data = JSON.parse(line);
                        setLogs(prev => [...prev, data]);
                    } catch (e) {
                        console.error("Failed to parse log line:", line);
                    }
                });
            }
        } catch (error: any) {
            setLogs(prev => [...prev, { message: `FATAL ERROR: ${error.message}`, type: 'error' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedCampaign) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <AIExpertLab 
                        campaignId={selectedCampaign.id} 
                        campaignName={selectedCampaign.name}
                        customerId={selectedAccount}
                        onBack={() => setSelectedCampaign(null)} 
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 font-sans selection:text-indigo-200">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Enterprise Grade Ads Engine
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent">
                            OptimaAds AI
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 self-center md:self-end">
                        {userEmail && (
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/50 border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <UserIcon className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Admin Access</p>
                                    <p className="text-xs text-zinc-300 font-semibold">{userEmail}</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="ml-2 p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                        <div className="flex bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-sm p-1.5 rounded-2xl self-center md:self-end">
                        <button 
                            onClick={() => setActiveTab('keywords')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'keywords' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-zinc-500 hover:text-indigo-600 transition-all'}`}
                        >
                            <Search className="w-4 h-4" />
                            Keyword Lab
                        </button>
                        <button 
                            onClick={() => setActiveTab('create')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-indigo-600 transition-all'}`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            Launch Center
                        </button>
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-indigo-600 transition-all'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Performance
                        </button>
                    </div>
                </header>

                {activeTab === 'keywords' ? (
                    <KeywordLab
                        onExportToLaunch={(kws, theme, adGroupNames, scannedUrl, suggestedBudget, negativeKws) => {
                            setApprovedKeywords(kws);
                            setApprovedNegativeKeywords(negativeKws);
                            setApprovedTheme(theme);
                            setUrl(scannedUrl); // Auto-fill from Keyword Lab
                            setBudget(suggestedBudget); // Auto-fill budget from Lab processing
                            
                            // Immediately build the Launch Center preview state
                            const preScanAdGroups = adGroupNames.map(gn => {
                                const groupKws = kws.filter(k => k.adGroup === gn).map(k => ({
                                    text: k.text,
                                    avgCpc: k.cpc,
                                    volume: k.volume,
                                    trend: k.trend,
                                    category: k.category,
                                    selected: k.selected
                                }));
                                
                                return {
                                    name: `NHÓM: ${gn.toUpperCase()}`,
                                    keywords: groupKws,
                                    headlines: [
                                        `Mua ${gn} Giá Tốt Nhất`,
                                        `${gn} Cao Cấp - Giao Nhanh`,
                                        `Chuyên Cung Cấp ${gn}`,
                                    ],
                                    descriptions: [
                                        `Cửa hàng cung cấp ${gn.toLowerCase()} chất lượng, giao hàng tận nơi. Đặt ngay!`,
                                        `Nhiều mẫu mã ${gn.toLowerCase()} đa dạng, giá cả cạnh tranh. Xem các ưu đãi hôm nay.`,
                                    ]
                                };
                            }).filter(g => g.keywords.length > 0);

                            setPreScanData({
                                theme: theme,
                                adGroups: preScanAdGroups,
                                globalAssets: {
                                    sitelinks: [
                                        { title: 'Sản Phẩm Khuyến Mãi', desc: 'Săn deal giảm giá ngay 50%' },
                                        { title: 'Chính Sách Giao Hàng', desc: 'Giao hỏa tốc 2 giờ toàn quốc' }
                                    ],
                                    callout: ['Giao hàng 24/7', 'Đổi trả miễn phí', 'Cam kết chính hãng']
                                }
                            });
                            
                            setActiveTab('create');
                        }}
                    />
                ) : activeTab === 'create' ? (
                    <div className="space-y-6">
                        {/* Approved Keywords Banner from Keyword Lab */}
                        {approvedKeywords.length > 0 && (
                            <div className="flex items-center justify-between p-5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-sm flex items-center gap-2">
                                            {approvedKeywords.length} từ khóa đã duyệt từ Keyword Lab
                                            {approvedNegativeKeywords.length > 0 && (
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                                                    Đã chặn {approvedNegativeKeywords.length} từ
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-purple-400 text-xs mt-0.5">
                                            {approvedTheme} · AI sẽ dùng bộ từ khóa này khi tạo chiến dịch
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setActiveTab('keywords')}
                                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => { setApprovedKeywords([]); setApprovedTheme(''); }}
                                        className="text-xs font-bold text-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="grid lg:grid-cols-12 gap-8">
                        {/* LEFT: Config Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl p-6 space-y-6">
                                <h2 className="text-zinc-100 font-bold flex items-center gap-2 px-2">
                                    <Target className="w-4 h-4 text-indigo-400" />
                                    Deployment Target
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Select Account</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <select 
                                                value={selectedAccount}
                                                onChange={(e) => setSelectedAccount(e.target.value)}
                                                className="w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 appearance-none text-sm text-zinc-300"
                                            >
                                                {accounts.map(acc => (
                                                    <option key={acc.id} value={acc.id} className="bg-zinc-900 text-white">{acc.name} ({acc.id})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Landing Page URL</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1 group">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-indigo-400 transition-colors">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    disabled={approvedKeywords.length > 0}
                                                    placeholder="https://example.com"
                                                    className={`w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-sm ${approvedKeywords.length > 0 ? 'opacity-50 cursor-not-allowed' : 'focus:border-indigo-500/50'}`}
                                                />
                                            </div>
                                            {/* Hide manual scan button if we already came from Keyword Lab with pre-scanned data */}
                                            {approvedKeywords.length === 0 && (
                                                <button 
                                                    onClick={handlePreScan}
                                                    disabled={isPreScanning || !url}
                                                    className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isPreScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={`p-4 rounded-2xl space-y-2 border transition-all ${approvedKeywords.length > 0 ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-white/5 border-white/5'}`}>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                                            Campaign Name Pattern
                                            {approvedKeywords.length > 0 && <span className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-500/20 text-indigo-400">AUTO</span>}
                                        </div>
                                        <div className="text-xs font-mono text-indigo-300 break-all">{getCampaignName()}</div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl p-6 space-y-6">
                                <h2 className="text-zinc-100 font-bold flex items-center gap-2 px-2">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    Budget & Targeting
                                </h2>

                                <div className="space-y-4">
                                    {/* Budget Input */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end ml-1">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Daily Budget</label>
                                            {approvedKeywords.length > 0 && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI SUGGESTED</span>}
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600">
                                                <span className="text-sm font-bold opacity-70">₫</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                value={budget}
                                                onChange={(e) => setBudget(Number(e.target.value))}
                                                className={`w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white rounded-2xl py-3.5 pl-10 pr-4 outline-none transition-all text-sm font-mono text-zinc-200 ${approvedKeywords.length > 0 ? 'bg-emerald-500/5 border-emerald-500/10' : 'focus:border-indigo-500/50'}`}
                                            />
                                        </div>
                                        <div className="ml-1 text-[10px] text-zinc-500 font-medium">Khoảng {(budget / 1000).toLocaleString()}K/ngày sẽ mang về tương đối click.</div>
                                    </div>

                                    {/* Location Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Location Targeting</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <select 
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 appearance-none text-sm text-zinc-300"
                                            >
                                                <option value="VN_ALL" className="bg-zinc-900 text-white">Việt Nam (Toàn quốc)</option>
                                                <option value="VN_HCM" className="bg-zinc-900 text-white">Thành phố Hồ Chí Minh</option>
                                                <option value="VN_HN" className="bg-zinc-900 text-white">Thủ đô Hà Nội</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl p-6 space-y-6">
                                <h2 className="text-zinc-900 font-bold flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="w-4 h-4 text-emerald-400" />
                                        Asset Controls
                                    </div>
                                    <button 
                                        onClick={() => setUseAI(!useAI)}
                                        className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${useAI ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}
                                    >
                                        AI SCAN: {useAI ? 'ON' : 'OFF'}
                                    </button>
                                </h2>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'call', label: 'Call', icon: Phone },
                                        { key: 'sitelink', label: 'Sitelinks', icon: Link2 },
                                        { key: 'callout', label: 'Callouts', icon: Type },
                                        { key: 'structured', label: 'Snippets', icon: ListChecks },
                                    ].map((ext) => (
                                        <button
                                            key={ext.key}
                                            onClick={() => setExtensions(prev => ({ ...prev, [ext.key]: !prev[ext.key as keyof typeof extensions] }))}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                                extensions[ext.key as keyof typeof extensions] 
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                : 'bg-zinc-800/20 border-white/5 text-zinc-600'
                                            }`}
                                        >
                                            <ext.icon className="w-4 h-4 shrink-0" />
                                            <span className="text-xs font-bold">{ext.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* CENTER: AI Review & Deployment */}
                        <div className="lg:col-span-5 space-y-6">
                            {!preScanData ? (
                                <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl p-12 flex flex-col items-center justify-center h-[520px] text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                        <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Step 1: AI Content Review</h3>
                                        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                                            Chọn tài khoản và bấm Lúp tìm kiếm để xem trước nội dung AI sinh ra.
                                        </p>
                                    </div>
                                </section>
                            ) : (
                                <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-indigo-500/5">
                                        <div className="flex items-center gap-3">
                                            <Bot className="w-4 h-4 text-indigo-400" />
                                            <div className="text-xs font-bold text-white uppercase tracking-widest">
                                                AI Generated Content (Review)
                                            </div>
                                        </div>
                                        <button onClick={() => setPreScanData(null)} className="text-zinc-500 hover:text-white transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* SCROLLABLE KEYWORD AREA */}
                                    <div className="overflow-y-auto p-6 space-y-8" style={{maxHeight: '65vh', scrollbarWidth: 'thin', scrollbarColor: '#6366f1 transparent'}}>
                                        <div className="space-y-10">
                                            {preScanData.adGroups.map((group, groupIdx) => (
                                                <div key={groupIdx} className="space-y-6">
                                                    <div className="flex items-center justify-between bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                                        <div className="flex items-center gap-3 text-[11px] font-black text-indigo-400 uppercase tracking-widest">
                                                            <BarChart3 className="w-4 h-4" />
                                                            {group.name}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-zinc-500">
                                                            {group.keywords.filter(k => k.selected).length}/{group.keywords.length} SELECTED
                                                        </div>
                                                    </div>
                                                    
                                                    {/* PART 1: CORE KEYWORDS */}
                                                    <div className="space-y-3">
                                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Từ khóa đề xuất chạy (Core)
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {group.keywords.filter(k => k.category === 'core').map((kw, i) => {
                                                                const globalIdx = group.keywords.findIndex(k => k.text === kw.text);
                                                                return (
                                                                    <div 
                                                                        key={i} 
                                                                        onClick={() => toggleKeyword(groupIdx, globalIdx)}
                                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${kw.selected ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 opacity-60'}`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${kw.selected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700'}`}>
                                                                                {kw.selected && <Check className="w-3 h-3 text-white" />}
                                                                            </div>
                                                                            <div className="text-sm font-bold text-zinc-200">{kw.text}</div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="text-right">
                                                                                <div className="text-[10px] font-mono text-zinc-300">{kw.volume.toLocaleString()}</div>
                                                                                <div className="text-[8px] text-zinc-500 uppercase font-bold">Vol./mo</div>
                                                                            </div>
                                                                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${kw.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : kw.trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>
                                                                                {kw.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : kw.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" /> : <span>—</span>}
                                                                                <span>{kw.trend === 'steady' ? 'STABLE' : kw.trend.toUpperCase()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* PART 2: SUGGESTED KEYWORDS */}
                                                    <div className="space-y-3">
                                                        <div className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                                            <Sparkles className="w-3 h-3" />
                                                            Từ khóa mở rộng (Suggested)
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {group.keywords.filter(k => k.category === 'suggested').map((kw, i) => {
                                                                const globalIdx = group.keywords.findIndex(k => k.text === kw.text);
                                                                return (
                                                                    <div 
                                                                        key={i} 
                                                                        onClick={() => toggleKeyword(groupIdx, globalIdx)}
                                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${kw.selected ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 opacity-60'}`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${kw.selected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700'}`}>
                                                                                {kw.selected && <Check className="w-3 h-3 text-white" />}
                                                                            </div>
                                                                            <div className="text-sm font-medium text-zinc-400">{kw.text}</div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="text-right">
                                                                                <div className="text-[10px] font-mono text-zinc-500">{kw.volume.toLocaleString()}</div>
                                                                                <div className="text-[8px] text-zinc-500 uppercase">Vol./mo</div>
                                                                            </div>
                                                                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${kw.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : kw.trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>
                                                                                {kw.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : kw.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" /> : <span>—</span>}
                                                                                <span>{kw.trend === 'steady' ? 'STABLE' : kw.trend.toUpperCase()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-3">
                                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                <Link2 className="w-3.5 h-3.5" />
                                                Common Assets (Sitelinks & Callouts)
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {preScanData.globalAssets.callout.map((c, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-zinc-400 border border-white/5 uppercase font-bold tracking-tighter">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-white/[0.05] bg-black/40">
                                        <button 
                                            onClick={handleStart}
                                            disabled={isLoading}
                                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                            {isLoading ? 'SYNCING TO GOOGLE ADS...' : 'CONFIRM & DEPLOY CAMPAIGN'}
                                        </button>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* RIGHT: Ad Preview */}
                        <div className="lg:col-span-3">
                            <section className="bg-zinc-900/40 border border-white/[0.08] shadow-sm rounded-3xl p-6 space-y-6 sticky top-12">
                                <h3 className="text-zinc-100 font-bold flex items-center gap-2 px-1 text-sm uppercase tracking-widest">
                                    <Eye className="w-4 h-4 text-indigo-400" />
                                    RSA Visuals
                                </h3>
                                
                                {preScanData?.adGroups.map((group, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 shadow-xl border border-white/10 group transition-all hover:-translate-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">Ad Group: {group.name.split(':')[1]?.trim()}</div>
                                        </div>
                                        <div className="text-indigo-700 text-sm font-bold leading-tight mb-1">
                                            {group.headlines[0] || "Headline Preview..."}
                                        </div>
                                        <div className="text-zinc-600 text-[11px] leading-relaxed line-clamp-2">
                                            {group.descriptions[0] || "Description Preview..."}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-zinc-100 flex gap-4">
                                            <div className="text-[9px] text-indigo-600 font-bold uppercase underline">Sitelink 1</div>
                                            <div className="text-[9px] text-indigo-600 font-bold uppercase underline">Sitelink 2</div>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Dashboard Headers with Account Filter */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                            <div className="w-full md:w-80 space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Context Account</label>
                                <select 
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-indigo-500/50 text-sm text-zinc-300 appearance-none"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
                                    ))}
                                </select>
                            </div>

                            {/* 1. KEY METRICS CARDS */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                {(() => {
                                    const totalSpend = dashboardData.keywords.reduce((acc, k) => acc + k.cost, 0);
                                    const totalClicks = dashboardData.keywords.reduce((acc, k) => acc + k.clicks, 0);
                                    const totalConversions = dashboardData.keywords.reduce((acc, k) => acc + k.conversions, 0);
                                    const avgCpa = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0;
                                    const avgQs = dashboardData.keywords.length > 0 ? (dashboardData.keywords.reduce((acc, k) => acc + k.qualityScore, 0) / dashboardData.keywords.length).toFixed(1) : '0';
                                    return [
                                        { label: 'Total Spend', value: `₫ ${totalSpend.toLocaleString()}`, trend: '—', icon: DollarSign, color: 'text-rose-400' },
                                        { label: 'Total Clicks', value: totalClicks.toLocaleString(), trend: '—', icon: MousePointer2, color: 'text-indigo-400' },
                                        { label: 'Conversions', value: totalConversions.toLocaleString(), trend: '—', icon: TrendingUp, color: 'text-emerald-400' },
                                        { label: 'Avg. QS', value: `${avgQs}/10`, trend: parseFloat(avgQs) >= 6 ? '✓ OK' : '⚠ Low', icon: Gauge, color: parseFloat(avgQs) >= 6 ? 'text-emerald-400' : 'text-amber-400' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-zinc-900/40 border border-white/[0.08] p-5 rounded-3xl relative overflow-hidden group hover:bg-zinc-900/60 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} shadow-inner`}>
                                                    <stat.icon className="w-5 h-5" />
                                                </div>
                                                <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${stat.trend.startsWith('+') || stat.trend.startsWith('✓') ? 'bg-emerald-500/10 text-emerald-400' : stat.trend.startsWith('-') || stat.trend.startsWith('⚠') ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-zinc-500'}`}>
                                                    {stat.trend}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black text-white tracking-tight mb-1">{stat.value}</div>
                                                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                                            </div>
                                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                                <stat.icon className="w-32 h-32" />
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* 2. MAIN CHART & AI DIAGNOSTICS */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10 w-full">
                            <section className="xl:col-span-2 bg-zinc-900/40 border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                {/* Ambient Glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-indigo-500/10 blur-[80px] pointer-events-none" />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-zinc-100 font-bold flex items-center gap-2 text-lg">
                                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                                            Performance Trends (7 Days)
                                        </h3>
                                        <p className="text-xs text-zinc-500 font-medium">Clicks vs Conversions trend over time</p>
                                    </div>
                                    <div className="flex items-center gap-4 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div> Clicks
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Conversions
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-[320px] w-full relative z-10">
                                    {hasMounted ? (
                                        <ResponsiveContainer width="100%" height="100%" minHeight={320} minWidth={0}>
                                            <AreaChart data={dashboardData.chartData}>
                                                <defs>
                                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e1e1" vertical={false} />
                                                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#52525b" fontSize={11} tickMargin={12} axisLine={false} tickLine={false} />
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                                    itemStyle={{ color: '#09090b', fontSize: '12px', fontWeight: 'bold' }}
                                                    labelStyle={{ color: '#71717a', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                                />
                                                <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" animationDuration={1000} />
                                                <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" animationDuration={1000} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="w-full h-full bg-zinc-50/50 animate-pulse rounded-2xl flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="xl:col-span-1 bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                                
                                <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-white/[0.05]">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                                        <Bot className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-zinc-900 font-bold text-sm tracking-wide">AI Diagnostician</h3>
                                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 uppercase tracking-widest mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active Scan
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                                    {dashboardData.diagnostics.map((card, idx) => {
                                        const severityStyles = {
                                            critical: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', iconColor: 'text-rose-400', actionBg: 'bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
                                            warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', iconColor: 'text-amber-400', actionBg: 'bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
                                            positive: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', iconColor: 'text-emerald-400', actionBg: 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
                                        };
                                        const style = severityStyles[card.severity];
                                        const Icon = card.severity === 'critical' ? TrendingDown : card.severity === 'warning' ? AlertCircle : TrendingUp;
                                        
                                        return (
                                            <div key={idx} className={`${style.bg} border ${style.border} rounded-2xl p-4`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-4 h-4 ${style.iconColor}`} />
                                                        <h4 className={`text-xs font-bold ${style.text} uppercase tracking-widest`}>{card.title}</h4>
                                                    </div>
                                                    {card.qualityScore !== undefined && (
                                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${card.qualityScore <= 4 ? 'bg-rose-500/20 text-rose-400' : card.qualityScore <= 6 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                            QS {card.qualityScore}/10
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-zinc-300 leading-relaxed">{card.body}</p>
                                                <div className={`mt-3 text-[11px] font-bold text-white ${style.actionBg} px-3 py-1.5 rounded-lg inline-block cursor-pointer transition-colors`}>
                                                    ACTION: {card.action}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        {/* 3. KEYWORD PERFORMANCE TABLE */}
                        <section className="bg-zinc-900/40 border border-white/[0.08] rounded-3xl overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Search className="w-4 h-4 text-emerald-400" />
                                    Deep Search Terms & Keywords
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase">{dashboardData.industry}</span>
                                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Context-Aware</div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/[0.02] bg-black/20">
                                            <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Keyword</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">QS</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">QS Factors</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Impr. / Clicks</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">CTR / Cost</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Conv. / CPA</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Health</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {dashboardData.keywords.map((kw, i) => {
                                            const qsColor = kw.qualityScore <= 4 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : kw.qualityScore <= 6 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                                            const ratingIcon = (rating: string) => rating === 'above' ? '↑' : rating === 'below' ? '↓' : '—';
                                            const ratingColor = (rating: string) => rating === 'above' ? 'text-emerald-400' : rating === 'below' ? 'text-rose-400' : 'text-zinc-500';
                                            
                                            return (
                                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-white mb-1">{kw.keyword}</div>
                                                        <div className="text-[10px] text-zinc-500 font-mono">Match: Exact/Phrase</div>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border font-black text-sm ${qsColor}`}>
                                                            {kw.qualityScore}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex flex-col gap-1.5 items-center">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[8px] text-zinc-600 uppercase w-8 text-right">CTR</span>
                                                                <span className={`text-xs font-bold ${ratingColor(kw.expectedCtr)}`}>{ratingIcon(kw.expectedCtr)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[8px] text-zinc-600 uppercase w-8 text-right">AD</span>
                                                                <span className={`text-xs font-bold ${ratingColor(kw.adRelevance)}`}>{ratingIcon(kw.adRelevance)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[8px] text-zinc-600 uppercase w-8 text-right">LP</span>
                                                                <span className={`text-xs font-bold ${ratingColor(kw.landingPageExp)}`}>{ratingIcon(kw.landingPageExp)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-right">
                                                        <div className="font-mono text-zinc-300">{kw.impr.toLocaleString()}</div>
                                                        <div className="text-[10px] font-mono text-indigo-400 mt-1">{kw.clicks.toLocaleString()} CLKS</div>
                                                    </td>
                                                    <td className="px-4 py-5 text-right">
                                                        <div className="font-mono text-white">{kw.ctr}%</div>
                                                        <div className="text-[10px] font-mono text-zinc-500 mt-1">₫ {kw.cost.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-4 py-5 text-right">
                                                        <div className="font-mono text-white">{kw.conversions}</div>
                                                        <div className="text-[10px] font-mono text-zinc-500 mt-1 flex justify-end gap-1">
                                                            <span>CPA:</span>
                                                            <span className={kw.cpa >= 100000 ? 'text-rose-400' : 'text-emerald-400'}>
                                                                ₫ {kw.cpa.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <div className="flex justify-center">
                                                            {kw.status === 'good' && <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1"><TrendingUp className="w-3 h-3"/> OPTIMAL</div>}
                                                            {kw.status === 'warning' && <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3"/> REVIEW</div>}
                                                            {kw.status === 'bad' && <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase flex items-center gap-1"><TrendingDown className="w-3 h-3"/> BLEEDING</div>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 4. ACCOUNT CAMPAIGNS */}
                        <section className="bg-zinc-900/40 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                                    Account Campaigns ({campaigns.length})
                                </h3>
                                <button onClick={fetchCampaigns} disabled={isFetchingCampaigns} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                                    {isFetchingCampaigns ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                    REFRESH
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/[0.02]">
                                            <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Campaign</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Cost (VND)</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">AI Strategy Lab</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {isFetchingCampaigns && campaigns.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-12 text-center text-zinc-500 italic">Loading specific campaign data...</td>
                                            </tr>
                                        ) : campaigns.map((c, i) => (
                                            <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-zinc-900 uppercase tracking-tight">{c.campaign.name}</div>
                                                    <div className="text-[10px] text-zinc-600 font-mono mt-1">ID: {c.campaign.id}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${c.campaign.status === 'ENABLED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        {c.campaign.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-mono text-zinc-300">
                                                    {((c.metrics?.cost_micros || 0) / 1000000).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => setSelectedCampaign({ id: c.campaign.id, name: c.campaign.name })}
                                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto"
                                                    >
                                                        <Wand2 className="w-3.5 h-3.5" />
                                                        ANALYZE 1-ON-1
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
