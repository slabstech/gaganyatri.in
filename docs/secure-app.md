Build a project with local LLM for Data Security

- git clone https://github.com/slabstech/gaganyatri.in.git

- Setup Locall LLM
    - docker compose -f docker/ollama-inference.yml up -d

    - Setup - llama3.1 8b model
        - Find Container ID for ollama container
            - docker ps --filter "ancestor=ollama/ollama:latest" --format "{{.ID}}"
        - connect to ollama container via bash, replace the <ContainerID> with output of previous command
            - docker exec -it <ContainerID>  /bin/bash
        - Download llama3.1 8b model from ollama registry
            - ollama pull llama3.1
        - Exit bash from container
            - exit

- Start Gaganyatri Application
    - docker compose -f docker/gaganyatri-app.yml up -d