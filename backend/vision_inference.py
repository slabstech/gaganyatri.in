from mistralai import Mistral
import os
import base64
import requests

def text_llm():
    s = Mistral(
        api_key=os.getenv("MISTRAL_API_KEY", ""),
    )

    res = s.chat.complete(model="mistral-small-latest", messages=[
        {
            "content": "Who is the best French painter? Answer in one short sentence.",
            "role": "user",
        },
    ])

    if res is not None:
        # handle response
        print(res)

def vision_llm_url():

    # Retrieve the API key from environment variables
    api_key = os.environ["MISTRAL_API_KEY"]

    # Specify model
    model = "pixtral-12b-2409"

    # Initialize the Mistral client
    client = Mistral(api_key=api_key)

    # Define the messages for the chat
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
                }
            ]
        }
    ]

    # Get the chat response
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )

    # Print the content of the response
    print(chat_response.choices[0].message.content)

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

def vision_llm_image():
    # Path to your image
    image_path = "/home/gaganyatri/Pictures/Screenshots/test_vision.png"

    # Getting the base64 string
    base64_image = encode_image(image_path)

    # Retrieve the API key from environment variables
    api_key = os.environ["MISTRAL_API_KEY"]

    # Specify model
    model = "pixtral-12b-2409"

    # Initialize the Mistral client
    client = Mistral(api_key=api_key)

    # Define the messages for the chat
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What's in this image?"
                },
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{base64_image}" 
                }
            ]
        }
    ]

    # Get the chat response
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )

    # Print the content of the response
    print(chat_response.choices[0].message.content)


#text_llm()
#vision_llm_url()
vision_llm_image()