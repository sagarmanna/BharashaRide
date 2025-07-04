import React, { useEffect, useRef, useState } from "react";

function App() {
  const [status, setStatus] = useState({
    drowsy: false,
    yawning: false,
    emotion: "Unknown",
  });

  const videoRef = useRef(null);
  const alarm = useRef(new Audio("/sound_alarm.wav"));

  // 🎥 Access camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera access denied:", err));
  }, []);

  // 📸 Send frame every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        fetch("http://127.0.0.1:8000/detect", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setStatus(data);
            if (data.drowsy || data.yawning) {
              alarm.current.loop = true;
              alarm.current.play();
            } else {
              alarm.current.pause();
              alarm.current.currentTime = 0;
            }
          })
          .catch((err) => console.error("Error:", err));
      }, "image/jpeg", 0.8);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statusCardStyle = (bgColor) => ({
    padding: "1rem 2rem",
    borderRadius: "12px",
    background: bgColor,
    color: "#fff",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    minWidth: "150px",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "bold",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f172a, #1e293b)",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          background: "linear-gradient(to right, #38bdf8, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🛡️ BharashaRide AI Dashboard
      </h1>

      {status.drowsy ? (
        <div
          style={{
            color: "#fff",
            background: "#ef4444",
            padding: "1rem 2rem",
            borderRadius: "10px",
            marginBottom: "1rem",
            fontSize: "1.5rem",
            boxShadow: "0 0 10px #ef4444",
            animation: "blink 1s infinite",
          }}
        >
          ⚠️ ALERT: Driver Drowsy – CAR OFF Activated!
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div style={statusCardStyle(status.drowsy ? "#ef4444" : "#22c55e")}>
          Drowsy<br />
          {status.drowsy ? "Yes 😴" : "No ✅"}
        </div>
        <div style={statusCardStyle(status.yawning ? "#facc15" : "#22c55e")}>
          Yawning<br />
          {status.yawning ? "Yes 🥱" : "No ✅"}
        </div>
        <div style={statusCardStyle("#3b82f6")}>
          Emotion<br />
          {status.emotion || "Unknown"} 😐
        </div>
      </div>

      <div
        style={{
          border: "5px solid #38bdf8",
          borderRadius: "16px",
          padding: "10px",
          boxShadow: "0 0 25px #38bdf8",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
          style={{ borderRadius: "10px" }}
        />
      </div>

      <footer
        style={{
          marginTop: "2rem",
          fontSize: "0.9rem",
          opacity: 0.7,
        }}
      >
        ⚙️ Built with 💙 for safer driving – BharashaRide
      </footer>
    </div>
  );
}

export default App;
