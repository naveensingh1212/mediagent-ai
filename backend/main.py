from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdf_parser import extract_text_from_pdf
from agents.parser_agent import run_parser_agent
from agents.nlp_agent import run_nlp_agent
from agents.risk_agent import run_risk_agent
from agents.question_agent import run_question_agent
from agents.report_agent import run_report_agent
import shutil
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    try:
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        text = extract_text_from_pdf(temp_path)
        result1 = run_parser_agent(text)
        result2 = run_nlp_agent(str(result1))
        result3 = run_risk_agent(str(result2))
        result4 = run_question_agent(str(result3))
        result5 = run_report_agent(str(result4))
        os.remove(temp_path)
        return {
            "parsed": str(result1),
            "explained": str(result2),
            "risks": str(result3),
            "questions": str(result4),
            "summary": str(result5)
            }
    except Exception as e:
        return {"result": f"Error occurred: {str(e)}"}

