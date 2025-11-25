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

# Import centralized configuration
from config import *

def load_messages(json_path):
    """Load extracted messages from JSON."""
    with open(json_path, 'r', encoding='utf-8') as f:
        messages = json.load(f)
    print(f"✅ Loaded {len(messages)} messages")
    return messages

def generate_embeddings(messages, model_name=EMBEDDING_MODEL):
    """Generate embeddings for message texts."""
    print(f"\n📊 Generating embeddings with {model_name}...")
    model = SentenceTransformer(model_name)

    # Extract texts
    texts = [msg['text'] for msg in messages]

    # Generate embeddings
    embeddings = model.encode(texts, show_progress_bar=True)

    print(f"✅ Generated embeddings: shape {embeddings.shape}")
    return embeddings

def reduce_to_3d(embeddings, n_neighbors=UMAP_N_NEIGHBORS, min_dist=UMAP_MIN_DIST):
    """
    Reduce embeddings to 3D coordinates using UMAP.
    Uses parameters from config.py
    """
    print(f"\n🗺️  Applying UMAP (n_neighbors={n_neighbors}, min_dist={min_dist})...")

    reducer = umap.UMAP(
        n_components=3,
        n_neighbors=n_neighbors,
        min_dist=min_dist,
        metric=UMAP_METRIC,
        random_state=UMAP_RANDOM_STATE
    )

    coords_3d = reducer.fit_transform(embeddings)

    print(f"✅ Reduced to 3D: shape {coords_3d.shape}")
    print(f"   X range: [{coords_3d[:, 0].min():.2f}, {coords_3d[:, 0].max():.2f}]")
    print(f"   Y range: [{coords_3d[:, 1].min():.2f}, {coords_3d[:, 1].max():.2f}]")
    print(f"   Z range: [{coords_3d[:, 2].min():.2f}, {coords_3d[:, 2].max():.2f}]")

    return coords_3d

def normalize_coordinates(coords, scale=COORDINATE_SCALE):
    """Normalize coordinates to [-scale, +scale] range."""
    scaler = MinMaxScaler(feature_range=(-scale, scale))
    normalized = scaler.fit_transform(coords)
    return normalized

def cluster_and_color(embeddings, n_clusters=NUM_CLUSTERS):
    """Cluster embeddings and assign colors."""
    print(f"\n🎨 Clustering into {n_clusters} groups...")

    kmeans = KMeans(n_clusters=n_clusters, random_state=KMEANS_RANDOM_STATE, n_init=10)
    cluster_labels = kmeans.fit_predict(embeddings)

    # Use color palette from config
    colors = CLUSTER_COLORS

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
            'text': msg['text'][:MAX_TEXT_LENGTH],  # Limit text length for performance
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

    # Paths from config
    input_path = Path(INPUT_MESSAGES_PATH)
    output_path = Path(OUTPUT_GALAXY_PATH)

    # Step 1: Load messages
    messages = load_messages(input_path)

    # Step 2: Generate embeddings
    embeddings = generate_embeddings(messages)

    # Step 3: Reduce to 3D
    coords_raw = reduce_to_3d(embeddings)
    coords_normalized = normalize_coordinates(coords_raw)

    # Step 4: Cluster and color
    colors, cluster_labels = cluster_and_color(embeddings)

    # Step 5: Export
    export_galaxy_data(messages, coords_normalized, colors, output_path)

    print("\n" + "=" * 60)
    print("✅ GALAXY BUILD COMPLETE!")
    print("=" * 60)
    print(f"\n🚀 Next step: Open http://localhost:5173 to view the galaxy")

if __name__ == '__main__':
    main()
