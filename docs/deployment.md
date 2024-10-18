- Deployment

- Fork the repo - 
  - https://github.com/slabstech/gaganyatri.in

- Server Deployment 
  - Frontend
    - npm run deploy

  - Backend
    - Get subscription for Mistral, Sarvam and NVIDIA nim
    - export MISTRAL_API_KEY='MISTRAL_KEY_ADD_HERE'
    - export NIM_API_KEY='NVIDIA-NIM-ADD-HERE'
    - export SARVAM_API_KEY='SARVAM-KEY-ADD-KEY-HERE'


  - Speech AI - GPU required
    - cd inference/speech
    - huggingface-cli download Systran/faster-distil-whisper-small.en
    - docker compose -f docker-compose.yml up -d