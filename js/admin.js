const body = document.querySelector('body');
const sidebar = body.querySelector('.sidebar');
const toggle = body.querySelector('.toggle');
const searchBtn = body.querySelector('.search-box');
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector('.mode-text');

modeSwitch.addEventListener('click', () => {
    body.classList.toggle('dark');

     if (body.classList.contains('dark')) {
        modeText.innerText = "Light mode";
    } else {
        modeText.innerText = "Dark mode";
    }

});

toggle.addEventListener('click', () => {

    sidebar.classList.toggle('close');

});



function showSection(sectionName) {
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
    });
    
   
    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.add('active-section');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
});

//PARTHA 1205 & TIBRO 1240 