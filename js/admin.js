import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc
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
const db = getFirestore(app);



const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");
const toggle = body.querySelector(".toggle");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");

const reportTableBody = document.getElementById("report-table-body");
const vehicleTableBody = document.getElementById("vehicle-table-body");


modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    modeText.innerText = body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";
});



toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});


window.showIcons = function (id) {
    document.querySelectorAll(".icon-controled")
        .forEach(el => el.classList.remove("active"));

    const target = document.getElementById(id);
    if (target) target.classList.add("active");
};


function loadReports() {
    const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        reportTableBody.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            const time = data.createdAt?.toDate
                ? data.createdAt.toDate().toLocaleString()
                : "Pending...";

            const row = `
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.reporterName}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.report}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${time}
                    </td>
                </tr>
            `;

            reportTableBody.innerHTML += row;
        });
    });
}

loadReports();



function loadVehicles() {

    onSnapshot(collection(db, "users"), (snapshot) => {

        let count = 0;

        vehicleTableBody.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            if (data.role !== "vehicle") return;

           
            const row = `
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.ownerName}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.registrationNumber}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.vehicleModel}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        ${data.vehicleColor}
                    </td>
                    <td style="padding:10px; border:1px solid #ddd;">
                        <button onclick="deleteVehicle('${docSnap.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            vehicleTableBody.innerHTML += row;
        });
    });
}

loadVehicles();

window.deleteVehicle = async function (uid) {
    try {
        await deleteDoc(doc(db, "users", uid));
        alert("Vehicle deleted successfully");
    } catch (err) {
        console.error(err);
        alert("Failed to delete vehicle");
    }
};


window.callAdmin = function () {
    window.location.href = "tel:01537297935";
};

const vehicleCountBox = document.querySelector(".vehicle-count"); 

function countVehicles() {
    onSnapshot(collection(db, "users"), (snapshot) => {
        let count = 0;

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();

            if (data.role === "vehicle") {
                count++;
            }
        });

   
        if (vehicleCountBox) {
            vehicleCountBox.innerText = count;
        }

        console.log("Total Vehicles:", count);
    });
}

countVehicles();

const userCountBox = document.querySelector(".user-count"); 


function countUsers() {
    onSnapshot(collection(db, "users"), (snapshot) => {
        let count = 0;

        snapshot.forEach(() => {
            count++; 
        });

        if (userCountBox) {
            userCountBox.innerText = count;
        }

        console.log("Total Users:", count);
    });
}

countUsers();

//Made By - Tibro and Partha - 1240 - 1205

// dynamic feature by - Partha Chanda- 1205