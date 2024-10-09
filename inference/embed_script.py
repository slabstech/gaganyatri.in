import os
from nomic import embed

def generate_embedding(text):
    output = embed.text(
        texts=[text],
        model='nomic-embed-text-v1.5',
        inference_mode='local'  # or 'remote' based on your setup
    )
    return output['embeddings']

if __name__ == "__main__":
    text = "Your text here"
    embeddings = generate_embedding(text)
    print(embeddings)
