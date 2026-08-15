import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { sanitizePrivacy } from './src/middleware/privacy.js';

// Load environment variables
dotenv.config();

// Initialize Gemini Client (Free Model)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const AI_MODEL = 'gemini-2.0-flash';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(sanitizePrivacy);

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

// ==========================================
// 1. WebSocket (WS) Logic with AI Chat features
// ==========================================
interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  roomId: string;
  userId: string;
  userName: string;
}

const getOnlineUsers = (room: string) => {
  const users: any[] = [];
  wss.clients.forEach((client) => {
    const extClient = client as ExtWebSocket;
    if (extClient.readyState === WebSocket.OPEN && extClient.roomId === room) {
      users.push({ id: extClient.userId, name: extClient.userName });
    }
  });
  return users;
};

wss.on('connection', (ws: ExtWebSocket) => {
  ws.userId = `User-${Math.floor(Math.random() * 10000)}`;
  ws.userName = `Foydalanuvchi-${ws.userId.split('-')[1]}`;
  ws.roomId = 'main';
  ws.isAlive = true;

  console.log(`${ws.userName} connected to WS.`);

  ws.send(JSON.stringify({
    type: 'INIT',
    userId: ws.userId,
    userName: ws.userName,
    onlineUsers: getOnlineUsers(ws.roomId),
    history: []
  }));

  const broadcastToRoom = (roomId: string, message: any) => {
    wss.clients.forEach((client) => {
      const extClient = client as ExtWebSocket;
      if (extClient.readyState === WebSocket.OPEN && extClient.roomId === roomId) {
        extClient.send(JSON.stringify(message));
      }
    });
  };

  broadcastToRoom(ws.roomId, { type: 'USER_JOINED', onlineUsers: getOnlineUsers(ws.roomId) });

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'JOIN_ROOM') {
        ws.roomId = data.room;
        ws.send(JSON.stringify({ type: 'ROOM_CHANGED', room: ws.roomId, onlineUsers: getOnlineUsers(ws.roomId), history: [] }));
        broadcastToRoom(ws.roomId, { type: 'USERS_UPDATED', onlineUsers: getOnlineUsers(ws.roomId) });
        return;
      }

      if (data.type === 'SEND_MESSAGE') {
        let textToSend = data.text;
        
        // AI Auto-Correct
        if (data.autoCorrect) {
          try {
            const prompt = `Ushbu o'zbek tilidagi gapni xatolarini to'g'irlang (boshqa gap qo'shmang): "${data.text}"`;
            const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
            textToSend = response.text?.trim() || data.text;
          } catch (e) {
            console.error('AI Auto-correct error:', e);
          }
        }

        // Generate Sign Gestures (Mocking with AI)
        let signGestures: any[] = [];
        if (data.generateSignGestures) {
            signGestures = textToSend.split(' ').map((word: string) => ({
                word,
                gesture: `[${word} ishorasi]`
            }));
        }

        const msgObj = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'user',
          senderId: ws.userId,
          senderName: ws.userName,
          text: textToSend,
          timestamp: new Date().toLocaleTimeString('uz-UZ'),
          signGestures
        };

        broadcastToRoom(ws.roomId, { type: 'NEW_MESSAGE', message: msgObj });
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  });

  ws.on('close', () => {
    broadcastToRoom(ws.roomId, { type: 'USER_LEFT', onlineUsers: getOnlineUsers(ws.roomId) });
  });
});

// ==========================================
// 2. Gemini AI Endpoints
// ==========================================

