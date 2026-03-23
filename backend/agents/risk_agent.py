import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent,Task,Crew
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

def run_risk_agent(parsed_data):

    risk_agent = Agent(
        role="Medical Risk Assessor",
        goal="Identify which medical values are abnormal and flag them as high,medium and low",
        backstory="You are an expert at analyzing medical reports and identifying dangerous or abnormal values",
        llm=llm
    )

    risk_task = Task(
        description=f"Analyze these medical values and flag each one as High, Low or Normal: {parsed_data}",
        expected_output="A numbered list with each value, its status (High/Low/Normal) and ONE sentence reason. Maximum 10 items.",
        agent=risk_agent
    )
    
    crew = Crew(
        agents=[risk_agent],
        tasks=[risk_task]
    )
    result=crew.kickoff()
    return result