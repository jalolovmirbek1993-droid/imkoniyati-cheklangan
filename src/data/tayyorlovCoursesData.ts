import { TayyorlovCourse, SignGesture } from "../types";

export const TAYYORLOV_COURSES: TayyorlovCourse[] = [
  {
    id: "ishora-tili-course",
    title: "Ishora Tili Boshlang'ich Tayyorlov Kursi",
    description: "Eshitishida va gapirishida nuqsoni bor o'quvchilar uchun ishora tili alifbosi, iboralar va vizual muloqot tayyorlov moduli.",
    iconName: "Hand",
    targetAudience: "Eshitish va gapirish nuqsoni bor o'quvchilar hamda muloqot qiluvchilar",
    totalModules: 2,
    badgeText: "Eshitish va Ishora Moduli",
    modules: [
      {
        id: "ishora-modul-1",
        title: "1-Dars: Ishora Alifbosi va Asosiy Salomlashuv",
        content: "Ushbu tayyorlov darsida biz barmoq alifbosi va kundalik salomlashuv ishoralarini o'rganamiz. Har bir harf va so'z mos keluvchi vizual qo'l harakatiga ega.",
        audioLectureText: "Salom! Tayyorlov darsimizga xush kelibsiz. Birinchi darsda barmoq alifbosi va salomlashish harakatlarini o'rganamiz.",
        signLanguageKeyWords: [
          { word: "Salom", description: "O'ng qo'lni peshona oldidan o'ngga silkitish", emoji: "👋" },
          { word: "Rahmat", description: "O'ng kaftni ko'krak ustiga qo'yib, ozgina egilish", emoji: "🙏" },
          { word: "Xayr", description: "Kaftni ochib, barmoqlarni qimirlatish", emoji: "✋" },
          { word: "Tushundim", description: "Ko'rsatgich barmoqni peshona yoniga tegizib, bosh silkish", emoji: "💡" },
        ],
        quiz: [
          {
            id: "q1",
            question: "'Salom' ishorasi qanday bajariladi?",
            options: [
              "O'ng qo'lni peshona oldidan o'ngga silkitiladi",
              "Kaft bilan stolga uriladi",
              "Ikkala qo'l musht qilinadi",
            ],
            correctAnswer: 0,
            explanation: "'Salom' harakati o'ng qo'lni peshona sohasi orqali ohista silkitish orqali ko'rsatiladi.",
            signHint: "👋 Peshona oldida qo'l silkiting",
          },
        ],
      },
      {
        id: "ishora-modul-2",
        title: "2-Dars: Ta'lim va Kundalik Ehtiyoj Iboralari",
        content: "Maktab va tayyorlov kurslarida ishlatiladigan so'zlar: 'Kitob', 'Savol', 'Yordam', 'O'qituvchi'.",
        audioLectureText: "Ikkinchi darsimizda o'quv va tayyorlov kurslariga oid so'zlarni o'rganamiz.",
        signLanguageKeyWords: [
          { word: "Kitob", description: "Ikkala kaftni birga birlashtirib, kitobga o'xshab ochish", emoji: "📖" },
          { word: "Savol", description: "So'roq belgisiga o'xshatib ko'rsatgich barmoqni burish", emoji: "❓" },
          { word: "Yordam", description: "Chap kaft ustiga o'ng mushtni mehribonlik bilan qo'yish", emoji: "🤝" },
        ],
        quiz: [
          {
            id: "q2",
            question: "'Kitob' ishorasi qanday shaklda tasvirlanadi?",
            options: [
              "Ikkala kaftni birlashtirib kitobga o'xshab ochish",
              "Kaftni tepaga ko'tarish",
              "Barmoqlar bilan havoda doira chizish",
            ],
            correctAnswer: 0,
            explanation: "Ikkala kaft birlashtirilib, ochilganda kitob sahifalari tasvirlanadi.",
          },
        ],
      },
    ],
  },
  {
    id: "ovozli-ekran-course",
    title: "Ekran O'quvchi va Ovozli Muloqot Tayyorlov Kursi",
    description: "Ko'zi ojiz va zaif ko'ruvchi o'quvchilar uchun Screen Reader, VoiceOver va ovozli sintizatorlar tayyorlov moduli.",
    iconName: "Volume2",
    targetAudience: "Ko'zi ojizlar va zaif ko'ruvchilar",
    totalModules: 1,
    badgeText: "Audio va Ovoz Moduli",
    modules: [
      {
        id: "ovoz-modul-1",
        title: "1-Dars: Screen Reader Tizimi Bilan Tanishish",
        content: "Ekran o'quvchilar raqamli ekrandagi matnlar, tugmalar va veb tuzilmalarini nutqqa aylantiradi. Klaviatura orqali boshqarish asoslari.",
        audioLectureText: "Screen reader tayyorlov darsimizda klaviatura orqali navigatsiya qilishni mashq qilamiz.",
        signLanguageKeyWords: [
          { word: "Eshitish", description: "O'ng ko'rsatgich barmoqni quloqqa tegizish", emoji: "👂" },
          { word: "Ovoz", description: "Barmoqni tomoqqa tegizib ko'rsatish", emoji: "🗣️" },
        ],
        quiz: [
          {
            id: "qo1",
            question: "Ekran o'quvchi dasturlar nima uchun xizmat qiladi?",
            options: [
              "Ekrandagi barcha matn va tugmalarni ovozli o'qib beradi",
              "Kompyuter ekranini yoritadi",
              "Rasm chizadi",
            ],
            correctAnswer: 0,
            explanation: "Ekran o'quvchilar ko'zi ojiz foydalanuvchilar uchun kompyuter va telefon ekranini nutqqa aylantiradi.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-text-correct-course",
    title: "AI Matn Tahriri va Tayyorlov Kursi",
    description: "Nutqida va yozishda qiyinchilikka ega o'quvchilar uchun AI yordamida tezkor fikrni to'g'ri yozish tayyorlov kursi.",
    iconName: "Sparkles",
    targetAudience: "Nutqida va yozishda qiyinchiligi bor o'quvchilar",
    totalModules: 1,
    badgeText: "AI Matn va Grammatika",
    modules: [
      {
        id: "ai-modul-1",
        title: "1-Dars: AI Yordamida Matnni Mukammallashtirish",
        content: "Ushbu darsda ovozdan matnga aylangan iboralarni Sun'iy Intellekt orqali xatosiz grammatik jumlaga aylantirish o'rgatiladi.",
        audioLectureText: "AI matn tahriri darsida kiritilgan fikringizni AI avtomatik to'g'rilashini o'rganamiz.",
        signLanguageKeyWords: [
          { word: "Yozish", description: "O'ng barmoqlar bilan chap kaftga yozish harakati", emoji: "✍️" },
          { word: "AI Yordami", description: "Bosh uzra barmog'i bilan uchqun harakati chizish", emoji: "✨" },
        ],
        quiz: [
          {
            id: "qai1",
            question: "AI matn to'g'rilash tugmasining vazifasi nimadan iborat?",
            options: [
              "Chala yoki qisqa matnlarni xatosiz, grammatik to'g'ri shaklga keltirish",
              "Matnni o'chirib tashlash",
              "Klaviaturaning rangini o'zgartirish",
            ],
            correctAnswer: 0,
            explanation: "AI generatori matn xatolarini to'g'rilab, aniq muloqot matnini shakllantiradi.",
          },
        ],
      },
    ],
  },
];

export const SIGN_DICTIONARY: SignGesture[] = [
  { word: "Salom", description: "O'ng qo'lni peshona oldida yengil silkitish", emoji: "👋", category: "Muloqot" },
  { word: "Rahmat", description: "O'ng kaftni ko'krak ustiga muloyim qo'yish", emoji: "🙏", category: "Muloqot" },
  { word: "Xayr", description: "Kaftni o'ngga-chapga tebratish", emoji: "✋", category: "Muloqot" },
  { word: "Tushundim", description: "Bosh silkib ko'rsatgich barmoqni boshga tegizish", emoji: "💡", category: "Tushuncha" },
  { word: "Tayyorlov", description: "Ikki qo'lni oldinda ketma-ket aylanma harakati", emoji: "📚", category: "Ta'lim" },
  { word: "O'qituvchi", description: "Barmoqlar bilan doskaga yozish harakatini simulyatsiya qilish", emoji: "👨🏫", category: "Ta'lim" },
  { word: "Yordam", description: "O'ng kaft bilan chap kaftni qo'llab-quvvatlash", emoji: "🤝", category: "Yordam" },
  { word: "Ovoz", description: "Tomog'iga tegizib gapirish harakati", emoji: "🗣️", category: "Muloqot" },
  { word: "Eshitish", description: "Quloq apparatiga yoki quloqqa ko'rsatish", emoji: "👂", category: "Muloqot" },
  { word: "Raqamli AI", description: "Barmoqlar bilan havoda yorqin nur chizish", emoji: "🤖", category: "Texnologiya" },
];
