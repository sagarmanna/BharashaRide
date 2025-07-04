import cv2
import dlib
import numpy as np
from scipy.spatial import distance as dist

predictor_path = "models/shape_predictor_68_face_landmarks.dat"
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

LEFT_EYE  = list(range(42, 48))
RIGHT_EYE = list(range(36, 42))
MOUTH     = list(range(60, 68))

EAR_THRESHOLD = 0.25
MAR_THRESHOLD = 0.6

def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

def mouth_aspect_ratio(mouth):
    # mouth: 8 inner‑lip points [60…67]
    A = dist.euclidean(mouth[1], mouth[7])
    B = dist.euclidean(mouth[2], mouth[6])
    C = dist.euclidean(mouth[3], mouth[5])
    D = dist.euclidean(mouth[0], mouth[4])
    if D == 0:
        return 0.0
    return (A + B + C) / (3.0 * D)

def detect(img):
    gray  = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 0)
    if not rects:
        return {"drowsy": False, "yawning": False, "emotion": "Unknown"}

    drowsy = yawning = False
    for rect in rects:
        shape  = predictor(gray, rect)
        coords = np.array([[p.x, p.y] for p in shape.parts()])

        left_eye  = coords[LEFT_EYE]
        right_eye = coords[RIGHT_EYE]
        mouth_pts = coords[MOUTH]

        ear = (eye_aspect_ratio(left_eye) + eye_aspect_ratio(right_eye)) / 2.0
        mar = mouth_aspect_ratio(mouth_pts)

        if ear < EAR_THRESHOLD:
            drowsy = True
        if mar > MAR_THRESHOLD:
            yawning = True

    emotion = "Tired" if drowsy else "Neutral"
    return {"drowsy": drowsy, "yawning": yawning, "emotion": emotion}
