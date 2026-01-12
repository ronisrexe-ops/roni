
import React, { useState, useEffect } from 'react';
import { UserRole, Walker, Booking, ServiceType, Dog, UserProfile, LocationState, SavedProfessional, DogReminder, Deal } from './types';
import { MOCK_WALKERS, PLATFORM_COMMISSION_RATE } from './constants';
import Header from './components/Header';
import WalkerList from './components/WalkerList';
import BookingModal from './components/BookingModal';
import AIAssistant from './components/AIAssistant';
import WalkerDashboard from './components/WalkerDashboard';
import AdminDashboard from './components/AdminDashboard';
import PetStores from './components/PetStores';
import MyDogs from './components/MyDogs';
import DogAcademy from './components/DogAcademy';
import VetClinics from './components/VetClinics';
import Insurance from './components/Insurance';
import DogGoShop from './components/DogGoShop';
import AdoptionCenters from './components/AdoptionCenters';
import AdoptionBanner from './components/AdoptionBanner';
import AuthModal from './components/AuthModal';
import LocationSelector from './components/LocationSelector';
import DailyTipHero from './components/DailyTipHero';
import DogTrainers from './components/DogTrainers';
import Grooming from './components/Grooming';
import SubscriptionBanner from './components/SubscriptionBanner';
import Community from './components/Community';
import SubscriptionGate from './components/SubscriptionGate';
import RemindersCenter from './components/RemindersCenter';
import PersonalArea from './components/PersonalArea';
import DogDetailView from './components/DogDetailView';
import AccessibilityMenu from './components/AccessibilityMenu';
import PromotionsCube from './components/PromotionsCube';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('godog_user_role') as UserRole) || 'OWNER';
  });
  const [activeService, setActiveService] = useState<ServiceType>('COMMUNITY');
  const [selectedWalker, setSelectedWalker] = useState<Walker | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myDogs, setMyDogs] = useState<Dog[]>(() => {
    const saved = localStorage.getItem('godog_my_dogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [reminders, setReminders] = useState<DogReminder[]>([]);
  const [showReminders, setShowReminders] = useState(false);
  const [reminderInitialDogId, setReminderInitialDogId] = useState<string | undefined>(undefined);
  const [showPersonalArea, setShowPersonalArea] = useState(false);
  const [selectedDogDetail, setSelectedDogDetail] = useState<Dog | null>(null);
  const [myAvailability, setMyAvailability] = useState(true);
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false);
  const [showAppInstallPrompt, setShowAppInstallPrompt] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('godog_session_active') === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('godog_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(!isLoggedIn);
  const [location, setLocation] = useState<LocationState>({ city: 'תל אביב', isManual: false });
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Show app install prompt for mobile users after 10 seconds
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasSeenPrompt = sessionStorage.getItem('godog_install_prompt_shown');
    
    if (isMobile && !hasSeenPrompt && isLoggedIn) {
      const timer = setTimeout(() => {
        setShowAppInstallPrompt(true);
        sessionStorage.setItem('godog_install_prompt_shown', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userProfile && isLoggedIn) {
      const trialStart = new Date(userProfile.trialStartDate || userProfile.registrationDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

      const isBusiness = ['WALKER', 'PROFESSIONAL', 'STORE_OWNER'].includes(role);
      if (isBusiness && userProfile.promotionTier === 'FREE' && diffDays > 180) {
        setIsBlocked(true);
      }
      else if (role === 'OWNER' && userProfile.subscriptionStatus === 'TRIAL' && diffDays > 90) {
        setIsBlocked(true);
      }
    }
  }, [userProfile, isLoggedIn, role]);

  const handleAuthComplete = (profile: UserProfile, initialDog?: Omit<Dog, 'id'>) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setRole(profile.userRole);
    localStorage.setItem('godog_user_role', profile.userRole);
    localStorage.setItem('godog_user_profile', JSON.stringify(profile));
    localStorage.setItem('godog_session_active', 'true');
    
    if (initialDog) {
      const dogWithId = { ...initialDog, id: Math.random().toString(36).substr(2, 9), media: [], albums: [] };
      const updatedDogs = [dogWithId];
      setMyDogs(updatedDogs as any);
      localStorage.setItem('godog_my_dogs', JSON.stringify(updatedDogs));
    }
    
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem('godog_session_active');
    localStorage.removeItem('godog_user_role');
    localStorage.removeItem('godog_user_profile');
    setShowAuthModal(true);
  };

  const handleAddDog = (newDog: Omit<Dog, 'id'>) => {
    const dogWithId = { ...newDog, id: Math.random().toString(36).substr(2, 9), media: [], albums: [] };
    const updatedDogs = [...myDogs, dogWithId] as Dog[];
    setMyDogs(updatedDogs);
    localStorage.setItem('godog_my_dogs', JSON.stringify(updatedDogs));
  };

  const handleUpdateDog = (updatedDog: Dog) => {
    const updatedDogs = myDogs.map(d => d.id === updatedDog.id ? updatedDog : d);
    setMyDogs(updatedDogs);
    localStorage.setItem('godog_my_dogs', JSON.stringify(updatedDogs));
    setSelectedDogDetail(updatedDog);
  };

  const handleDeleteDog = (id: string) => {
    const updatedDogs = myDogs.filter(d => d.id !== id);
    setMyDogs(updatedDogs);
    localStorage.setItem('godog_my_dogs', JSON.stringify(updatedDogs));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('godog_user_profile', JSON.stringify(updated));
  };

  const handleToggleFavorite = (name: string, type: ServiceType, phone: string) => {
    if (!userProfile) return;
    const favorites = userProfile.savedProfessionals || [];
    const existingIndex = favorites.findIndex(p => p.name === name);
    let updatedFavorites;
    if (existingIndex > -1) updatedFavorites = favorites.filter((_, i) => i !== existingIndex);
    else updatedFavorites = [...favorites, { id: Math.random().toString(36).substr(2, 9), name, type, phone }];
    handleUpdateProfile({ ...userProfile, savedProfessionals: updatedFavorites });
  };

  const handleBooking = (walker: Walker, dog: Dog, amount: number, details: any) => {
    const platformFee = amount * PLATFORM_COMMISSION_RATE;
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      walkerId: walker.id,
      ownerName: `${userProfile?.firstName} ${userProfile?.lastName}`,
      dogId: dog.id,
      dogName: dog.name,
      serviceType: activeService,
      startTime: details.start || new Date(),
      totalAmount: amount,
      walkerEarnings: amount - platformFee,
      platformFee,
      status: 'confirmed'
    };
    setBookings(prev => [newBooking, ...prev]);
    setSelectedWalker(null);
    alert(`הזמנה בוצעה בהצלחה!`);
  };

  const handleDealClick = (deal: Deal) => {
    alert(`עברת למבצע: ${deal.title}\nמאת: ${deal.businessName}\nתיאור: ${deal.description}`);
  };

  const handleSubscribe = (tier: 'MONTHLY' | 'ANNUAL') => {
    if (!userProfile) return;
    handleUpdateProfile({ ...userProfile, subscriptionStatus: 'ACTIVE', subscriptionTier: tier });
    setShowSubscriptionGate(false);
    alert(`ברוכים הבאים ל-GODOG PRO! המנוי הופעל בהצלחה.`);
  };

  const getDynamicDogTitle = () => {
    const isShared = (userProfile?.collaborators && userProfile.collaborators.length > 0);
    const count = myDogs.length;
    const suffix = isShared ? 'שלנו' : 'שלי';

    if (count === 0) return `הכלבים ${suffix}`;
    if (count > 1) return `הכלבים ${suffix}`;
    
    const isFemale = myDogs[0].gender === 'FEMALE';
    return isFemale ? `הכלבה ${suffix}` : `הכלב ${suffix}`;
  };

  const services: { id: ServiceType, label: string, icon: string, color?: string }[] = [
    { id: 'COMMUNITY', label: 'קהילה', icon: '👥' },
    { id: 'ARTICLES', label: 'אקדמיה', icon: '🎓' },
    { id: 'WALKING', label: 'טיולים', icon: '🚶' },
    { id: 'PENSION', label: 'פנסיון', icon: '🏠' },
    { id: 'TRAINING', label: 'מאלפים', icon: '🦴' },
    { id: 'STORES', label: 'חנויות', icon: '🛍️' },
    { id: 'VETERINARY', label: 'וטרינר', icon: '🩺' },
    { id: 'INSURANCE', label: 'ביטוח', icon: '🛡️' },
    { id: 'SHOP', label: 'חנות GoDog', icon: '📦' },
    { id: 'GROOMING', label: 'מספרה', icon: '✂️' },
    { id: 'ADOPTION', label: 'אימוץ', icon: '🐾', color: 'bg-rose-600' },
  ];

  const renderContent = () => {
    if (!isLoggedIn) return null;
    if (isBlocked) return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-[60px] shadow-2xl border-4 border-rose-500 animate-in zoom-in">
         <div className="text-8xl mb-8">🚫</div>
         <h2 className="text-4xl font-black text-rose-600 mb-4">תקופת הניסיון הסתיימה</h2>
         <p className="text-xl text-gray-500 font-bold max-w-lg">חצי שנת הפרסום בחינם הסתיימה. כדי להמשיך להופיע באפליקציה ולקבל פניות, אנא רכוש מסלול פרסום.</p>
         <button onClick={() => setShowPersonalArea(true)} className="mt-10 bg-rose-600 text-white px-12 py-5 rounded-[28px] font-black text-xl shadow-xl hover:bg-rose-700 transition-all">לרכישת מנוי עסקי</button>
      </div>
    );

    if (role === 'ADMIN') return <AdminDashboard bookings={bookings} callLogs={[]} />;
    
    if (['WALKER', 'PROFESSIONAL', 'STORE_OWNER'].includes(role)) return (
      <WalkerDashboard 
        isAvailable={myAvailability} 
        onToggleAvailability={() => setMyAvailability(!myAvailability)} 
        bookings={bookings.filter(b => b.walkerId === '1' || b.walkerId === userProfile?.businessId)} 
        profile={userProfile as any}
      />
    );

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {userProfile && <SubscriptionBanner registrationDate={userProfile.registrationDate} onClick={() => setShowSubscriptionGate(true)} />}
        <DailyTipHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <MyDogs 
              title={getDynamicDogTitle()} 
              dogs={myDogs} 
              onAddDog={handleAddDog} 
              onDeleteDog={handleDeleteDog} 
              onSelectDog={setSelectedDogDetail} 
              onOpenReminders={(id) => {setReminderInitialDogId(id); setShowReminders(true);}} 
            />
            <PromotionsCube location={location} onDealClick={handleDealClick} />
          </div>

          <div className="lg:col-span-5 grid grid-rows-2 gap-8">
            <div 
              onClick={() => setShowReminders(true)} 
              className="group bg-white border border-indigo-100 rounded-[45px] p-10 shadow-sm hover:shadow-2xl hover:border-indigo-600 transition-all cursor-pointer flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">תזכורות וטיפולים</span>
              </div>
              <div className="flex-grow">
                 <h4 className="text-2xl font-black text-indigo-950 mb-4">מה בתכנון?</h4>
                 {reminders.length > 0 ? (
                    <div className="space-y-4">
                       {reminders.slice(0, 2).map((rem, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent group-hover:border-indigo-100 transition-all">
                             <div className="text-lg">{rem.icon || '🗓️'}</div>
                             <div>
                                <p className="text-sm font-black text-gray-800 leading-none">{rem.title}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1">{rem.date} | {rem.time}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                       <p className="text-gray-400 font-bold text-sm italic">אין תזכורות קרובות.</p>
                    </div>
                 )}
              </div>
            </div>

            <div 
              onClick={() => setShowPersonalArea(true)} 
              className="group bg-indigo-900 rounded-[45px] p-10 shadow-xl hover:shadow-indigo-900/40 transition-all cursor-pointer flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="bg-white/10 p-4 rounded-3xl text-indigo-100 group-hover:bg-white group-hover:text-indigo-900 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">אזור אישי וחשבון</span>
              </div>
              <div className="flex-grow text-white">
                 <h4 className="text-2xl font-black mb-4">הפרופיל שלי</h4>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                       <p className="text-sm font-bold opacity-90">{userProfile?.firstName} {userProfile?.lastName}</p>
                    </div>
                    <div className="bg-white/10 p-5 rounded-[28px] border border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">סטטוס מנוי</p>
                       <div className="flex justify-between items-center">
                          <p className="text-sm font-black">{userProfile?.subscriptionStatus === 'TRIAL' ? 'תקופת ניסיון' : 'מנוי Pro פעיל'}</p>
                          <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black">PRO</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <section id="services" className="space-y-6">
          <div className="flex items-center gap-6 mb-4 px-2">
            <h2 className="text-3xl font-black text-indigo-900">מרכז הכלבים שלך</h2>
            <LocationSelector currentLocation={location} onLocationChange={setLocation} />
          </div>
          
          <div className="flex flex-wrap bg-white p-4 rounded-[40px] shadow-sm border border-gray-100 gap-3 items-center justify-start overflow-x-auto scrollbar-hide">
            {services.map((service) => (
              <button 
                key={service.id} 
                onClick={() => setActiveService(service.id)} 
                className={`flex items-center gap-2 px-6 py-4 rounded-[24px] font-black transition-all ${
                  activeService === service.id 
                    ? (service.color || 'bg-indigo-600') + ' text-white shadow-xl scale-105' 
                    : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <span className="text-xl">{service.icon}</span>
                <span className="whitespace-nowrap">{service.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8">
            {activeService === 'COMMUNITY' ? <Community profile={userProfile as any} /> : 
             activeService === 'ARTICLES' ? <DogAcademy /> :
             activeService === 'SHOP' ? <DogGoShop onPurchase={() => {}} /> :
             activeService === 'ADOPTION' ? <AdoptionCenters location={location} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             activeService === 'STORES' ? <PetStores location={location} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             activeService === 'VETERINARY' ? <VetClinics location={location} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             activeService === 'TRAINING' ? <DogTrainers location={location} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             activeService === 'GROOMING' ? <Grooming location={location} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             activeService === 'INSURANCE' ? <Insurance dogs={myDogs} onTrackCall={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} /> :
             <WalkerList walkers={MOCK_WALKERS.filter(w => w.services.includes(activeService))} activeService={activeService} onBook={setSelectedWalker} onToggleFavorite={handleToggleFavorite} favorites={userProfile?.savedProfessionals || []} />}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-24 md:pb-0" dir="rtl">
      <Header 
        role={role} 
        onRoleChange={setRole} 
        onProfileClick={() => setShowPersonalArea(true)} 
        onLogout={handleLogout} 
        isProfileComplete={!!userProfile?.isComplete} 
        profile={userProfile}
      />
      {role === 'OWNER' && isLoggedIn && <AdoptionBanner />}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {renderContent()}
      </main>
      {isLoggedIn && !isBlocked && <AIAssistant dogs={myDogs} />}
      <AccessibilityMenu />
      {showAuthModal && <AuthModal onAuthComplete={handleAuthComplete} onClose={() => {}} />}
      {showReminders && userProfile && <RemindersCenter dogs={myDogs} profile={userProfile} reminders={reminders} onAddReminder={r => setReminders([...reminders, {...r, id: Math.random().toString(36).substr(2,9)}])} initialDogId={reminderInitialDogId} onClose={() => setShowReminders(false)} />}
      {showPersonalArea && userProfile && <PersonalArea profile={userProfile} onUpdate={handleUpdateProfile} onClose={() => setShowPersonalArea(false)} />}
      {showSubscriptionGate && userProfile && <SubscriptionGate profile={userProfile} onSubscribe={handleSubscribe} forcedOpen={true} onClose={() => setShowSubscriptionGate(false)} />}
      {selectedDogDetail && <DogDetailView dog={selectedDogDetail} onUpdate={handleUpdateDog} onClose={() => setSelectedDogDetail(null)} />}
      {selectedWalker && <BookingModal walker={selectedWalker} serviceType={activeService} dogs={myDogs} onClose={() => setSelectedWalker(null)} onConfirm={handleBooking} />}
      
      {/* App Install Prompt for Mobile */}
      {showAppInstallPrompt && (
        <div className="fixed bottom-24 inset-x-4 z-[400] animate-in slide-in-from-bottom duration-500">
           <div className="bg-indigo-600 p-6 rounded-[35px] shadow-2xl text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                 <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black">התקינו את GoDog על הטלפון!</h3>
                    <button onClick={() => setShowAppInstallPrompt(false)} className="bg-white/20 p-1 rounded-full">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
                 <p className="text-sm font-bold opacity-90 leading-relaxed">
                    כדי להשתמש ב-GoDog כאפליקציה אמיתית, לחצו על כפתור ה'שיתוף' (Share) בתחתית הדפדפן ואז על 'הוסף למסך הבית' (Add to Home Screen).
                 </p>
                 <div className="flex items-center gap-3 mt-2">
                    <div className="bg-white p-2 rounded-xl text-indigo-600">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">זמין כעת להתקנה מהירה</span>
                 </div>
              </div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
