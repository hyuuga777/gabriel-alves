'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle2, Loader2, Eye, EyeOff, Dumbbell } from 'lucide-react';

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!token) {
      setError('Token de redefinição ausente. Solicite uma nova recuperação.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Senha redefinida com sucesso!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Erro ao redefinir a senha.');
      }
    } catch (err) {
      setError('Erro na conexão. Verifique sua rede e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
        <Dumbbell size={100} className="text-white" />
      </div>

      <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Nova Senha</h1>
      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
        Digite e confirme a sua nova senha de acesso à área de consultoria.
      </p>

      <AnimatePresence mode="wait">
        {message ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 border border-primary/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4 mb-4"
          >
            <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" />
            <div>
              <h3 className="font-bold text-white mb-1">Senha Atualizada!</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
              <p className="text-[10px] text-primary/70 mt-3 font-semibold uppercase tracking-wider">Redirecionando em instantes...</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {!token && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-4 py-3 rounded-xl">
                Nenhum token de redefinição fornecido no link.
              </div>
            )}

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Repita a nova senha"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Atualizando...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </button>
          </form>
        )}
      </AnimatePresence>

      {/* Links */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Login
        </Link>
      </div>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.2),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="https://ogabrielalves.com/logo.png" alt="Gabriel Alves" className="h-[82px] w-auto object-contain" />
        </Link>

        <Suspense fallback={
          <div className="glass rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Carregando redefinidor...</p>
          </div>
        }>
          <RedefinirSenhaForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
