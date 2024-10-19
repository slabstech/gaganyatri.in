import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';
import axios, { AxiosError } from 'axios';

const MyChatBot: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [textResponse, setTextResponse] = useState<string>('');
    const [textPrompt, setTextPrompt] = useState<string>('');
    //const [textSelectedModel, setTextSelectedModel] = useState<string>(''); // Example model selection
    //const serverBaseUrl = 'YOUR_SERVER_BASE_URL'; // Replace with your actual server base URL
    const serverBaseUrl = import.meta.env.VITE_HF_SPACES_URL;
    const sendPromptToServer = async () => {
        setLoading(true);

        const serverEndpoint = `${serverBaseUrl}/recipes/text_llm_url/`;
        const textSelectedModel= 'mistral-nemo';
        const requestBody = {
            model: textSelectedModel,
            messages: [
                {
                    role: 'user',
                    prompt: textPrompt,
                }
            ],
            stream: false
        };

        try {
            const response = await axios.post(serverEndpoint, requestBody);
            const messageContent = response.data.response;
            setLoading(false);
            setTextResponse(messageContent);
            return messageContent;
        } catch (error) {
            console.error('Error processing Text Prompt:', (error as AxiosError).message);
            setLoading(false);
            throw error;
        }
    };

    const flow = {
        start: {
            message: "Welcome! Ask me anything!",
            path: "loop",
        },
        loop: {
            message: async (params: any) => {
                // Set the text prompt from user input
                setTextPrompt(params.userInput);
                await sendPromptToServer();
                // Inject the response back into the chat
                await params.injectMessage(textResponse);
            },
            path: () => "loop",
        }
    };

    return (
        <ChatBot 
            settings={{ general: { embedded: true }, chatHistory: { storageKey: "example_llm_conversation" } }} 
            flow={flow} 
        />
    );
};

export default MyChatBot;
