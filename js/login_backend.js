
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//Made By - Partha Chanda - 1205
const firebaseConfig = {
    apiKey: "AIzaSyAa0LS8iUVaYrar-bXk65SpaJJoW7CgNR0",
    authDomain: "myriyad4-tech.firebaseapp.com",
    projectId: "myriyad4-tech",
    storageBucket: "myriyad4-tech.firebasestorage.app",
    messagingSenderId: "486392673926",
    appId: "1:486392673926:web:3aaad5395d2b2ddc738307"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



window.loginUser = function () {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)

        .then((userCredential) => {

            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);

            getDoc(docRef)
                .then((docSnap) => {

                    if (docSnap.exists()) {

                        const userData = docSnap.data();

                        console.log("Logged in user:", userData);

                        
                        if (userData.role === "police") {
                            window.location.href = "police_homepage_ui.html";
                        }
                        else if (userData.role === "vehicle") {
                            window.location.href = "vehicle_homepage_ui.html";
                        }
                        else if(userData.role == "public") {
                            window.location.href = "public_dashboard.html";
                        }
                        else if(userData.role == "admin"){
                            window.location.href = "Admin.html"
                        }

                    } else {
                        alert("User data not !");
                    }

                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    alert("Database error!");
                });

        })

        .catch((error) => {

            if (error.code === "auth/user-not-found") {
                alert("User not found!");
            }
            else if (error.code === "auth/wrong-password") {
                alert("Wrong password!");
            }
            else if (error.code === "auth/invalid-email") {
                alert("Invalid email format!");
            }
            else {
                alert(error.message);
            }

        });
};

//PARTHA || 1205