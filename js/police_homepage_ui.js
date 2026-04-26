
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
  getDocs,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector(".mode-text");

if (modeSwitch) {
  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    modeText.innerText = body.classList.contains("dark")
      ? "Light mode"
      : "Dark mode";
  });
}

if (toggle) {
  toggle.addEventListener("click", () => {
    if (sidebar) sidebar.classList.toggle("close");
  });
}




window.showIcons = function (id) {
  document.querySelectorAll(".icon-controled")
    .forEach(el => el.classList.remove("active"));

  const target = document.getElementById(id);
  if (target) target.classList.add("active");
};


let base64Image = "";

const fileInput = document.getElementById("profilePhotoInput");
const preview = document.getElementById("previewImage");
const saveBtn = document.getElementById("savePhotoBtn");
const sidebarImg = document.getElementById("sidebarPhoto");

window.addEventListener("load", () => {
  const saved = localStorage.getItem("profilePhoto");
  if (saved && sidebarImg) sidebarImg.src = saved;
});

if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      return alert("Image too large (max 2MB)");
    }

    const reader = new FileReader();
    reader.onload = () => {
      base64Image = reader.result;
      if (preview) preview.src = base64Image;
    };
    reader.readAsDataURL(file);
  });
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!base64Image) return alert("Select image first");

    localStorage.setItem("profilePhoto", base64Image);
    if (sidebarImg) sidebarImg.src = base64Image;

    alert("Profile updated!");
  });
}



onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  loadUserData(user);
});



async function loadUserData(user) {

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




    const complaintBox = document.getElementById("complaintContainer");

    if (complaintBox) {

      const snap2 = await getDocs(collection(db, "complains"));

      let html = "";

      snap2.forEach(docSnap => {
        const c = docSnap.data();

        html += `
          <div class="complaint-card" style="
              background:#f8fafc;
              padding:12px;
              margin-top:10px;
              border-left:4px solid #1c55cf;
              border-radius:8px;
          ">
              <p><b>👤 Name:</b> ${c.reporterName || "Unknown"}</p>
              <p><b>🚗 Vehicle:</b> ${c.vehicleNumber || "N/A"}</p>
              <p><b>📝 Complaint:</b> ${c.report || "-"}</p>
              <p><b>⏰ Time:</b> ${c.createdAt?.toDate
            ? c.createdAt.toDate().toLocaleString()
            : "N/A"
          }</p>
          </div>
        `;
      });

      complaintBox.innerHTML = html || "<p>No complaints found</p>";
    }



    const caseBox = document.getElementById("caseContainer");
    const totalCase = document.getElementById("totalCases");

    if (caseBox) {

      const snap3 = await getDocs(collection(db, "fines"));

      let html = "";
      let count = 0;

      snap3.forEach(docSnap => {

        const f = docSnap.data();

        if (f.issuedBy === user.uid) {

          count++;

          html += `
            <div class="case-card" style="
                background:#f8fafc;
                padding:12px;
                margin-top:10px;
                border-left:4px solid red;
                border-radius:8px;
            ">

                <p><b>🚗 Reg:</b> ${f.regNumber}</p>
                <p><b>💰 Amount:</b> ৳${f.amount}</p>
                <p><b>📝 Reason:</b> ${f.reason}</p>
                <p><b>⏰ Time:</b> ${f.createdAt?.toDate
              ? f.createdAt.toDate().toLocaleString()
              : "N/A"
            }</p>

            </div>`;
        }
      });

      caseBox.innerHTML = html || "<p>No fines issued by you</p>";
      if (totalCase) totalCase.innerText = count;
    }

  } catch (err) {
    console.error("loadUserData error:", err);
  }
}



const fineBtn = document.getElementById("submitPenaltyBtn");

if (fineBtn) {
  fineBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const regNumber = document.getElementById("penaltyRegNumber")?.value.trim();
    const amount = document.getElementById("penaltyAmount")?.value.trim();
    const reason = document.getElementById("penaltyReason")?.value.trim();

    if (!regNumber || !amount || !reason) {
      return alert("Fill all fields");
    }

    await addDoc(collection(db, "fines"), {
      regNumber: regNumber.toUpperCase(),
      amount: Number(amount),
      reason,
      issuedBy: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    alert("Fine issued!");
  });
}


const logoutButton = document.getElementById("logout");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => window.location.href = "../index.html")
      .catch(err => console.error(err));
  });
}