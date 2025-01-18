from flask import Blueprint, request, jsonify
from firebase_admin import firestore

# Blueprint for categories routes
categories_bp = Blueprint("categories", __name__)

def get_firestore_client():
    """Lazy-load Firestore client to ensure Firebase app is initialized."""
    return firestore.client()

@categories_bp.route("/", methods=["GET"])
def get_categories():
    """Fetch all categories."""
    try:
        db = get_firestore_client()
        categories_ref = db.collection("categories")
        categories = [{"id": doc.id, **doc.to_dict()} for doc in categories_ref.stream()]
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@categories_bp.route("/", methods=["POST"])
def create_category():
    """Create a new category."""
    try:
        data = request.get_json()
        if "name" not in data:
            return jsonify({"error": "Category name is required"}), 400

        db = get_firestore_client()
        categories_ref = db.collection("categories")

        # Check if the category already exists
        existing_categories = [doc.to_dict()["name"] for doc in categories_ref.where("name", "==", data["name"]).stream()]
        if existing_categories:
            return jsonify({"error": f"Category '{data['name']}' already exists."}), 400

        # Add the new category
        category_data = {"name": data["name"]}
        categories_ref.add(category_data)
        return jsonify({"message": "Category created", "data": category_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@categories_bp.route("/<string:category_name>", methods=["DELETE"])
def delete_category_by_name(category_name):
    """Delete a category by name and update associated transactions to 'Uncategorized'."""
    try:
        db = get_firestore_client()
        categories_ref = db.collection("categories")
        
        # Find categories with the specified name
        matching_categories = list(categories_ref.where("name", "==", category_name).stream())

        if not matching_categories:
            return jsonify({"error": f"Category with name '{category_name}' not found."}), 404

        # Delete all matching categories
        for doc in matching_categories:
            doc.reference.delete()

        # Update all transactions with the deleted category to 'Uncategorized'
        transactions_ref = db.collection("transactions")
        transactions_with_category = transactions_ref.where("category", "==", category_name).stream()

        for txn in transactions_with_category:
            txn.reference.update({"category": "Uncategorized"})

        return jsonify({"message": f"Category '{category_name}' deleted and associated transactions updated to 'Uncategorized'."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

