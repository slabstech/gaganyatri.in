import { Ollama } from 'ollama/browser';

const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL;
const ollama = new Ollama({ host: ollamaBaseUrl });
const MODEL_NAME = "llava:latest"

export const generateResponse = async (prompt: string, imageFile: File) => {
  try {
    const imageData = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageData)));
    const response = await ollama.generate({
      model: MODEL_NAME,
      prompt: prompt,
      images: [base64Image],
      stream: true,
    });
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

export const generateFeatures = async (imageFile: File) => {
  try {
    const prompt = `
        Identify food items and its features from the given image. 
        The result should be in a JSON string format. For example,
        {"food_items": [{"name": "banana", "color": "yellow", "taste": "sweet", "rotten": true, "quantity": 1,  "type": "fruit"},
        {"name": "potato", "color": "yellow", "taste": "sweet", "rotten": false, "quantity": 3, "type": "vegetable"}]}
      `;
    const imageData = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageData)));
     const response = await ollama.generate({
      model: MODEL_NAME,
      prompt: prompt,
      images: [base64Image],
      stream: false,
    });
    const data = response.response.trim();
    //const data = '```json\n{\n  "food_items": [\n    {"name": "cucumber", "color": "green", "taste": "bitter", "is_rotten": false, "quantity": 10, "type": "vegetable"},\n    {"name": "carrot", "color": "orange", "taste": "sweet", "is_rotten": false, "quantity": 10, "type": "vegetable"},\n    {"name": "broccoli", "color": "green", "taste": "bitter", "is_rotten": false, "quantity": 5, "type": "vegetable"},\n    {"name": "celery", "color": "green", "taste": "bitter", "is_rotten": false, "quantity": 5, "type": "vegetable"},\n    {"name": "onion", "color": "white", "taste": "pungent", "is_rotten": false, "quantity": 10, "type": "vegetable"},\n    {"name": "potato", "color": "red", "taste": "starchy", "is_rotten": false, "quantity": 5, "type": "vegetable"},\n    {"name": "tomato", "color": "red", "taste": "sweet", "is_rotten": false, "quantity": 10, "type": "vegetable"},\n    {"name": "lettuce", "color": "green", "taste": "bitter", "is_rotten": false, "quantity": 5, "type": "vegetable"},\n    {"name": "pepper", "color": "red", "taste": "spicy", "is_rotten": false, "quantity": 10, "type": "vegetable"},\n    {"name": "squash", "color": "orange", "taste": "neutral", "is_rotten": false, "quantity": 5, "type": "vegetable"}\n  ]\n}\n```'
    const result: string = cleanJsonString(data);
    return result;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

function cleanJsonString(inputString: string) {
  const prefix = "```json";
  const suffix = "```";
  // Check if the string starts with the prefix and ends with the suffix
  if (inputString.startsWith(prefix) && inputString.endsWith(suffix)) {
      // Remove the prefix and suffix
      const cleanedString = inputString.slice(prefix.length, -suffix.length).trim();
      return cleanedString;
  } else {
      return inputString; // Return the original string if conditions are not met
  }
}

export const generateResponseFromJson = async (jsonStr: string) => {
  try {
    const prompt = "For each food item in the JSON DATA, provide a detailed description focusing on reducing food wastage. Include the following sections:\n" +
                "1. State the name of the food item.\n" +
                "2. Mention the expiration date to raise awareness about freshness.\n" +
                "3. Describe the best storage practices to prolong shelf life.\n" +
                "4. List creative ways to use the food item to encourage consumption before it spoils.\n" +
                "5. Provide actionable tips for minimizing waste, such as recipes or preservation methods.\n" +
                "JSON DATA = "+ jsonStr;
    const response = await ollama.generate({
      model: MODEL_NAME,
      prompt: prompt,
      stream: true,
    });
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};