// runChat.js

const fetch = require("node-fetch");

const MODEL_NAME = "deepseek/deepseek-chat-v3-0324:free";
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || "";

if (!API_KEY) {
  console.error("Warning: REACT_APP_OPENROUTER_API_KEY environment variable is not set");
}

const rateLimit = {
  requestsPerMinute: 60,
  requestQueue: [],
  lastRequestTimes: [],
  minRequestInterval: 3000,
};

const MAX_RETRIES = 3;
const QUOTA_RESET_INTERVAL = 60000;

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateRequestQueue() {
  const now = Date.now();
  rateLimit.lastRequestTimes = rateLimit.lastRequestTimes.filter(
    time => now - time < QUOTA_RESET_INTERVAL
  );
}

async function checkRateLimit() {
  updateRequestQueue();

  if (rateLimit.lastRequestTimes.length >= rateLimit.requestsPerMinute) {
    const oldestRequest = rateLimit.lastRequestTimes[0];
    const waitTime = QUOTA_RESET_INTERVAL - (Date.now() - oldestRequest);
    if (waitTime > 0) {
      await wait(waitTime);
    }
    updateRequestQueue();
  }

  const lastRequest = rateLimit.lastRequestTimes[rateLimit.lastRequestTimes.length - 1];
  if (lastRequest) {
    const timeSinceLastRequest = Date.now() - lastRequest;
    if (timeSinceLastRequest < rateLimit.minRequestInterval) {
      await wait(rateLimit.minRequestInterval - timeSinceLastRequest);
    }
  }

  rateLimit.lastRequestTimes.push(Date.now());
}

// ✅ CHANGED: Accepts `messages` instead of just `prompt`
async function runChat(messages, retryCount = 0) {
  try {
    await checkRateLimit();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Replace if deployed
        "X-Title": "your-project-name"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages // ✅ CHANGED from single prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `API call failed with status ${response.status}`);
    }

    return data.choices?.[0]?.message?.content?.trim() || "No response from model.";

  } catch (error) {
    console.error("DeepSeek API Error:", error);

    if (error.message.includes("RATE_LIMIT_EXCEEDED") || error.message.includes("429")) {
      if (retryCount < MAX_RETRIES) {
        const backoffTime = Math.pow(2, retryCount + 1) * 1000;
        console.log(`Rate limit exceeded. Retrying in ${backoffTime / 1000} seconds...`);
        await wait(backoffTime);
        return runChat(messages, retryCount + 1); // ✅ RECURSE with same messages
      }
      throw new Error("We're experiencing high traffic. Please try again in a few minutes.");
    }

    if (error.message.includes("INVALID_ARGUMENT")) {
      throw new Error("Invalid input. Please check your message and try again.");
    }

    if (error.message.includes("PERMISSION_DENIED") || error.message.includes("Unauthorized")) {
      throw new Error("API key error. Please check your OpenRouter credentials.");
    }

    throw new Error("Unable to process your request. Please try again later.");
  }
}

module.exports = runChat;
