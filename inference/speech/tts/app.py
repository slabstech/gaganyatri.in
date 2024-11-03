import requests

# Define the URL for the TTS API
url = 'http://localhost:5002/api/tts'

# Define the multiline text
text = "This is the first line"

# Prepare the parameters for the GET request
params = {
    'text': text.replace('\n', '%0A')  # Replace newlines with URL encoding
}

# Make the GET request
response = requests.get(url, params=params)

# Check if the request was successful
if response.status_code == 200:
    # Save the audio response as a WAV file
    with open('abs.wav', 'wb') as audio_file:
        audio_file.write(response.content)
    print("Audio synthesized and saved as abs.wav")
else:
    print("Failed to synthesize speech:", response.text)
