import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent,Task,Crew
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)
def run_nlp_agent(parsed_data):

    nlp_agent = Agent(
        role="Medical NLP Specialist",
        goal="Explain medical terms and values in simple plain English that a non-medical person can understand",
        backstory="you are expert into translating the complex medical terminology into simple language",
        llm=llm
    )

    nlp_task = Task(
        description=f"Explain these extracted medical values in simple English: {parsed_data}",
        expected_output="A simple numbered list explaining each value in 1-2 sentences maximum. Plain English only.",
        agent=nlp_agent
    )
    
    crew = Crew(
        agents=[nlp_agent],
        tasks=[nlp_task]
    )
    result=crew.kickoff()
    return result