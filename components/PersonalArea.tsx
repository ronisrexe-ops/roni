
import React, { useState } from 'react';
import { UserProfile, Deal, PromotionTier, AddonTier } from '../types';
import { BUSINESS_PROMOTION_MONTHLY, BUSINESS_PROMOTION_ANNUAL, CUBE_ADDON_MONTHLY, CUBE_ADDON_ANNUAL } from '../constants';
import LegalModal from './LegalModal';

interface PersonalAreaProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
}

const PersonalArea: React.FC<PersonalAreaProps> = ({ profile, onUpdate, onClose }) => {
  const isBusiness = ['WALKER', 'PROFESSIONAL', 'STORE_OWNER'].includes(profile.userRole);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SAVED' | 'BUSINESS' | 'ADVERTISING' | 'DEALS' | 'PAYMENTS' | 'LEGAL'>(isBusiness ? 'BUSINESS' : 'PROFILE');
  const [showLegalType, setShowLegalType] = useState<'OWNER' | 'BUSINESS' | 'GENERAL' | null>(null);
  
  const [dealForm, setDealForm] = useState<Partial<Deal>>({
    title: '',
    description: '',
    images: []
  });

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...profile, isComplete: true });
    alert('הפרטים נשמרו בהצלחה!');
  };

  const handleAddonPurchase = (tier: 'MONTHLY' | 'ANNUAL') => {
    const addon: AddonTier = tier === 'MONTHLY' ? 'MONTHLY_CUBE' : 'ANNUAL_CUBE';
    onUpdate({ ...profile, hasPromotionsAddon: true, promotionsAddonTier: addon });
    alert(`תוספת המבצעים הופעלה! תוכל כעת להעלות עד 5 מבצעים שיופיעו בקובייה המתחלפת.`);
    setActiveTab('DEALS');
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const existingDeals = profile.marketingProfile?.deals || [];
    if (existingDeals.length >= 5) return alert('ניתן להעלות עד 5 מבצעים בלבד');

    // Fix: Corrected variable name from 'new Deal' to 'newDeal' to resolve syntax errors and shadowed type usage.
    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      title: dealForm.title || '',
      description: dealForm.description || '',
      images: dealForm.images || [],
      businessName: profile.businessName || profile.firstName,
      businessId: profile.businessId || profile.id,
      category: 'WALKING',
      city: profile.city
    };

    const updatedProfile = {
      ...profile,
      marketingProfile: {
        ...profile.marketingProfile!,
        // Fix: Use the corrected variable name 'newDeal' instead of the undeclared 'newDeal'
        deals: [...existingDeals, newDeal]
      }
    };
    onUpdate(updatedProfile);
    setDealForm({ title: '', description: '', images: [] });
    alert('המבצע פורסם בהצלחה!');
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-white rounded-[60px] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col max-h-[95vh]">
        
        <div className="p-10 bg-indigo-900 text-white flex flex-col md:flex-row justify-between items-center shrink-0 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-[30px] flex items-center justify-center text-4xl">👤</div>
            <div>
              <h2 className="text-3xl font-black">{profile.firstName} {profile.lastName}</h2>
              <p className="text-indigo-200 font-bold opacity-80 text-sm">ניהול חשבון GoDog</p>
            </div>
          </div>
          <div className="flex bg-white/10 p-1.5 rounded-[24px] overflow-x-auto scrollbar-hide max-w-full">
            {[
              { id: 'PROFILE', label: 'פרופיל' },
              { id: 'PAYMENTS', label: 'תשלומים' },
              { id: 'BUSINESS', label: 'פרטי עסק', hide: !isBusiness },
              { id: 'ADVERTISING', label: 'קידום ופרסום', hide: !isBusiness },
              { id: 'DEALS', label: 'מבצעים 🎁', hide: !isBusiness },
              { id: 'LEGAL', label: 'משפטי' },
              { id: 'SAVED', label: 'מועדפים', hide: isBusiness }
            ].filter(t => !t.hide).map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-indigo-600 shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow p-12 overflow-y-auto custom-scrollbar bg-[#FDFDFF]" dir="rtl">
          
          {activeTab === 'LEGAL' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black text-indigo-900 mb-6">מסמכים ואישורים משפטיים</h3>
                  <p className="text-gray-500 font-bold mb-10">כאן תוכל לצפות בכל התנאים עליהם חתמת בעת ההצטרפות ל-GoDog.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <button onClick={() => setShowLegalType('GENERAL')} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:border-indigo-600 transition-all">
                        <div className="text-right">
                           <h4 className="font-black text-indigo-950">תנאי שימוש כלליים</h4>
                           <p className="text-[10px] text-gray-400 font-bold">אושר בתאריך {new Date(profile.registrationDate).toLocaleDateString('he-IL')}</p>
                        </div>
                        <svg className="w-6 h-6 text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                     </button>

                     <button onClick={() => setShowLegalType(profile.userRole === 'OWNER' ? 'OWNER' : 'BUSINESS')} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:border-indigo-600 transition-all">
                        <div className="text-right">
                           <h4 className="font-black text-indigo-950">נספח {profile.userRole === 'OWNER' ? 'בעלים' : 'עסקים'}</h4>
                           <p className="text-[10px] text-gray-400 font-bold">כולל התחייבויות אחריות ועמלות</p>
                        </div>
                        <svg className="w-6 h-6 text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>

                  <div className="mt-12 p-8 bg-indigo-900 rounded-[40px] text-white">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-3xl">🛡️</div>
                        <div>
                           <h4 className="text-xl font-black">הגנה משפטית מלאה</h4>
                           <p className="text-indigo-200 text-sm font-bold opacity-80">GoDog פועלת בהתאם לחוק הגנת הצרכן הישראלי (תשמ"א-1981).</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'PAYMENTS' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black text-indigo-900 mb-6">ארנק GoDog</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                     <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">אמצעי תשלום ברירת מחדל</p>
                        <div className="flex justify-between items-center">
                           <p className="font-black text-indigo-900">Visa מסתיימת ב-4492</p>
                           <button className="text-xs text-indigo-600 font-bold underline">עריכה</button>
                        </div>
                     </div>
                     <div className="bg-green-50 p-8 rounded-[32px] border border-green-100">
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">אבטחת תשלומים</p>
                        <p className="font-black text-green-800">מוגן ע"י תקן PCI-DSS ו-SSL</p>
                     </div>
                  </div>

                  <h4 className="text-xl font-black text-indigo-950 mb-6">היסטוריית עסקאות</h4>
                  <div className="space-y-4">
                     {[
                       { id: 'tx1', date: '20/05/2024', amount: 50, service: 'טיול כלבים - נועם כהן', status: 'הושלם' },
                       { id: 'tx2', date: '18/05/2024', amount: 150, service: 'פנסיון לילה - נועם כהן', status: 'הושלם' }
                     ].map(tx => (
                       <div key={tx.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-[28px] border border-gray-100">
                          <div>
                             <p className="font-black text-gray-800">{tx.service}</p>
                             <p className="text-[10px] text-gray-400 font-bold">{tx.date}</p>
                          </div>
                          <div className="text-left">
                             <p className="font-black text-indigo-600">₪{tx.amount}</p>
                             <span className="text-[9px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded uppercase">{tx.status}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'ADVERTISING' && (
            <div className="space-y-12 animate-in fade-in">
               <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm">
                  <h3 className="text-3xl font-black text-indigo-900 mb-4">תוספת "קוביית מבצעים"</h3>
                  <p className="text-gray-500 font-bold mb-8">פרסמו עד 5 מבצעים חודשיים שיופיעו בדף הבית של כל בעלי הכלבים באזורכם.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className={`p-8 rounded-[40px] border-4 transition-all flex flex-col justify-between ${profile.promotionsAddonTier === 'ANNUAL_CUBE' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-50 bg-white hover:border-indigo-100'}`}>
                        <div>
                           <h4 className="text-2xl font-black text-indigo-900 mb-2">התחייבות לשנה</h4>
                           <div className="text-4xl font-black text-orange-600 mb-6">₪{CUBE_ADDON_ANNUAL} <span className="text-sm text-gray-400">/ לחודש</span></div>
                           <ul className="text-sm font-bold text-gray-600 space-y-2 mb-8">
                              <li>✅ הופעה קבועה בקובייה המתחלפת</li>
                              <li>✅ עד 5 מבצעים בכל רגע נתון</li>
                           </ul>
                        </div>
                        <button onClick={() => handleAddonPurchase('ANNUAL')} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black">הפעל מסלול שנתי</button>
                     </div>

                     <div className={`p-8 rounded-[40px] border-4 transition-all flex flex-col justify-between ${profile.promotionsAddonTier === 'MONTHLY_CUBE' ? 'border-orange-500 bg-orange-50/20' : 'border-gray-50 bg-white hover:border-indigo-100'}`}>
                        <div>
                           <h4 className="text-2xl font-black text-indigo-900 mb-2">מסלול חודשי</h4>
                           <div className="text-4xl font-black text-orange-600 mb-6">₪{CUBE_ADDON_MONTHLY} <span className="text-sm text-gray-400">/ לחודש</span></div>
                        </div>
                        <button onClick={() => handleAddonPurchase('MONTHLY')} className="w-full bg-white border-2 border-orange-600 text-orange-600 py-4 rounded-2xl font-black">הפעל מסלול חודשי</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'BUSINESS' && (
            <div className="animate-in fade-in">
               <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm mb-8">
                  <h3 className="text-2xl font-black text-indigo-900 mb-8">ניהול דף עסקי</h3>
                  <div className="space-y-6">
                     <textarea rows={4} className="w-full bg-gray-50 border-none rounded-3xl p-6 font-bold" placeholder="תיאור העסק שלך..." />
                  </div>
               </div>
               <button onClick={handleSaveBusiness} className="bg-indigo-600 text-white px-12 py-5 rounded-[28px] font-black shadow-xl">שמור שינויים</button>
            </div>
          )}

          {activeTab === 'PROFILE' && (
             <div className="space-y-8 animate-in fade-in">
                <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm">
                   <h3 className="text-2xl font-black text-indigo-900 mb-8">פרטים אישיים</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase mb-1">שם משתמש</p>
                         <p className="text-xl font-black text-gray-800">{profile.username}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase mb-1">אימייל</p>
                         <p className="text-xl font-black text-gray-800">{profile.email}</p>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
      {showLegalType && <LegalModal type={showLegalType} onClose={() => setShowLegalType(null)} />}
    </div>
  );
};

export default PersonalArea;
