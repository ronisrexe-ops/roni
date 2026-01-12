
import React, { useMemo } from 'react';
import { Walker, ServiceType, SavedProfessional } from '../types';

interface WalkerListProps {
  walkers: Walker[];
  activeService: ServiceType;
  onBook: (walker: Walker) => void;
  onToggleFavorite: (name: string, type: ServiceType, phone: string) => void;
  favorites: SavedProfessional[];
}

const WalkerList: React.FC<WalkerListProps> = ({ walkers, activeService, onBook, onToggleFavorite, favorites }) => {
  const processedWalkers = useMemo(() => {
    const premium = walkers.filter(w => w.isPromoted).sort(() => Math.random() - 0.5);
    const standard = walkers.filter(w => !w.isPromoted);
    return { premium, standard };
  }, [walkers]);

  const handleWhatsApp = (walker: Walker) => {
    const phone = "0500000000"; // Mock phone, in real app would use walker.phone
    const serviceName = 
        activeService === 'WALKING' ? 'טיול' : 
        activeService === 'PENSION' ? 'פנסיון' : 
        activeService === 'TRAINING' ? 'אילוף' : 'שירות';
    const text = encodeURIComponent(`היי ${walker.name}, פניתי אלייך דרך אפליקציית GoDog בנוגע ל${serviceName} לכלב שלי. האם את/ה פנוי/ה?`);
    window.open(`https://wa.me/972${phone.substring(1)}?text=${text}`, '_blank');
  };

  const renderWalkerCard = (walker: Walker, isPremium: boolean) => {
    const isFavorited = favorites.some(f => f.name === walker.name);
    
    if (!isPremium) {
      return (
        <div key={walker.id} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-full min-h-[240px] group">
           <div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-black text-gray-800">{walker.name}</h3>
                 <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-widest">Free Account</span>
              </div>
              <p className="text-sm text-gray-400 font-bold mb-4">{walker.city} • {walker.reviewsCount} חוות דעת</p>
              <p className="text-xs text-gray-500 line-clamp-2 italic mb-6">"{walker.bio}"</p>
           </div>
           <div className="flex gap-2">
              <button onClick={() => handleWhatsApp(walker)} className="bg-green-50 text-green-600 p-3 rounded-2xl flex items-center justify-center hover:bg-green-100 transition-colors shadow-sm" title="שיחה בוואצאפ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.122.554 4.194 1.606 6.04L0 24l6.117-1.605A11.803 11.803 0 0012.05 24c6.638 0 12.031-5.393 12.035-12.031a11.848 11.848 0 00-3.617-8.412Z" /></svg>
              </button>
              <a href={`tel:0500000000`} className="flex-grow bg-indigo-50 text-indigo-600 py-3 rounded-2xl text-center font-black text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">חיוג</a>
              <button onClick={() => onBook(walker)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs group-hover:bg-indigo-700 transition-all">הזמן</button>
           </div>
        </div>
      );
    }

    return (
      <div key={walker.id} className="bg-white rounded-[44px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-4 border-yellow-400/30 overflow-hidden flex flex-col group relative">
        <div className="relative h-64 overflow-hidden">
          <img src={walker.image} alt={walker.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-950 text-[10px] px-4 py-2 rounded-full font-black shadow-lg flex items-center gap-1">
             ⭐ עסק מקודם
          </div>
          <button 
            onClick={() => onToggleFavorite(walker.name, activeService, '0500000000')}
            className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition-all ${isFavorited ? 'bg-indigo-600 text-white' : 'bg-white/80 text-gray-400 hover:text-indigo-600'}`}
          >
             <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" /></svg>
          </button>
          <div className="absolute bottom-6 right-6 text-white text-right">
             <h3 className="text-2xl font-black leading-tight mb-1">{walker.name}</h3>
             <p className="text-xs font-bold opacity-80">{walker.marketingProfile?.customDisplayText || walker.bio}</p>
          </div>
        </div>
        
        <div className="p-8 flex-grow bg-white">
           <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <span className="text-xs font-black text-gray-400">({walker.reviewsCount} חוות דעת מרוצות)</span>
           </div>
           
           <div className="flex flex-wrap gap-2 mb-8">
              {walker.services.map(s => <span key={s} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{s}</span>)}
           </div>

           <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                 <button onClick={() => handleWhatsApp(walker)} className="bg-green-500 text-white p-3 rounded-2xl hover:bg-green-600 shadow-lg transition-all active:scale-95" title="וואצאפ">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.122.554 4.194 1.606 6.04L0 24l6.117-1.605A11.803 11.803 0 0012.05 24c6.638 0 12.031-5.393 12.035-12.031a11.848 11.848 0 00-3.617-8.412Z" /></svg>
                 </button>
                 <div>
                    <span className="text-3xl font-black text-indigo-900">₪{walker.pricePerHour || walker.pricePerSession}</span>
                    <span className="text-[10px] font-black text-gray-400 mr-1 uppercase">/ שירות</span>
                 </div>
              </div>
              <button onClick={() => onBook(walker)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl transition-all active:scale-95">הזמן עכשיו</button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {processedWalkers.premium.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-10">
             <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
             <h3 className="text-4xl font-black text-indigo-950 tracking-tight">מומלצי GoDog PRO ✨</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {processedWalkers.premium.map(w => renderWalkerCard(w, true))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-4 mb-10">
           <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
           <h3 className="text-3xl font-black text-indigo-950 tracking-tight">כל נותני השירות באזורך</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {processedWalkers.standard.map(w => renderWalkerCard(w, false))}
        </div>
      </section>
    </div>
  );
};

export default WalkerList;
