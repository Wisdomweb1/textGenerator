import React, { useState } from "react";


const Message = ({ message, onSummarize, onTranslate }) => {
  const [selectedLang, setSelectedLang] = useState("pt"); // Default selected translation language

  const canSummarize = message.language === "en" && message.text.length > 150;

  return (
    <div className="bg-white p-3 my-2 rounded shadow">
      {/* Display original text */}
      <p className="text-gray-800">{message.text}</p>

      {/* Show detected language */}
      {message.language && (
        <p className="text-sm text-blue-600 mt-1">
          Detected Language: {message.language.toUpperCase()}
        </p>
      )}

      {/* Display Summarize button if eligible */}
      {canSummarize && !message.summary && (
        <button
          className="mt-2 bg-green-500 text-white px-3 py-1 rounded focus:outline-none focus:ring-2"
          onClick={() => onSummarize(message.id, message.text)}
        >
          Summarize
        </button>
      )}

      {/* Display summary */}
      {message.summary && (
        <div className="mt-2 p-2 border rounded">
          <p className="font-semibold">Summary:</p>
          <p>{message.summary}</p>
        </div>
      )}

      {/* Translation Section */}
      <div className="mt-2">
        <label htmlFor={`lang-select-${message.id}`} className="mr-2">
          Translate:
        </label>
        {/* <select
          id={`lang-select-${message.id}`}
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="p-1 border rounded focus:outline-none focus:ring-2 bg-fuchsia-300"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select> */}
        <button
          className="ml-2 bg-purple-500 text-white px-3 py-1 rounded focus:outline-none focus:ring-2"
          onClick={() => onTranslate(message.id, message.text, selectedLang)}
        >
          Translate
        </button>
      </div>

      {/* Display translation */}
      {message.translation && (
        <div className="mt-2 p-2 border rounded">
          <p className="font-semibold">Translation:</p>
          <p>{message.translation}</p>
        </div>
      )}

      {/* Error message if any */}
      {message.error && (
        <p className="mt-2 text-red-500 font-bold">{message.error}</p>
      )}
    </div>
  );
};

export default Message;
