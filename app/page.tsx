"use client";

import React, { ReactNode, useRef, useEffect, useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { AI } from "./actions";
import { BottomNavigation } from "@/components/bottom-navigation";
import { BlueText } from "@/components/blue-text";
import { LoadingDots } from "@/components/loading-dots";

export default function Home() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { sendMessageWithContext } = useActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [currentTool, setCurrentTool] = useState<ReactNode | null>(null);
  const [currentToolType, setCurrentToolType] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<
    Array<{ id: number; component: ReactNode }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("Main page: useUIState messages:", messages.length, messages);
  }, [messages]);

  // Clean AI-driven message handler
  const handleAIMessage = async (userMessage: string) => {
    console.log("Main page: handleAIMessage called with:", userMessage);
    setIsProcessing(true);

    try {
      console.log(
        "Main page: calling sendMessage with current tool:",
        currentToolType
      );

      // Send message with current tool state to AI for decision making
      const response = await sendMessageWithContext(
        userMessage,
        currentToolType
      );
      console.log("Main page: got AI response:", response);

      // Execute the AI's decision
      switch (response.type) {
        case "tool":
          console.log("✅ AI decided to show tool:", response.tool);
          // Clear text overlays and show new tool
          setTextOverlays([]);
          setCurrentTool(response.component);
          setCurrentToolType(response.tool);

          // Show contextual text briefly
          const toolOverlayId = Date.now();
          setTimeout(() => {
            setTextOverlays([
              {
                id: toolOverlayId,
                component: <BlueText>{response.response}</BlueText>,
              },
            ]);

            // Auto-remove after 5 seconds
            setTimeout(() => {
              setTextOverlays((prev) =>
                prev.filter((overlay) => overlay.id !== toolOverlayId)
              );
            }, 5000);
          }, 300);
          break;

        case "text":
          console.log("🔵 AI decided to show text response");
          // Show text overlay (keeping current tool if any)
          const textOverlayId = Date.now();
          setTextOverlays([]);
          setTimeout(() => {
            setTextOverlays([
              {
                id: textOverlayId,
                component: response.component,
              },
            ]);

            // Auto-remove after 6 seconds
            setTimeout(() => {
              setTextOverlays((prev) =>
                prev.filter((overlay) => overlay.id !== textOverlayId)
              );
            }, 6000);
          }, 10);
          break;

        default:
          console.warn("Unknown response type:", response);
      }

      // Update messages array
      setMessages((prevMessages) => [...prevMessages, response.component]);
    } catch (error) {
      console.error("Main page: error in sendMessage:", error);

      // Show error as text overlay
      const errorOverlayId = Date.now();
      setTextOverlays([
        {
          id: errorOverlayId,
          component: (
            <BlueText>Sorry, something went wrong. Please try again.</BlueText>
          ),
        },
      ]);

      setTimeout(() => {
        setTextOverlays((prev) =>
          prev.filter((overlay) => overlay.id !== errorOverlayId)
        );
      }, 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white dark:bg-zinc-900">
      <div
        ref={messagesContainerRef}
        className="w-full h-[calc(100vh-5rem)] overflow-auto"
      >
        {/* Show persistent tool if available */}
        {currentTool && (
          <div className="w-full h-full">
            <React.Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <div className="text-lg text-blue-600">
                    Loading {currentToolType}...
                  </div>
                  <div className="text-sm text-gray-500">
                    This may take a few moments
                  </div>
                </div>
              }
            >
              {currentTool}
            </React.Suspense>
          </div>
        )}

        {/* If no tool, show welcome message or latest message */}
        {!currentTool && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                Smart Home AI
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ask me about cameras, smart home controls, energy usage, or
                contact information
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text overlays - appear over everything */}
      {textOverlays.map((overlay) => (
        <div key={overlay.id}>{overlay.component}</div>
      ))}

      {/* Loading dots - show when processing */}
      {isProcessing && <LoadingDots />}

      <BottomNavigation
        onMessage={handleAIMessage}
        isProcessing={isProcessing}
        hasMessages={messages.length > 0}
      />
    </div>
  );
}
