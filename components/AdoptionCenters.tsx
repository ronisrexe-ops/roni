
import React, { useState, useEffect } from 'react';
import { findAdoptionCenters } from '../services/gemini';
import { LocationState, ServiceType, AdoptionCenter, SavedProfessional } from '../types';

interface AdoptionCentersProps {
  location: LocationState;
  onToggleFavorite: (name: string, type: ServiceType, phone: string) => void;
  favorites: SavedProfessional[];
}

const AdoptionCenters: React.FC<AdoptionCentersProps> = ({ location, onToggleFavorite, favorites }) => {
  const [centers, setCenters] = useState<AdoptionCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      const cityParam = location.isManual ? location.city : undefined;
      const result = await findAdoptionCenters(location.lat, location.lng, cityParam);
      setCenters(result.centers);
      setLoading(false);
    };
    fetchCenters();
  }, [location]);

  const handleCall = (center: AdoptionCenter) => {
    window.location.href = `tel:${center.phone}`;
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-rose-400">מחפש עמותות...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {centers.map((center, i) => {
        const isFavorited = favorites.some(f => f.name === center.name);
        return (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 w-fit">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <button 
                onClick={() => onToggleFavorite(center.name, 'ADOPTION', center.phone)} 
                className={`p-2 transition-colors ${isFavorited ? 'text-rose-600' : 'text-gray-300 hover:text-rose-400'}`}
              >
                <svg className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" /></svg>
              </button>
            </div>
            <h4 className="text-xl font-black text-gray-800 mb-1">{center.name}</h4>
            <p className="text-sm text-gray-400 mb-6 flex-grow">{center.address}</p>
            <button 
              onClick={() => handleCall(center)}
              className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              חיוג לעמותה
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AdoptionCenters;
