import os
import cv2
import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# ==================================================
# CONFIGURATION
# ==================================================
DATASET_PATH = r"D:\Apple Disease\dataset"
MODEL_DIR = r"D:\Apple Disease\ml\models"

IMAGE_SIZE = 224
BATCH_SIZE = 4
TEST_SIZE = 0.2
RANDOM_STATE = 42

os.makedirs(MODEL_DIR, exist_ok=True)

# ==================================================
# LOAD DATASET
# ==================================================
print("\n[INFO] Loading dataset...")

X, y = [], []

for class_name in os.listdir(DATASET_PATH):
    class_path = os.path.join(DATASET_PATH, class_name)

    if not os.path.isdir(class_path):
        continue

    print(f"[INFO] Loading class: {class_name}")

    for img_name in os.listdir(class_path):
        img_path = os.path.join(class_path, img_name)
        img = cv2.imread(img_path)

        if img is None:
            continue

        img = cv2.resize(img, (IMAGE_SIZE, IMAGE_SIZE))
        img = preprocess_input(img)

        X.append(img)
        y.append(class_name)

X = np.array(X)
y = np.array(y)

print(f"[INFO] Total images loaded: {len(X)}")

# ==================================================
# LABEL ENCODING
# ==================================================
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
joblib.dump(label_encoder, os.path.join(MODEL_DIR, "label_encoder.pkl"))

# ==================================================
# EFFICIENTNET + GLOBAL AVERAGE POOLING
# ==================================================
print("\n[INFO] Loading EfficientNet-B0 with GAP...")

base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)

feature_extractor = Model(inputs=base_model.input, outputs=x)

# ==================================================
# FEATURE EXTRACTION
# ==================================================
print("[INFO] Extracting features (memory-safe)...")

features = feature_extractor.predict(
    X,
    batch_size=BATCH_SIZE,
    verbose=1
)

print(f"[INFO] Feature shape: {features.shape}")  # (N, 1280)

# ==================================================
# TRAIN–TEST SPLIT
# ==================================================
X_train, X_test, y_train, y_test = train_test_split(
    features,
    y_encoded,
    test_size=TEST_SIZE,
    random_state=RANDOM_STATE,
    stratify=y_encoded
)

# ==================================================
# TRAIN SVM
# ==================================================
print("\n[INFO] Training SVM classifier...")

svm_model = SVC(
    kernel="rbf",
    C=10,
    gamma="scale",
    probability=True
)

svm_model.fit(X_train, y_train)

# ==================================================
# EVALUATION
# ==================================================
train_acc = svm_model.score(X_train, y_train)
test_acc = svm_model.score(X_test, y_test)

print("\n========== MODEL PERFORMANCE ==========")
print(f"Training Accuracy: {train_acc * 100:.2f}%")
print(f"Testing Accuracy : {test_acc * 100:.2f}%")

y_pred = svm_model.predict(X_test)

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=label_encoder.classes_
))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ==================================================
# SAVE MODELS
# ==================================================
print("\n[INFO] Saving models...")

feature_extractor.save(
    os.path.join(MODEL_DIR, "efficientnet_feature_extractor.h5")
)

joblib.dump(
    svm_model,
    os.path.join(MODEL_DIR, "svm_model.pkl")
)

print("\n[SUCCESS] Training completed and models saved!")
