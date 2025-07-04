from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from drowsiness_detector import detect  # Your existing detector logic

app = FastAPI()

# ✅ Enable CORS so React (localhost:3000) can call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production lock this down!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def status_check():
    return {"status": "Backend is running ✅"}

@app.post("/detect")
async def detect_frame(file: UploadFile = File(...)):
    contents = await file.read()
    print(f"📦 Received {len(contents)} bytes")
    
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        print("❌ Frame decode failed")
        return {"drowsy": False, "yawning": False, "emotion": "Unknown"}

    result = detect(frame)
    print("🎯 Detect result:", result)
    return result
