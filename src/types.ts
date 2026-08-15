export type ContrastTheme = "slate-dark" | "yellow-black" | "high-light";
export type NavTab = 
  | "chat" 
  | "ishora" 
  | "tayyorlov" 
  | "cv-sign" 
  | "live-assist" 
  | "social-feed" 
  | "bandlik" 
  | "psychology"
  | "imtihon"
  | "admin"
  | "general";

export type FontSize = "small" | "normal" | "large" | "extra-large";
export type AccessibilityMode = "visual" | "hearing" | "speech" | "general";

export interface AccessibilitySettings {
  contrastTheme: ContrastTheme;
  fontSize: FontSize;
  screenReaderEnabled: boolean;
  autoSpeakMessages: boolean;
  signLanguageAssist: boolean;
  userMode: AccessibilityMode;
  speakSpeed: number; // 0.8 - 1.5
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  correctedText?: string;
  signLanguageGestures?: string[];
  timestamp: string;
  room: string;
  isAi?: boolean;
}

export interface OnlineUser {
  id: string;
  name: string; // e.g., "[Foydalanuvchi_1]"
  role: "o'quvchi" | "ustoz" | "mehmon";
  accessibilityMode: AccessibilityMode;
}

export interface SignGesture {
  word: string;
  description: string;
  emoji?: string;
  category?: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  signHint?: string;
}

export interface TayyorlovCourse {
  id: string;
  title: string;
  description: string;
  iconName: string;
  targetAudience: string;
  totalModules: number;
  badgeText: string;
  modules: {
    id: string;
    title: string;
    content: string;
    audioLectureText: string;
    signLanguageKeyWords: { word: string; description: string; emoji: string }[];
    quiz: QuizItem[];
  }[];
}

export interface PostRecord {
  id: number;
  author_id: number;
  author_name: string;
  media_url?: string;
  text_content: string;
  ai_alt_text?: string;
  created_at: string;
  likes_count?: number;
}

export interface JobRecord {
  id: number;
  title: string;
  employer_name: string;
  category: "IT" | "Copywriting" | "Design" | "Translation" | "Voiceover" | "Support";
  required_ability: "blind" | "deaf" | "mute" | "none" | "any";
  salary_range: string;
  description: string;
  contact_info: string;
  posted_at: string;
  applications_count: number;
}

export interface StoryRecord {
  id: number;
  author_name: string;
  author_status: "blind" | "deaf" | "mute" | "none";
  title: string;
  content: string;
  likes: number;
  created_at: string;
  audio_narrative?: string;
}

export interface PsychConsultation {
  id: number;
  client_name: string;
  specialist_name: string;
  status: "pending" | "approved" | "completed";
  topic: string;
  scheduled_time: string;
  is_anonymous: boolean;
}

export interface ExamQuestion {
  id: number;
  course_id: number;
  course_title: string;
  question_text: string;
  audio_prompt: string;
  sign_gesture_prompt?: string;
  options: string[];
  correct_option: number;
  explanation: string;
}

export interface ExamResult {
  exam_id: string;
  user_name: string;
  course_title: string;
  score: number;
  total_questions: number;
  passed: boolean;
  mode: "voice_stt" | "visual_sign" | "standard";
  certificate_id?: string;
  completed_at: string;
}
