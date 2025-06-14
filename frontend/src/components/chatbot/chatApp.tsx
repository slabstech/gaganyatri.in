import ChatBot from 'react-chatbotify';

type ChatBotDemoProps = {
  serverUrl?: string;
  isOnline: boolean;
};

const MyChatBot = ({ serverUrl, isOnline }: ChatBotDemoProps) => {
  const helpOptions = ["Deployment", "Github", "Discord"];
  const isOnlineAccess = isOnline;

  const serverInfernce = serverUrl;
  //console.log(serverInfernce + '' + isOnlineAccess);

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
      path: async (params:any) => {
        let link = "";
        switch (params.userInput) {
          case "Github":
            link = "https://github.com/slabstech/gaganyatri.in";
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
        footer: { text: 'Powered by dwani.ai' }
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;
