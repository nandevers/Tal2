import requests
import json

BASE_URL = "http://localhost:8000/api" # Inside the container, we talk to port 8000

def test_chat_flow():
    """
    Tests the chat flow (1.2 -> 2.2).
    Sends a simple query and expects a plain text response.
    """
    query = "hello"
    response = requests.get(f"{BASE_URL}/search/?q={query}", stream=True)
    
    assert response.status_code == 200
    
    is_text_answer = False
    for line in response.iter_lines():
        if line:
            chunk = json.loads(line)
            if chunk.get("type") == "answer" and chunk.get("format") == "text":
                is_text_answer = True
                print(f"Chat flow test passed. Response: {chunk['content']}")
                break
    
    assert is_text_answer, "Did not receive a text answer for the chat flow."

def test_search_flow():
    """
    Tests the search flow (1.1 -> 2.1).
    Sends a search query and expects a JSON response.
    """
    query = "find me the CTO of TechCorp"
    response = requests.get(f"{BASE_URL}/search/?q={query}", stream=True)
    
    assert response.status_code == 200
    
    is_json_answer = False
    for line in response.iter_lines():
        if line:
            chunk = json.loads(line)
            if chunk.get("type") == "answer" and chunk.get("format") == "json":
                try:
                    # Clean up the content if it's wrapped in markdown
                    content = chunk['content'].replace("```json", "").replace("```", "").strip()
                    json.loads(content)
                    is_json_answer = True
                    print(f"Search flow test passed. Response is valid JSON.")
                    break
                except json.JSONDecodeError:
                    print("Search flow test failed. 'content' is not valid JSON.")
    
    assert is_json_answer, "Did not receive a JSON answer for the search flow."

if __name__ == "__main__":
    print("--- Testing Chat Flow ---")
    test_chat_flow()
    print("\n--- Testing Search Flow ---")
    test_search_flow()
