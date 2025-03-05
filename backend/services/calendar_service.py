import json
import os
import logging
from datetime import datetime
from models import Event

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORAGE_DIR = os.path.join(BASE_DIR, "storage")
EVENTS_FILE = os.path.join(STORAGE_DIR, "events.json")

def init_storage():
    """Initialize storage directory and events file."""
    try:
        os.makedirs(STORAGE_DIR, exist_ok=True)
        if not os.path.exists(EVENTS_FILE):
            with open(EVENTS_FILE, "w", encoding='utf-8') as file:
                json.dump([], file, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error initializing storage: {e}")
        return False

def read_events():
    """Read events from storage file."""
    if not os.path.exists(EVENTS_FILE):
        return []
    try:
        with open(EVENTS_FILE, "r", encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        logger.error(f"Error reading events: {e}")
        return []

def write_events(events):
    """Write events to storage file."""
    try:
        with open(EVENTS_FILE, "w", encoding='utf-8') as file:
            json.dump(events, file, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        logger.error(f"Error writing events: {e}")
        return False

def get_events(target_lang: str = "en"):
    """
    Get all events from storage.
    Args:
        target_lang (str): Target language for event titles
    """
    try:
        if not os.path.exists(EVENTS_FILE):
            logger.debug("Events file doesn't exist, initializing storage")
            init_storage()
            return []
            
        with open(EVENTS_FILE, "r") as file:
            events = json.load(file)
            
            # Translate titles if needed
            if target_lang != "en":
                from main import translate_text
                for event in events:
                    if event.get("original_lang", "en") != target_lang:
                        translated_title = translate_text(event["title"], "en", target_lang)
                        if not "Translation Error" in translated_title:
                            event["title"] = translated_title
            
            # Convert timestamps
            for event in events:
                event["start_time"] = datetime.fromisoformat(event["start_time"])
                event["end_time"] = datetime.fromisoformat(event["end_time"])
            
            return events
    except Exception as e:
        logger.error(f"Error reading events: {e}")
        return []

def add_event(event: Event, original_title: str = None, original_lang: str = "en"):
    """Add a new event to storage."""
    try:
        if not init_storage():
            return False

        events = read_events()
        new_event = {
            "title": event.title,
            "original_title": original_title or event.title,
            "original_lang": original_lang,
            "start_time": event.start_time.isoformat(),
            "end_time": event.end_time.isoformat()
        }
        
        logger.debug(f"Adding new event: {new_event}")
        events.append(new_event)
        
        return write_events(events)
        
    except Exception as e:
        logger.error(f"Error adding event: {e}")
        return False