Kassel - 3rd Bio - Hackathon - 9-13- December 2024

- Problem statement 
    - Build on top of OntoGPT

- https://www.denbi.de/de-nbi-events/1757-3rd-biohackathon-germany-building-on-top-of-ontogpt

- https://monarch-initiative.github.io/ontogpt/

- https://github.com/monarch-initiative/ontogpt/

- https://github.com/monarch-initiative

-
Ontogpt 

- Setup
    - Create virtual environment
        - python3.10 -m venv venv
        - source venv/bin/activate
    - Install ontogpt
        - pip install ontogpt
    - Create api-key to use with ollama
        - runoak set-apikey -e openai hello-world
    - Start ollama server 

- Execute Commands
    - echo "One treatment for high blood pressure is carvedilol." > example.txt
    - ontogpt extract -i example.txt -t drug --model ollama/llama3.2

    
- web-ontogpt   
    - pip install ontogpt[web]
    - web-ontogpt

    - update file src/ontogpt/webapp/main.py
        - provide proper version names for ollama model
            - ollama/llama3.2
            - ollama/llama3.1
    
    - pip install poetry
    - poetry build
    - poetry install -E web
    - poetry run web-ontogpt



- Different Quantization
    - https://huggingface.co/bartowski/Ministral-8B-Instruct-2410-GGUF

- TO use Ministral from Hugginface

    - ollama pull hf.co/bartowski/Ministral-8B-Instruct-2410-GGUF:Q4_K_L

- To use Qwen2.5 
    - ollama pull qwen2.5