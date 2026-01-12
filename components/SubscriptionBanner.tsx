
import React, { useState } from 'react';

interface SubscriptionBannerProps {
  registrationDate: string;
  onClick: () => void;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ registrationDate, onClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  const regDate = new Date(registrationDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, 90 - diffDays);

  if (!isVisible) return null;

  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-800 text-white p-4 shadow-2xl animate-in slide-in-from-top duration-1000 sticky top-[72px] z-30 border-b border-white/10 cursor-pointer hover:brightness-110 transition-all group"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 hidden md:block group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-sm md:text-xl tracking-tight leading-tight group-hover:underline">
              ניהול מושלם של חיי הכלב עבורך ועבור כל מי שצירפת – יומן, תזכורות, אנשי מקצוע וזכרונות, הכל במקום אחד!
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
               <p className="text-[10px] md:text-xs opacity-90 font-bold uppercase tracking-widest text-indigo-100">
                 נשארו לך {remainingDays} ימים לניסיון חינם • לחץ כאן למעבר למסלולי המנוי המקצועיים
               </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }} 
            className="p-2 hover:bg-white/20 rounded-full transition-all hover:rotate-90 z-40"
            aria-label="סגור באנר"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
