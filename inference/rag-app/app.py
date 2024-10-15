from flask import Flask, request, jsonify
from nomic import embed

app = Flask(__name__)

@app.route('/embed', methods=['POST'])
def get_embedding():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Generate the embedding using Nomic Embed
    output = embed.text(
        texts=[text],
        model='nomic-embed-text-v1.5',
        inference_mode='local'  # or 'remote' based on your setup
    )
    
    embeddings = output['embeddings']
    return jsonify({'embeddings': embeddings})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
