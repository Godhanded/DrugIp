from flask import Flask, jsonify,request
from drug_eligibility import check_eligibility
from test import gen_smile
from flask_cors import CORS


app= Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
}})

@app.route(rule="/predict/<string:smile>")
def predict_smile(smile):
    smiles = smile
    if not smiles:
        return jsonify({"error": "No SMILES provided"}), 400
    try:
        analysis = check_eligibility(smiles)
        return jsonify(analysis),200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route(rule="/predict", methods=["GET","POST"])
def analyze_smile():
    smiles:str | None = request.get_json().get("smiles",None)
    if not smiles:
        return jsonify({"error": "No SMILES provided"}), 400
    try:
        analysis = check_eligibility(smiles)
        return jsonify(analysis),200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route(rule="/gensmile/<int:amount>")
def generate_smile(amount=1):
    return jsonify({"smiles": gen_smile(amount)}), 200
    
@app.route(rule="/health")
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route(rule="/")
def index():
    return jsonify({"message": "Welcome to the SMILES ml-analysis API"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    