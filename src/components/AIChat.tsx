import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { GoogleGenAI } from '@google/genai';

// Initialize the API with an empty key for now (the user can add it later via environment variables)
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'API_KEY_REQUIRED' });

export default function AIChat() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { speak } = useAccessibility();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        const response = await genAI.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: userMessage,
        });
        const responseText = response.text || '';
        
        setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
        speak(responseText); // Avtomatik tarzda javobni o'qib eshittirish
      } else {
        const fallbackText = "API kaliti sozlanmagan. Iltimos, VITE_GEMINI_API_KEY ni .env fayliga kiriting.";
        setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
        speak(fallbackText);
      }
    } catch (error) {
      console.error(error);
      const errorText = "Kechirasiz, xatolik yuz berdi.";
      setMessages(prev => [...prev, { role: 'ai', text: errorText }]);
      speak(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
      <div className="bg-blue-600 p-4 text-white font-bold text-center" aria-live="polite">
        Gemini AI Yordamchisi
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto h-96 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-blue-100 text-blue-900 self-end' 
                : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100 text-gray-800 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">Gemini o'ylamoqda...</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-900 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..." 
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Gemini AI ga savol yozish"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700"
          aria-label="Xabarni yuborish"
        >
          Yuborish
        </button>
      </form>
    </div>
  );
}
