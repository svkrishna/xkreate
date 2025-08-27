from pydantic import BaseModel
from typing import List


class Preset(BaseModel):
    key: str
    label: str
    w: int
    h: int


class PresetGroup(BaseModel):
    key: str
    label: str
    presets: List[Preset]


class PresetsResponse(BaseModel):
    groups: List[PresetGroup]


