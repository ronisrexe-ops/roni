
import React from 'react';
import { Booking, UserProfile } from '../types';
import { BUSINESS_PROMOTION_MONTHLY, BUSINESS_PROMOTION_ANNUAL, PLATFORM_COMMISSION_RATE } from '../constants';

interface WalkerDashboardProps {
  isAvailable: boolean;
  onToggleAvailability: () => void;
  bookings: Booking[];
  profile?: UserProfile;
}

const BusinessDashboard: React.FC<WalkerDashboardProps> = ({ isAvailable, onToggleAvailability, bookings, profile }) => {
  const totalGross = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalEarnings = bookings.reduce((sum, b) => sum + b.walkerEarnings, 0);
  const totalPlatformFees = totalGross * PLATFORM_COMMISSION_RATE;
  
  const isPremium = profile?.promotionTier && profile.promotionTier !== 'FREE';
  
  const trialStart = profile?.trialStartDate ? new Date(profile.trialStartDate) : new Date();
  const diffDays = Math.floor((new Date().getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, 180 - diffDays);

  const roleLabel = profile?.userRole === 'STORE_OWNER' ? 'חנות וספק' : 
                   profile?.userRole === 'PROFESSIONAL' ? 'בעל מקצוע' : 'דוג-ווקר';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Business Identity Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-indigo-50 rounded-[30px] flex items-center justify-center text-4xl shadow-inner">
              {profile?.userRole === 'STORE_OWNER' ? '📦' : '🚶'}
           </div>
           <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black text-indigo-950">{profile?.businessName || profile?.firstName}</h2>
                 <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{roleLabel}</span>
              </div>
              <p className="text-gray-400 font-bold mt-1">מזהה עסק: {profile?.businessId}</p>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[32px] border border-gray-100">
           <div className="text-left md:text-right">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">זמינות לקבלת פניות</p>
              <h4 className={`text-lg font-black ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                {isAvailable ? 'עסק פעיל' : 'עסק סגור'}
              </h4>
           </div>
           <button 
              onClick={onToggleAvailability}
              className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors shadow-inner ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${isAvailable ? '-translate-x-8' : '-translate-x-1'}`} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Financial Highlights */}
        <div className="md:col-span-4 bg-indigo-900 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="relative z-10">
              <h4 className="text-indigo-300 text-[10px] font-black uppercase mb-2">יתרה למשיכה (נטו)</h4>
              <p className="text-5xl font-black mb-1">₪{totalEarnings.toFixed(2)}</p>
              <p className="text-indigo-400 text-xs font-bold">לאחר ניכוי עמלת פלטפורמה (20%)</p>
           </div>
           
           <div className="relative z-10 mt-10 space-y-4">
              <div className="flex justify-between text-xs font-bold border-t border-white/10 pt-4">
                 <span className="opacity-60">מחזור ברוטו:</span>
                 <span>₪{totalGross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-300">
                 <span className="opacity-60">עמלת GoDog (20%):</span>
                 <span>-₪{totalPlatformFees.toFixed(2)}</span>
              </div>
              <button className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all">בקשת משיכה לבנק</button>
           </div>
           
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats & Preview */}
        <div className="md:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h4 className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-widest">דירוג עסק</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-indigo-900">4.9</span>
                    <span className="text-yellow-400 text-xl">⭐</span>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h4 className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-widest">חוות דעת</h4>
                 <p className="text-3xl font-black text-indigo-900">{profile?.marketingProfile?.recommendations?.length || 0}</p>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h4 className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-widest">סטטוס קידום</h4>
                 <p className={`text-xl font-black ${isPremium ? 'text-yellow-600' : 'text-blue-500'}`}>
                    {isPremium ? 'Premium ✨' : 'Basic (Trial)'}
                 </p>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-xl font-black text-indigo-900">תצוגה מקדימה: הדף העסקי שלך</h4>
                 <button className="text-indigo-600 font-black text-xs hover:underline">עריכת דף עסקי</button>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-[40px] border border-dashed border-gray-200 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-24 h-24 bg-white rounded-3xl shadow-md flex items-center justify-center text-4xl border-4 border-white">
                    {profile?.userRole === 'STORE_OWNER' ? '🏪' : '🚶'}
                 </div>
                 <div className="flex-grow text-center md:text-right">
                    <h5 className="text-2xl font-black text-gray-800">{profile?.businessName || profile?.firstName}</h5>
                    <p className="text-gray-500 font-bold mb-4 line-clamp-1">{profile?.marketingProfile?.description || 'אין תיאור עסקי עדיין...'}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                       {profile?.marketingProfile?.deals?.map(d => (
                          <span key={d.id} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[8px] font-black">🎁 {d.title}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
