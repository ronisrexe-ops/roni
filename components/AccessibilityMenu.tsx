
import React, { useState, useEffect } from 'react';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isNegativeContrast, setIsNegativeContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.style.fontSize = `${fontSize}%`;
    
    if (isGrayscale) body.classList.add('filter-grayscale');
    else body.classList.remove('filter-grayscale');

    if (isHighContrast) body.classList.add('high-contrast');
    else body.classList.remove('high-contrast');

    if (isNegativeContrast) body.classList.add('negative-contrast');
    else body.classList.remove('negative-contrast');

    if (highlightLinks) body.classList.add('highlight-links');
    else body.classList.remove('highlight-links');

    if (readableFont) body.classList.add('readable-font');
    else body.classList.remove('readable-font');

    if (stopAnimations) body.classList.add('stop-animations');
    else body.classList.remove('stop-animations');

  }, [fontSize, isGrayscale, isHighContrast, isNegativeContrast, highlightLinks, readableFont, stopAnimations]);

  const reset = () => {
    setFontSize(100);
    setIsGrayscale(false);
    setIsHighContrast(false);
    setIsNegativeContrast(false);
    setHighlightLinks(false);
    setReadableFont(false);
    setStopAnimations(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[500]" dir="rtl">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-2 border-white"
        aria-label="תפריט נגישות"
        aria-expanded={isOpen}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
            <h3 className="font-black text-lg">תפריט נגישות</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm">גודל גופן</span>
              <div className="flex gap-2">
                <button onClick={() => setFontSize(prev => Math.min(prev + 10, 150))} className="bg-gray-100 w-8 h-8 rounded-lg font-black">+</button>
                <button onClick={() => setFontSize(prev => Math.max(prev - 10, 80))} className="bg-gray-100 w-8 h-8 rounded-lg font-black">-</button>
              </div>
            </div>

            <button onClick={() => setIsGrayscale(!isGrayscale)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${isGrayscale ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               גווני אפור
            </button>

            <button onClick={() => setIsHighContrast(!isHighContrast)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${isHighContrast ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               ניגודיות גבוהה
            </button>

            <button onClick={() => setIsNegativeContrast(!isNegativeContrast)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${isNegativeContrast ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               ניגודיות הפוכה
            </button>

            <button onClick={() => setHighlightLinks(!highlightLinks)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${highlightLinks ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               הדגשת קישורים
            </button>

            <button onClick={() => setReadableFont(!readableFont)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${readableFont ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               פונט קריא
            </button>

            <button onClick={() => setStopAnimations(!stopAnimations)} className={`w-full text-right p-3 rounded-xl text-sm font-bold transition-all ${stopAnimations ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
               עצירת אנימציות
            </button>

            <button onClick={reset} className="w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-black text-sm mt-4">
               איפוס הגדרות
            </button>

            <div className="pt-4 border-t border-gray-100">
               <a href="#" className="text-xs font-bold text-indigo-600 underline">הצהרת נגישות</a>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .filter-grayscale { filter: grayscale(100%); }
        .high-contrast { background-color: #000 !important; color: #ff0 !important; }
        .high-contrast * { background-color: transparent !important; color: inherit !important; border-color: #ff0 !important; }
        .negative-contrast { filter: invert(100%); }
        .highlight-links a, .highlight-links button { text-decoration: underline !important; background-color: #ff0 !important; color: #000 !important; }
        .readable-font { font-family: Arial, sans-serif !important; }
        .stop-animations * { animation: none !important; transition: none !important; }
      `}</style>
    </div>
  );
};

export default AccessibilityMenu;
