import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)  # Corrected '__name__'
CORS(app)

# Load the dataset once when the app starts
df = pd.read_csv('try(3).csv').head(10000)

# Preprocess the text data
df['text'] = df['text'].str.lower()

# Initialize TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['text'])

@app.route('/recommend/<song>', methods=['GET'])
def recommend(song):
    # Calculate TF-IDF matrix for the input song
    song_tfidf = tfidf_vectorizer.transform([song.lower()])

    # Calculate cosine similarity between input song and all songs in the dataset
    cosine_similarities = cosine_similarity(song_tfidf, tfidf_matrix).flatten()

    # Get indices of top similar songs
    similar_song_indices = cosine_similarities.argsort()[:-11:-1]

    # Get recommendations based on similarity scores
    recommendations = df.iloc[similar_song_indices]

    # Convert recommendations to a list of dictionaries
    recommendations_list = recommendations.to_dict(orient='records')

    return jsonify(recommendations_list)

if __name__ == '__main__':  # Corrected '__name__'
    app.run(debug=True)
