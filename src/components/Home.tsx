import { useAccessibility } from '../context/AccessibilityContext';
import AIChat from '../components/AIChat';

export default function Home() {
  const { speak, isSpeaking, stopSpeaking, listen, isListening, transcript } = useAccessibility();

  const handleSpeak = () => {
    if (isSpeaking) stopSpeaking();
    else speak("Xush kelibsiz! Bu imkoniyati cheklanganlar uchun maxsus AI ekotizimi bosh sahifasi.");
  };

  return (
    <div className="flex flex-col gap-8 items-center text-center mt-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">AI Inclusive Ecosystem</h1>
      <p className="max-w-2xl text-lg">
        Ushbu platforma ko'zi ojiz yoki eshitishda nuqsoni bor foydalanuvchilar uchun qulay interfeys, 
        ovozli boshqaruv va sun'iy intellekt xizmatlarini taqdim etadi. (Navigatsiya uchun tepadagi menyuni ishlating).
      </p>

      <div className="flex gap-4">
        <button 
          onClick={handleSpeak}
          className={`px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-yellow-400 focus:outline-none ${
            isSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label={isSpeaking ? "O'qishni to'xtatish" : "Matnni ovozli o'qish"}
        >
          {isSpeaking ? "To'xtatish" : "Ovozli O'qish"}
        </button>
        
        <button 
          onClick={listen}
          className={`px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-yellow-400 focus:outline-none ${
            isListening ? 'bg-green-600 text-white animate-pulse' : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          aria-label="Ovoz orqali yozishni boshlash"
        >
          {isListening ? "Tinglanmoqda..." : "Mikrofon (STT)"}
        </button>
      </div>

      {transcript && (
        <div className="p-4 border border-green-500 rounded-lg w-full text-left">
          <strong>Ovozli kiritish natijasi:</strong> {transcript}
        </div>
      )}

      <div className="mt-8">
        <AIChat />
      </div>
    </div>
  );
}
