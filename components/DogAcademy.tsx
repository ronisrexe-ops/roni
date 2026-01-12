
import React, { useState, useMemo } from 'react';
import { MOCK_ARTICLES, MOCK_VIDEOS, MOCK_BREEDS_DATA } from '../constants';
import { Article, DogVideo, BreedInfo } from '../types';
import { fetchBreedData } from '../services/gemini';

const DogAcademy: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'KNOWLEDGE' | 'BREEDS'>('KNOWLEDGE');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<BreedInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingBreed, setIsSearchingBreed] = useState(false);
  const [dynamicBreeds, setDynamicBreeds] = useState<BreedInfo[]>(MOCK_BREEDS_DATA);
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = [
    { id: 'RESEARCH', label: 'מחקרים', icon: '🔬', color: 'from-blue-400 to-blue-500' },
    { id: 'TRAINING', label: 'אילוף', icon: '🦴', color: 'from-purple-400 to-purple-500' },
    { id: 'HEALTH', label: 'בריאות', icon: '🩺', color: 'from-emerald-400 to-emerald-500' },
    { id: 'NUTRITION', label: 'תזונה', icon: '🍖', color: 'from-orange-400 to-orange-500' },
    { id: 'KIDS', label: 'ילדים', icon: '👶', color: 'from-rose-400 to-rose-500' },
    { id: 'BEHAVIOR', label: 'התנהגות', icon: '🐕', color: 'from-indigo-400 to-indigo-500' },
  ];

  const filteredArticles = useMemo(() => {
    let result = MOCK_ARTICLES;
    if (selectedCategory) result = result.filter(a => a.category === selectedCategory);
    if (searchQuery && activeMainTab === 'KNOWLEDGE') {
        const query = searchQuery.toLowerCase();
        result = result.filter(a => a.title.toLowerCase().includes(query) || a.excerpt.toLowerCase().includes(query));
    }
    return result;
  }, [selectedCategory, searchQuery, activeMainTab]);

  const displayedBreeds = useMemo(() => {
    if (searchQuery && activeMainTab === 'BREEDS') {
      return dynamicBreeds.filter(b => 
        b.name.includes(searchQuery) || 
        b.englishName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return dynamicBreeds;
  }, [dynamicBreeds, searchQuery, activeMainTab]);

  const handleBreedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || activeMainTab !== 'BREEDS') return;
    
    const existing = dynamicBreeds.find(b => b.name.includes(searchQuery) || b.englishName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (existing) {
        setSelectedBreed(existing);
        return;
    }

    setIsSearchingBreed(true);
    const data = await fetchBreedData(searchQuery);
    if (data) {
        setDynamicBreeds(prev => [data, ...prev]);
        setSelectedBreed(data);
    }
    setIsSearchingBreed(false);
  };

  const renderRating = (value: number, colorClass: string) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className={`w-3 h-3 rounded-full ${s <= value ? colorClass : 'bg-gray-200'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Academy Hero */}
      <div className="relative overflow-hidden rounded-[50px] bg-indigo-900 p-12 md:p-20 text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl text-right">
          <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-black mb-6 uppercase tracking-widest">
            {activeMainTab === 'KNOWLEDGE' ? 'הידע שכל בעל כלב צריך' : 'הכירו את החבר הכי טוב שלכם'}
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            {activeMainTab === 'BREEDS' ? 'עולם הגזעים' : 'אקדמיית GoDog'}
          </h2>
          <p className="text-indigo-100 text-xl leading-relaxed mb-10 opacity-90">
            {activeMainTab === 'KNOWLEDGE' 
              ? `גישה חופשית למעל 200 מאמרים, מחקרים וסרטונים מקצועיים.`
              : `מאגר של 50+ גזעי כלבים עם מידע מפורט על אופי, בריאות וטיפול.`}
          </p>
          
          <form onSubmit={handleBreedSearch} className="relative max-w-xl mr-0">
             <input 
                type="text" 
                placeholder={activeMainTab === 'KNOWLEDGE' ? "חפשו מאמר או נושא..." : "חפשו גזע (למשל: בורדר קולי)..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white text-indigo-900 px-8 py-5 rounded-[28px] font-bold outline-none shadow-2xl focus:ring-4 focus:ring-indigo-500/50 transition-all text-lg text-right"
             />
             <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2 bg-indigo-600 p-2 rounded-xl text-white">
                {isSearchingBreed ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
             </button>
          </form>
        </div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
      </div>
      
      {/* Main Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-2 rounded-[30px] shadow-xl flex border border-gray-100">
           <button onClick={() => {setActiveMainTab('KNOWLEDGE'); setVisibleCount(12);}} className={`px-10 py-4 rounded-[22px] font-black text-sm transition-all ${activeMainTab === 'KNOWLEDGE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>מאמרים ומחקרים</button>
           <button onClick={() => {setActiveMainTab('BREEDS'); setVisibleCount(24);}} className={`px-10 py-4 rounded-[22px] font-black text-sm transition-all ${activeMainTab === 'BREEDS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>מדריך הגזעים (50+) 🐕</button>
        </div>
      </div>

      {activeMainTab === 'KNOWLEDGE' ? (
        <div className="space-y-16">
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => { setSelectedCategory(null); setVisibleCount(12); }} className={`px-8 py-4 rounded-full font-black text-sm transition-all shadow-md ${!selectedCategory ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-gray-500'}`}>הכל</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setVisibleCount(12); }} className={`px-6 py-4 rounded-full font-black text-sm transition-all flex items-center gap-3 border shadow-sm ${selectedCategory === cat.id ? `bg-gradient-to-r ${cat.color} text-white` : `bg-white text-gray-700`}`}>
                <span className="text-xl">{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredArticles.slice(0, visibleCount).map((article) => (
                <div key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-2xl transition-all flex flex-col h-full">
                  <div className="h-56 overflow-hidden relative">
                    <img src={article.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-indigo-600">{article.readTime}</div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col text-right">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">{article.category}</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-3 leading-tight">{article.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6">{article.excerpt}</p>
                    <div className="mt-auto flex items-center justify-end text-indigo-600 font-black text-[10px]">קראו עוד ←</div>
                  </div>
                </div>
              ))}
            </div>
            {filteredArticles.length > visibleCount && (
                <div className="mt-12 text-center">
                    <button onClick={() => setVisibleCount(prev => prev + 12)} className="bg-indigo-50 text-indigo-600 px-10 py-4 rounded-full font-black hover:bg-indigo-100 transition-all">טען פריטים נוספים ({filteredArticles.length - visibleCount} נותרו)</button>
                </div>
            )}
          </section>

          <section className="bg-white rounded-[60px] p-12 md:p-20 shadow-sm border border-gray-100">
            <h3 className="text-3xl font-black text-indigo-950 mb-10 text-right flex items-center gap-4 justify-end">GoDog TV 📺</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {MOCK_VIDEOS.slice(0, 9).map((video) => (
                 <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-[44px] overflow-hidden shadow-2xl bg-gray-100">
                       <img src={video.thumbnail} loading="lazy" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 shadow-2xl group-hover:scale-110 transition-transform"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
                       </div>
                       <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-black">{video.duration}</div>
                    </div>
                    <div className="mt-6 text-right">
                       <h4 className="text-xl font-black text-indigo-950 group-hover:text-red-600 transition-colors leading-tight">{video.title}</h4>
                       <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{video.category}</p>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="animate-in fade-in duration-500">
           <h3 className="text-4xl font-black text-indigo-950 mb-12 text-right">החברים הכי טובים ({displayedBreeds.length})</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedBreeds.slice(0, visibleCount).map((breed) => (
                <div key={breed.id} onClick={() => setSelectedBreed(breed)} className="bg-white rounded-[44px] border border-gray-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-2xl transition-all flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative"><img src={breed.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" /></div>
                  <div className="p-8 text-right flex flex-col flex-grow">
                    <h4 className="text-2xl font-black text-gray-900 mb-6">{breed.name}</h4>
                    <div className="space-y-4 mb-8 flex-grow">
                       <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400">אינטליגנציה</span>{renderRating(breed.intelligence, 'bg-indigo-600')}</div>
                       <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400">נשירה</span>{renderRating(breed.shedding, 'bg-rose-500')}</div>
                       <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400">אנרגיה</span>{renderRating(breed.energy, 'bg-amber-500')}</div>
                    </div>
                    <div className="flex items-center justify-end text-indigo-600 font-black text-xs">בואו לדעת הכל ←</div>
                  </div>
                </div>
              ))}
           </div>
           {displayedBreeds.length > visibleCount && (
              <div className="mt-12 text-center">
                 <button onClick={() => setVisibleCount(prev => prev + 12)} className="bg-indigo-600 text-white px-12 py-5 rounded-full font-black shadow-xl hover:bg-indigo-700 transition-all">הצג גזעים נוספים</button>
              </div>
           )}
        </section>
      )}

      {/* Modals for Article and Breed Detail remain same with fixed logic */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={() => setSelectedArticle(null)} />
          <div className="bg-white rounded-[60px] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="h-80 relative shrink-0">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-12 md:p-20 overflow-y-auto bg-white custom-scrollbar text-right">
               <h3 className="text-4xl font-black mb-8">{selectedArticle.title}</h3>
               <p className="text-gray-700 leading-relaxed text-2xl font-medium whitespace-pre-wrap">{selectedArticle.content}</p>
            </div>
          </div>
        </div>
      )}

      {selectedBreed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={() => setSelectedBreed(null)} />
          <div className="bg-white rounded-[60px] w-full max-w-6xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
             <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
                <div className="lg:col-span-5 h-80 lg:h-auto overflow-hidden relative">
                    <img src={selectedBreed.image} className="w-full h-full object-cover" />
                    <button onClick={() => setSelectedBreed(null)} className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all lg:hidden"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="lg:col-span-7 p-10 md:p-16 text-right">
                   <div className="flex justify-between items-start mb-8">
                        <button onClick={() => setSelectedBreed(null)} className="hidden lg:block p-3 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        <h3 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">{selectedBreed.name}</h3>
                   </div>
                   <p className="text-xl text-gray-500 font-bold mb-10 leading-relaxed">{selectedBreed.description}</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div className="bg-indigo-50 p-6 rounded-[32px] text-center"><p className="text-[10px] font-black text-indigo-400 mb-3">אינטליגנציה</p>{renderRating(selectedBreed.intelligence, 'bg-indigo-600')}</div>
                      <div className="bg-rose-50 p-6 rounded-[32px] text-center"><p className="text-[10px] font-black text-rose-400 mb-3">נשירה</p>{renderRating(selectedBreed.shedding, 'bg-rose-600')}</div>
                      <div className="bg-amber-50 p-6 rounded-[32px] text-center"><p className="text-[10px] font-black text-amber-400 mb-3">אנרגיה</p>{renderRating(selectedBreed.energy, 'bg-amber-600')}</div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-green-50 p-8 rounded-[40px]"><h4 className="font-black text-green-800 mb-4">יתרונות הגזע</h4><ul className="space-y-2">{selectedBreed.pros.map((p,i)=><li key={i} className="text-sm font-bold text-green-700">✓ {p}</li>)}</ul></div>
                      <div className="bg-rose-50 p-8 rounded-[40px]"><h4 className="font-black text-rose-800 mb-4">חשוב לדעת</h4><ul className="space-y-2">{selectedBreed.cons.map((c,i)=><li key={i} className="text-sm font-bold text-rose-700">! {c}</li>)}</ul></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogAcademy;
