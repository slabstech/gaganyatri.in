import { Component } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';

interface RecipesState {
  response: any;
  isLoading: boolean;
  models: string[]; 
  selectedModel: string; 
  responseJson: string;

}

type RecipesProps = {
  serverUrl: string;
};

function cleanJsonString(inputString: string) {
  const prefix = "```json";
  const suffix = "```";
  // Check if the string starts with the prefix and ends with the suffix
  if (inputString.startsWith(prefix) && inputString.endsWith(suffix)) {
      // Remove the prefix and suffix
      const cleanedString = inputString.slice(prefix.length, -suffix.length).trim();
      const jsonObject = JSON.parse(cleanedString);
      return jsonObject;
  } else {
      return inputString; // Return the original string if conditions are not met
  }
}

class Recipes extends Component<RecipesProps, RecipesState> {
  serverBaseUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
    
  constructor(props:RecipesProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
    this.state = {
      response: null,
      isLoading: false,
      models: ['mistral', 'mistral-nemo'], 
      selectedModel: 'mistral-nemo',
      responseJson: '',
    };
  }

  componentDidMount() {
   
  }

  handleModelChange = (event: SelectChangeEvent<string>) => {
    this.setState({ selectedModel: event.target.value }, () => {
    });
  };

  sendDatatoServer = async () => {
    const serverRequest = this.serverBaseUrl + '/inference/recipe_generate/';
    console.log(serverRequest);
    try {
      const response = await axios.get(serverRequest);

      //console.log("Prompt - ", this.state.prompt);
      //console.log(response.data);
  
      const messageContent = response.data[5][1][0][1][1][0][1];
      //console.log(messageContent);

      const respone_data = cleanJsonString(messageContent);
      this.setState({ response: respone_data });
      return respone_data;
    } catch (error) {
      console.error('Error processing image:', (error as AxiosError).message);
      throw error;
    }
    
  };

  render(){
  return (
    <>
    <Box className="app-container" p={2}>
        <p className="read-the-docs">Warehouse UI</p>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              onClick={this.sendDatatoServer}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? 'Processing...' : 'Analyse'}
            </Button>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel id="model-select-label">Model</InputLabel>
              <Select
                labelId="model-select-label"
                value={this.state.selectedModel}
                onChange={this.handleModelChange}
              >
                {this.state.models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {this.state.response && (
          <Box className="response-container" mt={2}>
            <h4>Response:</h4>
            <pre>{JSON.stringify(this.state.response, null, 2)}</pre>
            <TextareaAutosize
              aria-label="empty textarea"
              value={this.state.response}
              readOnly
            />
          </Box>
        )}
      </Box>    </>
  )
}
}

export default Recipes;
