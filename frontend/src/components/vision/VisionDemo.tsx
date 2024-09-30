import { Component, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';

interface AppState {
  base64StringImage: string | null;
  imageresponse: any;
  imageprompt: string;
  uploadedImage: string | null;
  isLoading: boolean;
  models: string[]; 
  imageSelectedModel: string; 
  functionEndpoint:string;
}
class VisionDemo extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  //serverBaseUrl = import.meta.env.VITE_BACKEND_APP_API_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  //serverBaseUrl = 'http://localhost:8000/api/v1' ;
  constructor(props:{}) {
    super(props);
    this.state = {
      base64StringImage: null,
      imageresponse: null,
      imageprompt: '',
      uploadedImage: null,
      isLoading: false,
      models: ['pixtral', 'llama3.2-vision'], 
      imageSelectedModel: 'pixtral', 
      functionEndpoint:'/recipes/vision_llm_url/',
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


  handleImagePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ imageprompt: event.target.value });
  };


  handleImageModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ imageSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
      if(this.state.imageSelectedModel == 'pixtral')
        this.setState({ functionEndpoint: '/recipes/vision_llm_url/' });
      else
        this.setState({ functionEndpoint: '/recipes/nim_vision_llm_url/' });
    });

  };

  sendImageToServer = async () => {
     
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
    const serverEndpoint = this.serverBaseUrl + this.state.functionEndpoint;
    console.log(serverEndpoint);

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

  render(){
  return (
    <>
    <div className="app-container">
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <tbody>    
      <tr>
        <td>
          <hr /><hr />
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
              InputProps={{
                style: {
                  backgroundColor: 'white',
                  color: 'black',
                },
              }}
            />
<label htmlFor="upload-image" style={{
  // Add your custom styles here
  backgroundColor: '#f0f0f0',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'inline-block',
  color: 'black',
}}>
  Choose Image
  <input
    id="upload-image"
    type="file"
    onChange={this.handleImageUpload}
    style={{
      display: 'none',
    }}
  />
</label>
            <button 
              onClick={this.sendImageToServer} 
              disabled={this.state.isLoading}>
              {this.state.isLoading ? 'Processing...' : 'Submit'}
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
            <textarea value={JSON.stringify(this.state.imageresponse, null, 2)} readOnly style={{ width: '95%', height: '100px' }}/>
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

export default VisionDemo;