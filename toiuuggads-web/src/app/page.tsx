import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <span className="font-bold text-xl tracking-tight">OptimaAds AI</span>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500">Welcome, Admin</span>
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smart Campaign Creator</h1>
          <p className="mt-2 text-slate-500">Tự động phân tích website và khởi tạo chiến dịch Google Ads hoàn chỉnh với AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Cột Trái */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Thông Số Khởi Tạo
              </h2>
              
              <form className="space-y-5">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
                    Website URL (Landing Page)
                  </label>
                  <input
                    type="url"
                    id="url"
                    placeholder="https://hoanhashi.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
                    defaultValue="https://hoanhashi.com"
                  />
                </div>

                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 mb-1">
                    Target Customer ID
                  </label>
                  <input
                    type="text"
                    id="customerId"
                    placeholder="115-462-6623"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none font-mono"
                    defaultValue="1154626623"
                  />
                  <p className="mt-1 text-xs text-slate-500">ID của tài khoản con nằm trong MCC.</p>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 group"
                  >
                    <span>Khởi Tạo Chiến Dịch Chuẩn SEO</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Console Output Cột Phải */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
              <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-slate-400 text-xs font-mono ml-2">system-terminal ~ /optima-ai</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-auto text-slate-300 space-y-2 flex-1">
                <div className="text-slate-500">Sẵn sàng khởi tạo chiến dịch AI... Nhấn nút bên trái để bắt đầu.</div>
                {/* Simulated Log Output */}
                {/* <div className="text-blue-400">🚀 STARTING SMART CAMPAIGN CREATION FOR: https://hoanhashi.com</div>
                <div className="text-slate-400">📡 Targeting Account: 1154626623 via MCC...</div>
                <div className="text-yellow-400 mt-4">💰 AI BUDGET SUGGESTION:</div>
                <div className="pl-4">- Avg CPC in market: 4,500 VND</div>
                <div className="pl-4">- Recommended Daily Budget: 112,500 VND</div>
                <div className="text-green-400 mt-4">✅ SUCCESS! Campaign created: customers/1154626623/campaigns/23640555024</div> */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
