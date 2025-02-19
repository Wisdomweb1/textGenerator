import React, { useState } from "react";

const Input = ({ onSend }) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(inputText);
    setInputText(""); // clear after sending
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-200 flex items-center">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2"
        rows="2"
        aria-label="Input text"
      ></textarea>
      <button
        type="submit"
        className="ml-2 bg-blue-500 p-3 rounded-full focus:outline-none focus:ring-2"
        aria-label="Send text"
      >
        <span className="">➤</span>
      </button>
    </form>
  );
};  
export default Input;
