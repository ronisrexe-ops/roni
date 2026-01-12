
import React, { useState } from 'react';
import { DogReminder, Dog, UserProfile, SavedProfessional } from '../types';

interface RemindersCenterProps {
  dogs: Dog[];
  profile: UserProfile;
  onClose: () => void;
  onAddReminder: (reminder: Omit<DogReminder, 'id'>) => void;
  reminders: DogReminder[];
  initialDogId?: string;
}

const RemindersCenter: React.FC<RemindersCenterProps> = ({ dogs, profile, onClose, onAddReminder, reminders, initialDogId }) => {
  const [activeDogFilter, setActiveDogFilter] = useState<string>(initialDogId || 'ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRem, setNewRem] = useState({
    dogId: initialDogId || dogs[0]?.id || '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    note: '',
    professionalId: '',
    alertTimeMinutes: 10,
    category: 'GENERAL' as const,
    icon: '🔔'
  });

  const filteredReminders = activeDogFilter === 'ALL' 
    ? reminders 
    : reminders.filter(r => r.dogId === activeDogFilter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReminder(newRem);
    setShowAddForm(false);
    alert('תזכורת נוספה בהצלחה!');
  };

  const alertOptions = [
    { val: 0, label: 'בדיוק בזמן' },
    { val: 5, label: '5 דקות לפני' },
    { val: 10, label: '10 דקות לפני' },
    { val: 30, label: '30 דקות לפני' },
    { val: 60, label: 'שעה לפני' },
    { val: 1440, label: 'יום לפני' }
  ];

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-white rounded-[60px] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        <div className="p-10 bg-indigo-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-3xl">🗓️</div>
            <div>
              <h3 className="text-3xl font-black">יומן ותזכורות</h3>
              <p className="text-indigo-200 font-bold opacity-80">ניהול סדר היום של הכלבים</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="bg-gray-50 p-6 flex flex-col md:flex-row items-center justify-between border-b border-gray-100 shrink-0 gap-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full">
            <button 
              onClick={() => setActiveDogFilter('ALL')}
              className={`px-6 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${activeDogFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400'}`}
            >
              כולם
            </button>
            {dogs.map(d => (
              <button 
                key={d.id}
                onClick={() => setActiveDogFilter(d.id)}
                className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 whitespace-nowrap ${activeDogFilter === d.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400'}`}
              >
                {d.profileImage && <img src={d.profileImage} className="w-5 h-5 rounded-full object-cover" />}
                {d.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 whitespace-nowrap w-full md:w-auto"
          >
            + תזכורת חדשה
          </button>
        </div>

        <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
          {showAddForm ? (
            <form onSubmit={handleAdd} className="space-y-8 bg-indigo-50/50 p-8 rounded-[40px] border border-indigo-100 animate-in slide-in-from-top-4" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">עבור איזה כלב?</label>
                  <select value={newRem.dogId} onChange={e => setNewRem({...newRem, dogId: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm outline-none">
                    {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">מה עושים? (כותרת)</label>
                  <input type="text" required placeholder="למשל: חיסון שנתי" value={newRem.title} onChange={e => setNewRem({...newRem, title: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">יום</label>
                    <input type="date" required value={newRem.date} onChange={e => setNewRem({...newRem, date: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">שעה</label>
                    <input type="time" required value={newRem.time} onChange={e => setNewRem({...newRem, time: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">התראה לפני</label>
                  <select value={newRem.alertTimeMinutes} onChange={e => setNewRem({...newRem, alertTimeMinutes: parseInt(e.target.value)})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm">
                    {alertOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">שיוך איש מקצוע (מועדפים)</label>
                  <select value={newRem.professionalId} onChange={e => setNewRem({...newRem, professionalId: e.target.value})} className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm">
                    <option value="">ללא איש מקצוע</option>
                    {(profile.savedProfessionals || []).map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-2 mr-2">הערה אישית</label>
                  <textarea value={newRem.note} onChange={e => setNewRem({...newRem, note: e.target.value})} rows={2} placeholder="הוסף הערות כאן..." className="w-full bg-white p-4 rounded-2xl font-bold shadow-sm" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-grow bg-indigo-600 text-white py-5 rounded-3xl font-black shadow-xl">שמור תזכורת</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="bg-white text-gray-400 px-8 py-5 rounded-3xl font-black">ביטול</button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {filteredReminders.map(rem => {
                const dog = dogs.find(d => d.id === rem.dogId);
                const pro = profile.savedProfessionals?.find(p => p.id === rem.professionalId);
                return (
                  <div key={rem.id} className="bg-white p-8 rounded-[44px] border border-gray-100 flex items-center justify-between shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl overflow-hidden shadow-inner">
                        {dog?.profileImage ? <img src={dog.profileImage} className="w-full h-full object-cover" /> : rem.icon}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 leading-tight">{rem.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                           <p className="text-xs font-bold text-indigo-600">עבור: {dog?.name || 'לא ידוע'}</p>
                           <p className="text-xs font-bold text-gray-400">🕒 {rem.date} | {rem.time}</p>
                           {pro && <p className="text-xs font-bold text-green-600">👨‍⚕️ עם: {pro.name}</p>}
                        </div>
                        {rem.note && <p className="text-xs text-gray-500 mt-2 italic">"{rem.note}"</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                       <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                         התראה: {alertOptions.find(o => o.val === rem.alertTimeMinutes)?.label}
                       </span>
                       <button className="text-red-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  </div>
                );
              })}
              {filteredReminders.length === 0 && (
                <div className="py-20 text-center bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-4 opacity-10">📅</div>
                  <p className="text-gray-400 font-bold text-xl">אין תזכורות קרובות לכלב זה.</p>
                  <button onClick={() => setShowAddForm(true)} className="mt-6 text-indigo-600 font-black text-sm underline">הוסף תזכורת ראשונה</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemindersCenter;
