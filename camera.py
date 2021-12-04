import cv2
import dlib
from scipy.spatial import distance



class VideoCamera(object):
  val=0
  hog_face_detector = dlib.get_frontal_face_detector()
  dlib_facelandmark = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
  lastValue=0.0
  EAR=1000
  status=""
  lastStates=["",""]
  var=0
    
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
          self.lastStates[1]=self.lastStates[0]
          self.lastStates[0]=self.status
          print(self.status)
          self.val=10
          print(self.val)
        else:
          self.status="Blinking"
          self.lastStates[1]=self.lastStates[0]
          self.lastStates[0]=self.status
          #print(self.status)
      else:
        self.status="Active"
        self.lastStates[1]=self.lastStates[0]
        self.lastStates[0]=self.status
        #print(self.status)
        #print(self.EAR)

 
  def get_frame(self):
    ret, frame = self.video.read()
    self.calculateEyes(frame)
    ret, jpeg = cv2.imencode('.jpg', frame)
      
    return jpeg.tobytes()
