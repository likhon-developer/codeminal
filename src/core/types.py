from dataclasses import dataclass
from typing import List, Optional

@dataclass
class ProjectBlueprint:
    name: str
    type: str
    features: List[str]

@dataclass
class ProcessResult:
    success: bool
    project_type: Optional[str] = None
    files_created: int = 0
    error_count: int = 0
    performance_score: float = 0.0
    blueprint: Optional['ProjectBlueprint'] = None

@dataclass
class AISuggestion:
    confidence: float
    improvements: List[str]