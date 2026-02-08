import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Building2, Shield, ChevronRight, PieChart, BarChart3, Target, Zap, Lock, Briefcase, Users, CreditCard, Landmark, ArrowUpRight, CheckCircle2, XCircle, Calculator, Layers, Percent, Clock, Wallet, LineChart, Volume2, Play, Pause, Globe2, Menu, X } from 'lucide-react';

// ─── Animated Counter Hook ───
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

// ─── Animated Progress Ring ───
function ProgressRing({ percent, size = 120, stroke = 8, color = '#06b6d4', label }: { percent: number; size?: number; stroke?: number; color?: string; label: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setOffset(circumference - (percent / 100) * circumference), 300);
        }
      },
      { threshold: 0.5 }
    );
    if (ringRef.current) observer.observe(ringRef.current);
    return () => observer.disconnect();
  }, [percent, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          ref={ringRef}
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <span className="text-2xl font-bold text-white -mt-[76px]">{percent}%</span>
      <span className="text-xs text-slate-400 mt-6">{label}</span>
    </div>
  );
}

// ─── Animated Bar ───
function AnimatedBar({ value, max, label, amount, color = 'from-cyan-500 to-blue-600' }: { value: number; max: number; label: string; amount: string; color?: string }) {
  const [width, setWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth((value / max) * 100), 200);
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [value, max]);

  return (
    <div ref={barRef} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-semibold">{amount}</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-[1.5s] ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ─── Reveal on scroll ───
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number; key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// ─── Particle background component ───
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            background: `rgba(${Math.random() > 0.5 ? '6,182,212' : '59,130,246'}, ${Math.random() * 0.4 + 0.1})`,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float-up ${Math.random() * 20 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN INVESTOR PAGE COMPONENT
// ════════════════════════════════════════════════════════════════
export default function InvestorPage({ onBack }: { onBack: () => void }) {
  // ─── Mobile Menu State ───
  const [mobileNav, setMobileNav] = useState(false);

  // ─── Audio Player State ───
  const [audioLang, setAudioLang] = useState<'es' | 'en'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioFiles = {
    en: '/audio/ENGLISH NEIVER ALVAREZ DEV.mp3',
    es: '/audio/ESPANOL NEIVER ALVAREZ DEV.mp3',
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const switchAudioLang = (lang: 'es' | 'en') => {
    if (lang === audioLang) return;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioProgress(0);
    }
    setAudioLang(lang);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setAudioProgress(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setAudioProgress(0); };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioLang]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // ─── Investment Calculator State ───
  const [investment, setInvestment] = useState(40000);
  const [profitShare, setProfitShare] = useState(20);
  const [equityStake, setEquityStake] = useState(10);
  const [scenarioIndex, setScenarioIndex] = useState(1); // 0=conservative, 1=base, 2=aggressive

  // ─── ROI Simulator State ───
  const [simMonth, setSimMonth] = useState(12);

  // Scenario multipliers
  const scenarios = [
    { label: 'Conservative', multiplier: 0.75, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
    { label: 'Base Case', multiplier: 1, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30' },
    { label: 'Aggressive', multiplier: 1.4, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  ];

  const m = scenarios[scenarioIndex].multiplier;

  // Revenue model
  const getMonthlyRevenue = (month: number) => {
    if (month <= 3) return 3000 * m;
    if (month <= 6) return 6000 * m;
    if (month <= 12) return 10000 * m;
    if (month <= 24) return 15000 * m;
    return 22000 * m;
  };

  const getMonthlyProfit = (month: number) => getMonthlyRevenue(month) * 0.40;

  // 12-month projections
  const year1Revenue = (3000 * 3 + 6000 * 3 + 10000 * 6) * m;
  const year1Profit = year1Revenue * 0.40;
  const year2Revenue = 175000 * m;
  const year2Profit = year2Revenue * 0.42;
  const year3Revenue = 250000 * m;
  const year3Profit = year3Revenue * 0.45;

  // Investor returns based on sliders
  const investorYear1Share = year1Profit * (profitShare / 100);
  const investorYear2Share = year2Profit * (profitShare / 100);
  const investorYear3Share = year3Profit * (profitShare / 100);
  const totalReturn3Y = investorYear1Share + investorYear2Share + investorYear3Share;
  const roi3Y = ((totalReturn3Y - investment) / investment) * 100;

  // Capital recovery months
  const monthlyDistributionAvg = (investorYear1Share / 12 + investorYear2Share / 12) / 2;
  const recoveryMonths = monthlyDistributionAvg > 0 ? Math.ceil(investment / monthlyDistributionAvg) : 99;

  // Cumulative for ROI chart
  const cumulativeData = Array.from({ length: 36 }, (_, i) => {
    const mo = i + 1;
    let cumRev = 0;
    let cumProfit = 0;
    for (let m2 = 1; m2 <= mo; m2++) {
      cumRev += getMonthlyRevenue(m2);
      cumProfit += getMonthlyProfit(m2);
    }
    return { month: mo, revenue: cumRev, profit: cumProfit, investorReturn: cumProfit * (profitShare / 100) };
  });

  // Capital allocation breakdown
  const allocation = {
    corporation: Math.round(investment * 0.088),
    legal: Math.round(investment * 0.05),
    platform: Math.round(investment * 0.25),
    automation: Math.round(investment * 0.125),
    marketing: Math.round(investment * 0.25),
    reserve: 0,
  };
  allocation.reserve = investment - Object.values(allocation).reduce((a, b) => a + b, 0) + allocation.reserve;

  // Banking leverage
  const bankLeverage6 = Math.round(investment * 1.1);
  const bankLeverage12 = Math.round(investment * 2.2);

  // ─── Animated counters ───
  const revenue1 = useCountUp(Math.round(year1Revenue));
  const profit1 = useCountUp(Math.round(year1Profit));
  const recovery = useCountUp(Math.min(recoveryMonths, 24));

  // ─── Visible months for simulator ───
  const simData = cumulativeData.slice(0, simMonth);
  const maxRevInSim = Math.max(...simData.map(d => d.revenue), 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* ─── FLOATING NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium">
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back to Portfolio</span>
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-white tracking-wider">INVESTOR RELATIONS</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/17865432478?text=I'm%20interested%20in%20the%20investment%20opportunity"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              Contact Now
            </a>
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              aria-label="Toggle menu"
            >
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-out ${mobileNav ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 px-6 py-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Investor Relations</span>
            </div>
            <a href="#model" onClick={() => setMobileNav(false)} className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium py-2.5 border-b border-slate-800/30">
              <Layers size={16} className="text-slate-500" /> Capital Model
            </a>
            <a href="#calculator" onClick={() => setMobileNav(false)} className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium py-2.5 border-b border-slate-800/30">
              <Calculator size={16} className="text-slate-500" /> ROI Calculator
            </a>
            <a href="#banking" onClick={() => setMobileNav(false)} className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium py-2.5 border-b border-slate-800/30">
              <Landmark size={16} className="text-slate-500" /> Banking Leverage
            </a>
            <a href="#deal" onClick={() => setMobileNav(false)} className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium py-2.5 border-b border-slate-800/30">
              <Briefcase size={16} className="text-slate-500" /> Deal Structure
            </a>
            <button onClick={() => { onBack(); setMobileNav(false); }} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium py-2.5 border-b border-slate-800/30">
              <ArrowLeft size={16} className="text-slate-500" /> Back to Portfolio
            </button>
            <a
              href="https://wa.me/17865432478?text=I'm%20interested%20in%20the%20investment%20opportunity"
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-center px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-lg"
            >
              Contact Now
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest">
                <Lock size={12} /> CONFIDENTIAL — INVESTOR DECK
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] font-serif">
                Corporate<br />
                Acquisition &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x">
                  Digital Engine
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                A <span className="text-white font-semibold">structured company-building strategy</span> where capital builds assets,
                assets generate cash flow, cash flow unlocks bank leverage, and leverage scales the system.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <a href="#calculator" className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all">
                  <Calculator size={18} /> ROI Calculator <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <a href="#model" className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900/50 border-2 border-slate-700 text-white font-bold hover:border-cyan-500 hover:-translate-y-1 transition-all backdrop-blur-md">
                  <Layers size={18} /> View Model
                </a>
              </div>
            </Reveal>

            {/* ── Audio Explainer Player ── */}
            <Reveal delay={400}>
              <div className="glass rounded-2xl p-5 max-w-md relative overflow-hidden group">
                {/* Subtle animated glow */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl transition-colors duration-500 ${isPlaying ? 'bg-cyan-500/20' : 'bg-slate-500/10'}`} />

                <audio ref={audioRef} src={audioFiles[audioLang]} preload="metadata" />

                {/* Header with language toggle */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isPlaying ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                      <Volume2 size={16} className={`transition-colors ${isPlaying ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Audio Explainer</p>
                      <p className="text-[10px] text-slate-500">Listen to the investment overview</p>
                    </div>
                  </div>

                  {/* Language toggle */}
                  <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5">
                    <button
                      onClick={() => switchAudioLang('en')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        audioLang === 'en'
                          ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Globe2 size={10} /> EN
                    </button>
                    <button
                      onClick={() => switchAudioLang('es')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        audioLang === 'es'
                          ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Globe2 size={10} /> ES
                    </button>
                  </div>
                </div>

                {/* Player controls */}
                <div className="flex items-center gap-3 relative z-10">
                  {/* Play/Pause button */}
                  <button
                    onClick={toggleAudioPlay}
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${
                      isPlaying
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30 hover:shadow-cyan-400/50'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isPlaying
                      ? <Pause size={16} className="text-white" />
                      : <Play size={16} className="text-white ml-0.5" />
                    }
                  </button>

                  {/* Progress bar + time */}
                  <div className="flex-1 space-y-1">
                    <div
                      className="relative h-1.5 bg-slate-800 rounded-full cursor-pointer group/progress"
                      onClick={(e) => {
                        if (!audioRef.current || !audioDuration) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        audioRef.current.currentTime = pct * audioDuration;
                      }}
                    >
                      {/* Buffered / total track */}
                      <div className="absolute inset-0 rounded-full bg-slate-800" />
                      {/* Played progress */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-150"
                        style={{ width: audioDuration ? `${(audioProgress / audioDuration) * 100}%` : '0%' }}
                      />
                      {/* Thumb dot */}
                      {audioDuration > 0 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md shadow-cyan-500/30 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                          style={{ left: `calc(${(audioProgress / audioDuration) * 100}% - 6px)` }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                      <span>{formatTime(audioProgress)}</span>
                      <span>{audioDuration ? formatTime(audioDuration) : '--:--'}</span>
                    </div>
                  </div>
                </div>

                {/* Waveform visualization (decorative) */}
                <div className="flex items-center justify-center gap-[2px] mt-3 h-6 relative z-10">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const baseH = Math.sin(i * 0.4) * 0.4 + 0.5;
                    const active = audioDuration > 0 && (i / 40) <= (audioProgress / audioDuration);
                    return (
                      <div
                        key={i}
                        className={`w-[2px] rounded-full transition-all duration-300 ${
                          active ? 'bg-cyan-400' : 'bg-slate-800'
                        } ${isPlaying ? 'animate-pulse' : ''}`}
                        style={{
                          height: `${baseH * 100}%`,
                          animationDelay: isPlaying ? `${i * 50}ms` : '0ms',
                          animationDuration: isPlaying ? '0.8s' : '0s',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — Snapshot Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <DollarSign className="text-cyan-400" />, label: 'Initial Capital', value: '$25K – $50K', sub: 'Sweet spot range' },
              { icon: <Clock className="text-emerald-400" />, label: 'Capital Recovery', value: '12–18 mo', sub: 'From net cash flow' },
              { icon: <TrendingUp className="text-blue-400" />, label: 'Year 1 Revenue', value: '$80K–$100K', sub: 'Conservative estimate' },
              { icon: <Landmark className="text-purple-400" />, label: 'Bank Leverage', value: '$75K–$100K+', sub: 'Non-dilutive capital' },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 100 + 200}>
                <div className="glass rounded-2xl p-6 hover-lift cursor-default group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INVESTMENT THESIS ─── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">The Thesis</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Not a Startup Bet. A <span className="text-cyan-400">Structured Build.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <DollarSign className="text-cyan-400" size={28} />, title: 'Capital Builds Assets', desc: 'Investment converts into a real corporation, digital platform, and automated systems.' },
              { step: '02', icon: <Zap className="text-emerald-400" size={28} />, title: 'Assets Generate Cash Flow', desc: 'Services + SaaS hybrid model produces recurring revenue from month 1.' },
              { step: '03', icon: <Landmark className="text-blue-400" size={28} />, title: 'Cash Flow Unlocks Leverage', desc: 'After 6–12 months of visible revenue, business qualifies for bank credit lines.' },
              { step: '04', icon: <TrendingUp className="text-purple-400" size={28} />, title: 'Leverage Scales System', desc: 'Bank capital ($75K–$100K+) fuels growth without any additional equity dilution.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="relative glass rounded-2xl p-8 h-full group hover-lift">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPITAL ALLOCATION ─── */}
      <section id="model" className="py-24 bg-slate-900/50 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Transparency</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Capital Allocation — <span className="text-cyan-400">${(investment / 1000).toFixed(0)}K</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Capital is converted into <span className="text-white font-semibold">operational assets and structure</span>, not burned.
                Drag the slider to explore different investment amounts.
              </p>
            </div>
          </Reveal>

          {/* Investment Amount Slider */}
          <Reveal delay={100}>
            <div className="max-w-xl mx-auto mb-16">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>$25,000</span>
                <span className="text-2xl font-bold text-white">${investment.toLocaleString()}</span>
                <span>$75,000</span>
              </div>
              <input
                type="range"
                min={25000}
                max={75000}
                step={1000}
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20"
              />
            </div>
          </Reveal>

          {/* Allocation Bars */}
          <Reveal delay={200}>
            <div className="max-w-3xl mx-auto space-y-5">
              <AnimatedBar value={allocation.corporation} max={investment} label="Corporation Acquisition (2yr history)" amount={`$${allocation.corporation.toLocaleString()}`} color="from-cyan-500 to-cyan-400" />
              <AnimatedBar value={allocation.legal} max={investment} label="Legal / Filings / Cleanup" amount={`$${allocation.legal.toLocaleString()}`} color="from-blue-500 to-blue-400" />
              <AnimatedBar value={allocation.platform} max={investment} label="Platform Development (MVP)" amount={`$${allocation.platform.toLocaleString()}`} color="from-purple-500 to-purple-400" />
              <AnimatedBar value={allocation.automation} max={investment} label="Automation & AI Systems" amount={`$${allocation.automation.toLocaleString()}`} color="from-emerald-500 to-emerald-400" />
              <AnimatedBar value={allocation.marketing} max={investment} label="Marketing (First 90 Days)" amount={`$${allocation.marketing.toLocaleString()}`} color="from-amber-500 to-yellow-400" />
              <AnimatedBar value={allocation.reserve} max={investment} label="Operating Reserve" amount={`$${allocation.reserve.toLocaleString()}`} color="from-slate-500 to-slate-400" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── INTERACTIVE ROI CALCULATOR ─── */}
      <section id="calculator" className="py-24 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Interactive</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                ROI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Calculator</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Adjust the parameters to see projected returns. All numbers are estimates based on conservative assumptions.
              </p>
            </div>
          </Reveal>

          {/* Scenario Selector */}
          <Reveal delay={100}>
            <div className="flex justify-center gap-3 mb-12">
              {scenarios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioIndex(i)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${
                    scenarioIndex === i
                      ? `${s.bg} ${s.color} border-current shadow-lg`
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Sliders */}
            <Reveal delay={200}>
              <div className="glass rounded-3xl p-8 space-y-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calculator className="text-cyan-400" size={22} /> Deal Parameters
                </h3>

                {/* Investment */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Investment Amount</span>
                    <span className="text-sm font-bold text-white">${investment.toLocaleString()}</span>
                  </div>
                  <input type="range" min={25000} max={75000} step={1000} value={investment} onChange={(e) => setInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Profit Share */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Profit Share %</span>
                    <span className="text-sm font-bold text-emerald-400">{profitShare}%</span>
                  </div>
                  <input type="range" min={10} max={30} step={1} value={profitShare} onChange={(e) => setProfitShare(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Equity Stake */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Equity Stake %</span>
                    <span className="text-sm font-bold text-purple-400">{equityStake}%</span>
                  </div>
                  <input type="range" min={5} max={20} step={1} value={equityStake} onChange={(e) => setEquityStake(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Capital Recovery</p>
                    <p className="text-2xl font-bold text-white mt-1">{Math.min(recoveryMonths, 24)} mo</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">3-Year ROI</p>
                    <p className={`text-2xl font-bold mt-1 ${roi3Y > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{roi3Y.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: Results */}
            <Reveal delay={300}>
              <div className="space-y-6">
                {/* 3-Year Table */}
                <div className="glass rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-cyan-400" size={22} /> 3-Year Projection
                  </h3>
                  <div className="space-y-4">
                    {[
                      { year: 'Year 1', rev: year1Revenue, profit: year1Profit, share: investorYear1Share },
                      { year: 'Year 2', rev: year2Revenue, profit: year2Profit, share: investorYear2Share },
                      { year: 'Year 3', rev: year3Revenue, profit: year3Profit, share: investorYear3Share },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-slate-800/50 last:border-0">
                        <span className="text-sm font-semibold text-slate-300">{row.year}</span>
                        <div>
                          <p className="text-xs text-slate-500">Revenue</p>
                          <p className="text-sm font-bold text-white">${(row.rev / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Net Profit</p>
                          <p className="text-sm font-bold text-emerald-400">${(row.profit / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Your Share</p>
                          <p className="text-sm font-bold text-cyan-400">${(row.share / 1000).toFixed(1)}K</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Total 3-Year Return</p>
                        <p className="text-3xl font-bold text-white">${(totalReturn3Y / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">On ${(investment / 1000).toFixed(0)}K Investment</p>
                        <p className={`text-3xl font-bold ${roi3Y > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{roi3Y > 0 ? '+' : ''}{roi3Y.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equity Bonus */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <PieChart className="text-purple-400" size={22} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">+ {equityStake}% Equity Stake</h4>
                      <p className="text-sm text-slate-400">
                        Participate in any future sale, merger, or scale event. At a conservative Year 3
                        valuation of 3x revenue (${(year3Revenue * 3 / 1000).toFixed(0)}K), your stake would be worth{' '}
                        <span className="text-purple-400 font-bold">${(year3Revenue * 3 * (equityStake / 100) / 1000).toFixed(0)}K</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Revenue Simulation (Visual Chart) — ENHANCED ─── */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[160px] -z-10" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[140px] -z-10" />

        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Simulation</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Growth Timeline</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Hover the chart to explore projections month by month. Adjust timeline and scenario to model different outcomes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="max-w-5xl mx-auto">
              {/* ── Controls Bar ── */}
              <div className="glass rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center gap-6">
                {/* Timeline slider */}
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-cyan-400" />
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Timeline</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-white">{simMonth}</span>
                      <span className="text-xs text-slate-500">months</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 rounded-full bg-slate-800" />
                    <div
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${((simMonth - 3) / 33) * 100}%` }}
                    />
                    <input
                      type="range" min={3} max={36} step={1} value={simMonth}
                      onChange={(e) => setSimMonth(Number(e.target.value))}
                      className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(6,182,212,0.6)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-400"
                    />
                  </div>
                  {/* Tick marks */}
                  <div className="flex justify-between mt-1">
                    {[3, 6, 12, 18, 24, 36].map(t => (
                      <button
                        key={t}
                        onClick={() => setSimMonth(t)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                          simMonth === t ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        {t}mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-16 bg-slate-700/50" />

                {/* Scenario pills */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Scenario</span>
                  <div className="flex gap-2">
                    {scenarios.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setScenarioIndex(i)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          scenarioIndex === i
                            ? `${s.bg} ${s.color} border-current shadow-md`
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:border-slate-500'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Main Chart Card ── */}
              <div className="glass rounded-3xl p-6 md:p-8 relative">
                {/* Phase indicator bar */}
                <div className="flex gap-0 mb-8 rounded-xl overflow-hidden h-8">
                  {(() => {
                    const phases = [
                      { label: 'Traction', months: Math.min(3, simMonth), color: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                      { label: 'Automation', months: Math.max(0, Math.min(3, simMonth - 3)), color: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
                      { label: 'Scale', months: Math.max(0, Math.min(6, simMonth - 6)), color: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
                      { label: 'Growth', months: Math.max(0, simMonth - 12), color: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
                    ].filter(p => p.months > 0);
                    return phases.map((p, i) => (
                      <div
                        key={i}
                        className={`${p.color} ${p.text} border-y ${p.border} ${i === 0 ? 'border-l rounded-l-xl' : ''} ${i === phases.length - 1 ? 'border-r rounded-r-xl' : ''} flex items-center justify-center text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-500`}
                        style={{ flex: p.months }}
                      >
                        {p.months >= 2 && <span>{p.label} ({p.months}mo)</span>}
                      </div>
                    ));
                  })()}
                </div>

                {/* SVG Area Chart */}
                {(() => {
                  const chartW = 800;
                  const chartH = 300;
                  const padL = 55;
                  const padR = 20;
                  const padT = 20;
                  const padB = 40;
                  const w = chartW - padL - padR;
                  const h = chartH - padT - padB;

                  const maxVal = Math.max(...simData.map(d => d.revenue), investment * 1.2);
                  const yScale = (v: number) => padT + h - (v / maxVal) * h;
                  const xScale = (i: number) => padL + (i / (simData.length - 1 || 1)) * w;

                  // Build SVG path for revenue area
                  const revPoints = simData.map((d, i) => `${xScale(i)},${yScale(d.revenue)}`);
                  const revLine = `M${revPoints.join(' L')}`;
                  const revArea = `${revLine} L${xScale(simData.length - 1)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`;

                  // Build SVG path for investor return area
                  const retPoints = simData.map((d, i) => `${xScale(i)},${yScale(d.investorReturn)}`);
                  const retLine = `M${retPoints.join(' L')}`;
                  const retArea = `${retLine} L${xScale(simData.length - 1)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`;

                  // Build SVG path for profit area
                  const profPoints = simData.map((d, i) => `${xScale(i)},${yScale(d.profit)}`);
                  const profLine = `M${profPoints.join(' L')}`;
                  const profArea = `${profLine} L${xScale(simData.length - 1)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`;

                  // Investment line
                  const invY = yScale(investment);

                  // Y axis ticks
                  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((maxVal / 4) * i));

                  // Breakeven month
                  const breakevenMonth = simData.findIndex(d => d.investorReturn >= investment);

                  // Monthly revenue (non-cumulative) for the last visible month
                  const lastMonthRev = getMonthlyRevenue(simMonth);
                  const lastMonthProfit = getMonthlyProfit(simMonth);
                  const lastInvReturn = simData[simData.length - 1]?.investorReturn || 0;
                  const lastCumRev = simData[simData.length - 1]?.revenue || 0;

                  return (
                    <>
                      {/* Chart with hover interaction */}
                      <div className="relative group/chart">
                        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            {/* Revenue gradient */}
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                            </linearGradient>
                            {/* Profit gradient */}
                            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                            </linearGradient>
                            {/* Investor return gradient */}
                            <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                            </linearGradient>
                            {/* Glow filter */}
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                          </defs>

                          {/* Grid lines */}
                          {yTicks.map((tick, i) => (
                            <g key={i}>
                              <line x1={padL} y1={yScale(tick)} x2={chartW - padR} y2={yScale(tick)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                              <text x={padL - 8} y={yScale(tick) + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace">
                                ${(tick / 1000).toFixed(0)}K
                              </text>
                            </g>
                          ))}

                          {/* Areas (back to front) */}
                          <path d={revArea} fill="url(#revGrad)" className="transition-all duration-700" />
                          <path d={profArea} fill="url(#profGrad)" className="transition-all duration-700" />
                          <path d={retArea} fill="url(#retGrad)" className="transition-all duration-700" />

                          {/* Lines */}
                          <path d={revLine} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinejoin="round" filter="url(#glow)" className="transition-all duration-700" />
                          <path d={profLine} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" className="transition-all duration-700" opacity="0.8" />
                          <path d={retLine} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" className="transition-all duration-700" opacity="0.8" />

                          {/* Investment threshold line */}
                          <line x1={padL} y1={invY} x2={chartW - padR} y2={invY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" />
                          <rect x={padL} y={invY - 10} width="82" height="18" rx="4" fill="rgba(239,68,68,0.15)" />
                          <text x={padL + 6} y={invY + 2} fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Investment ${(investment / 1000).toFixed(0)}K
                          </text>

                          {/* Breakeven marker */}
                          {breakevenMonth > 0 && breakevenMonth < simData.length && (
                            <g>
                              <line x1={xScale(breakevenMonth)} y1={padT} x2={xScale(breakevenMonth)} y2={chartH - padB} stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                              <circle cx={xScale(breakevenMonth)} cy={yScale(simData[breakevenMonth].investorReturn)} r="6" fill="#10b981" opacity="0.8" filter="url(#glow)" />
                              <circle cx={xScale(breakevenMonth)} cy={yScale(simData[breakevenMonth].investorReturn)} r="3" fill="#fff" />
                              <rect x={xScale(breakevenMonth) - 38} y={padT - 2} width="76" height="20" rx="6" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="0.5" />
                              <text x={xScale(breakevenMonth)} y={padT + 12} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                                Breakeven
                              </text>
                            </g>
                          )}

                          {/* Milestone dots on revenue line */}
                          {simData.filter((_, i) => i === 2 || i === 5 || i === 11 || i === 23).map((d, idx) => (
                            <g key={idx}>
                              <circle cx={xScale(d.month - 1)} cy={yScale(d.revenue)} r="5" fill="#06b6d4" opacity="0.9" />
                              <circle cx={xScale(d.month - 1)} cy={yScale(d.revenue)} r="2.5" fill="#fff" />
                            </g>
                          ))}

                          {/* X axis month labels */}
                          {simData.filter((_, i) => {
                            if (simMonth <= 12) return true;
                            if (simMonth <= 24) return i % 2 === 0;
                            return i % 3 === 0;
                          }).map((d, i) => (
                            <text key={i} x={xScale(d.month - 1)} y={chartH - padB + 18} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">
                              {d.month}
                            </text>
                          ))}
                          <text x={padL + w / 2} y={chartH - 4} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="9">
                            Month
                          </text>

                          {/* Hover zones — invisible rects for each month */}
                          {simData.map((d, i) => {
                            const barW = w / simData.length;
                            return (
                              <g key={i} className="group/bar" style={{ cursor: 'crosshair' }}>
                                <rect x={xScale(i) - barW / 2} y={padT} width={barW} height={h} fill="transparent" />
                                {/* Vertical crosshair */}
                                <line x1={xScale(i)} y1={padT} x2={xScale(i)} y2={chartH - padB} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" className="opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                {/* Tooltip card */}
                                <foreignObject x={Math.min(xScale(i) - 70, chartW - padR - 150)} y={Math.max(yScale(d.revenue) - 95, padT)} width="150" height="90" className="opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none">
                                  <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 shadow-2xl shadow-black/40">
                                    <p className="text-[11px] font-bold text-white mb-1.5">Month {d.month}</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-[10px] text-cyan-400">Revenue</span>
                                        <span className="text-[10px] font-bold text-white">${(d.revenue / 1000).toFixed(1)}K</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-[10px] text-blue-400">Profit</span>
                                        <span className="text-[10px] font-bold text-white">${(d.profit / 1000).toFixed(1)}K</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-[10px] text-emerald-400">Your Return</span>
                                        <span className="text-[10px] font-bold text-emerald-400">${(d.investorReturn / 1000).toFixed(1)}K</span>
                                      </div>
                                    </div>
                                  </div>
                                </foreignObject>
                                {/* Dot on revenue line */}
                                <circle cx={xScale(i)} cy={yScale(d.revenue)} r="4" fill="#06b6d4" className="opacity-0 group-hover/bar:opacity-100 transition-opacity" filter="url(#glow)" />
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 justify-center">
                        {[
                          { color: 'bg-cyan-400', label: 'Cumulative Revenue' },
                          { color: 'bg-blue-500', label: 'Cumulative Net Profit' },
                          { color: 'bg-emerald-400', label: 'Your Cumulative Return' },
                        ].map((l, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                            <span className="text-xs text-slate-400">{l.label}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <div className="w-5 border-t-2 border-dashed border-red-400/50" />
                          <span className="text-xs text-slate-400">Investment Line</span>
                        </div>
                      </div>

                      {/* ── KPI Summary Cards (at selected month) ── */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                          {
                            icon: <LineChart size={16} className="text-cyan-400" />,
                            label: `Cum. Revenue (Mo ${simMonth})`,
                            value: `$${(lastCumRev / 1000).toFixed(0)}K`,
                            color: 'text-white',
                            bg: 'from-cyan-500/8 to-cyan-500/2',
                          },
                          {
                            icon: <Wallet size={16} className="text-emerald-400" />,
                            label: `Your Return (Mo ${simMonth})`,
                            value: `$${(lastInvReturn / 1000).toFixed(1)}K`,
                            color: lastInvReturn >= investment ? 'text-emerald-400' : 'text-white',
                            bg: 'from-emerald-500/8 to-emerald-500/2',
                          },
                          {
                            icon: <TrendingUp size={16} className="text-blue-400" />,
                            label: 'Monthly Revenue',
                            value: `$${(lastMonthRev / 1000).toFixed(1)}K`,
                            sub: `at month ${simMonth}`,
                            color: 'text-white',
                            bg: 'from-blue-500/8 to-blue-500/2',
                          },
                          {
                            icon: <Target size={16} className={breakevenMonth > 0 && breakevenMonth < simMonth ? 'text-emerald-400' : 'text-yellow-400'} />,
                            label: 'Breakeven',
                            value: breakevenMonth > 0 ? `Month ${breakevenMonth + 1}` : `>${simMonth} mo`,
                            color: breakevenMonth > 0 && breakevenMonth < simMonth ? 'text-emerald-400' : 'text-yellow-400',
                            bg: breakevenMonth > 0 && breakevenMonth < simMonth ? 'from-emerald-500/8 to-emerald-500/2' : 'from-yellow-500/8 to-yellow-500/2',
                          }
                        ].map((kpi, i) => (
                          <Reveal key={i} delay={i * 60}>
                            <div className={`bg-gradient-to-br ${kpi.bg} rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors`}>
                              <div className="flex items-center gap-2 mb-2">
                                {kpi.icon}
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{kpi.label}</span>
                              </div>
                              <p className={`text-xl md:text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                              {'sub' in kpi && kpi.sub && <p className="text-[10px] text-slate-600 mt-0.5">{kpi.sub}</p>}
                            </div>
                          </Reveal>
                        ))}
                      </div>

                      {/* ── Monthly Revenue Breakdown Table ── */}
                      <details className="mt-8 group/details">
                        <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                          <ChevronRight size={14} className="group-open/details:rotate-90 transition-transform" />
                          <span className="font-semibold">View monthly breakdown</span>
                        </summary>
                        <div className="mt-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 overflow-hidden">
                          <div className="max-h-64 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm">
                                <tr className="text-slate-500 uppercase tracking-wider">
                                  <th className="text-left px-4 py-3 font-bold">Month</th>
                                  <th className="text-right px-4 py-3 font-bold">Monthly Rev</th>
                                  <th className="text-right px-4 py-3 font-bold">Cum. Revenue</th>
                                  <th className="text-right px-4 py-3 font-bold">Cum. Profit</th>
                                  <th className="text-right px-4 py-3 font-bold">Your Return</th>
                                  <th className="text-right px-4 py-3 font-bold">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {simData.map((d, i) => {
                                  const monthlyRev = getMonthlyRevenue(d.month);
                                  const recovered = d.investorReturn >= investment;
                                  return (
                                    <tr key={i} className={`border-t border-slate-800/30 ${recovered ? 'bg-emerald-500/3' : ''} hover:bg-white/2 transition-colors`}>
                                      <td className="px-4 py-2.5 font-semibold text-slate-300">
                                        <span className="inline-flex items-center gap-1.5">
                                          {d.month}
                                          {d.month === 3 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold">P1</span>}
                                          {d.month === 6 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">P2</span>}
                                          {d.month === 12 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">P3</span>}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 text-right text-slate-400">${(monthlyRev / 1000).toFixed(1)}K</td>
                                      <td className="px-4 py-2.5 text-right font-semibold text-cyan-400">${(d.revenue / 1000).toFixed(1)}K</td>
                                      <td className="px-4 py-2.5 text-right text-blue-400">${(d.profit / 1000).toFixed(1)}K</td>
                                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-400">${(d.investorReturn / 1000).toFixed(1)}K</td>
                                      <td className="px-4 py-2.5 text-right">
                                        {recovered
                                          ? <span className="text-emerald-400 text-[10px] font-bold">✓ RECOVERED</span>
                                          : <span className="text-slate-600 text-[10px]">{((d.investorReturn / investment) * 100).toFixed(0)}%</span>
                                        }
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    </>
                  );
                })()}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Revenue Assumptions ─── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Revenue Model</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Revenue <span className="text-cyan-400">Phases</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                phase: 'Phase 1', period: 'Month 1–3', title: 'Early Traction',
                revenue: '$2K – $4K/mo', icon: <Target className="text-yellow-400" size={24} />,
                items: ['Pilot clients', 'Platform validation', 'Initial revenue streams'],
                gradient: 'from-yellow-500/10 to-amber-500/5', border: 'border-yellow-500/20'
              },
              {
                phase: 'Phase 2', period: 'Month 4–6', title: 'Automation Active',
                revenue: '$5K – $7.5K/mo', icon: <Zap className="text-cyan-400" size={24} />,
                items: ['Marketing automation live', 'AI systems active', 'Client pipeline growing'],
                gradient: 'from-cyan-500/10 to-blue-500/5', border: 'border-cyan-500/20'
              },
              {
                phase: 'Phase 3', period: 'Month 7–12', title: 'Optimized Scale',
                revenue: '$8K – $12K/mo', icon: <TrendingUp className="text-emerald-400" size={24} />,
                items: ['Recurring revenue growing', 'Bank leverage activated', 'Funnels optimized'],
                gradient: 'from-emerald-500/10 to-green-500/5', border: 'border-emerald-500/20'
              },
            ].map((phase, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className={`rounded-3xl p-8 bg-gradient-to-br ${phase.gradient} border ${phase.border} h-full hover-lift`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/50 flex items-center justify-center">
                      {phase.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold tracking-wider">{phase.phase} · {phase.period}</p>
                      <p className="text-lg font-bold text-white">{phase.title}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-6">{phase.revenue}</p>
                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <p className="text-center text-sm text-slate-500 mt-8 max-w-xl mx-auto">
              Assumptions are based on <span className="text-white">services + SaaS hybrid model</span>, not viral growth.
              No guaranteed returns promised.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Margin Rings ─── */}
      <section className="py-24 bg-slate-900/50 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Expense Structure</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Net Margin <span className="text-cyan-400">Target</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-wrap justify-center gap-12">
              <ProgressRing percent={33} color="#06b6d4" label="Operating Costs" />
              <ProgressRing percent={18} color="#3b82f6" label="Marketing (Ongoing)" />
              <ProgressRing percent={40} color="#10b981" label="Net Margin" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="max-w-md mx-auto mt-12 glass rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-400">Year 1 Net Income Projection</p>
              <p className="text-4xl font-bold text-white mt-2">$30,000 – $40,000</p>
              <p className="text-xs text-slate-500 mt-2">Based on 35-45% net margin target</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Banking Leverage ─── */}
      <section id="banking" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/20 -z-10" />
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Non-Dilutive Upside</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Banking <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Leverage</span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Your investment unlocks bank capital — scaling the system <span className="text-white font-semibold">without additional equity dilution</span>.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal delay={100}>
              <div className="glass rounded-3xl p-8 relative overflow-hidden group hover-lift">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                      <CreditCard className="text-cyan-400" size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold tracking-wider">After 6–9 Months</p>
                      <p className="text-lg font-bold text-white">Initial Access</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-sm text-slate-400">Business Credit Cards</span>
                      <span className="font-bold text-white">$20K – $30K</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-sm text-slate-400">Line of Credit</span>
                      <span className="font-bold text-white">$15K – $30K</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-400 font-bold">Total Leverage</span>
                      <span className="font-bold text-cyan-400 text-xl">$35K – $60K</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass rounded-3xl p-8 relative overflow-hidden group hover-lift border border-emerald-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Landmark className="text-emerald-400" size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold tracking-wider">After 12+ Months</p>
                      <p className="text-lg font-bold text-white">Full Potential</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-sm text-slate-400">Total Bank Capital</span>
                      <span className="font-bold text-white">$75K – $100K+</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                      <span className="text-sm text-slate-400">SBA Loan Eligibility</span>
                      <span className="font-bold text-white">Possible</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-400 font-bold">Growth Without Dilution</span>
                      <span className="text-emerald-400 text-xl">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Deal Structure Options ─── */}
      <section id="deal" className="py-24 bg-slate-900/50 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Investment Options</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Deal <span className="text-cyan-400">Structure</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Option A */}
            <Reveal delay={0}>
              <div className="glass rounded-3xl p-8 h-full relative">
                <div className="text-xs font-bold text-slate-500 tracking-wider mb-4">OPTION A</div>
                <h3 className="text-xl font-bold text-white mb-2">Revenue Share + Equity</h3>
                <p className="text-sm text-slate-400 mb-6">Cash flow from day one + ownership upside</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    Capital returned first (waterfall)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    15%–25% net profit share
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    5%–15% equity stake
                  </li>
                </ul>
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-slate-400">
                  Best for: Investors who want <span className="text-cyan-400 font-semibold">early cash flow + exit potential</span>
                </div>
              </div>
            </Reveal>

            {/* Option B — Recommended */}
            <Reveal delay={150}>
              <div className="relative glass rounded-3xl p-8 h-full border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white tracking-wider shadow-lg">
                  RECOMMENDED
                </div>
                <div className="text-xs font-bold text-cyan-400 tracking-wider mb-4">OPTION B — HYBRID</div>
                <h3 className="text-xl font-bold text-white mb-2">Hybrid Model</h3>
                <p className="text-sm text-slate-400 mb-6">Maximum protection + upside participation</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    100% capital returned from cash flow
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    Then: 20% profit share
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    10% equity stake
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    Participation in future sale event
                  </li>
                </ul>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-slate-400">
                  Best for: Investors who want <span className="text-emerald-400 font-semibold">full capital protection + growth</span>
                </div>
              </div>
            </Reveal>

            {/* Option C */}
            <Reveal delay={300}>
              <div className="glass rounded-3xl p-8 h-full relative">
                <div className="text-xs font-bold text-slate-500 tracking-wider mb-4">OPTION C</div>
                <h3 className="text-xl font-bold text-white mb-2">SAFE / Equity Pure</h3>
                <p className="text-sm text-slate-400 mb-6">For tech-focused investors betting on scale</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    Reasonable pre-seed valuation
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    10%–20% equity
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    No operational control
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    Preference in future rounds
                  </li>
                </ul>
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs text-slate-400">
                  Best for: Investors focused on <span className="text-purple-400 font-semibold">SaaS exit and long-term value</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── What You Promise / Don't ─── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Risk & Mitigation</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Honest <span className="text-cyan-400">Commitments</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal delay={0}>
              <div className="glass rounded-3xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">What We Promise</h3>
                </div>
                <ul className="space-y-4">
                  {['Structure & discipline from day 1', 'Full transparency on capital use', 'Execution-first mentality', 'Progressive returns from cash flow', 'Real assets — corporation, platform, automation'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <ChevronRight size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="glass rounded-3xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <XCircle className="text-red-400" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">What We Don't Promise</h3>
                </div>
                <ul className="space-y-4">
                  {['Exact guaranteed dollar amounts', 'Magic timelines or overnight success', 'Guaranteed loan approvals', 'Quick exits or flips', 'Any return that isn\'t earned from operations'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <ChevronRight size={16} className="text-red-400 mt-0.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300}>
            <div className="max-w-3xl mx-auto mt-12 text-center">
              <div className="glass rounded-2xl p-8 border border-cyan-500/10">
                <p className="text-lg text-slate-300 leading-relaxed">
                  "This is not a high-risk startup bet. It is a <span className="text-white font-bold">structured company-building strategy</span> where
                  capital builds assets, assets generate cash flow, cash flow unlocks bank leverage, and leverage scales the system."
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Roles ─── */}
      <section className="py-24 bg-slate-900/50 relative">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Partnership</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 font-serif">
                Clear <span className="text-cyan-400">Roles</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Reveal delay={0}>
              <div className="glass rounded-3xl p-8 h-full border border-cyan-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">The Operator</h3>
                    <p className="text-sm text-cyan-400">Neiver Álvarez</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Acquires the corporation',
                    'Builds the digital platform',
                    'Implements marketing automation',
                    'Manages day-to-day operations',
                    'Builds cash flow & banking relationships',
                    'Provides know-how + execution + time'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="glass rounded-3xl p-8 h-full border border-emerald-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">The Investor</h3>
                    <p className="text-sm text-emerald-400">Strategic Partner</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Provides initial capital ($25K–$50K)',
                    'Does NOT operate the business',
                    'Does NOT manage day-to-day',
                    'Receives transparent reporting',
                    'Earns returns from net cash flow',
                    'Provides capital + strategic patience'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-blue-950/30 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px] -z-10" />

        <div className="container mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold text-white font-serif mb-6">
              Ready to Build<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Together?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
              This opportunity is limited to one strategic partner. Let's discuss how we can create value together.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/17865432478?text=I'm%20interested%20in%20the%20investment%20opportunity"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all"
              >
                Schedule a Call <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a
                href="mailto:business@neiveralvarez.dev?subject=Investment%20Inquiry"
                className="flex items-center gap-3 px-10 py-4 rounded-full bg-slate-900/50 border-2 border-slate-700 text-white font-bold text-lg hover:border-cyan-500 hover:-translate-y-1 transition-all backdrop-blur-md"
              >
                Send Email
              </a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-xs text-slate-600 mt-8 max-w-md mx-auto">
              This document is for informational purposes only and does not constitute an offer to sell securities.
              All projections are estimates and not guaranteed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="text-sm text-slate-500">© {new Date().getFullYear()} OMNIA — Confidential</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Shield size={14} /> All projections are estimates · Not a securities offering · Past performance does not guarantee future results
          </div>
        </div>
      </footer>
    </div>
  );
}
