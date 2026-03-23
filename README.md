# MediAgent AI 🧠

MediAgent AI is an AI-powered medical report analyzer that uses a multi-agent (Agent-to-Agent) architecture to extract, interpret, and simplify complex medical reports into plain English.

## 🚀 Features

* Upload medical report PDFs
* Extract structured medical data
* AI-powered explanation of medical terms
* Risk analysis and flagging
* Suggested questions for doctors
* Easy-to-understand summary

## 🧠 Architecture

This project uses a multi-agent system built with CrewAI where:

* Parser Agent → extracts data from PDF
* Explainer Agent → simplifies medical terms
* Risk Analyzer → identifies potential risks
* Question Generator → suggests doctor questions
* Summary Agent → generates final summary

## 🛠 Tech Stack

* Frontend: React (Vite + Tailwind CSS)
* Backend: FastAPI (Python)
* AI Framework: CrewAI
* PDF Processing: PyMuPDF
* API Communication: Fetch API

## 📦 Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Usage

1. Upload a medical report PDF
2. Click "Analyze"
3. View AI-generated insights

## 🔮 Future Improvements

* User authentication
* History of reports
* Better UI/UX
* Model optimization

## 📌 Author

Naveen Singh
