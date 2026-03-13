'use client';

import { useState } from 'react';
import {
    Search, Globe, Loader2, Plus, Trash2, TrendingUp, TrendingDown,
    Minus, CheckCircle2, Sparkles, ChevronRight, Tag, BarChart3,
    ArrowRight, X, Bot, Download, Filter, RefreshCw, ShieldAlert, Skull
} from 'lucide-react';

export interface ResearchedKeyword {
    id: string;
    text: string;
    volume: number;
    cpc: number;
    trend: 'up' | 'down' | 'steady';
    competition: 'low' | 'medium' | 'high';
    category: 'core' | 'suggested';
    selected: boolean;
    adGroup: string;
}
export interface NegativeKeyword {
    id: string;
    text: string;
    selected: boolean;
    reason: string;
}

interface KeywordLabProps {
    onExportToLaunch: (keywords: ResearchedKeyword[], theme: string, adGroupNames: string[], scannedUrl: string, suggestedBudget: number, negativeKeywords: string[]) => void;
}

const COMPETITION_COLOR = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const MOCK_RESEARCH: { theme: string; keywords: ResearchedKeyword[]; negativeKeywords: NegativeKeyword[] } = {
    theme: 'Premium Gift Shop - Flowers, Jewelry & Gifts',
    keywords: [
        // Group 1: Hoa tươi
        { id: '1', text: 'hoa sáp thơm tphcm', volume: 1200, cpc: 4500, trend: 'up', competition: 'medium', category: 'core', selected: true, adGroup: 'Hoa Sáp' },
        { id: '2', text: 'shop hoa sáp online', volume: 850, cpc: 3800, trend: 'steady', competition: 'medium', category: 'core', selected: true, adGroup: 'Hoa Sáp' },
        { id: '3', text: 'đặt hoa sáp theo yêu cầu', volume: 450, cpc: 4000, trend: 'up', competition: 'low', category: 'core', selected: true, adGroup: 'Hoa Sáp' },
        { id: '4', text: 'mẫu bó hoa sáp đẹp 2024', volume: 590, cpc: 3100, trend: 'up', competition: 'low', category: 'suggested', selected: false, adGroup: 'Hoa Sáp' },
        { id: '5', text: 'hoa sáp vĩnh cửu cao cấp', volume: 380, cpc: 4800, trend: 'steady', competition: 'low', category: 'suggested', selected: false, adGroup: 'Hoa Sáp' },
        { id: '6', text: 'hoa sáp nhũ kim tuyến', volume: 720, cpc: 3900, trend: 'down', competition: 'low', category: 'suggested', selected: false, adGroup: 'Hoa Sáp' },
        { id: '7', text: 'hoa sáp giá bao nhiêu', volume: 2100, cpc: 2000, trend: 'steady', competition: 'high', category: 'suggested', selected: false, adGroup: 'Hoa Sáp' },
        { id: '8', text: 'mua hoa sáp ở đâu tphcm', volume: 1600, cpc: 3500, trend: 'up', competition: 'medium', category: 'suggested', selected: false, adGroup: 'Hoa Sáp' },
        // Group 2: Gấu bông
        { id: '9', text: 'hoa gấu bông tphcm', volume: 900, cpc: 6000, trend: 'up', competition: 'medium', category: 'core', selected: true, adGroup: 'Gấu Bông' },
        { id: '10', text: 'gấu bông kèm hoa sáp', volume: 600, cpc: 5500, trend: 'up', competition: 'low', category: 'core', selected: true, adGroup: 'Gấu Bông' },
        { id: '11', text: 'set quà gấu bông đẹp', volume: 300, cpc: 7000, trend: 'steady', competition: 'medium', category: 'core', selected: true, adGroup: 'Gấu Bông' },
        { id: '12', text: 'gấu dâu kèm hoa', volume: 1200, cpc: 6500, trend: 'up', competition: 'medium', category: 'suggested', selected: false, adGroup: 'Gấu Bông' },
        { id: '13', text: 'thú bông tốt nghiệp', volume: 3500, cpc: 3000, trend: 'up', competition: 'high', category: 'suggested', selected: false, adGroup: 'Gấu Bông' },
        { id: '14', text: 'gấu bông quà tặng bạn gái', volume: 2200, cpc: 5000, trend: 'up', competition: 'medium', category: 'suggested', selected: false, adGroup: 'Gấu Bông' },
        { id: '15', text: 'gấu bông dễ thương giá rẻ', volume: 5100, cpc: 1800, trend: 'steady', competition: 'high', category: 'suggested', selected: false, adGroup: 'Gấu Bông' },
        // Group 3: Trang sức
        { id: '16', text: 'dây chuyền bạc quà tặng', volume: 1800, cpc: 5500, trend: 'up', competition: 'medium', category: 'core', selected: true, adGroup: 'Trang Sức' },
        { id: '17', text: 'nhẫn bạc s925 thiết kế', volume: 920, cpc: 6200, trend: 'up', competition: 'medium', category: 'core', selected: true, adGroup: 'Trang Sức' },
        { id: '18', text: 'vòng tay bạc xinh', volume: 1400, cpc: 4800, trend: 'steady', competition: 'high', category: 'suggested', selected: false, adGroup: 'Trang Sức' },
        { id: '19', text: 'set trang sức bạc cặp đôi', volume: 490, cpc: 9000, trend: 'up', competition: 'low', category: 'suggested', selected: false, adGroup: 'Trang Sức' },
        { id: '20', text: 'bông tai bạc nữ dễ thương', volume: 3200, cpc: 4200, trend: 'up', competition: 'high', category: 'suggested', selected: false, adGroup: 'Trang Sức' },
    ],
    negativeKeywords: [
        { id: 'n1', text: 'cách làm hoa sáp', selected: true, reason: 'Tìm kiếm hướng dẫn (không mua)' },
        { id: 'n2', text: 'nguyên liệu làm hoa', selected: true, reason: 'Nhu cầu sỉ/B2B (sai tệp khách)' },
        { id: 'n3', text: 'shop hoa sáp lừa đảo', selected: true, reason: 'Từ khóa tiêu cực' },
        { id: 'n4', text: 'giặt gấu bông', selected: true, reason: 'Dịch vụ phụ trợ' },
        { id: 'n5', text: 'sửa dây chuyền', selected: true, reason: 'Sửa chữa (sản phẩm đã có)' },
        { id: 'n6', text: 'đồ tự làm gấu bông', selected: false, reason: 'Nhu cầu DIY (tỉ lệ mua thấp)' },
    ]
};

