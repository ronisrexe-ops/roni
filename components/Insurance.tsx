
import React, { useState } from 'react';
import { Dog, InsurancePlan, ServiceType, SavedProfessional } from '../types';
import { getInsuranceComparison } from '../services/gemini';

interface InsuranceProps {
  dogs: Dog[];
  onTrackCall: (name: string, type: ServiceType, phone: string) => void;
  favorites: SavedProfessional[];
}

const STATIC_PLANS: InsurancePlan[] = [
  {
    id: 'libra',
    company: 'ליברה',
    name: 'מסלול חיות מחמד',
    pricePerMonth: 85,
    coverage: ['טיפולים וטרינריים', 'ניתוחים ואשפוזים', 'אחריות צד ג׳', 'תרופות'],
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?q=80&w=100'
  },
  {
    id: 'phoenix',
    company: 'הפניקס (חיות וחיוכים)',
    name: 'מסלול פלטינום',
    pricePerMonth: 79,
    coverage: ['השתתפות עצמית נמוכה', 'כיסוי מחלות כרוניות', 'חיסונים', 'ייעוץ 24/7'],
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?q=80&w=101'
  },
  {
    id: 'harel',
    company: 'הראל (Pets)',
    name: 'הראל בלו',
    pricePerMonth: 92,
    coverage: ['תשלום בכרטיס אשראי במקום', 'בדיקות מעבדה', 'הטסה לחו"ל', 'מוקד חירום'],
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?q=80&w=102'
  }
];

const Insurance: React.FC<InsuranceProps> = ({ dogs, onTrackCall, favorites }) => {
  const [selectedDogId, setSelectedDogId] = useState<string>(dogs[0]?.id || '');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    const dog = dogs.find(d => d.id === selectedDogId);
    if (!dog) return;

    setIsLoading(true);
    const result = await getInsuranceComparison(dog.breed, dog.age);
    if (result) {
      setComparisonResult(result.analysis);
    }
    setIsLoading(false);
  };

  const handleAction = (company: string) => {
    onTrackCall(company, 'INSURANCE', '03-INSURANCE');
    alert(`מעביר אותך לנציג ${company} לקבלת הצעה מותאמת לכלב שלך!`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-indigo-900 rounded-[50px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6">השוואת ביטוח חכמה</h2>
          <p className="text-indigo-100 text-lg opacity-90 leading-relaxed mb-8">
            אל תחכו למקרה חירום. GoDog משווה עבורכם את מחירי הביטוח המעודכנים ביותר בהתאם לגזע וגיל הכלב שלכם, ישירות מול חברות הביטוח המובילות בישראל.
          </p>
          
          {dogs.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[32px] border border-white/20 inline-flex flex-col md:flex-row items-center gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">בחרו כלב להשוואה</label>
                <select 
                  value={selectedDogId}
                  onChange={(e) => setSelectedDogId(e.target.value)}
                  className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black outline-none border-none shadow-xl"
                >
                  {dogs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.breed})</option>)}
                </select>
              </div>
              <button 
                onClick={handleCompare}
                disabled={isLoading}
                className="bg-yellow-400 text-indigo-900 px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'מנתח נתונים...' : 'השווה עכשיו אוטומטית'}
              </button>
            </div>
          ) : (
            <p className="bg-red-500/20 px-6 py-4 rounded-2xl text-sm font-bold border border-red-500/30">
              הוסיפו כלב בפרופיל כדי לבצע השוואה מותאמת אישית
            </p>
          )}
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-20"></div>
      </div>

      {/* Comparison results and plans... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STATIC_PLANS.map(plan => {
          const isFavorited = favorites.some(f => f.name === plan.company);
          return (
            <div key={plan.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
              <button 
                onClick={() => onTrackCall(plan.company, 'INSURANCE', '03-INSURANCE')} 
                className={`absolute top-6 left-6 p-2 rounded-full transition-colors z-20 ${isFavorited ? 'text-indigo-600 bg-indigo-50' : 'text-gray-300 hover:text-indigo-400 bg-gray-50'}`}
              >
                <svg className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" /></svg>
              </button>
              
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">{plan.company}</h4>
                  <p className="text-xl font-black text-gray-800">{plan.name}</p>
                </div>
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                  <img src={plan.logo} alt={plan.company} className="w-full h-full object-contain mix-blend-multiply opacity-50" />
                </div>
              </div>
              
              <div className="p-10 flex-grow">
                <ul className="space-y-5">
                  {plan.coverage.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600 font-bold">
                      <svg className="w-5 h-5 text-green-500 ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-10 bg-gray-50/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-gray-900">כ-{plan.pricePerMonth}₪</span>
                    <span className="text-xs text-gray-400 font-bold mr-1">/ לחודש</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleAction(plan.company)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                >
                  קבלת הצעה למייל
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Insurance;
