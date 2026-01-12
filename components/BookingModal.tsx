
import React, { useState } from 'react';
import { Walker, ServiceType, Dog } from '../types';

interface BookingModalProps {
  walker: Walker;
  serviceType: ServiceType;
  dogs: Dog[];
  onClose: () => void;
  onConfirm: (walker: Walker, dog: Dog, amount: number, details: any) => void;
}

type PaymentMethod = 'VISA' | 'PAYPAL' | 'BIT' | 'PAYBOX';

const BookingModal: React.FC<BookingModalProps> = ({ walker, serviceType, dogs, onClose, onConfirm }) => {
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT' | 'VERIFYING'>('DETAILS');
  const [selectedDogId, setSelectedDogId] = useState(dogs[0]?.id || '');
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BIT');

  const price = 
    serviceType === 'WALKING' ? (walker.pricePerHour || 0) : 
    serviceType === 'PENSION' ? (walker.pricePerNight || 0) : (walker.pricePerSession || 0);
    
  const total = price * duration;
  const platformFee = total * 0.20; // The 20% commission
  const selectedDog = dogs.find(d => d.id === selectedDogId);

  const handleProcessPayment = () => {
    setStep('VERIFYING');
    setTimeout(() => {
      if (selectedDog) {
        onConfirm(walker, selectedDog, total, { count: duration, method: paymentMethod });
      }
    }, 2500);
  };

  const PaymentLogos = {
    VISA: <svg className="h-6" viewBox="0 0 48 48" fill="none"><path d="M19 32l3.4-16h2.8l-3.4 16H19zM36.1 16.3c-.6-.2-1.6-.4-2.8-.4-3.1 0-5.3 1.6-5.3 3.9 0 1.7 1.6 2.6 2.8 3.2 1.3.6 1.7 1 1.7 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2.2-.2-3.4-.7l-.5-.2-.5 3c.9.4 2.6.8 4.3.8 3.3 0 5.4-1.6 5.5-4.1 0-1.4-.8-2.4-2.6-3.3-1.1-.5-1.7-.9-1.7-1.5 0-.5.6-1.1 1.8-1.1 1.1 0 1.9.2 2.6.5l.3.1.4-3zM46.7 16h-2.6c-.8 0-1.4.2-1.8 1.1l-5.1 12.2h3.3l.7-1.8h4l.4 1.8h2.9L46.7 16zm-3.6 8.8l1.4-3.7.8 3.7h-2.2zM12.9 16l-3.2 8.7L8.4 17.1c-.2-1-1-1.1-1.8-1.1H1.2l-.2.1c1.4.3 3 1.1 4 1.7l3.7 14.2h3.4L17.2 16h-4.3z" fill="#1A1F71"/></svg>,
    PAYPAL: <div className="flex items-center gap-1 font-black italic text-blue-900"><span className="text-blue-600">Pay</span><span>Pal</span></div>,
    BIT: <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">bit</div><span className="font-black text-xs text-blue-600">bit</span></div>,
    PAYBOX: <div className="flex items-center gap-1"><div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-[10px] text-white font-black italic">PB</div><span className="font-black text-xs text-indigo-900">PayBox</span></div>
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white rounded-[50px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">סיום והזמנה</p>
            <h3 className="text-2xl font-black">{step === 'VERIFYING' ? 'מבצע סליקה...' : step === 'PAYMENT' ? 'תשלום מאובטח' : `הזמנה מ${walker.name}`}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {step === 'DETAILS' && (
            <div className="space-y-8 animate-in slide-in-from-left-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-4 mr-2">בחרו כלב</label>
                <div className="grid grid-cols-2 gap-3">
                  {dogs.map(dog => (
                    <button 
                      key={dog.id}
                      onClick={() => setSelectedDogId(dog.id)}
                      className={`p-4 rounded-[24px] border-2 transition-all text-right ${
                        selectedDogId === dog.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-500'
                      }`}
                    >
                      <p className="font-black text-sm">{dog.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-gray-500">מחיר שירות:</span>
                   <span className="font-black text-indigo-950">₪{total}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                   <span className="font-bold">דמי ניהול ואבטחה (כלול):</span>
                   <span className="font-black italic">₪{platformFee.toFixed(1)}</span>
                </div>
                <div className="pt-3 border-t border-indigo-100 flex justify-between items-center">
                  <span className="text-lg font-black text-indigo-900">סה"כ לתשלום:</span>
                  <span className="text-3xl font-black text-indigo-600">₪{total}</span>
                </div>
              </div>

              <button 
                onClick={() => setStep('PAYMENT')}
                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
              >
                מעבר לתשלום
              </button>
            </div>
          )}

          {step === 'PAYMENT' && (
            <div className="space-y-6 animate-in slide-in-from-right-4" dir="rtl">
              <div className="grid grid-cols-2 gap-3">
                {(['VISA', 'BIT', 'PAYBOX', 'PAYPAL'] as PaymentMethod[]).map(method => (
                   <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-3 ${paymentMethod === method ? 'border-indigo-600 bg-indigo-50' : 'border-gray-50 bg-white'}`}
                   >
                     {PaymentLogos[method]}
                   </button>
                ))}
              </div>
              <button 
                onClick={handleProcessPayment}
                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-xl shadow-xl hover:bg-indigo-700 mt-4"
              >
                שלם ₪{total} עכשיו
              </button>
            </div>
          )}

          {step === 'VERIFYING' && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xl font-black text-indigo-900">מאמת עסקה מול חברת האשראי...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
