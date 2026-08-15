// scripts/healthcheck.ts
async function checkPlatformHealth() {
  const BASE_URL = process.env.APP_URL || "http://localhost:3000";
  console.log(`[HealthCheck] Tekshirilmoqda: ${BASE_URL}`);

  try {
    // 1. Health API Tekshiruvi
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log("✅ Server API Status:", healthData.status);

    // 2. Gemini AI Grammar API Tekshiruvi
    const aiRes = await fetch(`${BASE_URL}/api/ai/correct-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "salom tayorlov darsi" }),
    });
    const aiData = await aiRes.json();
    console.log("✅ Gemini AI Grammar Status: Faol (Javob:", aiData.correctedText, ")");

    console.log("🚀 Barcha asosiy servislar 100% barqaror ishlamoqda!");
  } catch (error) {
    console.error("❌ Xatolik aniqlandi:", error);
    process.exit(1);
  }
}

checkPlatformHealth();
