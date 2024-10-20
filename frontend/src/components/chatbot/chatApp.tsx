import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';

type ChatBotDemoProps = {
  serverUrl?: string;
};

const MyChatBot = ({ serverUrl }: ChatBotDemoProps) => {
  const helpOptions = ["Deployment", "Github", "Discord"];

  const flow = {
    start: {
      message: "Hello, Thanks for using our chatbot 😊!",
      transition: { duration: 1000 },
      path: "show_options"
    },
    show_options: {
      message: "Here are a few helpful things you can check out to get started:",
      options: helpOptions,
      path: "process_options"
    },
    prompt_again: {
      message: "Do you need any other help?",
      options: helpOptions,
      path: "process_options"
    },
    unknown_input: {
      message: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on the Github option and open an issue there or visit our discord.",
      options: helpOptions,
      path: "process_options"
    },
    process_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params) => {
        let link = "";
        switch (params.userInput) {
          case "Deployment":
            link = "https://github.com/slabstech/gaganyatri.in/blob/main/docs/deployment.md";
            break;
          case "Github":
            link = "https://github.com/slabstech/gaganyatri.in";
            break;
          case "Discord":
            link = "https://discord.gg/WZMCerEZ2P";
            break;
          default:
            return "unknown_input";
        }
        await params.injectMessage("Sit tight! I'll send you right there!");
        setTimeout(() => {
          window.open(link);
        }, 1000)
        return "repeat";
      }
    },
    repeat: {
      transition: { duration: 3000 },
      path: "prompt_again"
    }
  };

  return (
    <ChatBot
      settings={{
        general: { embedded: true },
        chatHistory: { storageKey: "example_faq_bot" },
        header: { title: 'gaganyatri.in', showAvatar: false },
        footer: { text: 'Powered by slabstech' }
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;
