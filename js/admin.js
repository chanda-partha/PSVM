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


window.showIcons = function (id) {
  document.querySelectorAll(".icon-controled").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
};
//PARTHA 1205 & TIBRO 1240 