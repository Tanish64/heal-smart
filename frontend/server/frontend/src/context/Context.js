import React, { createContext, useState } from "react";
import runChat from "../config/runChat"; // Make sure this path is correct

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async (messageText) => {
    const promptToSend = (messageText || input || "").trim();
    if (!promptToSend) return;

    try {
      setError(null);
      setInput("");
      setResultData("");
      setLoading(true);
      setShowResult(true);

      setRecentPrompt(promptToSend);
      setPrevPrompts((prev) => [...prev, promptToSend]);

      const userMessage = { role: "user", content: promptToSend };
      const updatedChat = [...chatHistory, userMessage];

      const response = await runChat(updatedChat);

      const assistantMessage = { role: "assistant", content: response };
      setChatHistory([...updatedChat, assistantMessage]);

      let formatted = response
        .split("**")
        .map((part, idx) => (idx % 2 === 1 ? `<b>${part}</b>` : part))
        .join("")
        .replace(/\*/g, "</br>");

      const newWords = formatted.split(" ");
      newWords.forEach((word, index) => delayPara(index, word + " "));
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Unable to process your request. Please try again later.");
      setResultData("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        recentPrompt,
        showResult,
        loading,
        resultData,
        error,
        prevPrompts,
        onSent,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
