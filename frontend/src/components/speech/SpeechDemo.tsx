import { useState, useRef, useEffect, ChangeEvent } from 'react';
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
import { saveAs } from 'file-saver';


const SpeechDemo = () => {
  const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
  const hfBaseUrl = import.meta.env.VITE_HF_SPACES_URL;
  const localInferenceUrl = import.meta.env.VITE_LOCAL_INFERENCE_URL;
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const serverBaseUrl = hfBaseUrl;
  const chunks = useRef([]);
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaRecorder = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);


  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [textresponse, setTextResponse] = useState<any>(null);
  const [textprompt, setTextPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [models, setModels] = useState<Map<string, any>>(new Map([
    ['mistral-nemo', 'open-mistral-nemo'],
    ['mistral-small', 'mistral-small-latest'],
    ['mistral-large', 'mistral-large-latest']
  ]));
  const [textSelectedModel, setTextSelectedModel] = useState<string>('mistral-nemo');

  const startRecordingNEw = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedUrl(url);
            //uploadAudio(blob); // Call upload function after stopping
            chunks.current = []; // Reset chunks for next recording
        };

        mediaRecorder.current.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
};

const stopRecordingNew = () => {
    if (mediaRecorder.current) {
        mediaRecorder.current.stop();
    }
};

  useEffect(() => {
    if (isListening) {
      startRecordingNEw();
    } else {
      stopRecordingNew();
    }
  }, [isListening]);

  /*
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Create a Blob from the audio chunks and do something with it (e.g. upload to a server)
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      // Reset the audio chunks array
      audioChunksRef.current = [];
        // Check if the audio file can be played
      const audio = new Audio(audioUrl);
      audio.onerror = () => {
        console.error('Audio file could not be decoded.');
        // Handle the error appropriately
          setAudioFile(null);
          setAudioUrl(null);
      };

      setAudioFile(audioFile);
      setAudioUrl(audioUrl);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      audioChunksRef.current.push(event.data);
    });

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

*/
/*
  const componentDidMount() {
    //this.getOrPullModel(this.state.selectedModel);
  };
*/
  const checkModelExists = async (modelName:string) => {
    try {
      await axios.post(`${ollamaBaseUrl}/show`, { name: modelName });
      return true; // Model exists
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 404) {
        return false; // Model doesn't exist
      }
      throw error; // Rethrow other errors
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      startRecordingNEw();
      console.log('isListinening');
    } else {
      stopRecordingNew();
     console.log('not listnen');
    }
    //setIsListening(!isListening);
    setIsListening(!isListening);
  };

  const getOrPullModel = async (modelName:string) => {
    try {
      const modelExists = await checkModelExists(modelName);
      if (modelExists) {
        console.log(`Model '${modelName}' already exists.`);
      } else {
        console.log(`Model '${modelName}' not found. Pulling...`);
      }
    } catch (error) {
      console.error('Error:', (error as AxiosError).message);
    }
  };


  const handleTextPromptChange = (event: ChangeEvent<HTMLInputElement>) => {
    //this.setState({ textprompt: event.target.value });
    setTextPrompt(event.target.value);
  };

  const handleTextModelChange = (event: SelectChangeEvent<string>) => {
    //this.setState({ textSelectedModel: event.target.value }, () => {
      //this.getOrPullModel(this.state.selectedModel);
    //});
    setTextSelectedModel(event.target.value);
  };

  const sendPromptToServer = async () => {
    if (!audioFile) {
      // If audioFile is null, do not proceed with the request
      return;
    }
    setTableAIProgressLoading(true);
    const serverEndpoint = serverBaseUrl + '/recipes/speech_llm_url/';
    const model = models.get(textSelectedModel);

  
    const formData = new FormData();
    formData.append('model', model);
    formData.append('prompt', textprompt);
    formData.append('audio', audioFile);
    formData.append('stream', 'false');
  

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
            <TextField
              value={textprompt}
              onChange={handleTextPromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
              sx={{ backgroundColor: 'white', color: 'black' }}
            />
          <Button
            variant="contained"
            onClick={toggleVoiceInput}
            disabled={isLoading}
          >
            {isListening ? 'Stop Voice Input' : 'Start Voice Input'}
            </Button>
            {recordedUrl && (
          <Button
            variant="contained"
            onClick={() => {
              const audio = new Audio(recordedUrl);
              audio.play();
            }}
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
            <Select
              value={textSelectedModel}
              onChange={handleTextModelChange}
            >
              {Array.from(models.entries()).map(([key, ]) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
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