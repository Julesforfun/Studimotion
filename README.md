# STUDIMOTION

Um das Projekt 'Studimotion' zu starten, muss main.py über das Terminal ausgeführt werden, zB. mit
`python main.py`.
Danach wird die Adresse angegeben, unter der man die Webapp findet. Diese nun öffnen.

## React-Opencv

[Medium article](https://medium.com/@jadomene99/integrating-your-opencv-project-into-a-react-component-using-flask-6bcf909c07f4)

## Dependencies
Die folgenden Packages mit Versionen wurden für das Projekt verwendet.

  * Python 3 (v3.7.12)
  * bluebird (v3.7.2)
  * csvtojson (v2.0.10)
  * is-utf8 (v0.2.1)
  * lodash (v4.17.21)
  * strip-bom (v2.0.0)
  * numpy (v1.21.5)
  * pandas (v1.3.5)
  * matplotlib (v3.5.1)
  * dlib (v19.22.0)
  * scipy (v1.7.3)
  * Tensorflow (v2.0.0)
  * opencv (v4.5.3)

## Model Training

### Dependencies

  * Python 3 (v3.7.12)
  * Tensorflow (v2.3.0)
  * Keras (v2.7.0)
  * Opencv-python (v4.5.4.58)

### Durchführung

Um das Model zu trainieren, muss zunächst der Datensatz über [diesen Link](https://drive.google.com/file/d/1uhz5SVoO8cGRsaB1iYtirhcz80mVPhBh/view?usp=sharing) heruntergeladen werden. Dieser basiert auf dem "Face expression recognition dataset", welches wiederum auf Google's FER-2013 Datensatz basiert und wurde bereits in die richtige Ordnerstruktur gebracht. Das data.zip nun auspacken.

Als nächstes muss die Datei `haarcascade_frontalface_default.xml` über [diesen Link] (https://drive.google.com/file/d/1Bu9QLFA0XSx6mrQ1Z01HMZtO7B9o-T-I/view?usp=sharing) heruntergeladen und in denselben Ordner, der den "data" Ordner beinhaltet, verschoben werden.

Der folgende Code muss nun in der Ordnerhierarchie auf Höhe des "data" Ordner ausgeführt werden:

```python
import numpy as np
import argparse
import matplotlib.pyplot as plt
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import MaxPooling2D,BatchNormalization,Activation
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Define data generators
train_dir = 'data/train'
val_dir = 'data/test'

num_train = 28709
num_val = 7178
batch_size = 128
num_epoch = 50
no_of_classes = 7

train_datagen = ImageDataGenerator(rescale=1./255)
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(48,48),
        batch_size=batch_size,
        color_mode="grayscale",
        class_mode='categorical')

validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(48,48),
        batch_size=batch_size,
        color_mode="grayscale",
        class_mode='categorical')

# Create the model
model = Sequential()

#1st CNN layer
model.add(Conv2D(64,(3,3),padding = 'same',input_shape = (48,48,1)))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size = (2,2)))
model.add(Dropout(0.25))

#2nd CNN layer
model.add(Conv2D(128,(5,5),padding = 'same'))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size = (2,2)))
model.add(Dropout (0.25))

#3rd CNN layer
model.add(Conv2D(512,(3,3),padding = 'same'))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size = (2,2)))
model.add(Dropout (0.25))

#4th CNN layer
model.add(Conv2D(512,(3,3), padding='same'))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Flatten())

#Fully connected 1st layer
model.add(Dense(256))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(Dropout(0.25))

# Fully connected layer 2nd layer
model.add(Dense(512))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(Dropout(0.25))

model.add(Dense(no_of_classes, activation='softmax'))

opt = Adam(lr = 0.0001)
model.compile(optimizer=opt,loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()


model.compile(loss='categorical_crossentropy',optimizer=Adam(lr=0.0001, decay=1e-6),metrics=['accuracy'])
    model_info = model.fit_generator(
            train_generator,
            steps_per_epoch=num_train // batch_size,
            epochs=num_epoch,
            validation_data=validation_generator,
            validation_steps=num_val // batch_size)
    model.save('model.h5')

```


Die resultierende model.h5 Datei kann nun als model in dem Studimotion Projekt verwendet werden. Dazu einfach die vorhandene model.h5 Datei (im Ordner "emotionDetectionKeras") mit dem neu trainierten Model ersetzen. 