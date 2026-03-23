
import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent, Task, Crew
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)


def run_parser_agent(pdf_text):

    parser_agent = Agent(
    role="Medical Report Parser",
    goal="Extract patient name, hemoglobin, blood pressure and other key values accurately from a medical report",
    backstory="Expert at reading medical reports and lab results",
    llm=llm
    )

    parser_task = Task(
        description=f"Read this medical report and extract all important values such as patient name, age, hemoglobin level and blood pressure: {pdf_text}",
        expected_output="A structured list of extracted values including patient name, age, hemoglobin and blood pressure",
        agent=parser_agent
    )

    medical_crew = Crew(
        agents=[parser_agent],
        tasks=[parser_task]
    )

    result = medical_crew.kickoff()
    return result