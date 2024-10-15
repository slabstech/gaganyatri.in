from openai import OpenAI


print('1')
client = OpenAI(api_key="cant-be-empty", base_url="http://localhost:8000/v1/")

print('2')
audio_file = open("audio.wav", "rb")

print('3')
transcript = client.audio.transcriptions.create(
    model="Systran/faster-distil-whisper-small.en", file=audio_file
)

print('3')
print(transcript.text)

print('4')