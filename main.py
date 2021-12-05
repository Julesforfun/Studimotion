from flask import Flask, render_template, Response, jsonify, request
from camera import VideoCamera
from waitress import serve

app = Flask(__name__)

camera2= VideoCamera()

@app.route('/_stuff', methods = ['GET'])
def stuff():
    emo= camera2.emotion
        
    return jsonify(result=emo)

@app.route('/')
def index():
   return render_template('index.html')
    
def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
               
@app.route('/video_feed')
def video_feed():
    #return Response(gen(VideoCamera()),
                    #mimetype='multipart/x-mixed-replace; boundary=frame')
    return Response(gen(camera2),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)
    #serve(app, host="0.0.0.0", port=5000)
