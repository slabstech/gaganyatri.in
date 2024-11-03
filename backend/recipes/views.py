from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from .engine import execute_prompt, bundle_function, propose_recipes, compute_reduced_prices
from rest_framework.views import APIView
from mistralai import Mistral
import os
import base64
import json
import requests
from openai import OpenAI
from ollama import Client
from django.http import FileResponse
import io

class TTSView(APIView):
    def post(self, request, format=None):
        # Define the API endpoint
        # Define the URL for the TTS API
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
            # Create a file-like object with the audio data
            audio_data = io.BytesIO(response.content)

            # Return the audio file as a response
            return FileResponse(audio_data, as_attachment=True, filename='audio_output.wav')
        else:
            return Response({"error": "Failed to synthesize speech"}, status=response.status_code)

class SpeechASRView(APIView):
    def post(self, request, format=None):
        try: 
            data = request.data
            ##prompt =  data['prompt']
            audio = data['audio']

            client = OpenAI(api_key="cant-be-empty", base_url="http://localhost:11800/v1/")

            #filename= '/home/gaganyatri/Music/test1.flac'
            audio_bytes = audio.read()

            #audio_file = open(filename, "rb")

            transcript = client.audio.transcriptions.create(
                model="Systran/faster-distil-whisper-small.en", file=audio_bytes
            )

            #print(transcript.text)
            voice_content = transcript.text
            return Response({"response": voice_content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)


class SpeechLLMView(APIView):
    def post(self, request, format=None):
        try: 
            data = request.data
            ##prompt =  data['prompt']
            audio = data['audio']

            client = OpenAI(api_key="cant-be-empty", base_url="http://localhost:11800/v1/")

            #filename= '/home/gaganyatri/Music/test1.flac'
            audio_bytes = audio.read()

            #audio_file = open(filename, "rb")

            transcript = client.audio.transcriptions.create(
                model="Systran/faster-distil-whisper-small.en", file=audio_bytes
            )

            #print(transcript.text)
            voice_content = transcript.text
                        #content = 'audio recieved'

            model = "mistral-nemo:latest"
            client = Client(host='http://localhost:11434')
            response = client.chat(
            model=model,
            messages=[{
            "role": "user",
            "content": voice_content,
            }],
            )

            # Extract the model's response about the image
            response_text = response['message']['content'].strip()

            return Response({"response": response_text})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)

class TranslateLLMView(APIView):
    def post(self, request, format=None):
        try: 
            data = request.data
            prompt =  data['messages'][0]['prompt']
            # Specify model
            source_language = data['sourceLanguage']
            target_language = data['targetLanguage']
            #model = data['model']
            # Define the messages for the chat
            api_key=os.getenv("SARVAM_API_KEY", "")
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
            headers = {"Content-Type": "application/json",
                    'API-Subscription-Key': f"{api_key}"
                    }

            response = requests.request("POST", url, json=payload, headers=headers)
            content = response.text
            #print(chat_response.choices[0].message.content)
            # Return the content of the response
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)

class TextLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data

            isOnline = data['isOnline']

            print(isOnline)
            prompt =  data['messages'][0]['prompt']
            # Specify model
            #model = "pixtral-12b-2409"
            model = data['model']
            # Define the messages for the chat
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]

            if(isOnline): 
                api_key = os.environ["MISTRAL_API_KEY"]

                # Initialize the Mistral client
                client = Mistral(api_key=api_key)


                # Get the chat response
                chat_response = client.chat.complete(
                    model=model,
                    messages=messages
                )

                content = chat_response.choices[0].message.content
            else:
                content = "helloWorld"

            #print(chat_response.choices[0].message.content)
            # Return the content of the response
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)

class IndicLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data

            isOnline = data['isOnline']

            print(isOnline)
            prompt =  data['messages'][0]['prompt']
            # Specify model
            #model = "pixtral-12b-2409"
            model = data['model']
            # Define the messages for the chat

            client = Client(host='http://localhost:11434')
            response = client.chat(
            model=model,
            messages=[{
            "role": "user",
            "content": prompt,
            }],
            )

            # Extract the model's response about the image
            response_text = response['message']['content'].strip()

            #print(chat_response.choices[0].message.content)
            # Return the content of the response
            return Response({"response": response_text})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)



@api_view(['GET'])
def recipe_generate_route(request):
    isLocal = False
    try:
        json_objs = compute_reduced_prices()
        obj= json.loads(json_objs)
        bundle_articles = bundle_function(obj[:10])

        result = execute_prompt(propose_recipes(bundle_articles), False)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        return Response({'error': str(e)}, status=500)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'error': 'Something went wrong'}, status=500)
    return Response(result)


class LlamaVisionView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data

            image_data = (data['messages'][0]['image'][0])
            prompt =  data['messages'][0]['prompt']
            # Specify model
            #model = "pixtral-12b-2409"
            model = data['model']
            # Define the messages for the chat

            # Define the messages for the chat

            client = Client(host='http://localhost:21434')
            response = client.chat(
            model="x/llama3.2-vision:latest",
            messages=[{
            "role": "user",
            "content": prompt,
            "images": [image_data]
            }],
            )

            # Extract the model's response about the image
            response_text = response['message']['content'].strip()

            print(response_text)
            content = response_text


            #print(chat_response.choices[0].message.content)
            # Return the content of the response
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)


class VisionLLMView(APIView):
    def post(self, request, format=None):
        try:
            data = request.data
            api_key = os.environ["MISTRAL_API_KEY"]

            # Initialize the Mistral client
            client = Mistral(api_key=api_key)

            image_data = (data['messages'][0]['image'][0])
            prompt =  data['messages'][0]['prompt']
            # Specify model
            #model = "pixtral-12b-2409"
            model = data['model']
            # Define the messages for the chat
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": f"data:image/jpeg;base64,{image_data}" 
                        }
                    ]
                }
            ]

            # Get the chat response
            chat_response = client.chat.complete(
                model=model,
                messages=messages
            )

            content = chat_response.choices[0].message.content
            #print(chat_response.choices[0].message.content)
            # Return the content of the response
            return Response({"response": content})
        except Exception as e:
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)


class NIMVisionLLMView(APIView):
    def post(self, request, format=None):
        try:
            invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"
            stream = False
            api_key = os.environ["NIM_API_KEY"]
            data = request.data
            model = data['model']
            print(model)
            image_data = (data['messages'][0]['image'][0])
            prompt =  data['messages'][0]['prompt']
            headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "text/event-stream" if stream else "application/json"
            }
            payload = {
            "model": model,
            "messages": [
                {
                "role": "user",
                "content": f'{prompt} <img src="data:image/png;base64,{image_data}" />'
                }
            ],
            "max_tokens": 512,
            "temperature": 1.00,
            "top_p": 1.00,
            "stream": stream
            }
            response = requests.post(invoke_url, headers=headers, json=payload)

            if stream:
                for line in response.iter_lines():
                    if line:
                        #print(line.decode("utf-8"))
                        data = line.decode("utf-8")
                        #content = json.loads(data)['choices'][0]['delta'].get('content', '') 
            else:
                #print(response.json())
                data =  response.json()
                content = data['choices'][0]['message']['content']

                #print(content)
                return Response({"response": content})


        except Exception as e:  # Added general exception handling
            print(f"An error occurred: {e}")
            return Response({'error': 'Something went wrong'}, status=500)
