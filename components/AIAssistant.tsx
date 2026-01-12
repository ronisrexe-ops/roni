
import React, { useState } from 'react';
import { getDogAdvice } from '../services/gemini';
import { Dog } from '../types';
import { DogLogo } from './Header';

interface AIAssistantProps {
  dogs?: Dog[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ dogs = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'היי! אני עוזר הכלבים החכם של GoDog. איך אוכל לעזור לכם היום?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const dogContext = dogs.length > 0 
      ? `המשתמש מחזיק בכלבים הבאים: ${dogs.map(d => `${d.name} (${d.breed}, בן ${d.age})`).join(', ')}. `
      : '';
    
    const response = await getDogAdvice(`${dogContext} שאלה: ${userMsg}`);
    
    setMessages(prev => [...prev, { role: 'model', text: response || 'מצטער, לא הצלחתי לענות.' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50">
      {isOpen ? (
        <div className="bg-white rounded-[32px] shadow-2xl w-80 md:w-96 flex flex-col border border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="bg-white p-1 rounded-xl shadow-lg scale-75 origin-right">
                 <DogLogo />
              </div>
              <span className="font-black tracking-tight">GoDog AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white p-4 rounded-[24px] border border-gray-100 rounded-tl-none shadow-sm">
                   <div className="flex space-x-1.5 space-x-reverse">
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-150"></div>
                   </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 flex space-x-2 space-x-reverse bg-white">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="שאל אותי על הכלב שלך..."
              className="flex-grow border-none bg-gray-50 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white p-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 group relative flex items-center justify-center border-2 border-indigo-50"
        >
          <DogLogo />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">AI</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
