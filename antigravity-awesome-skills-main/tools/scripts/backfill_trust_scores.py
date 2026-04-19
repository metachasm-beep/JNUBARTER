#!/usr/bin/env python3
import os
import sys
import re
import yaml
import json
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from _project_paths import find_repo_root

# Ensure UTF-8 output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def backfill_skills(skills_dir: Path, mock: bool = True, limit: int = None):
    print(f"🚀 Starting backfill in {skills_dir} (Mock: {mock}, Limit: {limit or 'None'})")
    
    skill_files = list(skills_dir.glob("**/SKILL.md"))
    if limit:
        skill_files = skill_files[:limit]

    processed = 0
    updated = 0
    errors = 0

    mode_arg = "--mode=mock" if mock else "--mode=llm"
    script_path = Path(__file__).parent / "audit_skill_quality.py"

    for skill_path in skill_files:
        processed += 1
        skill_id = skill_path.parent.name
        print(f"  [{processed}/{len(skill_files)}] Auditing {skill_id}...")

        try:
            # 1. Run the auditor
            cmd = [sys.executable, str(script_path), str(skill_path), mode_arg]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            audit_report = json.loads(result.stdout)

            if "error" in audit_report:
                print(f"    ❌ Audit error for {skill_id}: {audit_report['error']}")
                errors += 1
                continue

            # 2. Update the file
            if update_skill_file(skill_path, audit_report):
                updated += 1
            
        except Exception as e:
            print(f"    ❌ Failed to process {skill_id}: {e}")
            errors += 1

    print(f"\n✅ Backfill Complete!")
    print(f"   Processed: {processed}")
    print(f"   Updated:   {updated}")
    print(f"   Errors:    {errors}")

def update_skill_file(path: Path, report: dict) -> bool:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        fm_match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
        if not fm_match:
            return False

        fm_text = fm_match.group(1)
        body = content[fm_match.end():]

        metadata = yaml.safe_load(fm_text) or {}
        
        # Update fields
        metadata['trust_score'] = report.get('trust_score', 0)
        metadata['last_audited'] = datetime.now(timezone.utc).date().isoformat()

        # Generate new frontmatter
        new_fm = yaml.dump(metadata, sort_keys=False, allow_unicode=True, width=1000).strip()
        new_content = f"---\n{new_fm}\n---" + body

        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"    ⚠️ File update failed for {path.name}: {e}")
        return False

def main():
    root = find_repo_root(Path(__file__))
    skills_dir = root / "skills"

    import argparse
    parser = argparse.ArgumentParser(description="Backfill trust scores for all skills")
    parser.add_argument("--llm", action="store_true", help="Use real LLM (requires API keys)")
    parser.add_argument("--limit", type=int, help="Limit number of skills to process")
    args = parser.parse_args()

    backfill_skills(skills_dir, mock=not args.llm, limit=args.limit)

if __name__ == "__main__":
    main()
