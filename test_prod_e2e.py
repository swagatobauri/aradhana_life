import requests
import json
import time

API_URL = "https://aradhana-life.onrender.com"
EMAIL = f"test_prod_{int(time.time())}@aradhana.test"
PASSWORD = "testpass"

print("=== 1. Sign up ===")
res = requests.post(f"{API_URL}/api/auth/register", json={"email": EMAIL, "password": PASSWORD})
print(res.status_code, res.text)
data = res.json()
user_id = data["user_id"]
print(f"USER_ID: {user_id}")

print("\n=== 2. Save Profile (Simulating BirthForm) ===")
profile_data = {
    "user_id": user_id,
    "birth_details": {
        "date": "2000-01-01",
        "time": "12:00",
        "place": "Delhi, India"
    }
}
res = requests.post(f"{API_URL}/api/profile", json=profile_data)
print(res.status_code, res.text)

print("\n=== 3. First Chat Message ===")
chat_data = {
    "message": "Compute my birth chart based on my details.",
    "session_id": user_id,
    "birth_details": profile_data["birth_details"]
}
res = requests.post(f"{API_URL}/api/chat", json=chat_data, stream=True)
content = ""
for line in res.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                event = json.loads(line[6:])
                if event["type"] == "content":
                    content += event["content"]
            except:
                pass
print(f"AI Response: {content[:150]}...")

print("\n=== 4. Save Chat History (Simulating ChatWindow auto-save) ===")
history_data = {
    "messages": [
        {"id": "msg1", "role": "user", "content": "Compute my birth chart based on my details."},
        {"id": "msg2", "role": "ai", "content": content}
    ]
}
res = requests.post(f"{API_URL}/api/chat/history/{user_id}", json=history_data)
print(res.status_code, res.text)

print("\n=== 5. Second Chat Message ===")
chat_data2 = {
    "message": "What does my Sun sign mean?",
    "session_id": user_id,
    "birth_details": profile_data["birth_details"]
}
res = requests.post(f"{API_URL}/api/chat", json=chat_data2, stream=True)
content2 = ""
for line in res.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith("data: "):
            try:
                event = json.loads(line[6:])
                if event["type"] == "content":
                    content2 += event["content"]
            except:
                pass
print(f"AI Response 2: {content2[:150]}...")

print("\n=== 6. Update Chat History ===")
history_data["messages"].extend([
    {"id": "msg3", "role": "user", "content": "What does my Sun sign mean?"},
    {"id": "msg4", "role": "ai", "content": content2}
])
res = requests.post(f"{API_URL}/api/chat/history/{user_id}", json=history_data)
print(res.status_code, res.text)

print("\n=== 7. Log out and Sign in again (Simulating returning user) ===")
res = requests.post(f"{API_URL}/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
print(res.status_code, res.text)

print("\n=== 8. Fetch Profile ===")
res = requests.get(f"{API_URL}/api/profile/{user_id}")
print(res.status_code, res.text)

print("\n=== 9. Fetch Chat History ===")
res = requests.get(f"{API_URL}/api/chat/history/{user_id}")
print(res.status_code, res.text)
history = res.json()
print(f"Loaded {len(history.get('messages', []))} messages.")

