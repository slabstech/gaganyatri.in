Build a project with local LLM for Data Security

- git clone https://github.com/slabstech/gaganyatri.in.git

- Setup Locall LLM
    - docker compose -f docker/ollama-inference.yml up -d

    - Download - llama3.1 8b model
        - docker exec -it <ContainerID>  /bin/bash
    - ollama pull llama3.1

- Start Application
    - docker compose -f docker/gaganyatri-app.yml up -d