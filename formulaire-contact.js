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

function setStatus(msg) {
  if (!statusEl) return;
  statusEl.textContent = msg;
}


// ==========================
// ENVOI DU FORMULAIRE
// ==========================

if (form) {
  const submitBtn = form.querySelector("button[type=submit]");

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  async function addDocWithRetry(data, { retries = 3, baseDelayMs = 1000 } = {}) {
    let lastErr;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await addDoc(collection(db, "messages"), data);
      } catch (err) {
        lastErr = err;
        console.error(`Firebase addDoc échoué (tentative ${attempt}/${retries}) :`, err);

        if (attempt < retries) {
          // backoff exponentiel: 1s, 2s, 4s...
          const delay = baseDelayMs * 2 ** (attempt - 1);
          await sleep(delay);
        }
      }
    }

    throw lastErr;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Empêche double-submit pendant l’envoi
    if (submitBtn && submitBtn.disabled) return;

    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    statusEl.textContent = "";

    if (!nom || !email || !message) {
      setStatus("Veuillez remplir tous les champs.");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
        submitBtn.style.cursor = "not-allowed";
      }

      statusEl.textContent = "Envoi en cours...";

      // ==========================
      // ENREGISTREMENT FIREBASE (avec retry)
      // ==========================
      await addDocWithRetry(
        {
          nom,
          email,
          message,
          createdAt: serverTimestamp(),
        },
        { retries: 3, baseDelayMs: 1000 }
      );

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
        }
      }

      statusEl.textContent = "Message envoyé avec succès ✅";
      form.reset();
    } catch (error) {
      console.error("Erreur :", error);

      const errMsg = error?.message || error?.code || String(error);

      let uiDetail = "";
      try {
        uiDetail = JSON.stringify(error, Object.getOwnPropertyNames(error));
      } catch {
        uiDetail = String(error);
      }

      statusEl.textContent = `Échec après relance de l'envoi ❌ (${errMsg})`;
      statusEl.title = uiDetail;
      console.error("Erreur complète:", uiDetail);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
        submitBtn.style.cursor = "";
      }
    }
  });
}



