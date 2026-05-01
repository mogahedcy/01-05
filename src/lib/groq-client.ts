import Groq from "groq-sdk";

// Use Llama 3.3 70B for fast, high-quality responses
export const GROQ_MODEL = "llama-3.3-70b-versatile";

// For more complex tasks with larger context
export const GROQ_MIXTRAL_MODEL = "mixtral-8x7b-32768";

// Function to get a fresh Groq AI client with current API key
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY غير متوفر - يرجى إضافة المفتاح في Secrets");
  }
  return new Groq({ apiKey });
}

// Export a proxy object that creates a fresh client on each access
const ai = new Proxy({} as Groq, {
  get(target, prop) {
    const client = getGroqClient();
    return (client as any)[prop];
  }
});

export default ai;
