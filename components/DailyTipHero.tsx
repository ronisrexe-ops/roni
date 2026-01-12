
import React, { useState, useEffect } from 'react';
// Corrected import from DOG_BREEDS to DOG_BREEDS_LIST
import { DOG_BREEDS_LIST } from '../constants';
import { getDogAdvice, generateDogPortrait } from '../services/gemini';

const DailyTipHero: React.FC = () => {
  const [dailyTip, setDailyTip] = useState<{ text: string, breed: string, imageUrl?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTip = async () => {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('godog_hero_tip');
      const parsed = saved ? JSON.parse(saved) : null;

      // Ensure we only use the saved tip if it's from today
      if (parsed && parsed.date === today) {
        setDailyTip({ text: parsed.text, breed: parsed.breed, imageUrl: parsed.imageUrl });
      } else {
        setLoading(true);
        // Corrected usage from DOG_BREEDS to DOG_BREEDS_LIST
        const breed = DOG_BREEDS_LIST[new Date().getDate() % DOG_BREEDS_LIST.length];
        
        try {
          const [tipText, imageUrl] = await Promise.all([
            getDogAdvice(`תן לי טיפ מקצועי, קצר ומעורר השראה על גידול ${breed} (עד 20 מילים).`),
            generateDogPortrait(breed, "כלב יומי")
          ]);

          if (tipText) {
            const newTip = { 
              text: tipText, 
              breed, 
              date: today, 
              imageUrl: imageUrl || undefined 
            };
            setDailyTip({ text: tipText, breed, imageUrl: imageUrl || undefined });
            localStorage.setItem('godog_hero_tip', JSON.stringify(newTip));
          }
        } catch (err) {
          console.error("Tip generation error", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTip();
  }, []);

  if (loading) return (
    <div className="bg-indigo-900 h-64 rounded-[50px] animate-pulse mb-12 flex items-center justify-center overflow-hidden border border-indigo-700/50 shadow-2xl">
       <div className="text-white/40 text-xl font-black flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          מכין לך רגע של ידע ויופי להיום...
       </div>
    </div>
  );

  if (!dailyTip) return null;

  return (
    <div className="relative overflow-hidden rounded-[50px] mb-12 group shadow-2xl border border-white/10">
      {/* Background with dynamic animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-600 to-rose-500 animate-gradient-slow opacity-95"></div>
      
      {/* Visual Decorations */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-[3s]"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-400/20 rounded-full blur-[80px]"></div>

      <div className="relative z-10 p-10 md:p-16 text-white flex flex-col md:flex-row items-center gap-12">
        <div className="shrink-0 relative">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-2xl rounded-[48px] flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 rotate-3 group-hover:rotate-0 transition-all duration-700">
             {dailyTip.imageUrl ? (
               <img 
                 src={dailyTip.imageUrl} 
                 alt={dailyTip.breed} 
                 className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
               />
             ) : (
               <span className="text-8xl">🐕</span>
             )}
          </div>
          <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-950 px-6 py-2 rounded-2xl text-[11px] font-black uppercase shadow-xl animate-bounce">
            הטיפ היומי
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
              מומחיות בגידול {dailyTip.breed} ✨
            </span>
          </div>
          
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black mb-10 leading-tight tracking-tight drop-shadow-2xl">
            "{dailyTip.text}"
          </h3>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
             <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl px-6 py-3.5 rounded-[28px] border border-white/10 shadow-inner">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-indigo-50">בלעדי למנויי GoDog Pro</span>
             </div>
             <p className="text-white/60 text-xs font-black uppercase tracking-widest italic">
                Daily Insight • GoDog AI Visuals
             </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default DailyTipHero;
