from pydantic import BaseModel, Field
from uuid import uuid4

class Session(BaseModel):
	id: str = Field(default_factory=lambda: str(uuid4()))
	filename: str