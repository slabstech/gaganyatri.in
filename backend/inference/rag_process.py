from mistralai import Mistral
import requests
import numpy as np
import faiss
import os

api_key=os.getenv("MISTRAL_API_KEY", "")
client = Mistral(api_key=api_key)

def get_data():

    response = requests.get('https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt')
    text = response.text

    f = open('essay.txt', 'w')
    f.write(text)
    f.close()


    len(text)
    return text

def create_chunks(text):

    chunk_size = 2048
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    len(chunks)
    return chunks

def get_text_embedding(input):
    embeddings_batch_response = client.embeddings.create(
          model="mistral-embed",
          inputs=input
      )
    return embeddings_batch_response.data[0].embedding


def load_vectors(chunks):
    text_embeddings = np.array([get_text_embedding(chunk) for chunk in chunks])

    text_embeddings.shape

    d = text_embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(text_embeddings)
    return index

def create_embed_for_question(question):
    
    question_embeddings = np.array([get_text_embedding(question)])
    question_embeddings.shape
    return question_embeddings

def get_similar_chunks(index, question_embeddings, chunks):
    D, I = index.search(question_embeddings, k=2)
    print(I)
    retrieved_chunk = [chunks[i] for i in I.tolist()[0]]
    print(retrieved_chunk)
    return retrieved_chunk

def create_prompt(retrieved_chunk, question):
    prompt = f"""
    Context information is below.
    ---------------------
    {retrieved_chunk}
    ---------------------
    Given the context information and not prior knowledge, answer the query.
    Query: {question}
    Answer:
    """
    return prompt


def run_mistral(user_message, model="mistral-large-latest"):
    messages = [
        {
            "role": "user", "content": user_message
        }
    ]
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )
    return (chat_response.choices[0].message.content)

def main():
    text = get_data()
    chunks = create_chunks(text=text)
    question = "What were the two main things the author worked on before college?"

    index = load_vectors(chunks=chunks)
    question_embeddings = create_embed_for_question(question=question)
    retrieved_chunk = get_similar_chunks(index, question_embeddings, chunks)
    prompt = create_prompt(retrieved_chunk, question)
    answer = run_mistral(prompt)
    print(answer)

main()