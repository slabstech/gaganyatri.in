import { Component, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
//import './App.css'
import TextField from '@mui/material/TextField';
import '../css/styles.css'
import { Mistral } from "@mistralai/mistralai";

interface AppState {
  base64StringImage: string | null;
  response: any;
  prompt: string;
  uploadedImage: string | null;
  isLoading: boolean;
  models: string[]; 
  selectedModel: string; 
}
class Home extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  constructor(props:{}) {
    super(props);
    this.state = {
      base64StringImage: null,
      response: null,
      prompt: '',
      uploadedImage: null,
      isLoading: false,
      models: ['pixtral', 'llava'], 
      selectedModel: 'pixtral', 
    };
  }

  componentDidMount() {
    this.getOrPullModel(this.state.selectedModel);
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

  handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ prompt: event.target.value });
  };

  handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedModel: event.target.value }, () => {
      this.getOrPullModel(this.state.selectedModel);
    });
  };

  sendImageToOllama = async () => {
  const apiKey  = import.meta.env.MISTRAL_API_KEY;
  //let apiKey = process.env["MISTRAL_API_KEY"];
  console.log(apiKey);
  const mistral = new Mistral({apiKey: apiKey});

  /*
  async function run() {
    const result = await mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [
            {
                content: "Who is the best French painter? Answer in one short sentence.",
                role: "user",
            },
        ],
    });

    // Handle the result
    console.log(result);
    }

    run();

    */
   /*
    async function runImage() {
      const result = await mistral.chat.complete({
          model: "pixtral-12b-2409",
          messages: [
              {
                  "role": "user",
                  "content": [
                    {
                      "type": "text",
                      "text": "What is in this image?"
                    },
                    {
                      "type": "image_url",
                      "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
                    }
                  ]
              },
          ],
      });
  
      // Handle the result
      console.log(result);
      }
  
      runImage();
*/
      /*
  
  const chatResponse = await mistral.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
          {
          role: "user",
          content: [
              {
              type: "text",
              text: "What s in this image?"
              },
              {
              type: "image_url",
              "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
              }
          ]
          }
      ]
      }
  );

  console.log('JSON:', chatResponse.choices[0].message.content)
  */
  
    /*
    if (!this.state.base64StringImage) return;
    
    const requestBody = {
      model: 'pixtral',
      messages: [
        {
          role: 'user',
          content: this.state.prompt,
          images: [this.state.base64StringImage]
        }
      ],
      stream: false
    };

    const ollamaEndpoint = this.ollamaBaseUrl + '/chat';

    try {
      const response = await axios.post(ollamaEndpoint, requestBody);
      console.log("Prompt - ", this.state.prompt);
      console.log('Image processing result:', response.data.message.content);
      this.setState({ response: response.data.message.content });
      return response.data.message.content;
    } catch (error) {
      console.error('Error processing image:', (error as AxiosError).message);
      throw error;
    }
      */
  };

  render(){
  return (
    <>
    <div className="app-container">
      <p className="read-the-docs">
        Warehouse UI
      </p>
      <div className="input-container">
          <TextField
            value={this.state.prompt}
            onChange={this.handlePromptChange}
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
            value={this.state.selectedModel} 
            onChange={this.handleModelChange}>
            {this.state.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>        
      </div>    
      {this.state.response && (
        <div className="response-container">
          <h4>Response:</h4>
          <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
          {this.state.uploadedImage && (
              <img 
              src={this.state.uploadedImage} 
              alt="Uploaded" 
              width="100" height="100" />
            )}
        </div>
      )}
      </div>  
    </>
  )
}
}

export default Home;