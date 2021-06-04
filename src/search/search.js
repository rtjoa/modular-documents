
import {auth, firestore } from '../firebase.js';

export async function searchDocuments(query="", user=null) {
    let request = firestore.collection("Documents");

    // If query is non-empty string, enforce that doc title starts with query
    if (query) {
        const queryLower = query.toLowerCase();
        request = request.where("lowercaseTitle", ">=", queryLower)
                         .where("lowercaseTitle", "<=", queryLower + '\uf8ff');
    }
        
    if (user !== null) {
        request = request.where("owner", "==", auth.currentUser.uid);
    }

    return (await request.get()).docs.map(doc => ({
        id: doc.id,
        title: doc.get('title'),
    }));
}
