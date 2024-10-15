import { useState, useRef, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';


const SpeechDemo = () => {
  const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  const hfBaseUrl = import.meta.env.VITE_HF_SPACES_URL;
  const localInferenceUrl = import.meta.env.VITE_LOCAL_INFERENCE_URL;
  //const serverBaseUrl = hfBaseUrl;
  const serverBaseUrl = "http://localhost:8000/api/v1" ;
  const chunks = useRef([]);
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaRecorder = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProduction, setIsProduction] = useState(true);


  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [textresponse, setTextResponse] = useState<any>(null);
  const [textprompt, setTextPrompt] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const [textSelectedModel, setTextSelectedModel] = useState<string>('mistral-nemo');

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioFile(blob);
            setRecordedUrl(url);
            //uploadAudio(blob); // Call upload function after stopping
            chunks.current = []; // Reset chunks for next recording
        };

        mediaRecorder.current.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
};

const stopRecording = () => {
    if (mediaRecorder.current) {
        mediaRecorder.current.stop();
    }
};

  useEffect(() => {
    if (isListening) {
      startRecording();
    } else {
      stopRecording();
    }
    if (process.env.NODE_ENV === 'production') {
      setIsProduction(true);
    }
  }, [isListening]);

 
/*
  const componentDidMount() {
    //this.getOrPullModel(this.state.selectedModel);
  };
*/

  const toggleVoiceInput = () => {
    if (isListening) {
      startRecording();
      //console.log('isListinening');
    } else {
      stopRecording();
     //console.log('not listnen');
    }
    //setIsListening(!isListening);
    setIsListening(!isListening);
  };

  const sendPromptToServer = async () => {
    if (!audioFile) {
      // If audioFile is null, do not proceed with the request
      return;
    }
    setTableAIProgressLoading(true);
    const serverEndpoint = serverBaseUrl + '/recipes/speech_llm_url/';
  
    const formData = new FormData();
    formData.append('audio', audioFile);
  

    try {
      const response = await axios.post(serverEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const messageContent = response.data.response;
      setTableAIProgressLoading(false);

      setTextResponse(messageContent);


      return messageContent;
    } catch (error) {
      console.error('Error processing Text Prompt:', (error as AxiosError).message);
      setTableAIProgressLoading(false);
      throw error;
    }
    
  };

  return (
    <>
      <Box className="app-container">
        <Box>
          <h2>Speech Demo</h2>
          <Divider />
          <Box className="input-container">
          <Button
            variant="contained"
            color={isListening ? "secondary" : "primary"}
            startIcon={isListening ? <MicIcon /> : <MicOffIcon />}
            onClick={toggleVoiceInput}
            disabled={isLoading}
          >
          </Button>
            {!isProduction && recordedUrl && (
          <Button
            variant="contained"
            onClick={() => {
              const audio = new Audio(recordedUrl);
              audio.play();
            }}
            disabled={isProduction}
          >
            Play Recording
          </Button>
        )}
            <Button
              variant="contained"
              onClick={sendPromptToServer}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </Box>
          <Box id="botResult">
            {tableAIProgressLoading && <LinearProgress />}
          </Box>
          {textresponse && (
            <Box className="response-container">
              <h4>Response:</h4>
              <TextField
                value={JSON.stringify(textresponse, null, 2)}
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

export default SpeechDemo;