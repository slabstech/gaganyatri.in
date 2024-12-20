UltraVox - SpeechLLM

- docker build -t vllm-audio -f Dockerfile .


- Download models from Huggingface
    - huggingface-cli download meta-llama/Llama-3.2-1B-Instruct --token $HF_ACCESS_TOKEN --exclude "*consolidated*"
    - huggingface-cli download fixie-ai/ultravox-v0_3-llama-3_2-1b
    - huggingface-cli download openai/whisper-small
    - huggingface-cli download openai/whisper-small \
  --exclude "*flax_model*" \
  --exclude "*tf_model.h5" \
  --exclude "*pytorch_model.bin*"

    
- Run Vllm container for Ultravox
    - docker compose -f vllm-ultravox.yml up -d