import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent,Task,Crew
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

def run_report_agent(parsed_data):

    report_agent = Agent(
        role="Medical Report Generator",
        goal="Generate a report which include all the import medical values and also speccify the problem and solution",
        backstory="You are an expert at analyzing medical reports ",
        llm=llm
    )

    report_task = Task(
        description=f"Generate a final plain English summary based on all this analysis: {parsed_data}",
        expected_output="A short paragraph of maximum 5 sentences summarizing the key findings and what the patient should do.",
        agent= report_agent
    )
    
    crew = Crew(
        agents=[report_agent],
        tasks=[report_task]
    )
    result=crew.kickoff()
    return result