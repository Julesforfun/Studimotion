import cv2
import dlib
from scipy.spatial import distance
from tensorflow.keras.models import load_model
from time import sleep
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt


class VideoCamera(object):
  emotion=0
  emotion_stress=0
  hog_face_detector = dlib.get_frontal_face_detector()
  dlib_facelandmark = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
  lastValue=0.0
  EAR=1000
  status=""
  status_stress ="0"
  status_underchallenged ="0"
  lastStates=["",""]
  results_list = []
  counter_time = 0
  csv_initalized= False

  def __init__(self):
      self.video = cv2.VideoCapture(0)

  def __del__(self):
      self.video.release()
    
  def calculate_EAR(self, eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear_aspect_ratio = (A+B)/(2.0*C)
    return ear_aspect_ratio

  def calculateEyes(self, frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = self.hog_face_detector(gray)

    for face in faces:
      face_landmarks = self.dlib_facelandmark(gray, face)
      leftEye = []
      rightEye = []

      for n in range(36,42):
        x = face_landmarks.part(n).x
        y = face_landmarks.part(n).y
        leftEye.append((x,y))
        next_point = n+1
        if n == 41:
          next_point = 36
        x2 = face_landmarks.part(next_point).x
        y2 = face_landmarks.part(next_point).y
        cv2.line(frame,(x,y),(x2,y2),(0,255,0),1)

      for n in range(42,48):
        x = face_landmarks.part(n).x
        y = face_landmarks.part(n).y
        rightEye.append((x,y))
        next_point = n+1
        if n == 47:
          next_point = 42
        x2 = face_landmarks.part(next_point).x
        y2 = face_landmarks.part(next_point).y
        cv2.line(frame,(x,y),(x2,y2),(0,255,0),1)

    
      left_ear = self.calculate_EAR(leftEye)
      right_ear = self.calculate_EAR(rightEye)

      self.lastValue=self.EAR
      self.EAR = (left_ear+right_ear)/2
      self.EAR = round(self.EAR,2)
      if self.EAR<0.26:
        if self.lastValue<0.26:
          cv2.putText(frame,"DROWSY",(20,100),
          cv2.FONT_HERSHEY_SIMPLEX,3,(0,0,255),4)
          cv2.putText(frame,"Are you Sleepy?",(20,400),
          cv2.FONT_HERSHEY_SIMPLEX,2,(0,0,255),4)
          self.status="Drowsy"
          self.status_underchallenged = "1"
          self.lastStates[1]=self.lastStates[0]
          self.lastStates[0]=self.status
          print(self.status)
          self.emotion=2
        else:
          self.status="Blinking"
          self.status_underchallenged = "0"
          self.lastStates[1]=self.lastStates[0]
          self.lastStates[0]=self.status
          self.emotion=1
          print(self.status)
      else:
        self.status="Active"
        self.status_underchallenged = "0"
        self.lastStates[1]=self.lastStates[0]
        self.lastStates[0]=self.status
        self.emotion=0
        print(self.status)
      print(self.EAR)

  def save_to_csv(self):
    if (self.csv_initalized==False):
          self.results_list.append(["Time", "Unterfordert", "Überfordert"]) 
          self.csv_initalized=True 
    self.counter_time = self.counter_time + 1 
    self.results_list.append([self.counter_time, self.status_underchallenged, self.status_stress])

    out = open('out.csv', 'w')
    for row in self.results_list:
        for column in row:
            if isinstance(column, str):
              out.write('%s;' % column)
            else:
              out.write('%i;' % column) 
        out.write('\n')
    out.close()
  
 
  def get_frame(self):
    ret, frame = self.video.read()
    self.calculateEyes(frame)
    self.calculateEmotion(frame)
    self.save_to_csv()
    ret, jpeg = cv2.imencode('.jpg', frame)
      
    return jpeg.tobytes()

  def calculateEmotion(self, frame): 
    face_classifier = cv2.CascadeClassifier('/Users/sophiasigethy/Desktop/Uni/Master/3.Semester/AffectiveComputing/NEWREPOSITORY/Studimotion/emotionDetectionKeras/haarcascade_frontalface_default.xml')
    classifier=load_model('/Users/sophiasigethy/Desktop/Uni/Master/3.Semester/AffectiveComputing/NEWREPOSITORY/Studimotion/emotionDetectionKeras/model.h5')
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
      
    #_, frame = self.video.read()
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
              if(label=='Angry' or label=="Sad" or label=="Disgust"):
                self.status_stress = "1"
                print(label + " -> stressed")
                self.emotion_stress=1
              else:
                self.status_stress = "0"
                print(label + " -> not stressed")
                self.emotion_stress=0
                
              label_position = (x,y-10)
              cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
          else:
              cv2.putText(frame, 'No Faces', (30,80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0),2)

          # cv2.imshow('Emotion Detector', frame)
          #if cv2.waitKey(1) & 0xFF == ord('q'):
              #break
    

