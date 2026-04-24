
const body      = document.querySelector('body');
const sidebar   = document.querySelector('.sidebar');
const toggle    = document.querySelector('.toggle');
const modeSwitch = document.querySelector(".toggle-switch");
const modeText  = document.querySelector('.mode-text');

//Made By - Partha Chanda - 1205
if (modeSwitch) {
    modeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark');
        modeText.innerText = body.classList.contains('dark') ? "Light mode" : "Dark mode";
    });
}


if (toggle) {
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('close');
    });
}


window.showIcons = function (showElementID) {
    document.querySelectorAll(".icon-controled").forEach(el => el.classList.remove("active"));
    const target = document.getElementById(showElementID);
    if (target) target.classList.add("active");
};



let base64Image = "";

const fileInput = document.getElementById("profilePhotoInput");
const preview = document.getElementById("previewImage");
const saveBtn = document.getElementById("savePhotoBtn");
const sidebarImg = document.getElementById("sidebarPhoto");


window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("profilePhoto");

    if (savedImage) {
        if (sidebarImg) sidebarImg.src = savedImage;
    }
});


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
            preview.src = base64Image;
        };

        reader.readAsDataURL(file);
    });
}


if (saveBtn) {
    saveBtn.addEventListener("click", () => {

        if (!base64Image) {
            alert("Select an image first");
            return;
        }

        
        localStorage.setItem("profilePhoto", base64Image);

        
        if (sidebarImg) {
            sidebarImg.src = base64Image;
        }

        alert("Profile photo updated!");
    });
}

//PARTHA || 1205