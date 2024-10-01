import { Component, ChangeEvent } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import IndeterminateProgressBar from '../demos/IndeterminateProgressBar';
import TextField from '@mui/material/TextField';

interface AppState {
  tableAIProgressLoading: boolean;
  textresponse: any;
  textprompt: string;
  isLoading: boolean;
  models: string[]; 
  textSelectedModel: string; 
}
//const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
class TextDemo extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  //serverBaseUrl = import.meta.env.VITE_BACKEND_APP_API_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1" ;

  constructor(props:{}) {
    super(props);
    this.state = {
      textresponse: null,
      tableAIProgressLoading: false,
      textprompt: '',
      isLoading: false,
      models: ['pixtral', 'mistral-large'], 
      textSelectedModel: 'mistral-large',
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


  handleTextPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ textprompt: event.target.value });
  };

  handleTextModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ textSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
    });
  };

  sendPromptToServer = async () => {
    //this.state.tableAIProgressLoading = true;
    this.setState({tableAIProgressLoading:true});
    //setTableAIProgressLoading(true);
    const serverEndpoint = this.serverBaseUrl + '/recipes/execute_prompt_get/';
    const serverRequest = `${serverEndpoint}?prompt="${this.state.textprompt}"`;
    console.log(serverRequest);
    try {
      const response = await axios.get(serverRequest);

      const messageContent = response.data[5][1][0][1][1][0][1];
      //setTableAIProgressLoading(false);
      this.setState({tableAIProgressLoading:false});
    
      this.setState({ textresponse: messageContent });

      return messageContent;
    } catch (error) {
      console.error('Error processing Text Prompt:', (error as AxiosError).message);
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
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                    color: 'black',
                  },
                }}
              />
              <button 
                onClick={this.sendPromptToServer} 
                disabled={this.state.isLoading}>
                {this.state.isLoading ? 'Processing...' : 'Submit'}
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
          <div id="botResult">
          <IndeterminateProgressBar loading={this.state.tableAIProgressLoading} />
        </div>    
          {this.state.textresponse && (
            <div className="response-container">
              <h4>Response:</h4>
              <textarea value={JSON.stringify(this.state.textresponse, null, 2)} readOnly style={{ width: '95%', height: '100px' }}/>
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>
          <hr /><hr />
        </td>
      </tr>
    </tbody>
  </table>
        </div>

    </>
  )
}
}

export default TextDemo;