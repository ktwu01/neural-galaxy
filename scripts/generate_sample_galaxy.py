#!/usr/bin/env python3
"""Generate a sanitized sample galaxy_data.json with synthetic prompts."""
import json
import math
import random
import time
import uuid
from pathlib import Path

NUM_POINTS = 488
OUTPUT_PATH = Path('frontend/public/galaxy_data.json')
COLORS = [
    '#FF1744', '#00E5FF', '#FFEA00', '#00E676',
    '#D500F9', '#FF6D00', '#2979FF', '#FF4081'
]

TOPIC_DESCRIPTIONS = [
    ('AI Research', 'brainstorming practical transformer tweaks for indie projects'),
    ('Creative Writing', 'crafting nonlinear story prompts and lyrical hooks'),
    ('Productivity Studio', 'designing humane focus rituals and automation scripts'),
    ('Learning Lab', 'summarizing books, podcasts, and science explainers'),
    ('Founder Log', 'mapping startup ideas, investor notes, and launch plans'),
    ('Wellness Coach', 'tracking mindfulness challenges and workout experiments'),
    ('Design Critique', 'iterating on playful UI layouts and motion cues'),
    ('Developer Journal', 'debugging full-stack prototypes and sharing snippets')
]

QUESTION_STEMS = [
    'How can we simplify this for a weekend build?',
    'What signals should we track to know it resonates?',
    'Which blockers keep appearing across sessions?',
    'Where can AI copilots safely accelerate the workflow?',
    'How do we explain this idea to a curious friend?',
    'What would a tactile prototype of this look like?',
    'Which constraints are worth embracing rather than fighting?',
    'What prior experiments already taught us part of the answer?'
]

ACTION_STEPS = [
    'Outlined a three-step action plan with measurable checkpoints.',
    'Sketched a mock API plus sample payloads to unblock coding.',
    'Listed the smallest possible experiment and a stretch goal.',
    'Paired each question with user research prompts for later.',
    'Documented what should be automated versus kept manual.',
    'Drafted a quick Loom script to pitch the idea to teammates.',
    'Translated the thought into Figma tasks with owners.',
    'Flagged the dependencies and added them to a Kanban swimlane.'
]

REFLECTIONS = [
    'Noted that momentum appears whenever the narrative is vivid.',
    'Realized the best solutions come from remixing simple patterns.',
    'Felt inspired to keep the scope generous but the steps bite-sized.',
    'Captured the intuition inside a daily review prompt for tomorrow.',
    'Saw that sharing early unlocks helpful feedback loops.',
    'Observed that boredom usually means the prototype needs texture.',
    'Confirmed that clear exit criteria prevent rabbit holes.',
    'Appreciated how constraints spark inventiveness rather than shutting it down.'
]

CLOSINGS = [
    'Next action: record a 2-minute voice note recapping the insight.',
    'Next action: sync with the accountability buddy during lunch.',
    'Next action: publish a quick thread to invite collaborators.',
    'Next action: schedule a usability walk-through with a friend.',
    'Next action: clean up the repo README so others can jump in.',
    'Next action: prep a 30-second demo GIF for tomorrow.',
    'Next action: capture a timelapse screenshot series for the log.',
    'Next action: write a reflection in the public build journal.'
]

BASE_TIME = int(time.time())

def build_text(topic_label: str, topic_desc: str) -> str:
    parts = [
        f"{topic_label} session — {topic_desc}.",
        random.choice(QUESTION_STEMS),
        random.choice(ACTION_STEPS),
        random.choice(REFLECTIONS),
        random.choice(CLOSINGS)
    ]
    return ' '.join(parts)


def generate_point(index: int) -> dict:
    topic_label, topic_desc = random.choice(TOPIC_DESCRIPTIONS)
    text = build_text(topic_label, topic_desc)

    radius = 90 + random.random() * 60
    phi = math.acos(2 * random.random() - 1)
    theta = random.random() * 2 * math.pi

    x = radius * math.cos(theta) * math.sin(phi)
    y = radius * math.sin(theta) * math.sin(phi)
    z = radius * math.cos(phi)

    words = len(text.split())
    if words < 30:
        size = 8.0
    elif words < 80:
        size = 12.0
    else:
        size = 16.0

    timestamp = BASE_TIME - index * 7200 + random.randint(-1200, 1200)

    return {
        'id': str(uuid.uuid4()),
        'x': round(x, 6),
        'y': round(y, 6),
        'z': round(z, 6),
        'color': random.choice(COLORS),
        'text': text,
        'title': f"{topic_label} #{index + 1}",
        'timestamp': float(timestamp),
        'size': size,
    }


def main():
    random.seed(42)
    data = [generate_point(i) for i in range(NUM_POINTS)]
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open('w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
    print(f"Generated {len(data)} sanitized points at {OUTPUT_PATH}")


if __name__ == '__main__':
    main()
