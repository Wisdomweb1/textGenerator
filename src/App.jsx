import React, { useState } from "react";
import Text from "./assets/screens/text";
import Input from "./assets/screens/input";

// AI-powered API integration using Chrome AI APIs
const detectLanguage = async (text) => {
  if (!text) return "en";

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();

    console.log("Google Translate Detection Response:", data);
    
    if (data && data[2]) { // Google's response format
      return data[2]; // Detected language
    }
  } catch (error) {
    console.error("Language detection failed:", error);
  }

  console.warn("Falling back to English.");
  return "en";
};





const summarizeText = async (text) => {
  if (!text) return "";

  // Only summarize if text is longer than 150 characters
  if (text.length <= 150) {
    return text;
  }

  if (window.chromeai && window.chromeai.summarize) {
    try {
      const response = await window.chromeai.summarize(text);
      console.log("Summarization API Response:", response);

      return response.summary || "Summarization failed.";
    } catch (error) {
      console.error("Summarization failed:", error);
      return "Summarization error!";
    }
  }

  return text; // Fallback: Return full text if no API
};


const translateText = async (text, sourceLang, targetLang) => {
  if (!text || !sourceLang || !targetLang || sourceLang === targetLang) {
    return "Please select two distinct languages.";
  }

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    
    console.log("Google Translate Response:", data);

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0]; // Extract translated text
    }
  } catch (error) {
    console.error("Translation API failed:", error);
    return "Translation error!";
  }

  return "Translation error!";
};


function App() {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const detectedLang = await detectLanguage(text);
    console.log("Detected Language:", detectedLang);

    const newMessage = {
      id: Date.now(),
      text,
      language: detectedLang,
      summary: null,
      translation: null,
      error: null,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const updateMessage = (id, updatedFields) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updatedFields } : msg))
    );
  };

  const handleSummarize = async (id, text) => {
    try {
      const summary = await summarizeText(text);
      updateMessage(id, { summary });
    } catch {
      updateMessage(id, { error: "Summarization failed." });
    }
  };

  const handleTranslate = async (id, text, targetLang) => {
    try {
      const message = messages.find((msg) => msg.id === id);
      if (!message || !message.language) return;
  
      const translation = await translateText(text, message.language, targetLang);
  
      updateMessage(id, { translation });
  
      // Automatically update the dropdown selection
      setSelectedLanguage(targetLang);
    } catch {
      updateMessage(id, { error: "Translation failed." });
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <header className="bg-indigo-700 text-white p-4 text-center text-2xl font-bold shadow-lg">
        🚀 HNG Text Processing interface
      </header>

      <div className="p-4 text-center">
        <label className="mr-2">Translate to:</label>
        <select className=" bg-fuchsia-700" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <div className="flex-grow p-4 overflow-y-auto text-black">
        <Text messages={messages} onSummarize={handleSummarize} onTranslate={(id, text) => handleTranslate(id, text, selectedLanguage)} />
      </div>

      <div className="p-4 bg-gray-800 shadow-md">
        <Input onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
