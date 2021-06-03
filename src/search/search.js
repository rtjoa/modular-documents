
import {auth, firestore } from '../firebase.js';

export async function searchDocuments(query="", user=null) {
    let request = firestore.collection("Documents");

    // If query is non-empty string, enforce that doc title starts with query
    if (query) {
        request = request.where("title", ">=", query)
                         .where("title", "<=", query + '\uf8ff');
    }
        
    if (user !== null) {
        request = request.where("DocOwner", "==", auth.currentUser.uid);
    }

    return (await request.get()).docs.map(doc => ({
        id: doc.id,
        title: doc.get('title') || "Untitled Document",
    }));
}
