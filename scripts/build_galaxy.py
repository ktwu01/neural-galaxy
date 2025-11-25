#!/usr/bin/env python3
"""
Build galaxy visualization data from extracted messages.
Pipeline: Load messages → Generate random spherical coordinates → Export
"""
import json
import numpy as np
from pathlib import Path

# Import centralized configuration
from config import *

def load_messages(json_path):
    """Load extracted messages from JSON."""
    with open(json_path, 'r', encoding='utf-8') as f:
        messages = json.load(f)
    print(f"✅ Loaded {len(messages)} messages")
    return messages

def generate_spherical_coords(n_points, scale=COORDINATE_SCALE, shell_thickness=50):
    """
    Generates random 3D coordinates in a spherical shell, mimicking the frontend's
    import behavior for a harmonized, non-clustered look.
    """
    print(f"\n🌐 Generating random spherical coordinates for {n_points} points...")
    
    radius = scale + np.random.rand(n_points) * shell_thickness
    phi = np.arccos(2 * np.random.rand(n_points) - 1)
    theta = np.random.rand(n_points) * 2 * np.pi

    x = radius * np.cos(theta) * np.sin(phi)
    y = radius * np.sin(theta) * np.sin(phi)
    z = radius * np.cos(phi)

    coords = np.stack([x, y, z], axis=1)
    print(f"✅ Generated coordinates: shape {coords.shape}")
    return coords

def generate_random_colors(n_points, color_palette=CLUSTER_COLORS):
    """Assigns a random color from the palette to each point."""
    print(f"\n🎨 Assigning random colors...")
    num_colors = len(color_palette)
    random_indices = np.random.randint(0, num_colors, size=n_points)
    colors = [color_palette[i] for i in random_indices]
    print(f"✅ Assigned colors to {len(colors)} points")
    return colors

def export_galaxy_data(messages, coords, colors, output_path):
    """Export galaxy data to JSON for frontend."""
    print(f"\n💾 Exporting galaxy data...")

    galaxy_points = []
    for i, msg in enumerate(messages):
        text = msg['text'][:MAX_TEXT_LENGTH]
        word_count = len(text.split())

        if word_count < 30:
            size = 8.0
        elif word_count < 150:
            size = 12.0
        else:
            size = 16.0

        galaxy_points.append({
            'id': msg['id'],
            'x': float(coords[i, 0]),
            'y': float(coords[i, 1]),
            'z': float(coords[i, 2]),
            'color': colors[i],
            'text': text,
            'title': msg['conversation_title'],
            'timestamp': msg['create_time'],
            'size': size,
        })

    # Create output directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(galaxy_points, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(galaxy_points)} points to {output_path}")
    print(f"   File size: {output_path.stat().st_size / 1024:.1f} KB")

def main():
    print("=" * 60)
    print("NEURAL GALAXY BUILDER (SPHERICAL MODE)")
    print("=" * 60)

    # Paths from config
    input_path = Path(INPUT_MESSAGES_PATH)
    output_path = Path(OUTPUT_GALAXY_PATH)

    # Step 1: Load messages
    messages = load_messages(input_path)
    num_messages = len(messages)

    # Step 2: Generate spherical coordinates (replaces UMAP)
    coords = generate_spherical_coords(num_messages)

    # Step 3: Generate random colors (replaces clustering)
    colors = generate_random_colors(num_messages)

    # Step 4: Export
    export_galaxy_data(messages, coords, colors, output_path)

    print("\n" + "=" * 60)
    print("✅ GALAXY BUILD COMPLETE!")
    print("=" * 60)
    print(f"\n🚀 Next step: Open http://localhost:5173 to view the galaxy")

if __name__ == '__main__':
    main()
