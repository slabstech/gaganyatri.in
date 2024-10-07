Inference

- Embedding
    - Text - Nomic

- Simple 
    - docker build -t nomic-embed-app .
    - docker run -p 5000:5000 nomic-embed-app
- Flask
    - docker-compose up --build

- curl -X POST http://localhost:5000/embed -H "Content-Type: application/json" -d '{"text": "Your text here"}'

Reference
- https://python.langchain.com/docs/integrations/text_embedding/nomic/

- https://docs.nomic.ai/atlas/cookbook/building-image-classifiers-with-atlas