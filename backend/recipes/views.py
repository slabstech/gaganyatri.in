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

class PromptSerializer(serializers.Serializer):
    prompt = serializers.CharField()


@api_view(['GET'])
def execute_prompt_route_get(request):
    prompt = request.query_params.get('prompt', None)
    print(prompt)
    if prompt is None:
        return Response({"error": "No prompt provided"}, status=400)
    is_local = False
    result = execute_prompt(prompt, is_local)
    return Response(result)


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



class VisionLLMView(APIView):
    def post(self, request, format=None):
        data = request.data

        #print(data)
        # Retrieve the API key from environment variables
        api_key = os.environ["MISTRAL_API_KEY"]

        # Specify model
        model = "pixtral-12b-2409"

        # Initialize the Mistral client
        client = Mistral(api_key=api_key)

        # Decode the base64 image
        #image_data = base64.b64decode(data['image'])
        #image_data = base64.b64decode(data['messages'][0]['image'][0])
        image_data = (data['messages'][0]['image'][0])
        prompt =  data['messages'][0]['prompt']

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


class NIMVisionLLMView(APIView):
    def post(self, request, format=None):
        try:
            invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"
            stream = False
            api_key = os.environ["NIM_API_KEY"]
            data = request.data
            image_data = (data['messages'][0]['image'][0])
            prompt =  data['messages'][0]['prompt']
            headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "text/event-stream" if stream else "application/json"
            }
            payload = {
            "model": 'meta/llama-3.2-11b-vision-instruct',
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
            print(f"Error: {e}")
        return None
