#!/usr/bin/env python3
"""
Markdown to JSON parser for Kastor Data Academy episodes.
Converts improved markdown episodes to JSON format for Flutter app.
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional


class EpisodeParser:
    def __init__(self):
        self.nodes = []
        self.scenes = []
        self.current_scene = None
        self.node_counter = 1

    def parse_markdown(self, md_content: str, episode_id: str, language: str) -> Dict[str, Any]:
        """Parse markdown content into JSON structure."""
        lines = md_content.split('\n')

        # Extract title
        title = self._extract_title(lines)
        description = f"Episode 1 - Missing Balance Patch ({'한국어' if language == 'ko' else 'English'} version)"

        # Parse scenes and dialogues
        self._parse_content(lines)

        return {
            "episodeId": episode_id,
            "title": title,
            "description": description,
            "language": language,
            "scenes": self.scenes
        }

    def _extract_title(self, lines: List[str]) -> str:
        """Extract episode title from first heading."""
        for line in lines[:10]:
            if line.startswith('# '):
                return line.replace('# ', '').replace('에피소드 1: ', '').replace('Episode 1: ', '').strip()
        return "The Missing Balance Patch"

    def _parse_content(self, lines: List[str]):
        """Parse markdown content into scenes and nodes."""
        i = 0
        current_scene_nodes = []
        current_scene_id = None
        current_scene_title = None

        while i < len(lines):
            line = lines[i].strip()

            # Detect scene headers
            if line.startswith('## Scene') or line.startswith('## 🎮 Scene'):
                # Save previous scene if exists
                if current_scene_id and current_scene_nodes:
                    self.scenes.append({
                        "id": current_scene_id,
                        "title": current_scene_title or "Scene",
                        "nodes": current_scene_nodes
                    })
                    current_scene_nodes = []

                # Extract scene info
                scene_match = re.search(r'Scene (\d+)', line)
                if scene_match:
                    scene_num = scene_match.group(1)
                    current_scene_id = f"scene_{scene_num}"
                    current_scene_title = line.split('—')[-1].strip() if '—' in line else f"Scene {scene_num}"
                else:
                    current_scene_id = f"scene_{len(self.scenes)}"
                    current_scene_title = "Scene"

            # Parse dialogue lines
            elif line.startswith('**') and '**:' in line:
                speaker, text = self._parse_dialogue(line)
                if speaker and text:
                    node = self._create_dialogue_node(speaker, text)
                    current_scene_nodes.append(node)

            # Parse narration (text in brackets)
            elif line.startswith('[') and line.endswith(']'):
                text = line[1:-1].strip()
                node = self._create_narration_node(text)
                current_scene_nodes.append(node)

            # Parse email sections
            elif '### 📧' in line or line.startswith('**발신**') or line.startswith('**제목**'):
                email_data = self._parse_email(lines, i)
                if email_data:
                    node = self._create_email_node(email_data)
                    current_scene_nodes.append(node)
                    i += 10  # Skip email lines

            # Parse choices
            elif '### 🔍 인터랙티브' in line or '### 🔍 Interactive' in line:
                choices_data = self._parse_choices(lines, i)
                if choices_data:
                    node = self._create_choice_node(choices_data)
                    current_scene_nodes.append(node)
                    i += 15  # Skip choice lines

            # Parse input prompts
            elif '[입력:' in line or '[INPUT:' in line:
                input_prompt = line.replace('[입력:', '').replace('[INPUT:', '').replace(']', '').strip()
                node = self._create_input_node(input_prompt)
                current_scene_nodes.append(node)

            i += 1

        # Save last scene
        if current_scene_id and current_scene_nodes:
            self.scenes.append({
                "id": current_scene_id,
                "title": current_scene_title or "Scene",
                "nodes": current_scene_nodes
            })

    def _parse_dialogue(self, line: str) -> tuple:
        """Parse dialogue line into speaker and text."""
        match = re.match(r'\*\*(.+?)\*\*:\s*(.+)', line)
        if match:
            speaker = match.group(1).strip()
            text = match.group(2).strip().strip('"')

            # Normalize speaker names
            speaker_map = {
                '탐정': 'detective',
                'Detective': 'detective',
                'DETECTIVE': 'detective',
                '카스터': 'kastor',
                'Kastor': 'kastor',
                'KASTOR': 'kastor',
                'Narrator': 'narrator',
            }

            speaker = speaker_map.get(speaker, speaker.lower())
            return speaker, text
        return None, None

    def _create_dialogue_node(self, speaker: str, text: str) -> Dict[str, Any]:
        """Create a dialogue node."""
        node_id = f"node_{str(self.node_counter).zfill(3)}"
        self.node_counter += 1
        next_node_id = f"node_{str(self.node_counter).zfill(3)}"

        return {
            "id": node_id,
            "type": "dialogue",
            "speaker": speaker,
            "text": text,
            "nextNodeId": next_node_id
        }

    def _create_narration_node(self, text: str) -> Dict[str, Any]:
        """Create a narration node."""
        node_id = f"node_{str(self.node_counter).zfill(3)}"
        self.node_counter += 1
        next_node_id = f"node_{str(self.node_counter).zfill(3)}"

        return {
            "id": node_id,
            "type": "narration",
            "text": text,
            "nextNodeId": next_node_id
        }

    def _create_email_node(self, email_data: Dict[str, str]) -> Dict[str, Any]:
        """Create an email node."""
        node_id = f"node_{str(self.node_counter).zfill(3)}"
        self.node_counter += 1
        next_node_id = f"node_{str(self.node_counter).zfill(3)}"

        return {
            "id": node_id,
            "type": "email",
            "speaker": "system",
            "text": f"📧 {email_data.get('subject', 'New Email')}",
            "data": email_data,
            "nextNodeId": next_node_id
        }

    def _create_choice_node(self, choices: List[Dict[str, str]]) -> Dict[str, Any]:
        """Create a choice node."""
        node_id = f"node_{str(self.node_counter).zfill(3)}"
        self.node_counter += 1

        return {
            "id": node_id,
            "type": "choice",
            "text": "Choose your approach:",
            "choices": choices
        }

    def _create_input_node(self, prompt: str) -> Dict[str, Any]:
        """Create an input node."""
        node_id = f"node_{str(self.node_counter).zfill(3)}"
        self.node_counter += 1
        next_node_id = f"node_{str(self.node_counter).zfill(3)}"

        return {
            "id": node_id,
            "type": "input",
            "text": prompt,
            "nextNodeId": next_node_id
        }

    def _parse_email(self, lines: List[str], start_idx: int) -> Optional[Dict[str, str]]:
        """Parse email data from markdown."""
        email_data = {}
        i = start_idx

        while i < len(lines) and i < start_idx + 15:
            line = lines[i].strip()

            if '**발신**' in line or '**From**' in line:
                email_data['from'] = line.split(':', 1)[-1].strip()
            elif '**제목**' in line or '**Subject**' in line:
                email_data['subject'] = line.split(':', 1)[-1].strip()
            elif line.startswith('>'):
                body = email_data.get('body', '')
                body += line[1:].strip() + '\n'
                email_data['body'] = body

            i += 1

        return email_data if email_data else None

    def _parse_choices(self, lines: List[str], start_idx: int) -> Optional[List[Dict[str, str]]]:
        """Parse choice options from markdown."""
        choices = []
        i = start_idx + 1

        while i < len(lines) and i < start_idx + 20:
            line = lines[i].strip()

            # Match choice patterns like **A) 공식 패치**
            if line.startswith('**') and ')' in line:
                choice_match = re.match(r'\*\*([A-C])\)\s*(.+?)\*\*', line)
                if choice_match:
                    choice_id = choice_match.group(1)
                    choice_text = choice_match.group(2).strip()

                    # Get description from next line if exists
                    if i + 1 < len(lines) and '→' in lines[i + 1]:
                        description = lines[i + 1].replace('→', '').strip()
                        choice_text += f" - {description}"

                    choices.append({
                        "id": f"choice_{choice_id.lower()}",
                        "text": choice_text,
                        "nextSceneId": f"choice_result_{choice_id.lower()}"
                    })

            i += 1

            if len(choices) >= 3:
                break

        return choices if choices else None


def main():
    """Main function to parse markdown files and generate JSON."""
    base_path = Path(__file__).parent.parent
    assets_path = base_path / 'assets' / 'episodes'

    # Parse Korean version
    korean_md = assets_path / 'Episode1_Korean_Improved.md'
    if korean_md.exists():
        print(f"Parsing {korean_md.name}...")
        with open(korean_md, 'r', encoding='utf-8') as f:
            content = f.read()

        parser_ko = EpisodeParser()
        json_data = parser_ko.parse_markdown(content, 'episode1', 'ko')

        output_file = assets_path / 'episode1_ko.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        print(f"✓ Created {output_file.name}")

    # Parse English version
    english_md = assets_path / 'Episode1_English_Improved.md'
    if english_md.exists():
        print(f"Parsing {english_md.name}...")
        with open(english_md, 'r', encoding='utf-8') as f:
            content = f.read()

        parser_en = EpisodeParser()
        json_data = parser_en.parse_markdown(content, 'episode1', 'en')

        output_file = assets_path / 'episode1_en.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        print(f"✓ Created {output_file.name}")

    print("\n✓ All done! Episode JSON files created.")


if __name__ == '__main__':
    main()
