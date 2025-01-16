from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from datetime import datetime

# Blueprint for reimbursements routes
reimbursements_bp = Blueprint("reimbursements", __name__)

def get_firestore_client():
    """Lazy-load Firestore client to ensure Firebase app is initialized."""
    return firestore.client()

@reimbursements_bp.route("/", methods=["GET"])
def get_reimbursements():
    """Fetch all reimbursement requests."""
    try:
        db = get_firestore_client()
        reimbursements_ref = db.collection("reimbursements")
        reimbursements = [{"id": doc.id, **doc.to_dict()} for doc in reimbursements_ref.stream()]
        return jsonify(reimbursements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reimbursements_bp.route("/", methods=["POST"])
def create_reimbursement():
    """Create a new reimbursement request."""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["date", "requester", "amount", "reason"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"'{field}' is required."}), 400

        # Parse and validate the date
        try:
            datetime.strptime(data["date"], "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD'."}), 400

        # Create reimbursement record
        db = get_firestore_client()
        reimbursements_ref = db.collection("reimbursements")
        reimbursement_data = {
            "date": data["date"],
            "requester": data["requester"],
            "amount": float(data["amount"]),
            "reason": data["reason"]
        }
        reimbursements_ref.add(reimbursement_data)
        return jsonify({"message": "Reimbursement request created", "data": reimbursement_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reimbursements_bp.route("/<string:reimbursement_id>", methods=["DELETE"])
def delete_reimbursement(reimbursement_id):
    """Delete a reimbursement request by ID."""
    try:
        db = get_firestore_client()
        reimbursements_ref = db.collection("reimbursements")
        reimbursement_doc = reimbursements_ref.document(reimbursement_id)

        # Check if the document exists
        if not reimbursement_doc.get().exists:
            return jsonify({"error": f"Reimbursement with ID '{reimbursement_id}' not found."}), 404

        # Delete the document
        reimbursement_doc.delete()
        return jsonify({"message": f"Reimbursement with ID '{reimbursement_id}' deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
