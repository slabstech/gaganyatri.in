from openai import OpenAI

client = OpenAI(api_key="cant-be-empty", base_url="http://localhost:8000/v1/")

filename= '/home/gaganyatri/Music/test1.flac'

audio_file = open(filename, "rb")

transcript = client.audio.transcriptions.create(
    model="Systran/faster-distil-whisper-small.en", file=audio_file
)

print(transcript.text)
