
import React, { useState } from 'react';
import { UserProfile, Dog } from '../types';

interface ProfileModalProps {
  onSave: (profile: UserProfile, initialDog: Omit<Dog, 'id'>) => void;
  onClose: () => void;
  initialProfile?: UserProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onSave, onClose, initialProfile }) => {
  const [formData, setFormData] = useState({
    firstName: initialProfile?.firstName || '',
    lastName: initialProfile?.lastName || '',
    email: initialProfile?.email || '',
    city: initialProfile?.city || '',
    dogName: '',
    dogBreed: '',
    dogAge: 1,
    dogGender: 'MALE' as 'MALE' | 'FEMALE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serialId = `GD-O-${Math.floor(1000 + Math.random() * 9000)}`;

    // Fix: Add trialStartDate and userRole which are required properties in UserProfile
    const profile: UserProfile = {
      id: initialProfile?.id || Math.random().toString(36).substr(2, 9),
      username: initialProfile?.username || formData.email.split('@')[0] || 'user',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      city: formData.city,
      isComplete: true,
      businessId: serialId,
      registrationDate: initialProfile?.registrationDate || new Date().toISOString(),
      trialStartDate: initialProfile?.trialStartDate || new Date().toISOString(),
      subscriptionStatus: 'TRIAL',
      // Added missing mandatory promotionTier and userRole
      promotionTier: 'FREE',
      userRole: initialProfile?.userRole || 'OWNER',
    };

    const initialDog: Omit<Dog, 'id'> = {
      name: formData.dogName,
      breed: formData.dogBreed,
      age: formData.dogAge,
      gender: formData.dogGender,
      notes: '',
      media: []
    };

    onSave(profile, initialDog);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-500">
        <div className="p-10 bg-indigo-600 text-white relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-3xl font-black">ברוכים הבאים ל-GoDog</h3>
              <p className="text-indigo-100 font-bold opacity-80">בואו נכיר אתכם ואת הכלב שלכם</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar" dir="rtl">
          <section>
            <h4 className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">פרטי בעלים</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">שם פרטי</label>
                <input 
                  type="text" required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="ישראל"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">שם משפחה</label>
                <input 
                  type="text" required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="ישראלי"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">כתובת מייל (לסנכרון יומן)</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">פרטי הכלב</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">שם הכלב</label>
                <input 
                  type="text" required
                  value={formData.dogName}
                  onChange={e => setFormData({...formData, dogName: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="שם הכלב"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">גזע</label>
                <input 
                  type="text" required
                  value={formData.dogBreed}
                  onChange={e => setFormData({...formData, dogBreed: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="למשל: גולדן רטריבר"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">מין הכלב</label>
                <select 
                  value={formData.dogGender}
                  onChange={e => setFormData({...formData, dogGender: e.target.value as any})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                >
                  <option value="MALE">זכר</option>
                  <option value="FEMALE">נקבה</option>
                </select>
              </div>
            </div>
          </section>

          <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
            הרשמה והמשך לאפליקציה
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
