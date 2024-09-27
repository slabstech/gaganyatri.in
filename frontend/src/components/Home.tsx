import { Component, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
//import './App.css'
import TextField from '@mui/material/TextField';
import '../css/styles.css'
//import { Mistral } from "@mistralai/mistralai";

interface AppState {
  base64StringImage: string | null;
  textresponse: any;
  imageresponse: any;
  imageprompt: string;
  textprompt: string;
  uploadedImage: string | null;
  isLoading: boolean;
  models: string[]; 
  textSelectedModel: string; 
  imageSelectedModel: string; 
}
class Home extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  //serverBaseUrl = import.meta.env.VITE_BACKEND_APP_API_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  constructor(props:{}) {
    super(props);
    this.state = {
      base64StringImage: null,
      imageresponse: null,
      textresponse: null,
      imageprompt: '',
      textprompt: '',
      uploadedImage: null,
      isLoading: false,
      models: ['pixtral', 'mistral-large'], 
      textSelectedModel: 'mistral-large',
      imageSelectedModel: 'pixtral', 
    };
  }

  componentDidMount() {
    //this.getOrPullModel(this.state.selectedModel);
  }

  checkModelExists = async (modelName:string) => {
    try {
      await axios.post(`${this.ollamaBaseUrl}/show`, { name: modelName });
      return true; // Model exists
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 404) {
        return false; // Model doesn't exist
      }
      throw error; // Rethrow other errors
    }
  };

  getOrPullModel = async (modelName:string) => {
    try {
      const modelExists = await this.checkModelExists(modelName);
      if (modelExists) {
        console.log(`Model '${modelName}' already exists.`);
      } else {
        console.log(`Model '${modelName}' not found. Pulling...`);
      }
    } catch (error) {
      console.error('Error:', (error as AxiosError).message);
    }
  };

  handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          this.setState({ 
            base64StringImage: reader.result.split(',')[1],
            uploadedImage: reader.result, 
          });
        }
      }
      reader.readAsDataURL(file);
    } else {
      // handle the case where no file was selected
    }
  };

  handleTextPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ textprompt: event.target.value });
  };

  handleImagePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ imageprompt: event.target.value });
  };

  handleTextModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ textSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
    });
  };

  handleImageModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ imageSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
    });
  };

  sendImageToOllama = async () => {
     
    if (!this.state.base64StringImage) return;
    
    const requestBody = {
      model: 'pixtral',
      messages: [
        {
          role: 'user',
          prompt: this.state.imageprompt,
          image: [this.state.base64StringImage]
        }
      ],
      stream: false
    };

    //const ollamaEndpoint = this.ollamaBaseUrl + '/chat';
    const serverEndpoint = this.serverBaseUrl + '/recipes/vision_llm_url/';

    try {
      const response = await axios.post(serverEndpoint, requestBody);
      //console.log("Prompt - ", this.state.prompt);
      const messageContent = response.data.response;
      //console.log('Image processing result:', messageContent);
      this.setState({ imageresponse: messageContent });
      return messageContent;
    } catch (error) {
      console.error('Error processing image:', (error as AxiosError).message);
      throw error;
    }
    
  };

  sendPromptToServer = async () => {
         
    const serverEndpoint = this.serverBaseUrl + '/recipes/execute_prompt_get/';
    const serverRequest = `${serverEndpoint}?prompt="${this.state.textprompt}"`;
    console.log(serverRequest);
    try {
      const response = await axios.get(serverRequest);

      //console.log("Prompt - ", this.state.prompt);
      //console.log(response.data);
  
      const messageContent = response.data[5][1][0][1][1][0][1];
      //console.log(messageContent);

      this.setState({ textresponse: messageContent });
      return messageContent;
    } catch (error) {
      console.error('Error processing image:', (error as AxiosError).message);
      throw error;
    }
    
  };


  render(){
  return (
    <>
    <div className="app-container">
      <p className="read-the-docs">
        LLM Use Cases
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <tbody>
      <tr>
      <td>Text LLM Demo</td>
      </tr>
      <tr>
        <td style={{ border: '1px solid white' }}>
          <div className="input-container">
              <TextField
                value={this.state.textprompt}
                onChange={this.handleTextPromptChange}
                placeholder="Enter your prompt here..."
                fullWidth
              />
              <button 
                onClick={this.sendPromptToServer} 
                disabled={this.state.isLoading}>
                {this.state.isLoading ? 'Processing...' : 'Send'}
              </button>
              <select 
                value={this.state.textSelectedModel} 
                onChange={this.handleTextModelChange}>
                {this.state.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>        
          </div>    
          {this.state.textresponse && (
            <div className="response-container">
              <h4>Response:</h4>
              <pre>{JSON.stringify(this.state.textresponse, null, 2)}</pre>
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>Vision Demo</td>
      </tr>
      <tr>
      <td style={{ border: '1px solid white' }}>
        <div className="input-container">
            <TextField
              value={this.state.imageprompt}
              onChange={this.handleImagePromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
            />
              <input 
                type="file" 
                onChange={this.handleImageUpload} 
            />
            <button 
              onClick={this.sendImageToOllama} 
              disabled={this.state.isLoading}>
              {this.state.isLoading ? 'Processing...' : 'Upload'}
            </button>
            <select 
              value={this.state.imageSelectedModel} 
              onChange={this.handleImageModelChange}>
              {this.state.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>        
        </div>    
        {this.state.imageresponse && (
          <div className="response-container">
            <h4>Response:</h4>
            <pre>{JSON.stringify(this.state.imageresponse, null, 2)}</pre>
            {this.state.uploadedImage && (
                <img 
                src={this.state.uploadedImage} 
                alt="Uploaded" 
                width="100" height="100" />
              )}
          </div>
        )}
      </td>
    </tr>
    </tbody>
  </table>
        </div>

    </>
  )
}
}

export default Home;