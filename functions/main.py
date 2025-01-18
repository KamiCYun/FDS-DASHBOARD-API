from firebase_admin import initialize_app, credentials
from firebase_functions import https_fn, options
from flask import Flask, request, redirect
from flask_cors import CORS
from routes.categories import categories_bp
from routes.reimbursements import reimbursements_bp
from routes.semesters import semesters_bp
from routes.transactions import transactions_bp

# Initialize Firebase app with credentials
cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred)

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(categories_bp, url_prefix="/categories")
app.register_blueprint(reimbursements_bp, url_prefix="/reimbursements")
app.register_blueprint(transactions_bp, url_prefix="/transactions")
app.register_blueprint(semesters_bp, url_prefix="/semesters")

@app.get("/")
def say_hello():
    return "Hello, World!"

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

# Run the Flask app when the script is executed directly
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True) 