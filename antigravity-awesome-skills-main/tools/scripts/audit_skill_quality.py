#!/usr/bin/env python3
import os
import sys
import json
import argparse
import yaml
import re
import requests
from pathlib import Path
from datetime import datetime, timezone
from _project_paths import find_repo_root

# Ensure UTF-8 output for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class SkillAuditor:
    def __init__(self, mode="mock"):
        self.mode = mode
        self.openai_key = os.getenv("SOVEREIGN_OPENAI_KEY")
        self.anthropic_key = os.getenv("SOVEREIGN_ANTHROPIC_KEY")

    def audit_skill(self, skill_path: Path) -> dict:
        """Audits a single SKILL.md file."""
        if not skill_path.exists():
            return {"error": f"Path {skill_path} does not exist"}

        try:
            with open(skill_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return {"error": f"Failed to read file: {e}"}

        # 1. Parse Frontmatter and Content
        fm_match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        if not fm_match:
            return {"error": "No frontmatter found in SKILL.md"}

        metadata = yaml.safe_load(fm_match.group(1)) or {}
        skill_body = content[fm_match.end():].strip()

        # 2. Execute Audit based on Mode
        if self.mode == "mock":
            return self._mock_audit(metadata, skill_body)
        else:
            return self._llm_audit(metadata, skill_body)

    def _mock_audit(self, metadata, body) -> dict:
        """Simple deterministic audit for development/CI."""
        skill_name = metadata.get('name', 'Unknown')
        desc = metadata.get('description', '')
        
        # Heuristics for a "Trust Score"
        score = 50
        score += 10 if len(body) > 300 else 0
        score += 10 if len(desc) > 50 else 0
        score += 10 if 'instruction' in body.lower() else 0
        score += 10 if metadata.get('category') != 'uncategorized' else -10
        score += 10 if metadata.get('author') else 0
        
        score = min(max(score, 0), 100)

        return {
            "skill_name": skill_name,
            "trust_score": score,
            "audit_summary": f"Mock audit completed for '{skill_name}'. (Deterministic score based on metadata/size)",
            "last_audited": datetime.now(timezone.utc).isoformat(),
            "metrics": {
                "clarity": score - 5,
                "accuracy": score,
                "completeness": score + 5
            }
        }

    def _llm_audit(self, metadata, body) -> dict:
        """Calls a real LLM for a deep-dive audit."""
        prompt = f"""Evaluate the following AI Agent Skill (SKILL.md).
Name: {metadata.get('name')}
Description: {metadata.get('description')}
Category: {metadata.get('category')}

CONTENT:
{body}

Audit Criteria (0-100):
1. Clarity: Are instructions easy for an agent to follow?
2. Technical Accuracy: Is it technically sound for {metadata.get('category')}?
3. Completeness: Does it provide enough context to succeed?

RESPONSE FORMAT (JSON ONLY):
{{
  "trust_score": [Overall 0-100],
  "audit_summary": "[2-sentence summary]",
  "metrics": {{ "clarity": [0-100], "accuracy": [0-100], "completeness": [0-100] }}
}}
"""
        if self.anthropic_key:
            return self._call_anthropic(prompt)
        elif self.openai_key:
            return self._call_openai(prompt)
        else:
            return {"error": "No LLM API keys found. Set SOVEREIGN_OPENAI_KEY or SOVEREIGN_ANTHROPIC_KEY"}

    def _call_anthropic(self, prompt):
        try:
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": self.anthropic_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            data = {
                "model": "claude-3-5-sonnet-20240620",
                "max_tokens": 1000,
                "messages": [{"role": "user", "content": prompt}]
            }
            res = requests.post(url, headers=headers, json=data)
            res.raise_for_status()
            result_text = res.json()['content'][0]['text']
            # Extract JSON from response if any text around it
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            return json.loads(json_match.group(0))
        except Exception as e:
            return {"error": f"Anthropic API failed: {e}"}

    def _call_openai(self, prompt):
        # Implementation for OpenAI if needed...
        return {"error": "OpenAI provider currently not implemented. Using Anthropic or Mock."}

def main():
    parser = argparse.ArgumentParser(description="AI Skill Auditor for Matriarch")
    parser.add_argument("path", help="Path to SKILL.md or folder containing one")
    parser.add_argument("--mode", choices=["mock", "llm"], default="mock", help="Auditing mode")
    args = parser.parse_args()

    target_path = Path(args.path)
    if target_path.is_dir():
        target_path = target_path / "SKILL.md"

    auditor = SkillAuditor(mode=args.mode)
    report = auditor.audit_skill(target_path)
    
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
