from tensorflow.keras.models import load_model
from time import sleep
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2


#face_classifier = cv2.CascadeClassifier('/Users/sophiasigethy/Desktop/Uni/Master/3.Semester/AffectiveComputing/NEWREPOSITORY/Studimotion/emotionDetectionKeras/haarcascade_frontalface_default.xml')
#classifier=load_model('/Users/sophiasigethy/Desktop/Uni/Master/3.Semester/AffectiveComputing/NEWREPOSITORY/Studimotion/emotionDetectionKeras/model.h5')
face_classifier = cv2.CascadeClassifier('/Users/yara5/Documents/Master/Semester_3/AffectiveComputing/Projekt/Studimotion/emotionDetectionKeras/haarcascade_frontalface_default.xml')
classifier=load_model('/Users/yara5/Documents/Master/Semester_3/AffectiveComputing/Projekt/Studimotion/emotionDetectionKeras/model.h5')

emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

cap = cv2.VideoCapture(0)

while True:
    _, frame = cap.read()
    labels = []
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray)

    for (x,y,w,h) in faces:
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0,255,255), 2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48), interpolation = cv2.INTER_AREA)

        if np.sum([roi_gray])!=0:
            roi = roi_gray.astype('float')/255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)

            prediction = classifier.predict(roi)[0]
            label = emotion_labels[prediction.argmax()]
            label_position = (x,y-10)
            cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
        else:
            cv2.putText(frame, 'No Faces', (30,80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0),2)
        cv2.imshow('Emotion Detector', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows