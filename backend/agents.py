from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
gemini_model = Gemini(id="gemini-1.5-flash", api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU")
# Web Agent - Gathers real estate data from the web
# Web Agent - Gathers real estate data from the web
web_agent = Agent(
    name="Web Agent",
    model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU"),
    tools=[DuckDuckGo()],
    instructions=[
        "Search the web for the most recent information on the Mumbai real estate market.",
        "Focus on the following:",
        "- Current house prices and trends.",
        "- Key factors influencing the market (e.g., supply-demand, interest rates).",
        "- Recent news articles or reports.",
        "Return the data in a structured format with clear headings, bullet points, and links to sources.",
        "If specific data is unavailable, provide a general overview based on the search results.",
    ],
    show_tool_calls=True,
    markdown=True,
)
# Real Estate Analysis Agent - Processes data & generates a report
real_estate_agent = Agent(
    name="Real Estate Analyst",
    model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU"),
    tools=[],  # No tools for now
    instructions=[
        "Use the data from the Web Agent to generate a detailed real estate report.",
        "Include the following sections:",
        "1. **Current House Prices in Mumbai**: Provide average prices per square foot and overall trends.",
        "2. **Key Trends**: Highlight supply-demand dynamics, interest rate effects, and future predictions.",
        "3. **Investment Hotspots**: Identify areas with high growth potential and rental yield.",
        "4. **Recent News**: Summarize recent news articles or reports about the Mumbai real estate market.",
        "Use markdown tables for price comparisons and bullet points for lists.",
        "Ensure the response is well-structured and easy to read.",
    ],
    show_tool_calls=True,
    markdown=True,
)
# Agent Team - Coordinates both agents
agent_team = Agent(
    team=[web_agent, real_estate_agent],
    instructions=[
        "Coordinate the Web Agent and Real Estate Analyst for detailed real estate reports.",
        "Ensure the response is well-structured with clear headings, tables, and bullet points.",
        "Include hyperlinks to credible sources for further reading.",
        "If specific data is unavailable, provide a general overview with disclaimers.",
    ],
    model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU"),
    show_tool_calls=True,
    markdown=True,
)
agent_team.print_response("What is the current house price like in Mumbai?")