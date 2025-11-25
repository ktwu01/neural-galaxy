"""
Galaxy Build Configuration
===========================
Centralized parameters for the data pipeline.
Modify these values to tune the galaxy visualization.
"""

# ============================================================
# EMBEDDING SETTINGS
# ============================================================
EMBEDDING_MODEL = 'all-MiniLM-L6-v2'
# Options: 'all-MiniLM-L6-v2' (fast, 384-dim)
#          'all-mpnet-base-v2' (better quality, 768-dim, slower)

# ============================================================
# UMAP DIMENSIONALITY REDUCTION
# ============================================================
UMAP_N_NEIGHBORS = 10
# Controls cluster tightness (5-50)
# Lower = tighter, more local clusters
# Higher = broader, more global structure
# Default: 10

UMAP_MIN_DIST = 0.1
# Controls particle separation (0.0-1.0)
# Lower = particles closer together
# Higher = particles more spread out
# Default: 0.1

UMAP_METRIC = 'cosine'
# Distance metric for UMAP
# Options: 'cosine', 'euclidean', 'manhattan'

UMAP_RANDOM_STATE = 42
# Random seed for reproducibility

# ============================================================
# CLUSTERING
# ============================================================
NUM_CLUSTERS = 5
# Number of semantic clusters (2-10 recommended)
# More clusters = finer topic separation
# Fewer clusters = broader categories

KMEANS_RANDOM_STATE = 42
# Random seed for reproducibility

# ============================================================
# COORDINATE NORMALIZATION
# ============================================================
COORDINATE_SCALE = 100
# Scale factor for normalized coordinates
# Coordinates will be in range [-SCALE, +SCALE]
# Default: 100 (matches camera distance of 200)

# ============================================================
# COLOR PALETTE
# ============================================================
CLUSTER_COLORS = [
    '#FF1744',  # Bright Red
    '#00E5FF',  # Bright Cyan
    '#FFEA00',  # Bright Yellow
    '#00E676',  # Bright Green
    '#D500F9',  # Bright Purple
    '#FF6D00',  # Bright Orange
    '#2979FF',  # Bright Blue
    '#FF4081',  # Bright Pink
]

# ============================================================
# DATA PROCESSING
# ============================================================
MAX_TEXT_LENGTH = 500
# Maximum characters to include in exported text
# Longer texts are truncated for performance

# ============================================================
# FILE PATHS
# ============================================================
INPUT_MESSAGES_PATH = 'data/extracted_messages.json'
OUTPUT_GALAXY_PATH = 'frontend/public/galaxy_data.json'

