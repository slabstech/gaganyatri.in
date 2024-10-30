Indic Language Demo

- Sarvam API
    - https://docs.sarvam.ai/api-reference-docs/endpoints/speech-to-text

- 6 bit - sarvam-1 
    - ollama pull hf.co/QuantFactory/sarvam-1-GGUF:sarvam-1.Q6_K.gguf

- 2bit version is downloaded by default - it is unusable
    - ollama pull hf.co/QuantFactory/sarvam-1-GGUF


- Pull hf model via ollama
    - docker compose -f inference-compose.yml up -d ollama
    -   docker exec -it continerID /bin/bash
    - ollama pull hf.co/QuantFactory/sarvam-1-GGUF
    - Add suitable prompt to make it usable for Instruction based