# 🛡️ BharashaRide AI – Driver Drowsiness & Yawning Detection System

A full-stack AI-powered safety dashboard that detects **driver drowsiness**, **yawning**, and **emotion** in real-time using webcam input. Built using **ReactJS** for the frontend and **FastAPI + OpenCV** for the backend.

> 🎥 Watch the live demo on YouTube:  
> [📺 BharashaRide AI – Real-Time Driver Monitoring](https://www.youtube.com/watch?v=MgHXPz6WP-c)

---

## 🚀 Features

- 🎥 Real-time camera feed with automatic frame capture
- 🧠 AI-based detection of:
  - Drowsiness
  - Yawning
  - Emotion recognition (basic)
- 🔊 Audio alerts when unsafe conditions are detected
- ⚠️ **CAR OFF Warning** message shown when danger is detected
- 📊 Live status dashboard with smooth, styled UI
- 🔁 Polls every 3 seconds with camera-to-backend communication

---

## 🛠️ Tech Stack

| Layer       | Technologies                     |
|-------------|----------------------------------|
| Frontend    | ReactJS, HTML, CSS, Audio API    |
| Backend     | FastAPI, Uvicorn, Python         |
| AI Logic    | OpenCV, Dlib, Face Landmarking   |
| Integration | CORS, Webcam API, FormData       |

---

## 📷 Dashboard Preview

![Dashboard Screenshot](https://github.com/user-attachments/assets/a75c6268-fe9c-47d3-9400-b215905af0c7)

---

## 📁 Project Structure
bharasharide_fullstack/
├── backend/
│ ├── app.py
│ ├── drowsiness_detector.py
│ ├── emotion_detector.py
│ ├── shape_predictor_68_face_landmarks.dat
│ └── start_server.py
├── frontend/
│ ├── public/
│ │ ├── sound_alarm.wav
│ │ └── index.html
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── index.css
│ └── package.json
