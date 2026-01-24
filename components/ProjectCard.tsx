import React, { useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

// Logo exclusivo "Omnia Engine" inspirado en la imagen (Dorado y Azul)
const OmniaEngineLogo = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_25px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform duration-700">
    <defs>
      <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="blue-core" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="glow-engine">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Tech Circuit Background Ring */}
    <path 
      d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10" 
      fill="none" 
      stroke="#1e293b" 
      strokeWidth="1" 
      strokeDasharray="4 2"
      className="animate-[spin_20s_linear_infinite]"
    />

    {/* Gold Wings / Pillars Structure */}
    <path d="M20 30 L35 40 V70 L20 60 Z" fill="url(#gold-gradient)" opacity="0.9" />
    <path d="M80 30 L65 40 V70 L80 60 Z" fill="url(#gold-gradient)" opacity="0.9" />
    
    {/* Central Structure */}
    <path d="M35 75 L50 85 L65 75 V40 L50 30 L35 40 Z" fill="#0f172a" stroke="url(#gold-gradient)" strokeWidth="1.5" />
    
    {/* Blue Core Energy */}
    <circle cx="50" cy="55" r="10" fill="url(#blue-core)" filter="url(#glow-engine)">
      <animate attributeName="opacity" values="0.8;1;0.8" duration="3s" repeatCount="indefinite" />
    </circle>
    
    {/* Tech Lines Rising */}
    <path d="M50 30 V15" stroke="url(#blue-core)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="12" r="2" fill="#22d3ee" />
    <path d="M40 35 V20" stroke="url(#blue-core)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M60 35 V20" stroke="url(#blue-core)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

  </svg>
);

