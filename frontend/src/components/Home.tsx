import { Component, ChangeEvent } from 'react';

import VisionDemo from './demos/VisionDemo';
import TextDemo from './demos/TextDemo';
//import { Mistral } from "@mistralai/mistralai";

interface AppState {
}
class Home extends Component<{}, AppState> {
  ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  //serverBaseUrl = import.meta.env.VITE_BACKEND_APP_API_URL;
  serverBaseUrl = "https://gaganyatri-django-spaces.hf.space/api/v1" ;
  constructor(props:{}) {
    super(props);
  }

 
  render(){
  return (
    <>
    <div className="app-container">
      <p className="read-the-docs">
        LLM Use Cases
      </p>
      <div className="row">
        <div className="col-md-6">
          <VisionDemo />
        </div>
        <hr />
        <hr />
        <div className="col-md-6">
          <TextDemo />
        </div>
      </div>
        </div>

    </>
  )
}
}

export default Home;