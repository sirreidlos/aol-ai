import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from keras.models import Sequential
from keras.layers import Dense, Dropout

# Load the dataset
df = pd.read_csv('dataset/Final_Augmented_dataset_Diseases_and_Symptoms.csv')


X = df.drop(columns=['diseases'])  # Symptoms (features)
y = df['diseases']                 # Disease labels (target)

# Encode the target variable (if it's categorical)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Build the ANN model
model = Sequential([
    Dense(512, activation='relu', input_shape=(X_train.shape[1],)),  
    Dropout(0.3),  
    Dense(256, activation='relu'),  
    Dropout(0.3),  
    Dense(128, activation='relu'), 
    Dropout(0.3),
    Dense(64, activation='relu'),  
    Dropout(0.2),
    Dense(32, activation='relu'),  
    Dropout(0.1),
    Dense(len(np.unique(y_encoded)), activation='softmax')  
])

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=256, batch_size=64, validation_split=0.2)

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.2f}")

model.save("model/relu_unscaled.keras")
model.save("model/relu_unscaled.h5")
