
import React, { useState } from 'react';
import { Booking, UserRole, Walker, Deal } from '../types';
import { MOCK_WALKERS, BUSINESS_PROMOTION_MONTHLY, PLATFORM_COMMISSION_RATE } from '../constants';

interface AdminDashboardProps {
  bookings: Booking[];
  callLogs: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'FINANCIAL' | 'STORES' | 'PROFESSIONALS' | 'TAX'>('FINANCIAL');
  const [selectedBusiness, setSelectedBusiness] = useState<Walker | null>(null);

  const platformFees = bookings.reduce((s, b) => s + b.platformFee, 0);
  
  const stores = MOCK_WALKERS.filter(w => w.role === 'STORE_OWNER');
  const professionals = MOCK_WALKERS.filter(w => ['WALKER', 'PROFESSIONAL'].includes(w.role));

  const storeRevenue = stores.length * BUSINESS_PROMOTION_MONTHLY;
  const proRevenue = professionals.length * BUSINESS_PROMOTION_MONTHLY;
  const addonRevenue = MOCK_WALKERS.filter(w => w.marketingProfile?.deals?.length).length * 80;
  const ownerSubscriptionsRevenue = 8450.00; 

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[60px] shadow-2xl p-20 animate-in zoom-in">
        <div className="bg-indigo-600 p-8 rounded-full text-white mb-10 shadow-2xl">
           <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-4xl font-black text-indigo-950 mb-8 text-center">ניהול מערכת GoDog</h2>
        <input 
          type="password" autoFocus
          value={adminPassword}
          onChange={e => setAdminPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && adminPassword === 'admin' && setIsAuthenticated(true)}
          placeholder="סיסמת מנהל"
          className="w-full max-w-sm bg-gray-50 border-2 border-indigo-100 rounded-3xl px-8 py-5 text-center font-black text-xl mb-6 outline-none focus:border-indigo-600 transition-all"
        />
        <button onClick={() => adminPassword === 'admin' ? setIsAuthenticated(true) : alert('טעות')} className="w-full max-w-sm bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg">כניסה מאובטחת</button>
      </div>
    );
  }

  const renderBusinessTable = (data: typeof MOCK_WALKERS) => (
    <div className="bg-white rounded-[44px] overflow-hidden border border-gray-100 shadow-sm animate-in fade-in duration-500">
       <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
             <tr>
                <th className="p-8">שם העסק</th>
                <th className="p-8">עיר</th>
                <th className="p-8">מסלול</th>
                <th className="p-8">מבצעים</th>
                <th className="p-8">עמלות (20%)</th>
                <th className="p-8">פעולות</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {data.map(w => {
                const businessBookings = bookings.filter(b => b.walkerId === w.id);
                const totalFees = businessBookings.reduce((sum, b) => sum + b.platformFee, 0);
                return (
                  <tr key={w.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-8">
                        <div className="font-black text-gray-900">{w.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{w.businessId}</div>
                      </td>
                      <td className="p-8 font-bold text-gray-500">{w.city}</td>
                      <td className="p-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${w.isPromoted ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                            {w.isPromoted ? 'PREMIUM' : 'BASIC'}
                        </span>
                      </td>
                      <td className="p-8">
                         <span className={`font-black ${w.marketingProfile?.deals?.length ? 'text-orange-600' : 'text-gray-300'}`}>
                           {w.marketingProfile?.deals?.length || 0}
                         </span>
                      </td>
                      <td className="p-8 font-black text-indigo-600">₪{totalFees.toFixed(2)}</td>
                      <td className="p-8">
                         <button 
                            onClick={() => setSelectedBusiness(w)}
                            className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                         >
                            ניהול חשבון
                         </button>
                      </td>
                  </tr>
                );
             })}
          </tbody>
       </table>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div>
           <h2 className="text-4xl font-black text-indigo-900 leading-tight">מרכז הבקרה GoDog</h2>
           <p className="text-gray-400 font-bold">מבט על הכנסות וניהול ספקים</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl overflow-x-auto max-w-full scrollbar-hide">
           {[
             { id: 'FINANCIAL', label: 'סקירה פיננסית' },
             { id: 'STORES', label: 'חנויות וספקים' },
             { id: 'PROFESSIONALS', label: 'בעלי מקצוע' },
             { id: 'TAX', label: 'דוחות מס' }
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setActiveTab(t.id as any)}
               className={`px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-indigo-600'}`}
             >
               {t.label}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'FINANCIAL' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-indigo-600 p-10 rounded-[50px] text-white shadow-2xl col-span-full md:col-span-1 flex flex-col justify-between overflow-hidden relative">
                 <div className="relative z-10">
                    <h4 className="text-indigo-200 text-[10px] font-black uppercase mb-2 tracking-widest opacity-80">סה"כ הכנסות (ברוטו)</h4>
                    <p className="text-6xl font-black">₪{(platformFees + storeRevenue + proRevenue + addonRevenue + ownerSubscriptionsRevenue).toFixed(0)}</p>
                 </div>
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex flex-col justify-between">
                 <div>
                    <h4 className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-widest">מנויי בעלים (PRO)</h4>
                    <p className="text-4xl font-black text-indigo-900">₪{ownerSubscriptionsRevenue.toFixed(0)}</p>
                 </div>
                 <div className="flex items-center gap-2 text-green-500 text-[10px] font-black">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    +12% חודשי
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm flex flex-col justify-between">
                 <div>
                    <h4 className="text-gray-400 text-[10px] font-black uppercase mb-4 tracking-widest">עמלות טיולים (20%)</h4>
                    <p className="text-4xl font-black text-indigo-900">₪{platformFees.toFixed(2)}</p>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 mt-4">מבוסס על {bookings.length} עסקאות</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h4 className="text-gray-400 text-[10px] font-black uppercase mb-2">דמי פרסום - חנויות</h4>
                 <p className="text-3xl font-black text-gray-900">₪{storeRevenue}</p>
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                 <h4 className="text-gray-400 text-[10px] font-black uppercase mb-2">דמי פרסום - בעלי מקצוע</h4>
                 <p className="text-3xl font-black text-gray-900">₪{proRevenue}</p>
              </div>
              <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 shadow-sm">
                 <h4 className="text-orange-600 text-[10px] font-black uppercase mb-2">תוספת קוביית מבצעים</h4>
                 <p className="text-3xl font-black text-orange-600">₪{addonRevenue}</p>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'STORES' && renderBusinessTable(stores)}
      {activeTab === 'PROFESSIONALS' && renderBusinessTable(professionals)}

      {/* Business Management Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-xl" onClick={() => setSelectedBusiness(null)} />
          <div className="bg-white rounded-[60px] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col max-h-[90vh]">
             <div className="p-10 bg-indigo-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-3xl">⚙️</div>
                   <div>
                      <h3 className="text-3xl font-black">{selectedBusiness.name} - ניהול חשבון</h3>
                      <p className="text-indigo-300 font-bold">מזהה פנימי: {selectedBusiness.businessId}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedBusiness(null)} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>

             <div className="flex-grow p-12 overflow-y-auto custom-scrollbar" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                   {/* Left Col: Actions & Status */}
                   <div className="md:col-span-4 space-y-6">
                      <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                         <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">סטטוס וקידום</h4>
                         <div className="space-y-4">
                            <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${selectedBusiness.isPromoted ? 'bg-yellow-400 text-indigo-900 shadow-xl' : 'bg-white text-gray-400 border border-gray-200'}`}>
                               עסק PREMIUM ✨
                            </button>
                            <button className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-black text-sm hover:border-indigo-600 transition-all">
                               הפוך לעסק רגיל (Basic)
                            </button>
                            <button className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all">
                               חסימת חשבון (Suspend)
                            </button>
                         </div>
                      </div>

                      <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
                         <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">פרטי העברה בנקאית</h4>
                         <div className="space-y-2 text-sm">
                            <p className="font-black text-indigo-900">בנק: <span className="font-bold opacity-60">הפועלים (12)</span></p>
                            <p className="font-black text-indigo-900">סניף: <span className="font-bold opacity-60">780</span></p>
                            <p className="font-black text-indigo-900">חשבון: <span className="font-bold opacity-60">123456789</span></p>
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Ledger & Deals */}
                   <div className="md:col-span-8 space-y-10">
                      <div className="bg-white border border-gray-100 rounded-[44px] p-10 shadow-sm">
                         <h4 className="text-xl font-black text-indigo-950 mb-6">פירוט עמלות אחרונות (20%)</h4>
                         <div className="space-y-4">
                            {bookings.filter(b => b.walkerId === selectedBusiness.id).slice(0, 3).map(b => (
                               <div key={b.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                  <div>
                                     <p className="font-black text-gray-800">{b.dogName} - {b.serviceType}</p>
                                     <p className="text-[10px] text-gray-400 font-bold">{new Date(b.startTime).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-left">
                                     <p className="font-black text-indigo-600">₪{b.platformFee.toFixed(2)} עמלה</p>
                                     <p className="text-[10px] text-gray-400 font-bold">סכום עסקה: ₪{b.totalAmount}</p>
                                  </div>
                               </div>
                            ))}
                            {bookings.filter(b => b.walkerId === selectedBusiness.id).length === 0 && (
                               <p className="text-gray-400 italic text-center py-6">טרם בוצעו עסקאות דרך הפלטפורמה.</p>
                            )}
                         </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-[44px] p-10 shadow-sm">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-black text-indigo-950">מבצעים פעילים בקובייה</h4>
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black">
                                {selectedBusiness.marketingProfile?.deals?.length || 0} מתוך 5
                            </span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedBusiness.marketingProfile?.deals?.map((deal: Deal) => (
                               <div key={deal.id} className="flex items-center justify-between p-4 border border-orange-50 rounded-2xl group">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-lg">🎁</div>
                                     <p className="font-black text-sm text-gray-800">{deal.title}</p>
                                  </div>
                                  <button className="text-rose-300 hover:text-rose-600 transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-10 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/50">
                <button onClick={() => setSelectedBusiness(null)} className="px-8 py-4 text-gray-400 font-black">סגור חלון</button>
                <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">שמור שינויי מנהל</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
