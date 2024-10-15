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


def generate_embedding(text):
    """
    Generate embeddings for the given text using a cached model.

    Parameters:
    - text (str): The input text to embed.

    Returns:
    - list: A list of embeddings generated for the input text.
    """
    model_path = "/home/<user>/.cache/nomic.ai/ggml-model-gpt4all-falcon-q4_0.bin"

    # Check if the model file exists in the cache
    if not os.path.exists(model_path):
        print("Model not found locally. Downloading...")
        # Logic to download the model (pseudo-code)
        # download_model(model_path)
        # Ensure to implement your download logic here

    try:
        # Call the embed method from the Nomic library
        output = embed.text(
            texts=[text],
            model=model_path,
            inference_mode='local'  # Use 'remote' if needed
        )
        
        return output['embeddings']
    
    except Exception as e:
        print(f"An error occurred while generating embeddings: {e}")
        return None
