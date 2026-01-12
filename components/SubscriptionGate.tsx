
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SubscriptionGateProps {
  profile: UserProfile;
  onSubscribe: (tier: 'MONTHLY' | 'ANNUAL') => void;
  forcedOpen?: boolean;
  onClose?: () => void;
}

const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ profile, onSubscribe, forcedOpen, onClose }) => {
  const regDate = new Date(profile.registrationDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays > 90 && profile.subscriptionStatus !== 'ACTIVE';

  if (!isExpired && !forcedOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl">
      <div className="bg-white rounded-[60px] w-full max-w-6xl overflow-hidden shadow-2xl animate-in zoom-in duration-500 relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-8 left-8 p-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all z-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Benefits Section */}
          <div className="lg:col-span-7 p-12 md:p-16 flex flex-col justify-center bg-white" dir="rtl">
            <div className="mb-10">
               <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">GODOG PRO</span>
               <h2 className="text-4xl md:text-5xl font-black text-indigo-900 leading-tight">מנוי מקצועי לכל המשפחה</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 shadow-sm">
                  <h4 className="font-black text-indigo-900 mb-4 text-xl flex items-center gap-2">
                     <span>🏠</span> מודל "המשפחה המורחבת":
                  </h4>
                  <ul className="space-y-4 text-base font-bold text-indigo-800">
                    <li className="flex justify-between items-center bg-white/60 p-3 rounded-2xl">
                      <span>🐕 כלב ראשון:</span> 
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">מחיר מלא</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>🐕 כלב שני:</span> 
                      <span className="text-indigo-600">75% מהמחיר</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>🐕 כלב שלישי:</span> 
                      <span className="text-indigo-600">50% מהמחיר</span>
                    </li>
                    <li className="flex justify-between items-center border-t border-indigo-200 pt-3">
                      <span>🐕🐕 כלב 5 ומעלה:</span> 
                      <span className="text-rose-600 font-black">5% בלבד!</span>
                    </li>
                  </ul>
               </div>

               <div className="bg-violet-50 p-8 rounded-[40px] border border-violet-100 shadow-sm">
                  <h4 className="font-black text-violet-900 mb-4 text-xl flex items-center gap-2">
                     <span>👥</span> מודל השותפים:
                  </h4>
                  <div className="space-y-4">
                     <div className="bg-white/60 p-4 rounded-3xl">
                        <p className="text-violet-900 font-black text-lg">כלול במנוי:</p>
                        <p className="text-violet-700 font-bold leading-tight mt-1">עד 3 אנשים (משתמש ראשי + 2 שותפים)</p>
                     </div>
                     <div className="p-4">
                        <p className="text-gray-500 font-black text-xs uppercase tracking-widest mb-3">מעל 3 אנשים:</p>
                        <ul className="space-y-2 text-sm font-bold text-gray-700">
                           <li className="flex items-center justify-between">
                              <span>במנוי חודשי:</span>
                              <span className="text-indigo-600">+1.5 ₪ לאדם</span>
                           </li>
                           <li className="flex items-center justify-between">
                              <span>במנוי שנתי:</span>
                              <span className="text-indigo-600">+1 ₪ לאדם</span>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
               <span className="text-2xl">✨</span>
               <p className="text-gray-400 text-sm font-bold italic leading-relaxed">
                  המחירים מתייחסים לכל כלב רשום בנפרד. המנוי מאפשר סנכרון יומן מלא, תזכורות ווטרינר, היסטוריית טיולים ותקשורת מאובטחת בין כל בני המשפחה והדוג-ווקר.
               </p>
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="lg:col-span-5 bg-indigo-900 p-12 md:p-16 flex flex-col gap-8 justify-center relative overflow-hidden" dir="rtl">
             <div className="relative z-10 space-y-6">
                <div 
                  className="bg-white p-10 rounded-[44px] shadow-2xl border-4 border-transparent hover:border-yellow-400 transition-all cursor-pointer group scale-105" 
                  onClick={() => onSubscribe('ANNUAL')}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-2xl font-black text-indigo-950">מנוי שנתי</h4>
                    <span className="bg-yellow-400 text-indigo-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">הכי משתלם</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-black text-indigo-600">14.9₪</span>
                    <span className="text-sm text-gray-400 font-bold">/ לחודש לכלב</span>
                  </div>
                  <p className="text-gray-400 font-bold text-xs mb-8">+ 1 ₪ לכל אדם נוסף מעל 3 משתמשים</p>
                  <button className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl group-hover:bg-indigo-700 transition-all">בחירה במסלול שנתי</button>
                </div>

                <div 
                  className="bg-indigo-800/40 backdrop-blur-md p-10 rounded-[44px] shadow-sm border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer group" 
                  onClick={() => onSubscribe('MONTHLY')}
                >
                  <h4 className="text-xl font-black text-white mb-6">מנוי חודשי</h4>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black text-white">19.9₪</span>
                    <span className="text-sm text-indigo-200 font-bold">/ לחודש לכלב</span>
                  </div>
                  <p className="text-indigo-300 font-bold text-xs mb-8">+ 1.5 ₪ לכל אדם נוסף מעל 3 משתמשים</p>
                  <button className="w-full bg-white text-indigo-900 py-5 rounded-[24px] font-black text-lg shadow-lg group-hover:bg-indigo-50 transition-all">בחירה במסלול חודשי</button>
                </div>
             </div>

             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-20"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGate;
