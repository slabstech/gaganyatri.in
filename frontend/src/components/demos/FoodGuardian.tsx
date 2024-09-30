import { useState } from 'react'
import { generateResponseFromJson, generateFeatures } from './ollamaservice'
import DataTable from './DataTable';
import IndeterminateProgressBar from './IndeterminateProgressBar';
import './FoodGuardian.css'

function FoodGuardian() {
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState<string>('');
  const [errorResponse, setErrorResponse] = useState<string>('');
  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState([]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleImage = async () => {
    const image = files[0];
    console.log('handling image files', image);
    setErrorResponse("");
    setTableAIProgressLoading(true);
    //Extract features from the image
    const jsonStr = await generateFeatures(image);
    console.log(jsonStr);
    setTableAIProgressLoading(false);
    try{
      setJsonData(JSON.parse(jsonStr).food_items)
    }catch(err){
      console.log(err);
      setErrorResponse(jsonStr);
      return;
    }
    

    //food descriptions
    const stream = await generateResponseFromJson(jsonStr);
    //let fullResponse = '';
    console.log(stream);
    setResponse(stream);
    /*for await (const part of stream) {
      fullResponse += part.response;
      setResponse(fullResponse);
    }*/
  };

  return (
    <>
      <div>
        <h5>Food Guardian AI</h5>
        <div id="fileUploadContainer">
          <label htmlFor="file-upload" className="custom-file-upload" style={{ backgroundColor: 'white' , color: 'black'}}>
            Upload Image
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        
        <div className="img-gallery">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="img-preview"
            />
          ))}
        </div>
        
        {files.length > 0 && (
          <button id="submit" onClick={handleImage}>Submit</button>
        )}

        <div id="botResult">
          <IndeterminateProgressBar loading={tableAIProgressLoading} />
          {jsonData.length > 0 && (
            <>
              <h4>Food Items</h4>
              <DataTable data={jsonData} />
              <div id="foodDescription" >{response}</div>
            </>
          )}
          {errorResponse && (
            <>
              <div id="errorDescription" >{errorResponse}</div>
            </>
          )}
        </div>
        
      </div>
    </>
  )
}

export default FoodGuardian;
