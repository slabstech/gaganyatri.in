import { Component } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import './Recipes.css'

interface RecipesState {
  response: any;
  isLoading: boolean;
  models: string[]; 
  selectedModel: string; 
  responseJson: string;

}

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

class Recipes extends Component<{}, RecipesState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  constructor(props:{}) {
    super(props);
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

  handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedModel: event.target.value }, () => {
    });
  };

  sendDatatoServer = async () => {

    //this.serverBaseUrl = 'http://localhost:8000/api/v1';
    const serverRequest = this.serverBaseUrl + '/recipes/recipe_generate/';
    //const serverRequest = `${serverEndpoint}`;
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
    <div className="app-container">
      <p className="read-the-docs">
        Warehouse UI
      </p>
      <div className="input-container">

          <button 
            onClick={this.sendDatatoServer} 
            disabled={this.state.isLoading}>
            {this.state.isLoading ? 'Processing...' : 'Analyse'}
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
          <textarea value={this.state.response} readOnly />
        </div>
      )}
      </div>  
    </>
  )
}
}

export default Recipes;
