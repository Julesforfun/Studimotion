import dlib
import cv2
import numpy as np


#face_cascade = cv2.CascadeClassifier('../assets/haarcascade_frontalface_default.xml')

predictor = dlib.shape_predictor('../assets/shape_predictor_68_face_landmarks.dat')
detector = dlib.get_frontal_face_detector()


def getting_landmarks(im):
    rects = detector(im, 1)

    if len(rects) > 1:
        return "error"
    if len(rects) == 0:
        return "error"
    return np.matrix([[p.x, p.y] for p in predictor(im, rects[0]).parts()])

def annotate_landmarks(im, landmarks):
    im = im.copy()
    for idx, point in enumerate(landmarks):
        pos = (point[0, 0], point[0,1])
        cv2.putText(im, str(idx), pos, fontFace=cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, fontScale=0.4, color=(1, 2, 255))
        cv2.circle(im, pos, 3, color=(0, 2, 2))
    return im

def top_lip(landmarks):
    top_lip_pts = []
    for i in range(50,53):
        top_lip_pts.append(landmarks[i])
    for i in range(61,64):
        top_lip_pts.append(landmarks[i])
    top_lip_all_pts = np.squeeze(np.asarray(top_lip_pts))
    top_lip_mean = np.mean(top_lip_pts, axis=0)
    return int(top_lip_mean[:,1])

def bottom_lip(landmarks):
    bottom_lip_pts = []
    for i in range(65,68):
        bottom_lip_pts.append(landmarks[i])
    for i in range(56,59):
        bottom_lip_pts.append(landmarks[i])
    bottom_lip_all_pts = np.squeeze(np.asarray(bottom_lip_pts))
    bottom_lip_mean = np.mean(bottom_lip_pts, axis=0)
    return int(bottom_lip_mean[:,1])

def mouth_open(image):
    landmarks = getting_landmarks(image)

    if landmarks == "error":
        return image, 0
    
    image_with_landmarks = annotate_landmarks(image, landmarks)
    top_lip_center = top_lip(landmarks)
    bottom_lip_center = bottom_lip(landmarks)
    lip_distance = abs(top_lip_center - bottom_lip_center)
    return image_with_landmarks, lip_distance

cap = cv2.VideoCapture(0)
yawns = 0
yawn_status = False

while True:
    ret, frame = cap.read()
    image_with_landmarks, lip_distance = mouth_open(frame)

    prev_yawn_status = yawn_status

    if lip_distance > 35:
        yawn_status = True
        cv2.putText(frame, "Tired? Get a coffee ;)", (50, 450), cv2.FONT_HERSHEY_COMPLEX, 1,(0,0,255),2)

        #from pygame import mixer
        #mixer.init()
        #mixer.music.load('sth.mp3')
        #mixer.music.play()

        output_text = "Yawn Count: " + str(yawns + 1)
        
        cv2.putText(frame, output_text, (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0,255,127),2)
    else:
        yawn_status = False

    if prev_yawn_status == True and yawn_status == False:
        yawns += 1
        
    cv2.imshow('Live Landmarks', image_with_landmarks)
    cv2.imshow('Yawn Detection', frame)

    if cv2.waitKey(1) == 13:
        break

cap.release()
cv2.destroyAllWindows()


'''
cap = cv2.VideoCapture(0)

while (cap.isOpened()):

    # Capture frame-by-frame
    ret, frame = cap.read()


    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 2, minSize=(200, 200))


    for (x1, y1, w, h) in faces:

        x2 = x1 + w
        y2 = y1 + h 

        pad = 0
        x1 = int(x1 - pad)
        x2 = int(x2 + pad)
        y1 = int(y1 - pad)
        y2 = int(y2 + pad)

        face = frame[y1:y2, x1:x2]


        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        shape = landmark_model(face, dlib.rectangle(0, 0, face.shape[1], face.shape[0]))

        for i in range(0, 68):
            (cx, cy) = (int(shape.part(i).x), int(shape.part(i).y))
            cv2.circle(frame, (x1+ cx, y1 + cy), 1, (0, 255, 0), 6)


    cv2.imshow("frame", frame)	

    k = cv2.waitKey(1)
    if k == 27:
        break


# When everything done, release the capture
cv2.destroyAllWindows()
cap.release()
'''
