import { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
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

  sendImageToOllama = async () => {
    
    const ollamaEndpoint = "http://localhost:5000/recipe_generate" ;

    try {
      const response = await  axios.get(ollamaEndpoint);
      //console.log('Analyse result:', response.data);
      const respone_data = cleanJsonString(response.data);
      console.log(respone_data);


      this.setState({ response: respone_data });
      return response.data;
    } catch (error) {
      console.error('Error Process JSON:', (error as AxiosError).message);
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
            onClick={this.sendImageToOllama} 
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
