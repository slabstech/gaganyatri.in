import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';
import axios, { AxiosError } from 'axios';

const MyChatBot: React.FC = () => {
    const serverBaseUrl = import.meta.env.VITE_HF_SPACES_URL;


    const sendPromptToServer = async () => {
        //this.setState({tableAIProgressLoading:true});
    
        const serverEndpoint = serverBaseUrl + '/recipes/text_llm_url/';
        console.log(serverEndpoint);
    
        const model = 'mistral-nemo';
        // const model = this.state.models.get(this.state.textSelectedModel);
            
        const requestBody = {
          model: model,
          messages: [
            {
              role: 'user',
              prompt:'what is the capital of kalinga?',
            }
          ],
          stream: false
        };
        try {
          const response = await axios.post(serverEndpoint, requestBody);
          const messageContent = response.data.response;
          //this.setState({tableAIProgressLoading:false});
        
          //this.setState({ textresponse: messageContent });
    
          return messageContent;
        } catch (error) {
          console.error('Error processing Text Prompt:', (error as AxiosError).message);
          //this.setState({tableAIProgressLoading:false});
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
                //setTextPrompt(params.userInput);
                //setTextPrompt('what is your name ?');
                const response = await sendPromptToServer();
                await params.injectMessage(response);
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
