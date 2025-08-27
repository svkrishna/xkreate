import json
import os
from typing import List, Dict, Any
from app.schemas.presets import Preset, PresetGroup, PresetsResponse


class PresetService:
    def __init__(self):
        self.presets_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "presets.json")
        self._presets_data = None
    
    def _load_presets(self) -> Dict[str, Any]:
        """Load presets from JSON file."""
        if self._presets_data is None:
            with open(self.presets_file, 'r') as f:
                self._presets_data = json.load(f)
        return self._presets_data
    
    def get_all_presets(self) -> PresetsResponse:
        """Get all presets grouped by platform."""
        data = self._load_presets()
        groups = []
        
        for group_data in data.get("groups", []):
            presets = [
                Preset(
                    key=preset["key"],
                    label=preset["label"],
                    w=preset["w"],
                    h=preset["h"]
                )
                for preset in group_data.get("presets", [])
            ]
            
            group = PresetGroup(
                key=group_data["key"],
                label=group_data["label"],
                presets=presets
            )
            groups.append(group)
        
        return PresetsResponse(groups=groups)
    
    def get_preset_by_key(self, preset_key: str) -> Preset:
        """Get a specific preset by its key."""
        data = self._load_presets()
        
        for group in data.get("groups", []):
            for preset in group.get("presets", []):
                if preset["key"] == preset_key:
                    return Preset(
                        key=preset["key"],
                        label=preset["label"],
                        w=preset["w"],
                        h=preset["h"]
                    )
        
        raise ValueError(f"Preset with key '{preset_key}' not found")


preset_service = PresetService()


