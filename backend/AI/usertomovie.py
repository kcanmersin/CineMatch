# movietomovie.py

import pandas as pd
#import torch
import joblib
from AI.NCFmodel import NCF  # Import the NCF class from the AI module
from pathlib import Path

def user_to_movie(user_id, rates_data):
    # rates_data kullanarak önerileri hesapla
    # Örnek olarak, şimdilik sabit bir liste döndür
    return [64, 65, 66, 68, 69, 70, 71, 73, 74, 76]
