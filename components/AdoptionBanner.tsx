
import React, { useState, useEffect } from 'react';
import { getLatestAdoptionEvents } from '../services/gemini';

const AdoptionBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [eventData, setEventData] = useState<{ text: string, source: string, allSources?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await getLatestAdoptionEvents();
        setEventData(data);
      } catch (err) {
        console.error("Banner fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 text-white p-3 shadow-2xl animate-in slide-in-from-top duration-700 sticky top-0 md:top-[72px] z-[110] overflow-hidden border-b border-rose-400/20">
      <div className="container mx-auto flex items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0 flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div className="hidden sm:flex gap-1.5">
               <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-black">f</div>
               <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-black">in</div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-green-400 text-green-950 px-2 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-wider animate-pulse">LIVE CONNECTED</span>
              <p className="font-black text-xs md:text-sm whitespace-nowrap">עדכוני אימוץ בזמן אמת</p>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-2.5 bg-white/20 rounded animate-pulse"></div>
              </div>
            ) : (
              <p className="text-[11px] md:text-xs opacity-90 font-bold mt-0.5 truncate">{eventData?.text}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!loading && eventData?.source && (
            <a 
              href={eventData.source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-rose-600 px-5 py-2 rounded-full font-black text-[10px] hover:bg-rose-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <span>לצפייה בפרטים ורישום</span>
              <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          )}
          <button onClick={() => setIsVisible(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      
      {/* Network line animation decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="h-[1px] w-full bg-white absolute top-1/2 -translate-y-1/2 animate-shimmer"></div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
        }
      `}</style>
    </div>
  );
};

export default AdoptionBanner;
