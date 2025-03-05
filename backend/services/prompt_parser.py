import re
import logging
import sys, os
from datetime import datetime
from typing import Optional

# Add parent directory to path to fix imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Event

# Configure logging
logger = logging.getLogger(__name__)
if not logger.handlers:
    logging.basicConfig(level=logging.DEBUG)

def parse_prompt(prompt: str, src_lang: str = "en") -> Optional[Event]:
    """Parse a user prompt into an Event object."""
    try:
        logger.debug(f"Attempting to parse prompt: '{prompt}'")
        
        # Clean and normalize the prompt
        prompt = prompt.lower().strip()
        
        # Simple pattern for "on <date> <time>"
        full_pattern = r'(.*?)\s*(?:on|at|for)?\s*(\d{1,2})(?:st|nd|rd|th)?\s*([a-zA-Z]+)\s*(\d{1,2})\s*-\s*(\d{1,2})'
        match = re.search(full_pattern, prompt)
        
        if not match:
            logger.error("No match found for the prompt pattern")
            return None
            
        title = match.group(1).strip() or "Meeting"
        day = int(match.group(2))
        month_str = match.group(3)[:3]
        start_hour = int(match.group(4))
        end_hour = int(match.group(5))
        
        # Parse month
        try:
            month = datetime.strptime(month_str, "%b").month
        except ValueError:
            logger.error(f"Could not parse month: {month_str}")
            return None
            
        # Create datetime objects
        year = datetime.now().year
        start_time = datetime(year, month, day, start_hour, 0)
        end_time = datetime(year, month, day, end_hour, 0)
        
        logger.debug(f"Successfully parsed: title='{title}', start={start_time}, end={end_time}")
        return Event(title=title, start_time=start_time, end_time=end_time)
        
    except Exception as e:
        logger.error(f"Error parsing prompt: {str(e)}")
        return None