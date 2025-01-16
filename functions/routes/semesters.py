from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from datetime import datetime

# Blueprint for semesters routes
semesters_bp = Blueprint("semesters", __name__)

def get_firestore_client():
    """Lazy-load Firestore client to ensure Firebase app is initialized."""
    return firestore.client()

@semesters_bp.route("/", methods=["GET"])
def get_semesters():
    """Fetch all semesters."""
    try:
        db = get_firestore_client()
        semesters_ref = db.collection("semesters")
        semesters = [{"id": doc.id, **doc.to_dict()} for doc in semesters_ref.stream()]
        return jsonify(semesters), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semesters_bp.route("/<string:semester_id>", methods=["GET"])
def get_semester(semester_id):
    """Fetch a specific semester by its ID."""
    try:
        db = get_firestore_client()
        semester_doc = db.collection("semesters").document(semester_id).get()

        if not semester_doc.exists:
            return jsonify({"error": f"Semester with ID '{semester_id}' not found."}), 404

        semester_data = {"id": semester_doc.id, **semester_doc.to_dict()}
        return jsonify(semester_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semesters_bp.route("/", methods=["POST"])
def create_semester():
    """Create a new semester."""
    try:
        data = request.get_json()
        required_fields = ["name", "date", "starting_capital", "active_house_size", "insurance_cost"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"'{field}' is required."}), 400

        db = get_firestore_client()
        semesters_ref = db.collection("semesters")
        semester_data = {
            "name": data["name"],
            "date": data["date"],
            "starting_capital": float(data["starting_capital"]),
            "current_capital": float(data["starting_capital"]),
            "net_change": 0.0,
            "active_house_size": int(data["active_house_size"]),
            "insurance_cost": float(data["insurance_cost"]),
            "weekly_balance": [],
            "transactions": []
        }
        semester_ref = semesters_ref.add(semester_data)
        
        # Extract the document ID
        semester_id = semester_ref[1].id

        # Include the ID in the response
        return jsonify({"message": "Semester created", "data": {"id": semester_id, **semester_data}}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semesters_bp.route("/<string:semester_id>", methods=["PATCH"])
def update_semester(semester_id):
    """Update semester fields."""
    try:
        data = request.get_json()
        db = get_firestore_client()
        semester_doc = db.collection("semesters").document(semester_id)

        if not semester_doc.get().exists:
            return jsonify({"error": f"Semester with ID '{semester_id}' not found."}), 404

        semester_doc.update(data)
        return jsonify({"message": "Semester updated."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@semesters_bp.route("/<string:semester_id>", methods=["DELETE"])
def delete_semester(semester_id):
    """Delete a semester and all its associated transactions."""
    try:
        db = get_firestore_client()

        # Fetch the semester document
        semester_ref = db.collection("semesters").document(semester_id)
        semester_doc = semester_ref.get()
        if not semester_doc.exists:
            return jsonify({"error": f"Semester with ID '{semester_id}' not found."}), 404

        # Fetch transaction IDs associated with the semester
        semester_data = semester_doc.to_dict()
        transaction_ids = semester_data.get("transactions", [])

        # Delete all associated transactions
        for transaction_id in transaction_ids:
            transaction_doc = db.collection("transactions").document(transaction_id)
            if transaction_doc.get().exists:
                transaction_doc.delete()

        # Delete the semester document
        semester_ref.delete()

        return jsonify({"message": f"Semester with ID '{semester_id}' and its associated transactions deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@semesters_bp.route("/<string:semester_id>/weekly_balance", methods=["POST"])
def add_weekly_balance(semester_id):
    """Add a weekly balance entry with value and date."""
    try:
        data = request.get_json()
        required_fields = ["date", "value"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"'{field}' is required."}), 400

        # Validate date format
        try:
            balance_date = datetime.strptime(data["date"], "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD'."}), 400

        db = get_firestore_client()
        semester_doc = db.collection("semesters").document(semester_id)

        if not semester_doc.get().exists:
            return jsonify({"error": f"Semester with ID '{semester_id}' not found."}), 404

        # Add the weekly balance entry
        semester_data = semester_doc.get().to_dict()
        new_weekly_balance = {
            "date": balance_date,
            "value": float(data["value"])
        }
        updated_weekly_balance = semester_data.get("weekly_balance", []) + [new_weekly_balance]

        semester_doc.update({"weekly_balance": updated_weekly_balance})
        return jsonify({"message": "Weekly balance entry added.", "data": new_weekly_balance}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500