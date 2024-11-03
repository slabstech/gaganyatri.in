Speech - 

- Speech Recognition
    - Download Model to cache - 
        - huggingface-cli download Systran/faster-distil-whisper-small.en
    - Run Docker with faster-whisper
        - docker compose -f docker-compose.yml up -d


    - [Whisper](https://github.com/openai/whisper)
    - [Faster Whisper](https://github.com/SYSTRAN/faster-whisper)
    - WhisperX
    - [faster-whisper-server](https://github.com/fedirz/faster-whisper-server)

    - Inference Engine 
        - [CTranslate2](https://github.com/OpenNMT/CTranslate2/)

- Text to Speech
    - list all models
        -  docker run --gpus all -it -p 5002:5002 ghcr.io/coqui-ai/tts:latest --list-models
    - Parse Text 
        - docker run --gpus all -it -p 5002:5002 ghcr.io/coqui-ai/tts:latest --text "gaganyatri is a space astronaut from hubli,india" --out_path temp/speech.wav
    - Copy Downloaded model
        - mkdir tts
        - docker ps -a
        - docker cp <container-id>:/root/.local/share/tts/ ./tts/
    - Load downloaded models with container
        -  docker run --rm --gpus all -it -v ./tts:/root/.local/share/tts -p 5002:5002 ghcr.io/coqui-ai/tts:latest --model_name tts_models/en/ljspeech/tacotron2-DDC --text "gaganyatri is a space astronaut from hubli,india" --out_path speech.wav 

    - Output files to mount volume
        - docker run --rm --gpus all -it -v ./tts:/root/.local/share/tts -v ./out:/mnt -p 5002:5002 ghcr.io/coqui-ai/tts:latest --model_name tts_models/en/ljspeech/tacotron2-DDC --text "gaganyatri is a space astronaut from hubli,india" --out_path /mnt/speech.wav 

    - Run with tts-server
        - docker run --rm --gpus all -it \
    -v ./tts:/root/.local/share/tts \
    -v ./out:/mnt \
    -p 5002:5002 \
    ghcr.io/coqui-ai/tts:latest \
    python3 TTS/server/server.py --model_name tts_models/en/ljspeech/tacotron2-DDC


- TODO
    - docker volume create tts_models_volume
    - docker volume create tts_output_volume

    - docker run --rm -it \
    -v tts_models_volume:/root/.local/share/tts \
    -v tts_output_volume:/mnt/output \
    --gpus all ghcr.io/coqui-ai/tts

    - tts --model_name tts_models/en/vctk/vits --text "Hello, this is a test." --out_path /mnt/output/output.wav
    - docker run --rm -it -v tts_output_volume:/mnt alpine ls /mnt


    - docker compose 
services:
  coqui-tts:
    image: ghcr.io/coqui-ai/tts
    volumes:
      - tts_models_volume:/root/.local/share/tts
      - tts_output_volume:/mnt/output
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]

volumes:
  tts_models_volume:
  tts_output_volume:
