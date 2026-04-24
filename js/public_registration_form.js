
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAa0LS8iUVaYrar-bXk65SpaJJoW7CgNR0",
    authDomain: "myriyad4-tech.firebaseapp.com",
    projectId: "myriyad4-tech",
    storageBucket: "myriyad4-tech.firebasestorage.app",
    messagingSenderId: "486392673926",
    appId: "1:486392673926:web:3aaad5395d2b2ddc738307"
};

//Made By - Partha Chanda - 1205
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

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

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const mobile = document.getElementById('mobile').value;

    const role = "public";

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                role:role
            };


           showMessage('Account Created Successfully', 'success', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'public_dashboard.html';
                })
                .catch((error) => {
                    console.error("error writing document", error);

                });
        })

        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {

                 showMessage('Email already exists!', 'danger', 'signUpMessage');
            }
            else {
                showMessage('Unable to create user', 'danger', 'signUpMessage');
            }
        })
});

//PARTHA || 1205