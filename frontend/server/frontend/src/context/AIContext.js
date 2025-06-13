// AIContextProvider.js

import { createContext, useState } from "react";
import runChat from "../config/runChat";

export const AIContext = createContext();

const AIContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [error, setError] = useState(null);

  // ✅ NEW: Full conversation history
  const [chatHistory, setChatHistory] = useState([]);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async (promptArg) => {
    const prompt = promptArg || input;
    if (!prompt.trim()) return;

    try {
      console.log("Starting chat with prompt:", prompt);
      setError(null);
      setInput("");
      setResultData("");
      setLoading(true);
      setShowResult(true);

      setRecentPrompt(prompt);
      setPrevPrompts((prev) => [...prev, prompt]);

      // ✅ NEW: Add user message to history
      const userMessage = { role: "user", content: prompt };
      const updatedHistory = [...chatHistory, userMessage];

      // ✅ Send full chat history
      const response = await runChat(updatedHistory);

      // ✅ Add assistant's reply to history
      const assistantMessage = { role: "assistant", content: response };
      setChatHistory([...updatedHistory, assistantMessage]);

      // ✅ Format response for display
      let formatted = response
        .split("**")
        .map((part, idx) => (idx % 2 === 1 ? `<b>${part}</b>` : part))
        .join("")
        .replace(/\*/g, "</br>");

      const newResponseArray = formatted.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (err) {
      console.error("Chat error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      setError(err.message);
      setResultData("Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    error,
    chatHistory, // optional to expose
  };

  return (
    <AIContext.Provider value={contextValue}>
      {props.children}
    </AIContext.Provider>
  );
};

export default AIContextProvider;
