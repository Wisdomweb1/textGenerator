import React from "react";
import Message from "../message";

const Text = ({ messages, onSummarize, onTranslate }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          onSummarize={onSummarize}
          onTranslate={onTranslate}
        />
      ))}
    </div>
  );
};

export default Text;
