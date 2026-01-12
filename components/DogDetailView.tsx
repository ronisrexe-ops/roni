
import React, { useState } from 'react';
import { Dog, DogMedia, DogAlbum } from '../types';
import { generateDogPortrait, getDogAdvice } from '../services/gemini';

interface DogDetailViewProps {
  dog: Dog;
  onUpdate: (dog: Dog) => void;
  onClose: () => void;
}

const DogDetailView: React.FC<DogDetailViewProps> = ({ dog, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'MEDIA' | 'NOTES' | 'ALBUMS'>('INFO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);

  const handleAiPortrait = async () => {
    setIsGenerating(true);
    const portraitUrl = await generateDogPortrait(dog.breed, dog.name);
    if (portraitUrl) {
      const newMedia: DogMedia = {
        id: 'ai-' + Date.now(),
        type: 'IMAGE',
        url: portraitUrl,
        date: new Date().toISOString()
      };
      onUpdate({ ...dog, media: [newMedia, ...(dog.media || [])] });
      alert('פורטרט ה-AI שלך מוכן!');
    }
    setIsGenerating(false);
  };

  const generateMonthlyAlbum = async () => {
    setIsAlbumLoading(true);
    const now = new Date();
    const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    const currentMonthName = months[now.getMonth()];
    
    // Filter media from current month
    const currentMonthMedia = (dog.media || []).filter(m => {
        const d = new Date(m.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    if (currentMonthMedia.length < 2) {
        alert('צריך לפחות 2 תמונות מהחודש האחרון כדי לייצר אלבום רגעים!');
        setIsAlbumLoading(false);
        return;
    }

    const aiSummary = await getDogAdvice(`ייצר תיאור רגשי קצר (עד 20 מילים) עבור אלבום תמונות חודשי של כלב בשם ${dog.name}. ציין שהחודש היה מלא באהבה ורגעים יפים.`);

    const newAlbum: DogAlbum = {
        id: Math.random().toString(36).substr(2, 9),
        title: `הרגעים היפים של ${dog.name}`,
        month: currentMonthName,
        year: now.getFullYear(),
        aiSummary: aiSummary || `סיכום נפלא של חודש ${currentMonthName}`,
        mediaIds: currentMonthMedia.map(m => m.id),
        createdAt: now.toISOString()
    };

    onUpdate({ ...dog, albums: [newAlbum, ...(dog.albums || [])] });
    setIsAlbumLoading(false);
    alert(`אלבום ${currentMonthName} נוצר בהצלחה!`);
  };

  const addMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMedia: DogMedia = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.includes('video') ? 'VIDEO' : 'IMAGE',
          url: reader.result as string,
          date: new Date().toISOString()
        };
        onUpdate({ ...dog, media: [newMedia, ...(dog.media || [])] });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-white rounded-[60px] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col max-h-[90vh]">
        
        <div className="h-64 relative shrink-0">
          <img 
            src={dog.media?.[0]?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000'} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-8 left-8 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-8 right-10 text-white">
            <h2 className="text-5xl font-black mb-2">{dog.name}</h2>
            <div className="flex gap-4">
               <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-black backdrop-blur-md">{dog.breed}</span>
               <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-black backdrop-blur-md">בן {dog.age}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 flex border-b border-gray-100 overflow-x-auto">
          {['INFO', 'MEDIA', 'ALBUMS', 'NOTES'].map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`flex-grow py-5 px-6 font-black text-sm transition-all whitespace-nowrap ${activeTab === t ? 'bg-white text-indigo-600 border-b-4 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t === 'INFO' ? 'פרטים רפואיים' : t === 'MEDIA' ? 'אלבום תמונות' : t === 'ALBUMS' ? 'זכרונות חודשיים' : 'הערות ויומן'}
            </button>
          ))}
        </div>

        <div className="flex-grow p-12 overflow-y-auto custom-scrollbar">
          {activeTab === 'ALBUMS' && (
              <div className="space-y-12 animate-in fade-in duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-indigo-50 p-10 rounded-[40px] border border-indigo-100">
                      <div className="max-w-md">
                          <h3 className="text-2xl font-black text-indigo-900 mb-2">אלבום רגעים אוטומטי</h3>
                          <p className="text-indigo-600/70 font-bold">GoDog AI אוסף את כל הרגעים היפים של {dog.name} מהחודש האחרון ומייצר עבורכם מזכרת מרגשת.</p>
                      </div>
                      <button 
                        onClick={generateMonthlyAlbum}
                        disabled={isAlbumLoading}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                      >
                        {isAlbumLoading ? 'מייצר קסם...' : (
                            <>
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                             ייצר אלבום חודשי עכשיו
                            </>
                        )}
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(dog.albums || []).map(album => (
                          <div key={album.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                              <div className="h-48 relative bg-gray-100 flex gap-1 p-1">
                                  {album.mediaIds.slice(0, 3).map(mid => {
                                      const m = dog.media.find(x => x.id === mid);
                                      return m ? <img key={mid} src={m.url} className="flex-grow h-full object-cover rounded-2xl" /> : null;
                                  })}
                                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
                                  <div className="absolute bottom-6 right-6 text-white">
                                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{album.month} {album.year}</p>
                                      <h4 className="text-xl font-black">{album.title}</h4>
                                  </div>
                              </div>
                              <div className="p-8">
                                  <p className="text-gray-600 font-bold italic leading-relaxed">"{album.aiSummary}"</p>
                                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                                      <span className="text-xs font-black text-indigo-400">{album.mediaIds.length} רגעים נשמרו</span>
                                      <button className="text-indigo-600 font-black text-sm hover:underline">צפייה באלבום מלא</button>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {(dog.albums || []).length === 0 && (
                          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                             <div className="text-5xl mb-4 opacity-20">📸</div>
                             <p className="text-gray-400 font-bold">כאן יופיעו האלבומים החודשיים שלכם. <br/>העלו עוד תמונות כדי להתחיל!</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'INFO' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-300">
                <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
                   <h3 className="text-xl font-black text-indigo-900 mb-6 flex items-center gap-3">
                      <span className="text-2xl">📋</span> פרטי זיהוי
                   </h3>
                   <div className="space-y-6">
                      <div>
                         <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">מספר רישיון עירוני</label>
                         <input 
                           type="text" 
                           value={dog.licenseNumber || ''} 
                           onChange={e => onUpdate({...dog, licenseNumber: e.target.value})}
                           className="w-full bg-white border-none rounded-xl px-4 py-3 font-black text-indigo-900 shadow-sm"
                           placeholder="הזן מספר רישיון..."
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">וטרינר קבוע</label>
                         <input 
                           type="text" 
                           value={dog.vetName || ''} 
                           onChange={e => onUpdate({...dog, vetName: e.target.value})}
                           className="w-full bg-white border-none rounded-xl px-4 py-3 font-black text-indigo-900 shadow-sm"
                           placeholder="שם הווטרינר..."
                         />
                      </div>
                   </div>
                </div>

                <div className="bg-rose-50 p-8 rounded-[40px] border border-rose-100 flex flex-col items-center justify-center text-center">
                   <div className="text-6xl mb-4">✨</div>
                   <h3 className="text-2xl font-black text-rose-900 mb-2">צייר AI לכלב שלך</h3>
                   <p className="text-rose-700 text-sm font-bold opacity-80 mb-6">צרו פורטרט אמנותי מרהיב של {dog.name} בעזרת בינה מלאכותית</p>
                   <button 
                    onClick={handleAiPortrait}
                    disabled={isGenerating}
                    className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
                   >
                     {isGenerating ? 'הצייר עובד...' : 'צור פורטרט אמנותי'}
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'MEDIA' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-indigo-900">האלבום של {dog.name}</h3>
                   <label className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black cursor-pointer shadow-xl hover:bg-indigo-700 flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      הוסף תמונות / סרטון
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={addMedia} />
                   </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {(dog.media || []).map(m => (
                      <div key={m.id} className="aspect-square rounded-[32px] overflow-hidden bg-gray-100 relative group border-4 border-white shadow-md">
                         {m.type === 'IMAGE' ? (
                            <img src={m.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                         ) : (
                            <video src={m.url} className="w-full h-full object-cover" />
                         )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-black">{new Date(m.date).toLocaleDateString()}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'NOTES' && (
             <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-indigo-900 mb-6">יומן חוויות והערות</h3>
                <textarea 
                  value={dog.notes}
                  onChange={e => onUpdate({...dog, notes: e.target.value})}
                  rows={10}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[40px] p-10 font-bold text-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="כתבו כאן כל מה שחשוב לזכור על הכלב שלכם..."
                />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogDetailView;
