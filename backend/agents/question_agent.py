import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent,Task,Crew
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

def run_question_agent(parsed_data):

    question_agent = Agent(
        role="Medical Question Suggestor",
        goal="Generate smart question which can be asked by patient after seeing abnormal medical values",
        backstory="You are an expert at analyzing medical reports and identifying dangerous or abnormal values",
        llm=llm
    )

    question_task = Task(
        description=f"Based on these risk flags, generate questions the patient should ask their doctor: {parsed_data}",
        expected_output="Exactly 5 short questions numbered 1-5. Each question maximum 1 sentence.",
        agent=question_agent
    )
    
    crew = Crew(
        agents=[question_agent],
        tasks=[question_task]
    )
    result=crew.kickoff()
    return result