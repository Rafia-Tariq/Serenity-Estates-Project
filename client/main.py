from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

app = Flask(__name__)
CORS(app)
data = pd.read_csv('final_dataset.csv')
pipe = pickle.load(open("RidgeModel.pkl", 'rb'))

# Assuming the dataset has a column 'description' for textual data
data['description'] = data['beds'].astype(str) + ' beds ' + data['baths'].astype(str) + ' baths ' + data['size'].astype(str) + ' sq ft in ' + data['zip_code'].astype(str)

# Compute TF-IDF matrix
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(data['description'])

@app.route('/predict', methods=['POST'])
def predict():
    content = request.json
    bedrooms = content['beds']
    bathrooms = content['baths']
    size = content['size']
    zipcode = content['zip_code']

    # Create a DataFrame with the input data
    input_data = pd.DataFrame([[bedrooms, bathrooms, size, zipcode]],
                              columns=['beds', 'baths', 'size', 'zip_code'])

    print("Input Data:")
    print(input_data)

    # Convert 'baths' column to numeric with errors='coerce'
    input_data['baths'] = pd.to_numeric(input_data['baths'], errors='coerce')

    # Convert input data to numeric types
    input_data = input_data.astype({'beds': int, 'baths': float, 'size': float, 'zip_code': int})

    # Handle unknown categories in the input data
    for column in input_data.columns:
        unknown_categories = set(input_data[column]) - set(data[column].unique())
        if unknown_categories:
            print(f"Unknown categories in {column}: {unknown_categories}")
            # Handle unknown categories (e.g., replace with a default value)
            input_data[column] = input_data[column].replace(unknown_categories, data[column].mode()[0])

    print("Processed Input Data:")
    print(input_data)

    # Predict the price
    prediction = pipe.predict(input_data)[0]

    return jsonify(prediction=prediction)

@app.route('/search', methods=['GET'])
def search():
    beds = request.args.get('beds')
    baths = request.args.get('baths')
    size = request.args.get('size')
    zip_code = request.args.get('zip_code')

    search_description = ""
    if beds:
        search_description += beds + " beds "
    if baths:
        search_description += baths + " baths "
    if size:
        search_description += size + " sq ft in "
    if zip_code:
        search_description += zip_code

    search_vec = tfidf_vectorizer.transform([search_description])
    cosine_similarities = cosine_similarity(search_vec, tfidf_matrix).flatten()
    similar_indices = cosine_similarities.argsort()[-10:][::-1]  # Top 10 similar houses

    results = data.iloc[similar_indices].to_dict(orient='records')
    return jsonify(results=results)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
