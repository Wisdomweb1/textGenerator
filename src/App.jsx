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

  if (text.length <= 150) {
    return text; // No need to summarize short text
  }

  console.log("Original Text:", text); // Debugging Output

  // Try Chrome AI Summarization API first
  if (window.chromeai && window.chromeai.summarize) {
    try {
      const response = await window.chromeai.summarize(text);
      console.log("Chrome Summarization API Response:", response);
      
      if (response && response.summary) {
        return response.summary;
      } else {
        console.warn("Chrome AI did not return a valid summary.");
      }
    } catch (error) {
      console.error("Chrome AI summarization failed:", error);
    }
  }

  // Fallback: Try Hugging Face Summarization API
  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer YOUR_HUGGINGFACE_API_KEY`, // Replace with actual API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const hfData = await hfResponse.json();
    console.log("Hugging Face Summarization Response:", hfData);

    if (hfData && hfData[0] && hfData[0].summary_text) {
      return hfData[0].summary_text;
    } else {
      console.warn("Hugging Face API did not return a valid summary.");
    }
  } catch (error) {
    console.error("Hugging Face summarization failed:", error);
  }

  // Final Fallback: Extract First 3 Sentences Manually
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const manualSummary = sentences.slice(0, 3).join(" ");
  console.log("Manual Summary:", manualSummary);

  return manualSummary;
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

    console.log("Google Translate Response:", data); // Debugging output

    if (data && data[0]) {
      // Extract translated text from all segments
      return data[0].map(segment => segment[0]).join(" ");
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
