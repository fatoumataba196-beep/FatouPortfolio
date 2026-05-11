// formulaire-contact.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
 
// Récupérer les éléments du formulaire
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
 
// Écouter la soumission du formulaire
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
 
    // Récupérer les valeurs saisies
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
 
    // Indiquer à l'utilisateur que l'envoi est en cours
    status.textContent = "Envoi en cours...";
    status.style.color = "gray";
 
    try {
        // Ajouter un document dans la collection "messages"
        await addDoc(collection(db, "messages"), {
            nom: nom,
            email: email,
            message: message,
            date: serverTimestamp()
        }); 
          // Succès
        status.textContent = "✓ Message envoyé avec succès !";
        status.style.color = "green";
        form.reset(); // Vider le formulaire
    } catch (error) {
        // Erreur
        console.error("Erreur Firestore :", error);
        status.textContent = "✗ Erreur, réessaie plus tard.";
        status.style.color = "red";
    }
});

