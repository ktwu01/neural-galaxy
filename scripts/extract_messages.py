#!/usr/bin/env python3
"""
Extract user messages from ChatGPT conversation export.
"""
import json
import sys
from pathlib import Path

def extract_user_messages(json_path):
    """Extract all user messages from conversation JSON."""
    with open(json_path, 'r', encoding='utf-8') as f:
        conversations = json.load(f)

    messages = []

    for conv_idx, conversation in enumerate(conversations):
        conv_id = conversation.get('id', f'conv_{conv_idx}')
        conv_title = conversation.get('title', 'Untitled')
        mapping = conversation.get('mapping', {})

        for msg_id, msg_node in mapping.items():
            if not msg_node.get('message'):
                continue

            message = msg_node['message']
            author = message.get('author', {})
            role = author.get('role')

            # Only extract user messages with text content
            if role != 'user':
                continue

            content = message.get('content', {})
            content_type = content.get('content_type')

            # Skip non-text content
            if content_type not in ['text', 'multimodal_text']:
                continue

            parts = content.get('parts', [])
            if not parts:
                continue

            # Extract text from parts (skip images/attachments)
            text_parts = []
            for part in parts:
                if isinstance(part, str):
                    text_parts.append(part)
                elif isinstance(part, dict) and part.get('content_type') == 'text':
                    text_parts.append(part.get('text', ''))

            text = ' '.join(text_parts).strip()

            if not text:
                continue

            messages.append({
                'id': msg_id,
                'conversation_id': conv_id,
                'conversation_title': conv_title,
                'text': text,
                'create_time': message.get('create_time'),
            })

    return messages

def main():
    input_path = Path('data/conversations.json')

    if not input_path.exists():
        print(f"Error: {input_path} not found", file=sys.stderr)
        sys.exit(1)

    print(f"Loading conversations from {input_path}...")
    messages = extract_user_messages(input_path)

    print(f"\nExtracted {len(messages)} user messages")

    # Show sample
    if messages:
        print("\nFirst 5 messages (truncated):")
        for i, msg in enumerate(messages[:5], 1):
            text = msg['text'][:100] + '...' if len(msg['text']) > 100 else msg['text']
            print(f"{i}. [{msg['conversation_title']}] {text}")

    # Save to JSON
    output_path = Path('data/extracted_messages.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {output_path}")

if __name__ == '__main__':
    main()
