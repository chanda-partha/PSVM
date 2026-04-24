
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyAa0LS8iUVaYrar-bXk65SpaJJoW7CgNR0",
  authDomain: "myriyad4-tech.firebaseapp.com",
  projectId: "myriyad4-tech",
  storageBucket: "myriyad4-tech.appspot.com",
  messagingSenderId: "486392673926",
  appId: "1:486392673926:web:3aaad5395d2b2ddc738307"
};

//Made By - Partha Chanda - 1205
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const body = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector('.mode-text');


if (modeSwitch) {
  modeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (modeText) {
      modeText.innerText = body.classList.contains('dark') ? "Light mode" : "Dark mode";
    }
  });
}


if (toggle) {
  toggle.addEventListener('click', () => {
    if (sidebar) sidebar.classList.toggle('close');
  });
}


window.showIcons = function (id) {
  document.querySelectorAll(".icon-controled").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
};



let base64Image = "";

const fileInput = document.getElementById("profilePhotoInput");
const preview = document.getElementById("previewImage");
const saveBtn = document.getElementById("savePhotoBtn");
const sidebarImg = document.getElementById("sidebarPhoto");


window.addEventListener("load", () => {
  const savedImage = localStorage.getItem("profilePhoto");
  if (savedImage && sidebarImg) {
    sidebarImg.src = savedImage;
  }
});

// Select image
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      alert("Image too large! Max 200KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      base64Image = reader.result;
      if (preview) preview.src = base64Image;
    };
    reader.readAsDataURL(file);
  });
}

// Save image
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!base64Image) {
      alert("Select an image first");
      return;
    }

    localStorage.setItem("profilePhoto", base64Image);

    if (sidebarImg) sidebarImg.src = base64Image;

    alert("Profile photo updated!");
  });
}



onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) return;

    const data = snap.data();

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.innerText = value || "-";
    };

    set("policeId", data.policeId);
    set("designation", data.designation);
    set("bloodGroup", data.blood);

    set("name", data.name);
    set("gender", data.gender);
    set("nid", data.nid);
    set("dob", data.dob);

    set("mother", data.mother);
    set("father", data.father);

    set("presentAddress", data.presentAddress);
    set("permanentAddress", data.permanentAddress);

    set("nationality", "Bangladeshi");

  } catch (err) {
    console.error("User load error:", err);
  }
});

//fine

const fineBtn = document.getElementById("submitPenaltyBtn");

if (fineBtn) {
  fineBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const regNumber = document.getElementById("penaltyRegNumber")?.value.trim();
    const amount = document.getElementById("penaltyAmount")?.value.trim();
    const reason = document.getElementById("penaltyReason")?.value.trim();

    if (!regNumber || !amount || !reason) {
      alert("⚠️ Fill all fields");
      return;
    }

    if (amount <= 0) {
      alert("⚠️ Invalid amount");
      return;
    }

    try {
      await addDoc(collection(db, "fines"), {
        regNumber: regNumber.toUpperCase(),
        amount: Number(amount),
        reason,
        issuedBy: auth.currentUser?.uid || "unknown",
        createdAt: serverTimestamp()
      });

      alert("✅ Fine issued!");

      document.getElementById("penaltyRegNumber").value = "";
      document.getElementById("penaltyAmount").value = "";
      document.getElementById("penaltyReason").value = "";

    } catch (err) {
      console.error(err);
      alert("❌ Failed to issue fine");
    }
  });
}


const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        window.location.href = "../index.html";
      })
      .catch(err => console.error("Logout error:", err));
  });
}

//PARTHA || 1205