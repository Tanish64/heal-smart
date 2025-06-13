# Heal-Smart 🏥💡

**Heal-Smart** is an AI-powered healthcare assistant web application that enables users to manage doctor appointments, analyze symptoms using a trained ML model, and access personalized dashboards. It also features a dedicated doctor portal to manage patient requests efficiently.

---

## 📸 UI Preview

| Login Page | Signup Page |
|------------|-------------|
| ![Login](./screenshots/login.png) | ![Signup](./screenshots/signup.png) |

| Dashboard | Appointments |
|-----------|--------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Appointments](./screenshots/appointments.png) |

| Symptom Input | Prediction Result |
|---------------|-------------------|
| ![Symptom Input](./screenshots/symptom_input.png) | ![Prediction Result](./screenshots/result.png) |

---

## 🚀 Features

### 🔐 Authentication
- User and doctor login/signup
- Role-based dashboard redirection

### 👨‍⚕️ Doctor Dashboard
- View patient appointment requests
- Approve/reject appointment requests

### 🧑‍💼 User Dashboard
- Request doctor appointments
- Track appointment status (Pending/Approved)
- Use AI-based symptom checker

### 🤖 Symptom Analysis (AI)
- Enter symptoms (e.g., headache, fever)
- Backend connects to ML API for predictions

### 📝 (Optional) Health Blog
- View and comment on blog posts
- Like blog posts
- Authenticated users can create blogs

---

## 🛠️ Tech Stack

### 🌐 Frontend
- React.js
- React Router
- Axios
- CSS

### ⚙ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### 🧠 AI/ML Service
- Python Flask API
- Machine Learning model (trained with scikit-learn)

---

## 🗂 Folder Structure

Heal-Smart/
├── backend/ # Node + Express server
├── frontend/ # React client
├── ml-api/ # Python Flask ML microservice
├── screenshots/ # Images used in README
└── README.md

yaml
Copy
Edit

---


2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
3. Backend Setup
bash
Copy
Edit
cd backend
npm install
node index.js
⚠ Make sure to configure your .env file in /backend:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. ML API Setup
bash
Copy
Edit
cd ml-api
pip install -r requirements.txt
python app.py
🔌 API Endpoints Overview
🧑 Auth
POST /api/auth/signup – Register as a user or doctor

POST /api/auth/login – Login and receive JWT token

📅 Appointments
POST /api/appointments/request – Request an appointment

GET /api/appointments/pending – Doctor views pending requests

PUT /api/appointments/approve/:id – Approve a request

🧠 Symptom Analysis
POST /api/symptoms/analyze – Send symptoms to ML model for prediction

✍️ Blog (Optional)
GET /api/blogs – Fetch blog posts

POST /api/blogs/create – Create a new blog post

🧠 ML Model
Built using scikit-learn (e.g., Naive Bayes or Random Forest)

Deployed via Flask as a REST API

Accepts symptoms and returns predicted disease name

📸 Screenshot Folder Setup
Place your images in a screenshots/ folder in the root directory:

pgsql
Copy
Edit
screenshots/
├── login.png
├── signup.png
├── dashboard.png
├── appointments.png
├── symptom_input.png
├── result.png
🙌 Credits
💻 Developed by: [Your Name]

💡 AI Model by: [Your Name or Model Info]

📚 Data & Inspiration: Real-world healthcare scenarios

📃 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute.

