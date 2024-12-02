from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from mistralai import Mistral
import os
import requests
from openai import OpenAI
from ollama import Client
from django.http import FileResponse
import io
from pydantic import BaseModel, Field
from pydantic.error_wrappers import ValidationError

# Define Pydantic models for request data
class AudioRequest(BaseModel):
    audio: bytes

class TextRequest(BaseModel):
    messages: list
    isOnline: bool
    model: str

class VisionRequest(BaseModel):
    messages: list
    model: str

class TranslateRequest(BaseModel):
    messages: list
    sourceLanguage: str
    targetLanguage: str

class TTSView(APIView):
    def post(self, request, format=None):
        # Define the API endpoint
        url = 'http://localhost:5002/api/tts'

        # Define the multiline text
        text = "This is the first line"

        # Prepare the parameters for the GET request
        params = {
            'text': text
        }

        # Make the GET request
        response = requests.get(url, params=params)

        # Check if the request was successful
        if response.status_code == 200:
            # Save the audio response as a WAV file
            audio_data = io.BytesIO(response.content)
            return FileResponse(audio_data, as_attachment=True, filename='audio_output.wav')
        else:
            return Response({"error": "Failed to synthesize speech"}, status=response.status_code)

class SpeechASRView(APIView):
    def post(self, request, format=None):
        try:
            data = AudioRequest(**request.data)
            audio = data.audio
            client = OpenAI(api_key="cant-be-empty", base_url="http://0.0.0.0:11800/v1/")
            transcript = client.audio.transcriptions.create(
                model="Systran/faster-distil-whisper-small.en", file=audio
            )
            voice_content = transcript.text
            return Response({"response": voice_content})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class SpeechToSpeechView(APIView):
    def post(self, request, format=None):
        try:
            data = AudioRequest(**request.data)
            audio = data.audio
            client = OpenAI(api_key="cant-be-empty", base_url="http://0.0.0.0:11800/v1/")
            transcript = client.audio.transcriptions.create(
                model="Systran/faster-distil-whisper-small.en", file=audio
            )
            voice_content = transcript.text
            system_prompt = "Please summarize the following prompt into a concise and clear statement:"
            model = "mistral-nemo:latest"
            client = Client(host='http://localhost:11434')
            response = client.chat(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": voice_content},
                ],
            )
            response_text = response['message']['content'].strip()
            url = 'http://localhost:5002/api/tts'
            params = {'text': response_text}
            response = requests.get(url, params=params)
            if response.status_code == 200:
                audio_data = io.BytesIO(response.content)
                return FileResponse(audio_data, as_attachment=True, filename='audio_output.wav')
            else:
                return Response({"error": "Failed to synthesize speech"}, status=response.status_code)
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class SpeechLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = AudioRequest(**request.data)
            audio = data.audio
            client = OpenAI(api_key="cant-be-empty", base_url="http://0.0.0.0:11800/v1/")
            transcript = client.audio.transcriptions.create(
                model="Systran/faster-distil-whisper-small.en", file=audio
            )
            voice_content = transcript.text
            model = "mistral-nemo:latest"
            client = Client(host='http://localhost:11434')
            response = client.chat(
                model=model,
                messages=[{"role": "user", "content": voice_content}],
            )
            response_text = response['message']['content'].strip()
            return Response({"response": response_text})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class TranslateLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = TranslateRequest(**request.data)
            prompt = data.messages[0]['prompt']
            source_language = data.sourceLanguage
            target_language = data.targetLanguage
            api_key = os.getenv("SARVAM_API_KEY", "")
            url = "https://api.sarvam.ai/translate"
            payload = {
                "input": prompt,
                "source_language_code": source_language,
                "target_language_code": target_language,
                "speaker_gender": "Male",
                "mode": "formal",
                "model": "mayura:v1",
                "enable_preprocessing": True
            }
            headers = {"Content-Type": "application/json", 'API-Subscription-Key': api_key}
            response = requests.post(url, json=payload, headers=headers)
            content = response.text
            return Response({"response": content})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class TextLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = TextRequest(**request.data)
            isOnline = data.isOnline
            prompt = data.messages[0]['prompt']
            model = data.model
            messages = [{"role": "user", "content": [{"type": "text", "text": prompt}]}]
            if isOnline:
                api_key = os.environ["MISTRAL_API_KEY"]
                client = Mistral(api_key=api_key)
                chat_response = client.chat.complete(model=model, messages=messages)
                content = chat_response.choices[0].message.content
            else:
                content = "helloWorld"
            return Response({"response": content})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class IndicLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = TextRequest(**request.data)
            isOnline = data.isOnline
            prompt = data.messages[0]['prompt']
            model = data.model
            client = Client(host='http://localhost:11434')
            response = client.chat(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            response_text = response['message']['content'].strip()
            return Response({"response": response_text})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class LlamaVisionView(APIView):
    def post(self, request, format=None):
        try:
            data = VisionRequest(**request.data)
            image_data = data.messages[0]['image'][0]
            prompt = data.messages[0]['prompt']
            model = data.model
            client = Client(host='http://localhost:21434')
            response = client.chat(
                model="x/llama3.2-vision:latest",
                messages=[{"role": "user", "content": prompt, "images": [image_data]}],
            )
            response_text = response['message']['content'].strip()
            return Response({"response": response_text})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class VisionLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = VisionRequest(**request.data)
            api_key = os.environ["MISTRAL_API_KEY"]
            client = Mistral(api_key=api_key)
            image_data = data.messages[0]['image'][0]
            prompt = data.messages[0]['prompt']
            model = data.model
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_data}"}
                    ]
                }
            ]
            chat_response = client.chat.complete(model=model, messages=messages)
            content = chat_response.choices[0].message.content
            return Response({"response": content})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)

class NIMVisionLLMView(APIView):
    def post(self, request, format=None):
        try:
            invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"
            stream = False
            api_key = os.environ["NIM_API_KEY"]
            data = VisionRequest(**request.data)
            model = data.model
            image_data = data.messages[0]['image'][0]
            prompt = data.messages[0]['prompt']
            headers = {"Authorization": f"Bearer {api_key}", "Accept": "text/event-stream" if stream else "application/json"}
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": f'{prompt} <img src="data:image/png;base64,{image_data}" />'}],
                "max_tokens": 512,
                "temperature": 1.00,
                "top_p": 1.00,
                "stream": stream
            }
            response = requests.post(invoke_url, headers=headers, json=payload)
            if stream:
                for line in response.iter_lines():
                    if line:
                        data = line.decode("utf-8")
            else:
                data = response.json()
                content = data['choices'][0]['message']['content']
                return Response({"response": content})
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)
        except Exception as e:
            return Response({'error': 'Something went wrong'}, status=500)