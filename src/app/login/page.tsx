'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">
              OptimaAds AI
            </h1>
            <p className="text-zinc-400 text-sm max-w-[280px]">
              Vui lòng đăng nhập bằng Gmail được cấp quyền để truy cập Dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                Tiếp tục với Google
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-xs">
              Độc quyền bởi hoanhashi@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-zinc-500 text-xs tracking-widest uppercase opacity-40">
          Enterprise Grade Ads Engine
        </div>
      </div>
    </main>
  );
}
