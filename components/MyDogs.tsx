
import React, { useState, useRef } from 'react';
import { Dog } from '../types';

interface MyDogsProps {
  title: string;
  dogs: Dog[];
  onAddDog: (dog: Omit<Dog, 'id'>) => void;
  onDeleteDog: (id: string) => void;
  onSelectDog: (dog: Dog) => void;
  onOpenReminders: (dogId: string) => void;
}

const MyDogs: React.FC<MyDogsProps> = ({ title, dogs, onAddDog, onDeleteDog, onSelectDog, onOpenReminders }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDog, setNewDog] = useState({ 
    name: '', breed: '', age: 1, gender: 'MALE' as const, notes: '', media: [], profileImage: '' 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDog({ ...newDog, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDog.name || !newDog.breed) return;
    onAddDog(newDog as any);
    setNewDog({ name: '', breed: '', age: 1, gender: 'MALE', notes: '', media: [], profileImage: '' });
    setShowAdd(false);
  };

  return (
    <section className="animate-in fade-in slide-in-from-top-4 duration-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 px-4 py-2 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-indigo-950 tracking-tight">{title}</h2>
          <p className="text-gray-400 font-bold mt-0.5 text-sm">נהלו את עולמו של הכלב במקום אחד</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="group bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-2.5 rounded-full font-black text-xs hover:bg-indigo-600 hover:text-white shadow-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          הוסף כלב חדש
        </button>
      </div>

      <div className="flex-grow">
        {showAdd && (
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border-2 border-indigo-50 mb-10 animate-in zoom-in duration-300">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 bg-indigo-50 rounded-[40px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-all overflow-hidden relative group shrink-0 shadow-inner"
                >
                  {newDog.profileImage ? (
                    <img src={newDog.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-[9px] font-black text-indigo-400 mt-2 uppercase tracking-widest text-center px-2">העלאת תמונה</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mr-2">שם הכלב</label>
                    <input type="text" required value={newDog.name} onChange={e => setNewDog({...newDog, name: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mr-2">גזע</label>
                    <input type="text" required value={newDog.breed} onChange={e => setNewDog({...newDog, breed: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mr-2">גיל</label>
                    <input type="number" required value={newDog.age} onChange={e => setNewDog({...newDog, age: parseInt(e.target.value)})} className="w-full bg-gray-50 p-4 rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mr-2">מין</label>
                    <select value={newDog.gender} onChange={e => setNewDog({...newDog, gender: e.target.value as any})} className="w-full bg-gray-50 p-4 rounded-2xl font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner appearance-none">
                      <option value="MALE">זכר</option>
                      <option value="FEMALE">נקבה</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-4 text-gray-400 font-black text-sm">ביטול</button>
                <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-full font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95">שמור כלב</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          {dogs.map(dog => (
            <div 
              key={dog.id} 
              className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden h-36"
              onClick={() => onSelectDog(dog)}
            >
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center text-indigo-500 overflow-hidden shadow-inner border-4 border-white shrink-0 group-hover:scale-105 transition-transform">
                  {dog.profileImage ? (
                    <img src={dog.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{dog.gender === 'FEMALE' ? '🐩' : '🐕'}</span>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{dog.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${dog.gender === 'FEMALE' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                          {dog.gender === 'FEMALE' ? 'נקבה' : 'זכר'}
                      </span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold mb-3">{dog.breed} • בן {dog.age}</p>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); onOpenReminders(dog.id); }}
                    className="w-fit bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    תזכורות
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteDog(dog.id); }}
                    className="text-gray-100 hover:text-rose-500 p-2 rounded-full transition-all group-hover:opacity-100 opacity-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="bg-gray-50 p-2.5 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </div>
              </div>
            </div>
          ))}
          {dogs.length === 0 && (
            <div className="col-span-full bg-white border-2 border-dashed border-indigo-100 rounded-[50px] p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🐕</div>
              <p className="text-indigo-900 font-black text-xl mb-1">עדיין אין לכם כלבים באפליקציה</p>
              <p className="text-gray-400 font-bold mb-8 text-sm">הוסיפו את הכלב הראשון כדי להתחיל לנהל את עולמו</p>
              <button onClick={() => setShowAdd(true)} className="text-indigo-600 font-black underline hover:text-indigo-800 transition-colors">הוסף עכשיו</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyDogs;
