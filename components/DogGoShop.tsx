
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface DogGoShopProps {
  onPurchase: (product: Product) => void;
}

const DogGoShop: React.FC<DogGoShopProps> = ({ onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: 'TOYS', label: 'צעצועים', icon: '🎾' },
    { id: 'FOOD', label: 'מזון וחטיפים', icon: '🍖' },
    { id: 'ESSENTIALS', label: 'חיוניים', icon: '🧴' },
    { id: 'ACCESSORIES', label: 'אביזרים', icon: '🧣' },
  ];

  const filteredProducts = activeCategory 
    ? MOCK_PRODUCTS.filter(p => p.category === activeCategory)
    : MOCK_PRODUCTS;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-4xl font-black mb-4">חנות הבית של GoDog</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            הצעצועים והמוצרים האיכותיים ביותר שנבחרו בקפידה עבור הכלב שלכם. רכישה מהירה ומשלוח עד הבית, או קנייה ישירה מחנויות מובילות.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -translate-x-20 -translate-y-20 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-400 rounded-full translate-x-10 translate-y-10 blur-3xl opacity-10"></div>
      </div>

      <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-8 py-4 rounded-2xl font-black transition-all whitespace-nowrap ${!activeCategory ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200'}`}
        >
          כל המוצרים
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-4 rounded-2xl font-black transition-all flex items-center whitespace-nowrap ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200'}`}
          >
            <span className="ml-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col">
            <div className="h-64 overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                <span className="text-2xl font-black text-indigo-900">{product.price}₪</span>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                {categories.find(c => c.id === product.category)?.label}
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto space-y-3">
                <button 
                  onClick={() => onPurchase(product)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  רכישה דרך GoDog
                </button>
                {product.externalLink && (
                  <a 
                    href={product.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-orange-50 text-orange-600 py-4 rounded-2xl font-black hover:bg-orange-100 transition-all shadow-sm active:scale-95 flex items-center justify-center border border-orange-100"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/en/8/80/AliExpress_logo.svg" className="h-4 ml-2" alt="AliExpress" />
                    צפייה ב-AliExpress
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogGoShop;