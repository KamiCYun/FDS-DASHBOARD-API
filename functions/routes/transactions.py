from flask import Blueprint, request, jsonify
from firebase_admin import firestore
from datetime import datetime

# Blueprint for transactions routes
transactions_bp = Blueprint("transactions", __name__)

def get_firestore_client():
    """Lazy-load Firestore client to ensure Firebase app is initialized."""
    return firestore.client()

def validate_category(category_name):
    """Validate that the category exists in the database."""
    db = get_firestore_client()
    categories_ref = db.collection("categories")
    return any(doc.to_dict()["name"] == category_name for doc in categories_ref.stream())

@transactions_bp.route("/", methods=["GET"])
def get_transactions():
    """Fetch paginated transactions for a specific semester, in the order they were added."""
    try:
        # Extract query parameters
        semester_id = request.args.get("semester_id")
        limit = int(request.args.get("limit", 10))  # Default to 10 transactions
        start_after = request.args.get("start_after")  # Optional: Last transaction ID from the previous page

        if not semester_id:
            return jsonify({"error": "'semester_id' is required as a query parameter."}), 400

        db = get_firestore_client()

        # Fetch the semester document
        semester_doc = db.collection("semesters").document(semester_id).get()
        if not semester_doc.exists:
            return jsonify({"error": f"Semester with ID '{semester_id}' not found."}), 404

        # Get the list of transaction IDs in the order they were added
        semester_data = semester_doc.to_dict()
        transaction_ids = semester_data.get("transactions", [])

        if not transaction_ids:
            return jsonify([]), 200

        # Apply pagination
        if start_after:
            if start_after not in transaction_ids:
                return jsonify({"error": f"'start_after' ID '{start_after}' not valid for this semester."}), 400

            # Start after the specified transaction ID
            start_index = transaction_ids.index(start_after) + 1
        else:
            start_index = 0

        # Paginate transaction IDs
        paginated_ids = transaction_ids[start_index:start_index + limit]

        # Fetch transactions using their IDs
        transactions = []
        for transaction_id in paginated_ids:
            transaction_doc = db.collection("transactions").document(transaction_id).get()
            if transaction_doc.exists:
                transactions.append({"id": transaction_id, **transaction_doc.to_dict()})

        # Determine the next page's starting ID
        next_start_after = paginated_ids[-1] if len(paginated_ids) == limit else None

        return jsonify({
            "transactions": transactions,
            "next_start_after": next_start_after
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@transactions_bp.route("/", methods=["POST"])
def create_transaction():
    """Create a new transaction and associate it with a semester."""
    try:
        data = request.get_json()
        required_fields = ["payer", "time", "message", "amount", "category", "semester_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"'{field}' is required."}), 400

        # Validate category
        if not validate_category(data["category"]):
            return jsonify({"error": f"Category '{data['category']}' does not exist."}), 400

        # Parse and validate time
        try:
            datetime.strptime(data["time"], "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            return jsonify({"error": "Invalid time format. Use ISO 8601 (e.g., '2025-01-15T12:34:56Z')."}), 400

        db = get_firestore_client()

        # Validate semester existence
        semester_ref = db.collection("semesters").document(data["semester_id"])
        semester_doc = semester_ref.get()
        if not semester_doc.exists:
            return jsonify({"error": f"Semester with ID '{data['semester_id']}' not found."}), 404

        # Create transaction
        transactions_ref = db.collection("transactions")
        transaction_data = {
            "payer": data["payer"],
            "time": data["time"],
            "message": data["message"],
            "amount": float(data["amount"]),
            "category": data["category"],
            "semester_id": data["semester_id"]
        }
        transaction_doc = transactions_ref.add(transaction_data)

        # Update semester's transactions array and current capital
        transaction_amount = float(data["amount"])
        semester_ref.update({
            "transactions": firestore.ArrayUnion([transaction_doc[1].id]),
            "current_capital": firestore.Increment(transaction_amount)
        })

        return jsonify({
            "message": "Transaction created and added to semester.",
            "data": {
                "id": transaction_doc[1].id,
                **transaction_data
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@transactions_bp.route("/<string:transaction_id>", methods=["PATCH"])
def update_transaction(transaction_id):
    """Update a single field of a transaction."""
    try:
        data = request.get_json()
        if "category" in data and not validate_category(data["category"]):
            return jsonify({"error": f"Category '{data['category']}' does not exist."}), 400

        db = get_firestore_client()
        transaction_doc = db.collection("transactions").document(transaction_id)

        if not transaction_doc.get().exists:
            return jsonify({"error": f"Transaction with ID '{transaction_id}' not found."}), 404

        transaction_doc.update(data)
        return jsonify({"message": "Transaction updated."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@transactions_bp.route("/<string:transaction_id>", methods=["DELETE"])
def delete_transaction(transaction_id):
    """Delete a transaction and remove it from the associated semester."""
    try:
        db = get_firestore_client()

        # Fetch the transaction document
        transaction_doc = db.collection("transactions").document(transaction_id)
        if not transaction_doc.get().exists:
            return jsonify({"error": f"Transaction with ID '{transaction_id}' not found."}), 404

        # Get transaction data to find the associated semester
        transaction_data = transaction_doc.get().to_dict()
        semester_id = transaction_data.get("semester_id")
        if not semester_id:
            return jsonify({"error": "The transaction is not associated with any semester."}), 400

        # Remove the transaction from the semester's transactions array
        semester_ref = db.collection("semesters").document(semester_id)
        semester_doc = semester_ref.get()
        if semester_doc.exists:
            transaction_amount = float(transaction_data["amount"])
            semester_ref.update({
                "transactions": firestore.ArrayRemove([transaction_id]),
                "current_capital": firestore.Increment(-transaction_amount)
            })

        # Delete the transaction document
        transaction_doc.delete()

        return jsonify({"message": f"Transaction with ID '{transaction_id}' deleted and removed from semester '{semester_id}'."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

