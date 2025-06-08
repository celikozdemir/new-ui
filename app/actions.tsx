import { Message } from "@/components/message";
import { azure } from "@ai-sdk/azure";
import { CoreMessage, generateId, generateText } from "ai";
import {
  createAI,
  getMutableAIState,
  streamUI,
  getAIState,
  createStreamableValue,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { CameraView } from "@/components/camera-view";
import { HubView } from "@/components/hub-view";
import { UsageView } from "@/components/usage-view";
import { ContactsView } from "@/components/contacts-view";
import { BlueText } from "@/components/blue-text";

export interface Hub {
  climate: Record<"low" | "high", number>;
  lights: Array<{ name: string; status: boolean }>;
  locks: Array<{ name: string; isLocked: boolean }>;
}

let hub: Hub = {
  climate: {
    low: 23,
    high: 25,
  },
  lights: [
    { name: "patio", status: true },
    { name: "kitchen", status: false },
    { name: "garage", status: true },
  ],
  locks: [{ name: "back door", isLocked: true }],
};

// AI-driven decision making function
const makeDecision = async (userQuery: string, currentTool: string | null) => {
  "use server";

  const result = await generateText({
    model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"),
    temperature: 0.1,
    system: `You are an AI assistant for a smart home automation system. 

AVAILABLE TOOLS:
1. cameras - Security cameras and surveillance feeds. Contains live camera feeds, recordings, security monitoring.
2. hub - Smart home control panel. Contains lights, temperature, locks, climate controls, device status.
3. usage - Utility consumption data. Contains electricity, water, gas usage statistics and billing.
4. contacts - Company contact information. Contains phone numbers, email addresses, office location, support details.

CURRENT STATE: ${
      currentTool
        ? `Currently displaying: ${currentTool}`
        : "No tool currently displayed"
    }

YOUR JOB: Analyze the user query and decide what action to take. Return a JSON object with:
{
  "action": "show_tool" | "same_tool" | "text_only",
  "tool": "cameras" | "hub" | "usage" | "contacts" | null,
  "response": "your response text here"
}

DECISION RULES:
- If query asks for a tool that's NOT currently displayed → action: "show_tool", tool: "toolname"
- If query asks for a tool that IS currently displayed → action: "same_tool", tool: null  
- If query is general/conversational (not tool-related) → action: "text_only", tool: null

EXAMPLES:
Query: "show cameras" + Current: null → {"action": "show_tool", "tool": "cameras", "response": "Here are your security camera feeds"}
Query: "what is your email" + Current: null → {"action": "show_tool", "tool": "contacts", "response": "You can find our contact information here"}
Query: "turn on lights" + Current: null → {"action": "show_tool", "tool": "hub", "response": "Here are your smart home controls"}
Query: "show cameras" + Current: "cameras" → {"action": "same_tool", "tool": null, "response": "The security cameras are already displayed"}
Query: "what is AI" + Current: "cameras" → {"action": "text_only", "tool": null, "response": "AI stands for Artificial Intelligence..."}

Always respond with valid JSON only. No other text.`,
    prompt: `User query: "${userQuery}"`,
  });

  try {
    return JSON.parse(result.text);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      action: "text_only",
      tool: null,
      response: result.text,
    };
  }
};

const sendMessage = async (
  message: string,
  currentTool: string | null = null
) => {
  "use server";

  console.log(
    "Server: Processing message:",
    message,
    "Current tool:",
    currentTool
  );

  // Get AI decision
  const decision = await makeDecision(message, currentTool);
  console.log("Server: AI Decision:", decision);

  const messages = getMutableAIState<typeof AI>("messages");

  // Add user message to history
  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  // Execute the decision
  switch (decision.action) {
    case "show_tool":
      // Return the appropriate tool component
      let toolComponent;
      switch (decision.tool) {
        case "cameras":
          toolComponent = <CameraView />;
          break;
        case "hub":
          toolComponent = <HubView hub={hub} />;
          break;
        case "usage":
          toolComponent = <UsageView type="electricity" />;
          break;
        case "contacts":
          toolComponent = <ContactsView />;
          break;
        default:
          toolComponent = <BlueText>{decision.response}</BlueText>;
      }

      // Add tool response to history
      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: `Showing ${decision.tool} tool: ${decision.response}`,
        },
      ]);

      return {
        type: "tool",
        tool: decision.tool,
        component: toolComponent,
        response: decision.response,
      };

    case "same_tool":
    case "text_only":
      // Return text response
      messages.done([
        ...(messages.get() as CoreMessage[]),
        { role: "assistant", content: decision.response },
      ]);

      return {
        type: "text",
        tool: null,
        component: <BlueText>{decision.response}</BlueText>,
        response: decision.response,
      };

    default:
      // Fallback
      return {
        type: "text",
        tool: null,
        component: <BlueText>{decision.response}</BlueText>,
        response: decision.response,
      };
  }
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage: async (message: string) => sendMessage(message, null),
    sendMessageWithContext: sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
