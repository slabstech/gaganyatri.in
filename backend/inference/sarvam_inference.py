
import requests
import os

def translate_text(text_string, source_lang, target_lang):

    api_key=os.getenv("SARVAM_API_KEY", "")
    url = "https://api.sarvam.ai/translate"
    payload = {
        "input": text_string,
        "source_language_code": source_lang,
        "target_language_code": target_lang,
        "speaker_gender": "Male",
        "mode": "formal",
        "model": "mayura:v1",
        "enable_preprocessing": True
    }
    headers = {"Content-Type": "application/json",
            'API-Subscription-Key': f"{api_key}"
            }

    response = requests.request("POST", url, json=payload, headers=headers)

    #print(response.text)
    return response.text


#text_string = "Who is the founder of Bengaluru?"
#source_lang = "en-IN"
#target_lang = "kn-IN"
#response_text = translate_text(text_string, source_lang, target_lang)
#print(response_text)