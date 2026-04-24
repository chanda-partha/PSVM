import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
const storage = getStorage(app);

//Made By - Partha Chanda - 1205
function showMessage(message, type, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.className = `alert alert-${type} fade show`;
  messageDiv.innerHTML = message;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.classList.remove("show");
    messageDiv.classList.add("fade");
    setTimeout(() => { messageDiv.style.display = "none"; }, 500);
  }, 4000);
}



const register = document.getElementById('submitRegistration');

register.addEventListener('click', async (event) => {
  event.preventDefault();

  const name        = document.getElementById("name").value.trim();
  const father      = document.getElementById("father").value.trim();
  const mother      = document.getElementById("mother").value.trim();
  const dob         = document.getElementById("dob").value;
  const blood       = document.getElementById("bloodGroup").value;       
  const nid         = document.getElementById("nid").value.trim();
  const gender      = document.getElementById("gender").value;

  const policeId    = document.getElementById("policeId").value.trim();
  const designation = document.getElementById("designation").value.trim();
  const email       = document.getElementById("email").value.trim();

  const present     = document.getElementById("presentAddress").value.trim();   
  const permanent   = document.getElementById("permanentAddress").value.trim(); 

  const pass        = document.getElementById("password").value;         
  const confirm     = document.getElementById("confirmPassword").value; 

  const role = "police";

  

  if (!name || !father || !mother || !dob || !nid || !policeId || !designation || !email) {
    return showMessage("Please fill in all required fields.", "danger", "signUpMessage");
  }

  if (!blood) {
    return showMessage("Please select a blood group.", "danger", "signUpMessage");
  }

  if (!gender) {
    return showMessage("Please select a gender.", "danger", "signUpMessage");
  }

  if (nid.length < 10) {
    return showMessage("NID must be at least 10 digits.", "danger", "signUpMessage");
  }

  if (pass.length < 6) {
    return showMessage("Password must be at least 6 characters.", "danger", "signUpMessage");
  }

  if (pass !== confirm) {
    return showMessage("Passwords do not match.", "danger", "signUpMessage");
  }


  try {
   
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

   
  
    const userData = {
      email,
      name,
      father,
      mother,
      dob,
      blood,
      nid,
      gender,
      policeId,
      designation,
      presentAddress: present,
      permanentAddress: permanent,
      role,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), userData);

    showMessage("Account created successfully!", "success", "signUpMessage");

    setTimeout(() => {
      window.location.href = "police_homepage_ui.html";
    }, 1500);

  } catch (error) {
    console.error("Registration error:", error);

    const messages = {
      "auth/email-already-in-use": "This email is already registered.",
      "auth/weak-password":        "Password must be at least 6 characters.",
      "auth/invalid-email":        "Invalid email address format.",
      "auth/network-request-failed": "Network error. Check your connection."
    };

    const msg = messages[error.code] || `Error: ${error.message}`;
    showMessage(msg, "danger", "signUpMessage");
  }
});


//PARTHA || 1205