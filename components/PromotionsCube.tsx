
import React, { useState, useEffect } from 'react';
import { Deal, LocationState } from '../types';
import { MOCK_WALKERS } from '../constants';

interface PromotionsCubeProps {
  location: LocationState;
  onDealClick: (deal: Deal) => void;
}

const PromotionsCube: React.FC<PromotionsCubeProps> = ({ location, onDealClick }) => {
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // In a real app, this would be an API call filtered by location
    const allDeals: Deal[] = [];
    MOCK_WALKERS.forEach(walker => {
      if (walker.marketingProfile?.deals && (walker.city === location.city || !location.city)) {
        allDeals.push(...walker.marketingProfile.deals);
      }
    });
    setActiveDeals(allDeals);
  }, [location]);

  useEffect(() => {
    if (activeDeals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeDeals]);

  if (activeDeals.length === 0) return null;

  const currentDeal = activeDeals[currentIndex];

  return (
    <div className="relative group bg-white rounded-[45px] shadow-2xl overflow-hidden border-2 border-orange-100 hover:border-orange-500 transition-all cursor-pointer h-full min-h-[350px]" onClick={() => onDealClick(currentDeal)}>
      <div className="absolute top-6 right-6 z-20 bg-orange-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-lg flex items-center gap-2">
         <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
         מבצע חם באזורך
      </div>

      <div className="relative h-48 overflow-hidden">
         <img 
            src={currentDeal.images[0] || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600'} 
            className="w-full h-full object-cover transition-transform duration-[5s] scale-110 group-hover:scale-100" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
         <div className="absolute bottom-6 right-8 left-8 text-white text-right">
            <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-1">{currentDeal.businessName}</h4>
            <h3 className="text-2xl font-black leading-tight line-clamp-1">{currentDeal.title}</h3>
         </div>
      </div>

      <div className="p-8 text-right bg-white">
         <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 line-clamp-2">{currentDeal.description}</p>
         
         <div className="flex justify-between items-center">
            <div className="flex gap-1">
               {activeDeals.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-orange-600' : 'w-1.5 bg-gray-200'}`} />
               ))}
            </div>
            <button className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-xl font-black text-xs group-hover:bg-orange-600 group-hover:text-white transition-all">למימוש המבצע</button>
         </div>
      </div>
      
      {/* Visual background element */}
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default PromotionsCube;
