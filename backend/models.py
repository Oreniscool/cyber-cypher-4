from dataclasses import dataclass
from datetime import datetime

@dataclass
class Event:
    title: str
    start_time: datetime
    end_time: datetime