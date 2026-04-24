import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    query,
    where,
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


function showMessage(message, type, divId) {
    const messageDiv = document.getElementById(divId);

    messageDiv.className = `alert alert-${type} fade show`;

    messageDiv.innerHTML = message;

    messageDiv.style.display = "block";
    setTimeout(() => {
        messageDiv.classList.remove("show");
        messageDiv.classList.add("fade");

        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 500);
    }, 4000);
}


async function vehicleExists(regNumber) {

    const q = query(
        collection(db, "users"),
        where("registrationNumber", "==", regNumber)
    );

    const snap = await getDocs(q);

    return !snap.empty;
}


const btn = document.getElementById("registerbtn");

btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    const vehicleModel = document.getElementById("vehicleModel").value;
    const vehicleColor = document.getElementById("vehicleColor").value;
    const mileage = document.getElementById("mileage").value;

    let regNumber = document.getElementById("registraionNumber").value
        .trim()
        .toUpperCase();

    const ownerName = document.getElementById("ownerName").value;
    const ownerAddress = document.getElementById("owenerAddress").value;

    const ownerEmail = email;

  
    if (!email || !password || !regNumber) {
        showMessage('❌ Fill all required fields', 'danger', 'signUpMessage');
        return;
    }

    if (password.length < 6) {
        showMessage('❌ Password must be at least 6 characters', 'danger', 'signUpMessage');
        return;
    }


    const exists = await vehicleExists(regNumber);

    if (exists) {
        showMessage('❌ Vehicle registration number already exists!', 'danger', 'signUpMessage' );
        return;
    }

   
    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        const userData = {
            registrationNumber: regNumber,
            vehicleModel,
            vehicleColor,
            mileage,
            ownerName,
            ownerEmail,
            ownerAddress,
            role: "vehicle",
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userData);

        showMessage("✅ Vehicle registered successfully!", 'success', 'signUpMessage');

        setTimeout(() => {
            window.location.href = "vehicle_homepage_ui.html";
        }, 1200);

    } catch (error) {

        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            showMessage('❌ Email already exists', 'danger', 'signUpMessage' );
        } else {
            showMessage('❌ Registration failed', 'danger', 'signUpMessage');
        }
    }
});