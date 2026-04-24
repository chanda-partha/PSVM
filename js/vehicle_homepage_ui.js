
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

//Made By - Partha Chanda - 1205
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


const body = document.body;
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const modeSwitch = document.querySelector(".toggle-switch");
const modeText = document.querySelector('.mode-text');


modeSwitch?.addEventListener('click', () => {
    body.classList.toggle('dark');
    modeText.innerText = body.classList.contains('dark')
        ? "Light mode"
        : "Dark mode";
});


toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('close');
});


window.showIcons = function (id) {
    document.querySelectorAll(".icon-controled")
        .forEach(el => el.classList.remove("active"));

    document.getElementById(id).classList.add("active");
};


onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        await loadUserData(user);
        await loadFineData(user);
    } catch (err) {
        console.error(err);
    }

});


async function loadUserData(user) {

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;

    const d = snap.data();

    document.getElementById("registrationNumber").innerText = d.registrationNumber || "-";
    document.getElementById("vehicleModel").innerText = d.vehicleModel || "-";
    document.getElementById("vehicleColor").innerText = d.vehicleColor || "-";
    document.getElementById("mileage").innerText = d.mileage || "-";

    document.getElementById("ownerName").innerText = d.ownerName || "-";
    document.getElementById("ownerEmail").innerText = d.ownerEmail || "-";
    document.getElementById("ownerAddress").innerText = d.ownerAddress || "-";
}


async function loadFineData(user) {

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const reg = (userSnap.data().registrationNumber || "")
        .trim()
        .toUpperCase();

    if (!reg) return;

    const finesSnap = await getDocs(collection(db, "fines"));

    let html = "";
    let total = 0;
    let count = 0;

    finesSnap.forEach(doc => {

        const f = doc.data();
        const fineReg = (f.regNumber || "").trim().toUpperCase();

        if (fineReg === reg) {

            count++;
            total += Number(f.amount || 0);

            html += `
            <div class="fine-card" style="background:#f8fafc;padding:10px;margin-top:10px;border-left:4px solid red;">
                <p><b>Amount:</b> ৳${f.amount}</p>
                <p><b>Reason:</b> ${f.reason}</p>
                <p><b>Date:</b> ${
                    f.createdAt?.toDate
                        ? f.createdAt.toDate().toLocaleString()
                        : "N/A"
                }</p>
            </div>`;
        }
    });

    document.getElementById("totalFines").innerText = count;
    document.getElementById("totalAmount").innerText = "৳" + total;
    document.getElementById("fineContainer").innerHTML =
        html || "<p>No fines found ✅</p>";

    if (count > 0) {
        document.getElementById("fineAlert").style.display = "block";
    }
}


let base64Image = "";

const fileInput = document.getElementById("profilePhotoInput");
const preview = document.getElementById("previewImage");
const saveBtn = document.getElementById("savePhotoBtn");
const sidebarImg = document.getElementById("sidebarPhoto");

window.addEventListener("load", () => {
    const saved = localStorage.getItem("profilePhoto");
    if (saved && sidebarImg) sidebarImg.src = saved;
});

// Upload
fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 200000) {
        alert("Max 200KB allowed");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        base64Image = reader.result;
        preview.src = base64Image;
    };
    reader.readAsDataURL(file);
});

// Save
saveBtn?.addEventListener("click", () => {

    if (!base64Image) {
        alert("Select image first");
        return;
    }

    localStorage.setItem("profilePhoto", base64Image);

    if (sidebarImg) sidebarImg.src = base64Image;

    alert("Photo updated!");
});


const logoutBtn = document.getElementById("logout");

logoutBtn?.addEventListener("click", () => {
    signOut(auth)
        .then(() => window.location.href = "../index.html")
        .catch(err => console.error(err));
});
