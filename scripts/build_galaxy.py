#!/usr/bin/env python3
"""
Build galaxy visualization data from extracted messages.
Pipeline: Load messages → Embeddings → UMAP → Clustering → Export
"""
import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
import umap
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler

def load_messages(json_path):
    """Load extracted messages from JSON."""
    with open(json_path, 'r', encoding='utf-8') as f:
        messages = json.load(f)
    print(f"✅ Loaded {len(messages)} messages")
    return messages

def generate_embeddings(messages, model_name='all-MiniLM-L6-v2'):
    """Generate embeddings for message texts."""
    print(f"\n📊 Generating embeddings with {model_name}...")
    model = SentenceTransformer(model_name)

    # Extract texts
    texts = [msg['text'] for msg in messages]

    # Generate embeddings
    embeddings = model.encode(texts, show_progress_bar=True)

    print(f"✅ Generated embeddings: shape {embeddings.shape}")
    return embeddings

def reduce_to_3d(embeddings, n_neighbors=10, min_dist=0.3):
    """
    Reduce embeddings to 3D coordinates using UMAP.
    
    Parameters:
    - n_neighbors: Controls cluster tightness (lower = tighter clusters, more local structure)
                   Range: 5-50, Default: 10 (reduced from 15 for tighter clusters)
    - min_dist: Controls particle separation (higher = more spread out)
                Range: 0.0-1.0, Default: 0.3 (increased from 0.1 for better separation)
    """
    print(f"\n🗺️  Applying UMAP (n_neighbors={n_neighbors}, min_dist={min_dist})...")

    reducer = umap.UMAP(
        n_components=3,
        n_neighbors=n_neighbors,
        min_dist=min_dist,
        metric='cosine',
        random_state=42
    )

    coords_3d = reducer.fit_transform(embeddings)

    print(f"✅ Reduced to 3D: shape {coords_3d.shape}")
    print(f"   X range: [{coords_3d[:, 0].min():.2f}, {coords_3d[:, 0].max():.2f}]")
    print(f"   Y range: [{coords_3d[:, 1].min():.2f}, {coords_3d[:, 1].max():.2f}]")
    print(f"   Z range: [{coords_3d[:, 2].min():.2f}, {coords_3d[:, 2].max():.2f}]")

    return coords_3d

def normalize_coordinates(coords, scale=100):
    """Normalize coordinates to [-scale, +scale] range."""
    scaler = MinMaxScaler(feature_range=(-scale, scale))
    normalized = scaler.fit_transform(coords)
    return normalized

def cluster_and_color(embeddings, n_clusters=5):
    """Cluster embeddings and assign colors."""
    print(f"\n🎨 Clustering into {n_clusters} groups...")

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(embeddings)

    # Color palette (VERY distinct colors for each cluster)
    colors = [
        '#FF1744',  # Bright Red
        '#00E5FF',  # Bright Cyan
        '#FFEA00',  # Bright Yellow
        '#00E676',  # Bright Green
        '#D500F9',  # Bright Purple
        '#FF6D00',  # Bright Orange
        '#2979FF',  # Bright Blue
        '#FF4081',  # Bright Pink
    ]

    # Assign colors based on cluster
    point_colors = [colors[label % len(colors)] for label in cluster_labels]

    # Count cluster sizes
    unique, counts = np.unique(cluster_labels, return_counts=True)
    for cluster_id, count in zip(unique, counts):
        print(f"   Cluster {cluster_id}: {count} points ({colors[cluster_id % len(colors)]})")

    print(f"✅ Assigned colors to {len(point_colors)} points")
    return point_colors, cluster_labels

def export_galaxy_data(messages, coords, colors, output_path):
    """Export galaxy data to JSON for frontend."""
    print(f"\n💾 Exporting galaxy data...")

    galaxy_points = []
    for i, msg in enumerate(messages):
        galaxy_points.append({
            'id': msg['id'],
            'x': float(coords[i, 0]),
            'y': float(coords[i, 1]),
            'z': float(coords[i, 2]),
            'color': colors[i],
            'text': msg['text'][:500],  # Limit text length for performance
            'title': msg['conversation_title'],
            'timestamp': msg['create_time']
        })

    # Create output directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(galaxy_points, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {len(galaxy_points)} points to {output_path}")
    print(f"   File size: {output_path.stat().st_size / 1024:.1f} KB")

def main():
    print("=" * 60)
    print("🌌 NEURAL GALAXY BUILDER")
    print("=" * 60)

    # Paths
    input_path = Path('data/extracted_messages.json')
    output_path = Path('frontend/public/galaxy_data.json')

    # Step 1: Load messages
    messages = load_messages(input_path)

    # Step 2: Generate embeddings
    embeddings = generate_embeddings(messages)

    # Step 3: Reduce to 3D
    coords_raw = reduce_to_3d(embeddings)
    coords_normalized = normalize_coordinates(coords_raw, scale=100)

    # Step 4: Cluster and color
    colors, cluster_labels = cluster_and_color(embeddings, n_clusters=5)

    # Step 5: Export
    export_galaxy_data(messages, coords_normalized, colors, output_path)

    print("\n" + "=" * 60)
    print("✅ GALAXY BUILD COMPLETE!")
    print("=" * 60)
    print(f"\n🚀 Next step: Open http://localhost:5173 to view the galaxy")

if __name__ == '__main__':
    main()
