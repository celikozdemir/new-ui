"use client";

import React from "react";
import { useUIState } from "ai/rsc";
import { TextStreamMessage } from "./message";

export function AITextDisplay() {
  const [messages] = useUIState();
  const [currentText, setCurrentText] = React.useState("");

  React.useEffect(() => {
    // Find the latest text message and extract its content
    let latestText = "";

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (React.isValidElement(message)) {
        // Check if this is a TextStreamMessage
        if (message.type === TextStreamMessage) {
          const props = message.props as any;

          // Try to access the current value from the streamable
          if (props.content && typeof props.content === "object") {
            // Check if it has a current value
            if (props.content.curr !== undefined) {
              latestText = props.content.curr || "";
              break;
            }
            // Fallback: try to access _value or value
            if (props.content._value !== undefined) {
              latestText = props.content._value || "";
              break;
            }
            if (props.content.value !== undefined) {
              latestText = props.content.value || "";
              break;
            }
          }
        }

        // Check if this is a regular Message with string content
        const messageProps = message.props as any;
        if (
          messageProps.role === "assistant" &&
          typeof messageProps.content === "string"
        ) {
          latestText = messageProps.content;
          break;
        }
      }
    }

    setCurrentText(latestText);
  }, [messages]);

  // Set up polling to check for streamable content updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];

        if (
          React.isValidElement(message) &&
          message.type === TextStreamMessage
        ) {
          const props = message.props as any;

          if (
            props.content &&
            typeof props.content === "object" &&
            props.content.curr !== undefined
          ) {
            const newText = props.content.curr || "";
            if (newText !== currentText) {
              setCurrentText(newText);
              break;
            }
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [messages, currentText]);

  if (!currentText) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-2xl font-medium text-blue-600 dark:text-blue-400 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg px-4 py-2">
          {currentText}
        </p>
      </div>
    </div>
  );
}
