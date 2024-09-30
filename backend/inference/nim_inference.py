
import requests, base64
import os
import json

def vision_inference(image_name):
  try:
    invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"
    stream = False

    with open(image_name, "rb") as f:
      image_b64 = base64.b64encode(f.read()).decode()

    #assert len(image_b64) < 180_000, \
    #  "To upload larger images, use the assets API (see docs)"
      
    api_key = os.environ["NIM_API_KEY"]

    headers = {
      "Authorization": f"Bearer {api_key}",
      "Accept": "text/event-stream" if stream else "application/json"
    }
    payload = {
      "model": 'meta/llama-3.2-11b-vision-instruct',
      "messages": [
        {
          "role": "user",
          "content": f'What is in this image? <img src="data:image/png;base64,{image_b64}" />'
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
        return content

  except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

#image_name = "/home/gaganyatri/Pictures/hackathon/eat-health/fruit-stall-1.jpg"
#content = vision_inference(image_name)
#print(content)