// Logo para proyectos en producción
const ProductionLogo = ({ icon }: { icon: string }) => {
  const IconComponent = (Icons as any)[icon] || Icons.Zap;
  
  return (
    <div className="relative">
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform duration-700">
        <defs>
          <linearGradient id="prod-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="prod-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Rotating rings */}
        <circle 
          cx="60" cy="60" r="45" 
          fill="none" 
          stroke="url(#prod-gradient)" 
          strokeWidth="2" 
          opacity="0.3"
          strokeDasharray="10 5"
          className="animate-[spin_15s_linear_infinite]"
        />
        <circle 
          cx="60" cy="60" r="35" 
          fill="none" 
          stroke="url(#prod-gradient)" 
          strokeWidth="1.5" 
          opacity="0.4"
          strokeDasharray="5 3"
          className="animate-[spin_10s_linear_infinite_reverse]"
        />
        
        {/* Central hexagon */}
        <path 
          d="M60 25 L85 42.5 L85 72.5 L60 90 L35 72.5 L35 42.5 Z" 
          fill="#0f172a" 
          stroke="url(#prod-gradient)" 
          strokeWidth="2"
          filter="url(#prod-glow)"
        />
        
        {/* Inner glow */}
        <circle cx="60" cy="60" r="18" fill="url(#prod-gradient)" opacity="0.2">
          <animate attributeName="r" values="18;22;18" duration="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" duration="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Corner dots */}
        <circle cx="60" cy="22" r="3" fill="#22d3ee">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="88" cy="42" r="3" fill="#3b82f6">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="88" cy="74" r="3" fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-cyan-400 opacity-90 group-hover:scale-110 transition-transform duration-500">
          <IconComponent size={40} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const safeUrl = project.url.startsWith('http') ? project.url : `https://${project.url}`;
  
  // Check if this is a production placeholder
  const isProductionPlaceholder = project.image === 'production';
  
  // Generates a screenshot automatically based on the URL.
  // We prioritize the screenshot service. If it fails, the onError handler will show the 'Under Construction' state.
  const screenshotUrl = !isProductionPlaceholder && project.image 
    ? project.image 
    : `https://s0.wp.com/mshots/v1/${encodeURIComponent(safeUrl)}?w=800&h=600`;

  // Dynamically resolve the icon component
  const IconComponent = project.icon ? (Icons as any)[project.icon] : null;

  return (
    <div className="group relative w-full flex flex-col rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25 hover:border-slate-600 hover:-translate-y-2 hover:scale-[1.02]">
      {/* Browser Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0 z-20 relative">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors duration-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors duration-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors duration-300" />
        </div>
        
        <div className="flex-1 mx-4">
          <div className="bg-slate-950/50 border border-slate-800/50 rounded flex items-center justify-center px-3 py-1.5 transition-colors group-hover:border-slate-700 relative">
            <Globe size={10} className="text-slate-600 group-hover:text-cyan-400 mr-2 transition-colors" />
            <div className="text-[10px] md:text-xs text-slate-500 font-mono text-center truncate max-w-[150px] md:max-w-[200px] group-hover:text-slate-400 transition-colors">
              {safeUrl.replace(/^https?:\/\//, '')}
            </div>
          </div>
        </div>

        {/* Category Icon */}
        <div className="w-6 flex justify-end">
          {IconComponent && (
            <div className="text-slate-600 group-hover:text-cyan-400 transition-colors duration-300">
              <IconComponent size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
        {/* Loading Skeleton */}
        {isLoading && !imgError && !isProductionPlaceholder && (
          <div className="absolute inset-0 bg-slate-900 animate-pulse z-0" />
        )}
        
        {isProductionPlaceholder ? (
          /* Estado "En Producción" Elegante */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-center relative overflow-hidden group-hover:from-slate-900/90 group-hover:via-slate-900/90 group-hover:to-slate-950/90 transition-colors">
             {/* Background decorative pattern */}
             <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.3),transparent_50%)]"></div>
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_48%,rgba(34,211,238,0.1)_49%,rgba(34,211,238,0.1)_51%,transparent_52%)] bg-[length:20px_20px]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50"></div>
             
             {/* Production Logo */}
             <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
               {project.icon && <ProductionLogo icon={project.icon} />}
               
               <div className="mt-6 space-y-2">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 backdrop-blur-md shadow-lg shadow-cyan-500/10">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                   </span>
                   <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.2em]">Live in Production</p>
                 </div>
                 <p className="text-slate-400 text-xs font-serif italic">Enterprise-Grade Solution</p>
               </div>
             </div>
          </div>
        ) : !imgError ? (
          <img
            src={screenshotUrl}
            alt={`Screenshot of ${project.name}`}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 group-hover:blur-[2px] ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImgError(true);
              setIsLoading(false);
            }}
            loading="lazy"
          />
        ) : (
          /* Estado "En Construcción" Elegante */
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-6 text-center relative overflow-hidden group-hover:bg-slate-900/80 transition-colors">
             {/* Background decorative pattern */}
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#0f172a_25%,transparent_25%,transparent_50%,#0f172a_50%,#0f172a_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
             
             {/* Omnia Engine Logo Fallback */}
             <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
               <OmniaEngineLogo />
               
               <div className="mt-4 space-y-2">
                 <div className="inline-block px-3 py-1 rounded border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-md">
                    <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em]">Under Construction</p>
                 </div>
                 <p className="text-slate-400 text-xs font-serif italic">Developing Digital Excellence</p>
               </div>
             </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md z-20">
          <h3 className="text-xl font-bold text-white mb-3 font-serif translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 drop-shadow-lg">
            {project.name}
          </h3>
          
          <p className="text-xs md:text-sm text-slate-300 font-light max-w-[90%] mb-5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 leading-relaxed line-clamp-4">
             {project.description || "A premium digital solution engineered for performance and scalability."}
          </p>
          
          <a
            href={safeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-lg shadow-cyan-900/20 translate-y-4 group-hover:translate-y-0 duration-300 delay-150 hover:scale-105"
          >
            VISIT WEBSITE
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};