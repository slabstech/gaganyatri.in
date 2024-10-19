- Deployment

- Fork the repo - 
  - https://github.com/slabstech/gaganyatri.in


- Cloud Deployment 

  - Backend
    - Duplicate the Huggingface Space at [https://huggingface.co/spaces/gaganyatri/django_spaces](https://huggingface.co/spaces/gaganyatri/django_spaces)
    - Add Environment variable for AI Inference
      - Get subscription for Mistral, Sarvam and NVIDIA nim
      - export MISTRAL_API_KEY='MISTRAL_KEY_ADD_HERE'
      - export NIM_API_KEY='NVIDIA-NIM-ADD-HERE'
      - export SARVAM_API_KEY='SARVAM-KEY-ADD-KEY-HERE'
    - Restart the Spaces

  - Frontend
    - In GitHub, Add Repository Secret for Huggingface Spaces
      - VITE_HF_SPACES_URL=https://Your-Spaces-URL/api/v1
    - cd frontend
    - npm run build
    - npm run deploy


- Local Deployment with GPU
  - With Docker
    - Application
      - docker compose -f docker-compose.dev.yml
    - Inference
      - docker compose -f inference-compose.yml
  - Without Docker
    - For UI/frontend
      - cd frontend
      - npm install
      - npm run dev
    - For App Server/backend
      - python -m venv venv
      - source venv/bin/activate
      - pip install -r requirements.txt
      - python manage.py runserver


- WIP
  - Speech AI - GPU required
    - cd inference/speech
    - huggingface-cli download Systran/faster-distil-whisper-small.en
    - docker compose -f docker-compose.yml up -d
