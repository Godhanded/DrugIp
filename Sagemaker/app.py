from flask import Flask, jsonify,request
from drug_eligibility import check_eligibility


app= Flask(__name__)

@app.route(rule="/predict", methods=["GET"])
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
    
@app.route(rule="/health")
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route(rule="/")
def index():
    return jsonify({"message": "Welcome to the SMILES ml-analysis API"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    