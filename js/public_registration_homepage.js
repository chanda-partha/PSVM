
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";


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


onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                document.getElementById('FName').innerText = userData.firstName;
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserLName').innerText = userData.lastName;
                document.getElementById('loggedUserEmail').innerText = userData.email;
                document.getElementById('loggedUserMobile').innerText = userData.mobile;
            } else {
                console.log("No document found");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    } else {
       
        window.location.href = "../index.html";
    }
});

//  Logout
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});


//PARTHA || 1205