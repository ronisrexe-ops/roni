
import React, { useState } from 'react';
import { UserProfile, Dog, UserRole } from '../types';
import { DogLogo } from './Header';
import LegalModal from './LegalModal';

type AuthMode = 'LOGIN' | 'ROLE_SELECT' | 'REGISTER';

interface AuthModalProps {
  onAuthComplete: (profile: UserProfile, initialDog?: Omit<Dog, 'id'>) => void;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthComplete, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showLegalType, setShowLegalType] = useState<'OWNER' | 'BUSINESS' | 'GENERAL' | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    businessName: '',
    idNumber: '',
    dogName: '',
    dogBreed: '',
    dogAge: 1,
    dogGender: 'MALE' as 'MALE' | 'FEMALE'
  });

  const handleQuickLogin = () => {
    const demoProfile: UserProfile = {
      id: 'demo-user',
      username: 'משתמש_דמו',
      firstName: 'ישראל',
      lastName: 'ישראלי',
      email: 'demo@godog.co.il',
      city: 'תל אביב',
      isComplete: true,
      businessId: 'GD-DEMO-001',
      registrationDate: new Date().toISOString(),
      trialStartDate: new Date().toISOString(),
      subscriptionStatus: 'TRIAL',
      promotionTier: 'FREE',
      userRole: 'OWNER',
      collaborators: []
    };
    onAuthComplete(demoProfile);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setMode('REGISTER');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'LOGIN') {
      handleQuickLogin();
      return;
    }

    if (!agreedToTerms) {
      alert('יש לאשר את תנאי השימוש כדי להמשיך');
      return;
    }

    const profile: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      username: formData.username || formData.email.split('@')[0],
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      city: formData.city,
      businessName: formData.businessName,
      idNumber: formData.idNumber,
      isComplete: true,
      businessId: `GD-${selectedRole?.[0]}-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationDate: new Date().toISOString(),
      trialStartDate: new Date().toISOString(),
      subscriptionStatus: 'TRIAL',
      promotionTier: 'FREE',
      userRole: selectedRole || 'OWNER',
      collaborators: []
    };

    let initialDog: Omit<Dog, 'id'> | undefined = undefined;
    if (selectedRole === 'OWNER') {
      initialDog = {
        name: formData.dogName,
        breed: formData.dogBreed,
        age: formData.dogAge,
        gender: formData.dogGender,
        notes: '',
        media: []
      };
    }

    localStorage.setItem('godog_user_role', selectedRole || 'OWNER');
    onAuthComplete(profile, initialDog);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl">
      <div className="bg-white rounded-[60px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-500 max-h-[95vh]">
        
        <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white p-4 rounded-[32px] w-fit mb-8 shadow-2xl scale-110">
              <DogLogo />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter">GoDog</h2>
            <p className="text-indigo-100 font-bold text-xl leading-tight">הבית המוגן של החבר הכי טוב שלך</p>
          </div>
          <div className="mt-8 space-y-4 relative z-10 hidden md:block">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">משפטי ומאובטח</p>
               <p className="text-sm font-bold">הפלטפורמה מגנה על פרטיותך ופועלת בהתאם לחוק הגנת הצרכן והנחיות משרד החקלאות.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full translate-x-20 -translate-y-20 blur-3xl opacity-20"></div>
        </div>

        <div className="md:w-2/3 p-10 md:p-14 overflow-y-auto custom-scrollbar bg-[#FDFDFF]" dir="rtl">
          {mode === 'LOGIN' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-indigo-950">שלום שוב</h3>
                <button onClick={() => setMode('ROLE_SELECT')} className="text-indigo-600 font-black text-sm hover:underline bg-indigo-50 px-6 py-2 rounded-xl">יצירת חשבון</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <input type="text" placeholder="אימייל או שם משתמש" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm" />
                 <input type="password" placeholder="סיסמה" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm" />
                 <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[28px] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all">כניסה</button>
              </form>
              <button onClick={handleQuickLogin} className="w-full bg-indigo-50 text-indigo-600 py-5 rounded-[28px] font-black text-lg border-2 border-indigo-100 mt-4">כניסה מהירה לדמו ✨</button>
            </div>
          )}

          {mode === 'ROLE_SELECT' && (
            <div className="space-y-6 animate-in fade-in">
               <h3 className="text-3xl font-black text-indigo-950">איך תשתמשו ב-GoDog?</h3>
               <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleRoleSelect('OWNER')} className="group bg-white border-2 border-indigo-50 p-6 rounded-[32px] text-right hover:border-indigo-600 transition-all flex items-center gap-6">
                     <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl">🐕</div>
                     <div><h4 className="text-xl font-black text-indigo-950">בעל כלב פרטי</h4></div>
                  </button>
                  <button onClick={() => handleRoleSelect('WALKER')} className="group bg-white border-2 border-indigo-50 p-6 rounded-[32px] text-right hover:border-indigo-600 transition-all flex items-center gap-6">
                     <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl">🚶</div>
                     <div><h4 className="text-xl font-black text-indigo-950">דוג-ווקר / פנסיון</h4></div>
                  </button>
                  <button onClick={() => handleRoleSelect('PROFESSIONAL')} className="group bg-white border-2 border-indigo-50 p-6 rounded-[32px] text-right hover:border-indigo-600 transition-all flex items-center gap-6">
                     <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl">🩺</div>
                     <div><h4 className="text-xl font-black text-indigo-950">בעל מקצוע (וטרינר/מאלף)</h4></div>
                  </button>
                  <button onClick={() => handleRoleSelect('STORE_OWNER')} className="group bg-white border-2 border-indigo-50 p-6 rounded-[32px] text-right hover:border-indigo-600 transition-all flex items-center gap-6">
                     <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">📦</div>
                     <div><h4 className="text-xl font-black text-indigo-950">בעל חנות / ספק ציוד</h4></div>
                  </button>
               </div>
               <button onClick={() => setMode('LOGIN')} className="text-indigo-400 font-black text-sm">חזרה לכניסה</button>
            </div>
          )}

          {mode === 'REGISTER' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-left-4">
               <h3 className="text-3xl font-black text-indigo-950">פרטי הרשמה</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="שם פרטי" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm" />
                  <input type="text" required placeholder="שם משפחה" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm" />
                  <input type="email" required placeholder="אימייל" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm md:col-span-2" />
                  <input type="password" required placeholder="סיסמה" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm md:col-span-2" />
                  <input type="text" required placeholder="עיר מגורים" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold shadow-sm md:col-span-2" />
                  
                  {selectedRole === 'OWNER' ? (
                     <div className="md:col-span-2 pt-4 border-t border-gray-100 space-y-4">
                        <h4 className="font-black text-indigo-900">פרטי הכלב הראשון</h4>
                        <input type="text" required placeholder="שם הכלב" value={formData.dogName} onChange={e => setFormData({...formData, dogName: e.target.value})} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-6 py-4 font-bold" />
                        <input type="text" required placeholder="גזע" value={formData.dogBreed} onChange={e => setFormData({...formData, dogBreed: e.target.value})} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-6 py-4 font-bold" />
                     </div>
                  ) : (
                     <div className="md:col-span-2 pt-4 border-t border-gray-100 space-y-4">
                        <h4 className="font-black text-indigo-900">פרטי עסק (עבור 6 חודשי חינם)</h4>
                        <input type="text" required placeholder="שם העסק הרשום" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-6 py-4 font-bold" />
                        <input type="text" required placeholder="ח.פ / עוסק מורשה" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-6 py-4 font-bold" />
                     </div>
                  )}

                  <div className="md:col-span-2 bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4">
                     <input 
                        type="checkbox" 
                        id="terms" 
                        checked={agreedToTerms} 
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        className="w-6 h-6 mt-1 rounded-lg text-indigo-600 focus:ring-indigo-500"
                     />
                     <label htmlFor="terms" className="text-sm font-bold text-indigo-900 leading-relaxed">
                        אני מאשר/ת שקראתי והסכמתי ל
                        <button type="button" onClick={() => setShowLegalType('GENERAL')} className="underline mx-1">תנאי השימוש</button>
                        ול
                        <button type="button" onClick={() => setShowLegalType(selectedRole === 'OWNER' ? 'OWNER' : 'BUSINESS')} className="underline mx-1">
                           נספח {selectedRole === 'OWNER' ? 'בעלים' : 'עסקים'}
                        </button>
                        של GoDog. אני מצהיר/ה שכל המידע שמסרתי נכון.
                     </label>
                  </div>
               </div>
               <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[28px] font-black text-xl shadow-xl">סיום והרשמה</button>
            </form>
          )}
        </div>
      </div>
      {showLegalType && <LegalModal type={showLegalType} onClose={() => setShowLegalType(null)} />}
    </div>
  );
};

export default AuthModal;
