Indic Language Demo

- Sarvam API
    - https://docs.sarvam.ai/api-reference-docs/endpoints/speech-to-text

- 
- Pull hf model via ollama
    - docker compose -f inference-compose.yml up -d ollama
    -   docker exec -it continerID /bin/bash
    - ollama pull hf.co/QuantFactory/sarvam-1-GGUF
    - Add suitable prompt to make it usable for Instruction based