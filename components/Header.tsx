
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { APP_CONFIG } from '../config';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onProfileClick: () => void;
  onLogout?: () => void;
  isProfileComplete: boolean;
  profile?: UserProfile | null;
}

export const DogLogo = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-2xl overflow-visible">
    <defs>
      <linearGradient id="furGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB347" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="2" />
        <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M20 30c-10 0-15 15-12 25 3 10 15 12 18 5l-6-30z" fill="#8B4513" filter="url(#shadow)" />
    <path d="M80 30c10 0 15 15 12 25-3 10-15 12-18 5l6-30z" fill="#8B4513" filter="url(#shadow)" />
    <path d="M50 20c-20 0-30 15-30 35s10 35 30 35 30-15 30-35-10-35-30-35z" fill="url(#furGrad)" filter="url(#shadow)" />
    <ellipse cx="50" cy="65" rx="18" ry="14" fill="#FFF8E1" />
    <circle cx="38" cy="45" r="5" fill="#1A1A1A" />
    <circle cx="62" cy="45" r="5" fill="#1A1A1A" />
    <circle cx="36" cy="43" r="1.5" fill="white" />
    <circle cx="60" cy="43" r="1.5" fill="white" />
    <path d="M46 58c0-2 2-4 4-4s4 2 4 4c0 3-4 7-4 7s-4-4-4-7z" fill="#333" />
    <path d="M46 72c0 4 2 8 4 8s4-4 4-8h-8z" fill="#FF4D4D" className="animate-pulse" />
    <path d="M32 38c2-2 6-2 8 0" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 38c2-2 6-2 8 0" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ role, onRoleChange, onProfileClick, onLogout, isProfileComplete, profile }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const isAdminUser = profile?.userRole === 'ADMIN' || localStorage.getItem('godog_user_role') === 'ADMIN';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${APP_CONFIG.APP_NAME} - הבית של הכלבים בישראל`,
          text: `מצאתי אפליקציה מדהימה לכלב שלי! בואו לראות את ${APP_CONFIG.APP_NAME}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('העתק את הקישור: ' + window.location.href);
    }
  };

  const roles = [
    { id: 'OWNER', label: 'בעל כלב', icon: '🐕' },
    { id: 'WALKER', label: 'דוג-ווקר', icon: '🚶' },
    { id: 'PROFESSIONAL', label: 'בעל מקצוע', icon: '🩺' },
    { id: 'STORE_OWNER', label: 'חנות', icon: '🏪' },
    { id: 'ADMIN', label: 'ניהול', icon: '📊' }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-[100] border-b border-indigo-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer group" onClick={() => { onRoleChange('OWNER'); setShowMobileMenu(false); }}>
          <div className="hover:scale-110 hover:rotate-3 transition-all duration-500">
            <DogLogo />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight mr-1 group-hover:text-orange-500 transition-colors">{APP_CONFIG.APP_NAME}</h1>
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest mr-1">{APP_CONFIG.SLOGAN}</span>
          </div>
        </div>

        {isAdminUser && (
          <div className="hidden lg:flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id as UserRole)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                  role === r.id ? 'bg-white text-indigo-600 shadow-md transform scale-105' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
           {isProfileComplete && profile && (
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100">
               <span className="text-xs font-black text-orange-900">שלום, {profile.firstName} ✨</span>
             </div>
           )}

           <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            title="שתף אפליקציה"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
           </button>
           
           <button 
            onClick={onProfileClick}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
              isProfileComplete ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
            }`}
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
           </button>

           <button 
             onClick={() => setShowMobileMenu(!showMobileMenu)}
             className="lg:hidden p-2 text-indigo-900 hover:bg-gray-50 rounded-xl transition-colors"
           >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={showMobileMenu ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
             </svg>
           </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 space-y-4 animate-in slide-in-from-top duration-300">
           {isAdminUser && (
             <div className="grid grid-cols-1 gap-3 pb-6 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">בקרת מנהל - החלף תצוגה</p>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { onRoleChange(r.id as UserRole); setShowMobileMenu(false); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-black text-right transition-all ${
                      role === r.id ? 'bg-indigo-600 text-white shadow-xl' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
             </div>
           )}
           
           <div className="pt-2 flex justify-between items-center">
              <button onClick={onLogout} className="text-rose-500 font-black text-sm flex items-center gap-2 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                התנתקות
              </button>
              <button onClick={handleShare} className="text-indigo-600 font-black text-sm">שתף את {APP_CONFIG.APP_NAME} 📲</button>
           </div>
        </div>
      )}
    </header>
  );
};

export default Header;
