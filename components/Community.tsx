
import React, { useState } from 'react';
import { CommunityQuestion, UserProfile } from '../types';
import { getDogAdvice } from '../services/gemini';

interface CommunityProps {
  profile: UserProfile;
}

const MOCK_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q1',
    userId: 'u100',
    userName: 'דניאל ג.',
    title: 'הכלב שלי לא מפסיק לנבוח על השליח',
    content: 'מה אפשר לעשות? כל פעם שיש מישהו בדלת הוא משתגע.',
    timestamp: new Date().toISOString(),
    answers: [
      { id: 'a1', userId: 'u200', userName: 'מיה כ.', userRole: 'OWNER', content: 'נסה לתת לו חטיף בדיוק כשהוא רואה את השליח לפני שהוא מתחיל לנבוח.', timestamp: new Date().toISOString() }
    ]
  },
  {
    id: 'q2',
    userId: 'u101',
    userName: 'יובל א.',
    title: 'מתי כדאי להתחיל לאלף גור?',
    content: 'הבאנו גור גולדן בן חודשיים, מתי הזמן האידיאלי?',
    timestamp: new Date().toISOString(),
    answers: []
  }
];

const Community: React.FC<CommunityProps> = ({ profile }) => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>(MOCK_QUESTIONS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  const [isAiAnswering, setIsAiAnswering] = useState<string | null>(null);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    /* Use firstName and lastName as fallback if name is not available to fix userName type error */
    const fullName = profile.name || `${profile.firstName} ${profile.lastName}`;

    const newQ: CommunityQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      userId: profile.businessId || 'GUEST',
      userName: fullName,
      title: newTitle,
      content: newContent,
      timestamp: new Date().toISOString(),
      answers: []
    };

    setQuestions([newQ, ...questions]);
    setNewTitle('');
    setNewContent('');
    setShowAskForm(false);
  };

  const handleAiHelp = async (questionId: string, title: string, content: string) => {
    setIsAiAnswering(questionId);
    const aiResponse = await getDogAdvice(`שאלה מהקהילה: ${title} - ${content}. תן תשובה קצרה ומקצועית כדוג-ווקר מומחה של GoDog.`);
    
    if (aiResponse) {
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, {
              id: 'ai-' + Date.now(),
              userId: 'GODOG-AI',
              userName: 'GoDog Expert (AI)',
              userRole: 'ADMIN',
              content: aiResponse,
              timestamp: new Date().toISOString(),
              isExpert: true
            }]
          };
        }
        return q;
      }));
    }
    setIsAiAnswering(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Community Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-indigo-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-5xl font-black mb-4 tracking-tight">קהילת GoDog</h2>
          <p className="text-indigo-100 text-lg font-bold opacity-80 leading-relaxed">
            המקום שבו כלבנים עוזרים לכלבנים. שאלו שאלות, שתפו חוויות וקבלו עצות מבעלי כלבים אחרים ומהמומחים שלנו.
          </p>
        </div>
        <button 
          onClick={() => setShowAskForm(!showAskForm)}
          className="relative z-10 bg-white text-indigo-900 px-10 py-5 rounded-[28px] font-black text-lg hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
        >
          {showAskForm ? 'סגור טופס' : 'שאלו שאלה את הקהילה'}
        </button>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -translate-x-20 -translate-y-20 blur-3xl opacity-20"></div>
      </div>

      {showAskForm && (
        <form onSubmit={handleAsk} className="bg-white p-10 rounded-[44px] shadow-sm border border-indigo-100 animate-in zoom-in duration-300 space-y-6">
          <h3 className="text-2xl font-black text-indigo-900">מה השאלה שלך?</h3>
          <div className="space-y-4">
            <input 
              type="text" required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="כותרת קצרה לשאלה..."
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
            />
            <textarea 
              required
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="פרטו כאן את השאלה שלכם..."
              rows={4}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">
            פרסם שאלה בקהילה
          </button>
        </form>
      )}

      {/* Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {questions.map(q => (
          <div key={q.id} className="bg-white rounded-[44px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all">
            <div className="p-10 border-b border-gray-50 bg-gray-50/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                    {q.userName[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-lg">{q.userName}</h4>
                    <p className="text-xs text-gray-400 font-bold">{new Date(q.timestamp).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">Community</span>
              </div>
              <h3 className="text-2xl font-black text-indigo-900 mb-4">{q.title}</h3>
              <p className="text-gray-600 font-bold leading-relaxed">{q.content}</p>
            </div>
            
            <div className="p-10 flex-grow space-y-6">
               <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  תשובות ({q.answers.length})
               </h5>
               
               <div className="space-y-6">
                  {q.answers.map(a => (
                    <div key={a.id} className={`p-6 rounded-[32px] ${a.isExpert ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                       <div className="flex justify-between items-center mb-3">
                          <p className="text-xs font-black">{a.userName} {a.isExpert && '⭐'}</p>
                          <p className={`text-[10px] font-bold ${a.isExpert ? 'text-indigo-200' : 'text-gray-400'}`}>{new Date(a.timestamp).toLocaleTimeString('he-IL')}</p>
                       </div>
                       <p className="text-sm font-bold leading-relaxed">{a.content}</p>
                    </div>
                  ))}
                  {q.answers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 opacity-40">
                       <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                       <p className="font-black text-gray-400">טרם התקבלו תשובות</p>
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t border-gray-50 flex gap-4">
                  <input 
                    type="text" 
                    placeholder="כתוב תשובה..."
                    className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // In real app, send answer
                        alert('תשובתך נשלחה לקהילה!');
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleAiHelp(q.id, q.title, q.content)}
                    disabled={isAiAnswering === q.id}
                    className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                  >
                    {isAiAnswering === q.id ? 'המומחה חושב...' : 'בקש תשובת מומחה AI'}
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
