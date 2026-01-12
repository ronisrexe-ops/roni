
import React from 'react';
import { LEGAL_TERMS } from './LegalContent';

interface LegalModalProps {
  type: 'OWNER' | 'BUSINESS' | 'GENERAL';
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const terms = type === 'GENERAL' ? LEGAL_TERMS.GENERAL : (type === 'OWNER' ? LEGAL_TERMS.OWNER : LEGAL_TERMS.BUSINESS);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/90 backdrop-blur-xl" onClick={onClose} />
      <div className="bg-white rounded-[50px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in">
        <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-indigo-900">{terms.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar text-right" dir="rtl">
          <div className="prose prose-indigo max-w-none">
            {terms.content.split('\n').map((line, i) => (
              <p key={i} className="text-gray-600 font-bold mb-4 leading-relaxed">{line}</p>
            ))}
          </div>
          <div className="mt-10 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
             <p className="text-xs text-indigo-900 font-black">מעודכן לתאריך: {new Date().toLocaleDateString('he-IL')}</p>
             <p className="text-[10px] text-indigo-400 mt-2">מסמך זה נכתב בלשון זכר אך פונה לכל המינים.</p>
          </div>
        </div>
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">הבנתי, תודה</button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
