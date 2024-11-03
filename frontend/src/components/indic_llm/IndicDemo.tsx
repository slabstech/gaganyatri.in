import { Component, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select';

interface AppState {
  tableAIProgressLoading: boolean;
  textresponse: any;
  textprompt: string;
  isLoading: boolean;
  models: Map<string, any>; 
  textSelectedModel: string; 
}

type TextDemoProps = {
  serverUrl: string;
  isOnline: boolean;
};


//const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
class IndicDemo extends Component<TextDemoProps, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = "http://localhost:8000/api/v1" ;
  isOnline= true;
  
  //serverBaseUrl = this.hfBaseUrl; 
  constructor(props:TextDemoProps) {
    super(props);
    //this.serverBaseUrl = this.props.serverUrl;
    this.isOnline = this.props.isOnline;
    this.state = {
      textresponse: null,
      tableAIProgressLoading: false,
      textprompt: '',
      isLoading: false,
      models: new Map([
        ['sarvam-1', 'hf.co/QuantFactory/sarvam-1-GGUF:sarvam-1.Q6_K.gguf'],
        ['sarvam-2b-v0.5','mistral-small-latest'],
      ]), 
      textSelectedModel: 'sarvam-1',
    };
    //console.log(this.hfBaseUrl);
    //console.log(this.localInferenceUrl);

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




  handleTextPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ textprompt: event.target.value });
  };

  handleTextModelChange = (event: SelectChangeEvent<string>) => {
    this.setState({ textSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
    });
  };

  sendPromptToServer = async () => {
    this.setState({tableAIProgressLoading:true});

    const serverEndpoint = this.serverBaseUrl + '/inference/indic_llm_url/';


    const model = this.state.models.get(this.state.textSelectedModel);
        
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          prompt: this.state.textprompt,
        }
      ],
      stream: false,
      isOnline: this.isOnline
    };
    try {
      const response = await axios.post(serverEndpoint, requestBody);
      const messageContent = response.data.response;
      this.setState({tableAIProgressLoading:false});
    
      this.setState({ textresponse: messageContent });

      return messageContent;
    } catch (error) {
      console.error('Error processing Text Prompt:', (error as AxiosError).message);
      this.setState({tableAIProgressLoading:false});
      throw error;
    }
    
  };

  render(){
  return (
    <>
      <Box className="app-container">
        <Box>
          <h2>Indic LLM</h2>
          <Divider />
          <Box className="input-container">
            <TextField
              value={this.state.textprompt}
              onChange={this.handleTextPromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
              sx={{ backgroundColor: 'white', color: 'black' }}
            />
            <Button
              variant="contained"
              onClick={this.sendPromptToServer}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? 'Processing...' : 'Submit'}
            </Button>
            <Select
              value={this.state.textSelectedModel}
              onChange={this.handleTextModelChange}
            >
              {Array.from(this.state.models.entries()).map(([key, ]) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box id="botResult">
            {this.state.tableAIProgressLoading && <LinearProgress />}
          </Box>
          {this.state.textresponse && (
            <Box className="response-container">
              <h4>Response:</h4>
              <TextField
                value={JSON.stringify(this.state.textresponse, null, 2)}
                disabled
                multiline
                fullWidth
                rows={4}
              />
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
    </>
  )
}
}

export default IndicDemo;