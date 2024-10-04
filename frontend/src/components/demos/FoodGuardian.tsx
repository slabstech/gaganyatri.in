import { useState } from 'react'
import { generateResponseFromJson, generateFeatures } from './ollamaservice'
import DataTable from './DataTable';
//import IndeterminateProgressBar from './IndeterminateProgressBar';

import { Button, Typography, Box, LinearProgress } from '@mui/material';


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
    <Box>
      <Typography variant="h5">Food Guardian AI</Typography>
      <Box id="fileUploadContainer">
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          Upload Image
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
        </Button>
      </Box>

      <Box className="img-gallery">
        {files.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="img-preview"
          />
        ))}
      </Box>

      {files.length > 0 && (
        <Button id="submit" onClick={handleImage}>Submit</Button>
      )}

      <Box id="botResult">
        {tableAIProgressLoading && <LinearProgress />}
        {jsonData.length > 0 && (
          <>
            <Typography variant="h6">Food Items</Typography>
            <DataTable data={jsonData} />
            <Typography id="foodDescription">{response}</Typography>
          </>
        )}
        {errorResponse && (
          <Typography id="errorDescription" color="error">{errorResponse}</Typography>
        )}
      </Box>
    </Box>    </>
  )
}

export default FoodGuardian;
