
import requests, base64
import os


def vision_inference(image_name):
  try:
    invoke_url = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-11b-vision-instruct/chat/completions"
    stream = True

    with open(image_name, "rb") as f:
      image_b64 = base64.b64encode(f.read()).decode()

    #assert len(image_b64) < 180_000, \
    #  "To upload larger images, use the assets API (see docs)"
      
    api_key = os.environ["NIM_API_KEY"]

    headers = {
      "Authorization": "Bearer {api_key}",
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
                print(line.decode("utf-8"))
    else:
        print(response.json())
  except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

image_name = "/home/gaganyatri/Pictures/hackathon/eat-health/fruit-stall-1.jpg"
vision_inference(image_name)