from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
gemini_model = Gemini(id="gemini-1.5-flash", api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU")
# Web Agent - Gathers real estate data from the web
web_agent = Agent(
    name="Web Agent",
    model=Gemini(id="gemini-1.5-flash",api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU"),
    tools=[DuckDuckGo()],
    instructions=[
        "Search the web for real estate trends, house prices, and market conditions.",
        "Focus on recent data, price per square foot, location-based comparisons, and rental trends.",
        "Return raw data and links to credible sources.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Real Estate Analysis Agent - Processes data & generates a report
real_estate_agent = Agent(
    name="Real Estate Analyst",
    model=Gemini(id="gemini-1.5-flash",api_key="AIzaSyCeT3uy-kvujuzKvB-rUojdEKyWw3gJExU"),
    tools=[YFinanceTools(stock_price=False, analyst_recommendations=False, company_info=False, company_news=False)],
    instructions=[
        "Use the data from the Web Agent to generate a detailed real estate report.",
        "Include price trends, supply-demand analysis, interest rate effects, and future predictions.",
        "Structure the response with markdown tables for price comparisons.",
        "Highlight investment hotspots and rental yield potential.",
        "Ensure accuracy by cross-checking with historical trends.",
    ],
    show_tool_calls=True,
    markdown=True,
)

# Agent Team - Coordinates both agents
agent_team = Agent(
    team=[web_agent, real_estate_agent],
    instructions=[
        "Coordinate the Web Agent and Real Estate Analyst for detailed real estate reports.",
        "Ensure sources are included and data is up-to-date.",
        "Use tables, bullet points, and structured formatting for better readability.",
    ],
    show_tool_calls=True,
    markdown=True,
)
response=agent_team.print_response("what is the current house price like in mumbai")
