import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import { firebaseConfig } from "../firebase-config.js";


// ==========================
// INITIALISATION FIREBASE
// ==========================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==========================
// INITIALISATION EMAILJS
// ==========================

// (optionnel) emailjs doit être chargé via:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
if (typeof emailjs !== "undefined") {
  emailjs.init("TA_PUBLIC_KEY");
}



// ==========================
// FORMULAIRE
// ==========================

const form = document.getElementById("contact-form");

const statusEl = document.getElementById("form-status");


// ==========================
// ENVOI DU FORMULAIRE
// ==========================

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();

    const email = document.getElementById("email").value.trim();

    const message = document.getElementById("message").value.trim();

    // Reset affichage erreur
    statusEl.textContent = "";


    // ==========================
    // VALIDATION
    // ==========================

    if (!nom || !email || !message) {

      statusEl.textContent = "Veuillez remplir tous les champs.";

      return;

    }


    try {

      statusEl.textContent = "Envoi en cours...";


      // ==========================
      // ENREGISTREMENT FIREBASE
      // ==========================

      const docRef = await addDoc(collection(db, "messages"), {

        nom,

        email,

        message,

        createdAt: serverTimestamp()

      });



      // ==========================
      // ENVOI EMAILJS (ne doit pas bloquer Firebase)
      // ==========================

      if (typeof emailjs !== "undefined") {
        try {
          await emailjs.send(
            "TON_SERVICE_ID",
            "TON_TEMPLATE_ID",
            {
              nom: nom,
              email: email,
              message: message,
            }
          );
        } catch (emailErr) {
          console.error("EmailJS error (bloquante ignorée):", emailErr);
          // On n'échoue pas si EmailJS ne marche pas
        }
      }


      // ==========================
      // SUCCÈS
      // ==========================

      statusEl.textContent = "Message envoyé avec succès ✅";

      form.reset();

    } catch (error) {

      console.error("Erreur :", error);

      // Afficher un message plus utile (Firebase / EmailJS)
      // Afficher plus de détails : message/code + payload complet si nécessaire
      const errMsg = error?.message || error?.code || String(error);
      // Afficher l'objet complet lisiblement côté UI
      let uiDetail = "";
      try {
        uiDetail = JSON.stringify(error, Object.getOwnPropertyNames(error));
      } catch {
        uiDetail = String(error);
      }

      statusEl.textContent = `Erreur lors de l'envoi ❌ (${errMsg})`;
      console.error("Erreur complète:", uiDetail);
      statusEl.title = uiDetail;

    }


  });
}