// AI Sign Translate (Vision)
app.post('/api/ai/sign-translate', async (req, res) => {
  try {
    const { imageBase64 } = req.body; // In real app, send base64 to Gemini
    // For demo purposes, we return a mock translation using AI text generation instead of full vision
    const prompt = `Imo-ishora tilidagi qo'l harakatini tahlil qilyapmiz deb faraz qiling. Birorta ijobiy qisqa so'z (masalan: "Salom", "Rahmat", "Zo'r") qaytaring. Boshqa gap qo'shmang.`;
    const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
    res.json({ translation: response.text?.trim() || "Tushunarsiz ishora", confidence: Math.floor(Math.random() * 20) + 80 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Live Assist (Scene Description)
app.post('/api/ai/live-assist', async (req, res) => {
  try {
    const prompt = `Ko'zi ojiz inson uchun atrof-muhit tasvirlanmoqda deb faraz qiling. Uning oldida nimalar bo'lishi mumkinligi haqida 2 ta xavfsiz va 1 ta ehtiyot bo'lish kerak bo'lgan obyektni sanab o'ting (O'zbek tilida).`;
    const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
    res.json({ description: response.text || "Atrofda turli xil narsalar mavjud.", objects: ["Stol", "Odam"], safety_warnings: ["Zinapoya"] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Tutor Chat
app.post('/api/ai/tayyorlov-tutor', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Siz inklyuziv ta'lim uchun mehribon ustozsiz (AI_O'qituvchi). O'quvchining savoliga o'zbek tilida qisqa va tushunarli javob bering: "${message}"`;
    const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
    res.json({ text: response.text || "Tizimda xatolik yuz berdi." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 3. Mock Data Endpoints
// ==========================================

app.get('/api/posts', (req, res) => {
  res.json({ posts: [
    { id: '1', author_name: 'Rustam', author_role: 'Dasturchi', content: 'Inklyuziv platforma juda zo\'r!', likes: 10, created_at: 'Bugun', alt_text: 'Odamlar kompyuterda ishlamoqda' }
  ] });
});

app.post('/api/posts', async (req, res) => {
    // Generate AI alt-text if image is provided
    let alt_text = undefined;
    if (req.body.media_url) {
        const prompt = `Ushbu rasm uchun o'zbek tilida qisqa ko'zi ojizlar uchun alt-text yozing. Rasm tasavvuriy.`;
        const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
        alt_text = response.text;
    }
    res.json({ status: 'success', alt_text });
});

app.get('/api/jobs', (req, res) => {
  res.json({ jobs: [
    { id: '1', title: 'Frontend Dasturchi', company: 'Tech LLC', is_inclusive: true, target_abilities: ['blind', 'mute'], description: 'ReactJS dasturchi kerak', salary: '$500+', created_at: '2 kun oldin' }
  ] });
});

app.post('/api/jobs', (req, res) => {
  res.json({ status: 'success' });
});

app.get('/api/stories', (req, res) => {
  res.json({ stories: [
    { id: '1', author_name: 'Anvar', author_status: 'blind', title: 'Mening muvaffaqiyatim', content: 'Hech qachon taslim bo\'lmang...', likes: 25, created_at: 'Kecha' }
  ] });
});

app.post('/api/stories', (req, res) => {
  res.json({ status: 'success' });
});

app.post('/api/psychology/consultations', (req, res) => {
  res.json({ status: 'success' });
});

app.get('/api/exams/questions', (req, res) => {
  res.json({ questions: [
    { id: 'q1', course_id: 'c1', course_title: 'Imo-ishora Asoslari', question_text: 'Salomlashish qanday amalga oshiriladi?', options: ['O\'ng qo\'lni ko\'tarib', 'Bosh irg\'ab', 'Qo\'lni ko\'krakka qo\'yib'], correct_option_index: 0, audio_prompt: 'Salomlashish qanday amalga oshiriladi?', sign_gesture_prompt: 'Salomlashish' }
  ]});
});

app.post('/api/exams/submit', (req, res) => {
  res.json({ status: 'success', message: 'Tabriklaymiz, siz imtihondan o\'tdingiz!', result: { passed: true, score: 95, certificate_id: 'CERT-12345', course_title: 'Imo-ishora Asoslari' } });
});


app.post('/api/ai/correct-text', async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Ushbu o'zbek tilidagi gapni xatolarini to'g'irlang (boshqa gap qo'shmang): "${text}"`;
    const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
    res.json({ correctedText: response.text?.trim() || text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/admin/add_course', (req, res) => {
  res.json({ status: 'success' });
});

// ==========================================
// 4. Vite Integration for Development/Production
// ==========================================
const startServer = async () => {
    if (process.env.NODE_ENV !== 'production') {
        try {
            const { createServer: createViteServer } = await import('vite');
            const vite = await createViteServer({
                server: { middlewareMode: true, allowedHosts: true },
                appType: 'spa'
            });
            app.use(vite.middlewares);
        } catch (e) {
            console.warn("Vite middleware error.");
            app.use(express.static(path.join(process.cwd(), 'dist')));
        }
    } else {
        // Production mode
        app.use(express.static(path.join(process.cwd(), 'dist')));
        
        // Frontend React Router support for Production
        app.get('*', (req, res) => {
            res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
        });
    }

    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 AI Inclusive Platform Server is RUNNING`);
        console.log(`🌐 Local URL: http://localhost:${PORT}`);
        console.log(`🤖 AI Model: ${AI_MODEL} (Google Gemini)`);
        console.log(`========================================\n`);
    });
};

startServer();
