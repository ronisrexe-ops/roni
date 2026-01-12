
import React, { useState, useEffect } from 'react';
import { findNearbyStores } from '../services/gemini';
import { PetStore, LocationState, ServiceType, SavedProfessional } from '../types';

interface PetStoresProps {
  location: LocationState;
  onToggleFavorite: (name: string, type: ServiceType, phone: string) => void;
  favorites: SavedProfessional[];
}

const PetStores: React.FC<PetStoresProps> = ({ location, onToggleFavorite, favorites }) => {
  const [stores, setStores] = useState<PetStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      const cityParam = location.isManual ? location.city : undefined;
      const result = await findNearbyStores(location.lat, location.lng, cityParam);
      setStores(result.stores);
      setLoading(false);
    };
    fetchStores();
  }, [location]);

  const handleCall = (store: PetStore) => {
    window.location.href = `tel:${store.phone}`;
  };

  const handleWhatsApp = (store: PetStore) => {
    const text = encodeURIComponent(`היי, הגעתי דרך GoDog. רציתי לשאול אם יש לכם במלאי מוצר מסוים או אם אתם עושים משלוחים?`);
    window.open(`https://wa.me/972${store.phone.replace(/\D/g, '').substring(1)}?text=${text}`, '_blank');
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛍️</div>
        <p className="font-bold text-indigo-400">מחפש חנויות חיות באזורכם...</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store, i) => {
        const isFavorited = favorites.some(f => f.name === store.name);
        return (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 w-fit group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <button 
                onClick={() => onToggleFavorite(store.name, 'STORES', store.phone)} 
                className={`p-2 transition-colors ${isFavorited ? 'text-indigo-600' : 'text-gray-300 hover:text-indigo-400'}`}
              >
                <svg className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" /></svg>
              </button>
            </div>
            <h4 className="text-xl font-black text-gray-800 mb-1">{store.name}</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">{store.address}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleCall(store)}
                className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                חיוג
              </button>
              <button 
                onClick={() => handleWhatsApp(store)}
                className="bg-green-500 text-white p-4 rounded-2xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.122.554 4.194 1.606 6.04L0 24l6.117-1.605A11.803 11.803 0 0012.05 24c6.638 0 12.031-5.393 12.035-12.031a11.848 11.848 0 00-3.617-8.412Z" /></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PetStores;