export default function KeywordLab({ onExportToLaunch }: KeywordLabProps) {
    const [url, setUrl] = useState('https://hoanhashi.com');
    const [isScanning, setIsScanning] = useState(false);
    const [keywords, setKeywords] = useState<ResearchedKeyword[]>([]);
    const [theme, setTheme] = useState('');
    const [negativeKeywords, setNegativeKeywords] = useState<NegativeKeyword[]>([]);
    const [filterGroup, setFilterGroup] = useState<string>('all');
    const [filterCat, setFilterCat] = useState<'all' | 'core' | 'suggested'>('all');
    const [manualInput, setManualInput] = useState('');
    const [manualGroup, setManualGroup] = useState('');
    const [hasScanned, setHasScanned] = useState(false);

    const adGroups = [...new Set(keywords.map(k => k.adGroup))];
    const selectedCount = keywords.filter(k => k.selected).length;
    const selectedNegativeCount = negativeKeywords.filter(k => k.selected).length;

    const filteredKeywords = keywords.filter(k => {
        const groupOk = filterGroup === 'all' || k.adGroup === filterGroup;
        const catOk = filterCat === 'all' || k.category === filterCat;
        return groupOk && catOk;
    });

    const handleScan = async () => {
        if (!url) return;
        setIsScanning(true);
        setHasScanned(false);
        await new Promise(r => setTimeout(r, 1800));
        setKeywords(MOCK_RESEARCH.keywords);
        setNegativeKeywords(MOCK_RESEARCH.negativeKeywords);
        setTheme(MOCK_RESEARCH.theme);
        setHasScanned(true);
        setIsScanning(false);
    };

    const toggleKeyword = (id: string) => {
        setKeywords(prev => prev.map(k => k.id === id ? { ...k, selected: !k.selected } : k));
    };

    const toggleNegativeKeyword = (id: string) => {
        setNegativeKeywords(prev => prev.map(k => k.id === id ? { ...k, selected: !k.selected } : k));
    };

    const removeKeyword = (id: string) => {
        setKeywords(prev => prev.filter(k => k.id !== id));
    };

    const addManual = () => {
        if (!manualInput.trim()) return;
        const newKw: ResearchedKeyword = {
            id: `manual-${Date.now()}`,
            text: manualInput.trim(),
            volume: 0,
            cpc: 0,
            trend: 'steady',
            competition: 'low',
            category: 'core',
            selected: true,
            adGroup: manualGroup || adGroups[0] || 'Manual',
        };
        setKeywords(prev => [...prev, newKw]);
        setManualInput('');
    };

    const selectAll = () => setKeywords(prev => prev.map(k => ({ ...k, selected: true })));
    const deselectAll = () => setKeywords(prev => prev.map(k => ({ ...k, selected: false })));

    const handleExport = () => {
        const selected = keywords.filter(k => k.selected);
        const selectedNegatives = negativeKeywords.filter(k => k.selected).map(k => k.text);
        const avgCpc = selected.reduce((sum, k) => sum + k.cpc, 0) / Math.max(1, selected.length);
        const suggestedBudget = Math.max(100000, Math.round((avgCpc * 50) / 10000) * 10000); // 50 clicks a day, rounded to 10k, min 100k
        onExportToLaunch(selected, theme, adGroups, url, suggestedBudget, selectedNegatives);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-1 flex items-center gap-2">
                        <Bot className="w-3 h-3" /> Keyword Intelligence Lab
                    </div>
                    <h2 className="text-2xl font-black text-zinc-900">Research & Approve Keywords</h2>
                    <p className="text-zinc-500 text-sm mt-1">Phân tích toàn diện từ khóa → duyệt → đẩy qua Launch Center</p>
                </div>
                {hasScanned && selectedCount > 0 && (
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/30 active:scale-95 group"
                    >
                        <span>{selectedCount} keywords</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>GỬI QUA LAUNCH CENTER</span>
                    </button>
                )}
            </div>

            {/* URL Scanner */}
            <section className="bg-white border border-zinc-200/60 shadow-sm rounded-3xl p-6 transition-all hover:shadow-md">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleScan()}
                            placeholder="https://yourwebsite.com"
                            className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-zinc-800 outline-none focus:border-indigo-500/50 focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                    <button
                        onClick={handleScan}
                        disabled={isScanning || !url}
                        className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
                    >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        {isScanning ? 'Đang phân tích...' : 'AI Scan'}
                    </button>
                    {hasScanned && (
                        <button
                            onClick={handleScan}
                            className="px-4 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-2xl transition-all"
                            title="Re-scan"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {theme && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>AI chủ đề nhận diện:</span>
                        <span className="text-indigo-300 font-bold">{theme}</span>
                        <span className="ml-auto text-zinc-600 font-bold">{keywords.length} keywords found</span>
                    </div>
                )}
            </section>

            {isScanning && (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-zinc-500">
                    <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                    <div className="text-sm font-semibold animate-pulse">AI đang quét và phân tích từ khóa...</div>
                </div>
            )}

            {hasScanned && !isScanning && (
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* LEFT: Controls & Stats */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Stats */}
                        <div className="bg-white border border-zinc-200/60 shadow-sm rounded-2xl p-4 space-y-4 transition-all hover:shadow-md">
                            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Summary</div>
                            {[
                                { label: 'Total Found', value: keywords.length, color: 'text-zinc-900' },
                                { label: 'Selected', value: selectedCount, color: 'text-indigo-400' },
                                { label: 'Core', value: keywords.filter(k => k.category === 'core').length, color: 'text-emerald-400' },
                                { label: 'Suggested', value: keywords.filter(k => k.category === 'suggested').length, color: 'text-amber-400' },
                                { label: 'Ad Groups', value: adGroups.length, color: 'text-purple-400' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">{s.label}</span>
                                    <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="bg-white border border-zinc-200/60 shadow-sm rounded-2xl p-4 space-y-4 transition-all hover:shadow-md">
                            <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Filter className="w-3 h-3" /> Filters
                            </div>
                            <div>
                                <div className="text-[9px] text-zinc-600 uppercase font-bold mb-2">Ad Group</div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => setFilterGroup('all')}
                                        className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterGroup === 'all' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Tất cả ({keywords.length})
                                    </button>
                                    {adGroups.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setFilterGroup(g)}
                                            className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterGroup === g ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            {g} ({keywords.filter(k => k.adGroup === g).length})
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] text-zinc-600 uppercase font-bold mb-2">Loại</div>
                                <div className="flex flex-col gap-1">
                                    {(['all', 'core', 'suggested'] as const).map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setFilterCat(c)}
                                            className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filterCat === c ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            {c === 'all' ? 'Tất cả' : c === 'core' ? '🟢 Core' : '🟡 Suggested'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Select All */}
                        <div className="flex gap-2">
                            <button onClick={selectAll} className="flex-1 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl hover:bg-indigo-500/20 transition-all">Chọn tất</button>
                            <button onClick={deselectAll} className="flex-1 py-2 bg-zinc-800 border border-white/5 text-zinc-500 text-xs font-bold rounded-xl hover:bg-zinc-700 transition-all">Bỏ chọn</button>
                        </div>
                    </div>

                    {/* RIGHT: Keyword Table */}
                    <div className="lg:col-span-9 space-y-4">
                        {/* Manual Add */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualInput}
                                onChange={e => setManualInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addManual()}
                                placeholder="Thêm từ khóa thủ công..."
                                className="flex-1 bg-white border border-zinc-200/60 rounded-2xl px-4 py-3 text-sm text-zinc-800 outline-none focus:border-indigo-500/40 transition-all shadow-sm focus:shadow-md"
                            />
                            <select
                                value={manualGroup}
                                onChange={e => setManualGroup(e.target.value)}
                                className="bg-zinc-900/40 border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-indigo-500/40 transition-all appearance-none"
                            >
                                <option value="">Nhóm...</option>
                                {adGroups.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <button
                                onClick={addManual}
                                disabled={!manualInput.trim()}
                                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all disabled:opacity-40 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white border border-zinc-200/60 shadow-xl rounded-3xl overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-100 bg-zinc-50/50 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                <div className="col-span-1"></div>
                                <div className="col-span-4">Từ khóa</div>
                                <div className="col-span-2 text-center">Vol./mo</div>
                                <div className="col-span-2 text-center">CPC (VND)</div>
                                <div className="col-span-1 text-center">Trend</div>
                                <div className="col-span-1 text-center">Cạnh tranh</div>
                                <div className="col-span-1 text-center">Nhóm</div>
                                <div className="col-span-0"></div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-white/[0.03]">
                                {filteredKeywords.map(kw => (
                                    <div
                                        key={kw.id}
                                        className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center transition-all hover:bg-white/[0.02] ${kw.selected ? '' : 'opacity-40'}`}
                                    >
                                        {/* Checkbox */}
                                        <div className="col-span-1 flex items-center">
                                            <button
                                                onClick={() => toggleKeyword(kw.id)}
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${kw.selected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700 hover:border-indigo-500/50'}`}
                                            >
                                                {kw.selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </button>
                                        </div>

                                        {/* Keyword */}
                                        <div className="col-span-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${kw.category === 'core' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className="text-sm font-medium text-zinc-800">{kw.text}</span>
                                            </div>
                                        </div>

                                        {/* Volume */}
                                        <div className="col-span-2 text-center">
                                            <span className={`text-sm font-black font-mono ${kw.volume === 0 ? 'text-zinc-600' : 'text-zinc-200'}`}>
                                                {kw.volume === 0 ? '—' : kw.volume.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* CPC */}
                                        <div className="col-span-2 text-center">
                                            <span className={`text-sm font-mono ${kw.cpc === 0 ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                {kw.cpc === 0 ? '—' : `₫${(kw.cpc / 1000).toFixed(1)}K`}
                                            </span>
                                        </div>

                                        {/* Trend */}
                                        <div className="col-span-1 flex justify-center">
                                            {kw.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            ) : kw.trend === 'down' ? (
                                                <TrendingDown className="w-4 h-4 text-rose-400" />
                                            ) : (
                                                <Minus className="w-4 h-4 text-zinc-600" />
                                            )}
                                        </div>

                                        {/* Competition */}
                                        <div className="col-span-1 flex justify-center">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${COMPETITION_COLOR[kw.competition]}`}>
                                                {kw.competition}
                                            </span>
                                        </div>

                                        {/* Ad Group */}
                                        <div className="col-span-1 flex justify-center">
                                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold rounded-md truncate max-w-full">
                                                {kw.adGroup}
                                            </span>
                                        </div>

                                        {/* Delete */}
                                        <div className="col-span-0 flex justify-end">
                                            <button
                                                onClick={() => removeKeyword(kw.id)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-700 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Negative Keywords Section */}
                        {negativeKeywords.length > 0 && (
                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl overflow-hidden mt-6">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-rose-500/10 text-[9px] font-black text-rose-500/70 uppercase tracking-widest bg-rose-500/5">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-4 flex items-center gap-2">
                                        <ShieldAlert className="w-3 h-3" />
                                        Từ khóa cấm (Negative)
                                    </div>
                                    <div className="col-span-6">AI Giải thích lý do cấm</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {/* Rows */}
                                <div className="divide-y divide-rose-500/5">
                                    {negativeKeywords.map(kw => (
                                        <div
                                            key={kw.id}
                                            className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center transition-all hover:bg-rose-500/5 ${kw.selected ? '' : 'opacity-40'}`}
                                        >
                                            {/* Checkbox */}
                                            <div className="col-span-1 flex items-center">
                                                <button
                                                    onClick={() => toggleNegativeKeyword(kw.id)}
                                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${kw.selected ? 'bg-rose-500 border-rose-500' : 'border-rose-900/50 hover:border-rose-500/50'}`}
                                                >
                                                    {kw.selected && <Skull className="w-3 h-3 text-white" />}
                                                </button>
                                            </div>

                                            {/* Keyword */}
                                            <div className="col-span-4 flex items-center gap-2">
                                                <span className="text-sm font-medium text-rose-200 line-through decoration-rose-500/50">{kw.text}</span>
                                            </div>

                                            {/* Reason */}
                                            <div className="col-span-6">
                                                <span className="text-xs text-rose-400/80 italic">{kw.reason}</span>
                                            </div>
                                            
                                            <div className="col-span-1"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Export bar */}
                        {selectedCount > 0 && (
                            <div className="flex items-center justify-between p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                <div>
                                    <div className="text-white font-black">{selectedCount} từ khóa đã chọn</div>
                                    <div className="text-indigo-400 text-sm mt-0.5">
                                        Trải đều trên {[...new Set(keywords.filter(k => k.selected).map(k => k.adGroup))].length} nhóm quảng cáo
                                        {selectedNegativeCount > 0 && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">Chặn {selectedNegativeCount} từ khóa</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 group"
                                >
                                    <Download className="w-4 h-4" />
                                    GỬI QUA LAUNCH CENTER
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
