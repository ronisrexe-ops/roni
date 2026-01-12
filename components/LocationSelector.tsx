
import React, { useState, useRef, useEffect } from 'react';
import { LocationState } from '../types';
import { ISRAEL_CITIES } from '../constants';

interface LocationSelectorProps {
  currentLocation: LocationState;
  onLocationChange: (location: LocationState) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ currentLocation, onLocationChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newCity.trim().length > 0) {
      const filtered = ISRAEL_CITIES.filter(city => 
        city.includes(newCity.trim())
      ).slice(0, 5);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [newCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilteredCities([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: string) => {
    onLocationChange({
      city: city,
      isManual: true
    });
    setNewCity('');
    setIsEditing(false);
    setFilteredCities([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCity.trim()) {
      handleSelectCity(newCity.trim());
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isEditing ? (
        <div className="flex flex-col animate-in slide-in-from-right-4 duration-300">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input 
                autoFocus
                type="text"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                placeholder="הזן עיר..."
                className="bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-48 shadow-sm"
              />
              {filteredCities.length > 0 && (
                <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {filteredCities.map((city, index) => (
                    <li 
                      key={index}
                      onClick={() => handleSelectCity(city)}
                      className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </button>
            <button type="button" onClick={() => { setIsEditing(false); setNewCity(''); }} className="text-gray-400 hover:text-red-500 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-2xl transition-all group"
        >
          <div className="bg-indigo-600 text-white p-1 rounded-lg">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-indigo-400 uppercase leading-none">אזור חיפוש</div>
            <div className="text-sm font-black text-indigo-900 flex items-center">
              {currentLocation.city}
              <svg className="w-3 h-3 mr-1 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default LocationSelector;
