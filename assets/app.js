// Teacher Mode toggle (simple + reliable)
// Checked = Teacher Mode ON
// Unchecked = Teacher Mode OFF
const KEY = "wm_teacher_mode";

function isTeacher(){
  return localStorage.getItem(KEY) === "1";
}

function setTeacher(on){
  localStorage.setItem(KEY, on ? "1" : "0");
  applyTeacher();
}

function applyTeacher(){
  const on = isTeacher();
  document.body.classList.toggle("teacher-on", on);

  const toggle = document.getElementById("teacherModeToggle");
  if(toggle) toggle.checked = on;

  const label = document.getElementById("teacherModeLabel");
  if(label) label.textContent = on ? "Teacher Mode" : "Student Mode";

  const badge = document.getElementById("teacherBadge");
  if(badge) badge.style.display = on ? "inline-flex" : "none";
}

function markActiveTab(){
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".pill").forEach(p=>{
    const href = (p.getAttribute("href") || "").toLowerCase();
    if(href.endsWith(current)) p.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  const toggle = document.getElementById("teacherModeToggle");
  if(toggle){
    toggle.addEventListener("change", ()=> setTeacher(toggle.checked));
  }
  applyTeacher();
  markActiveTab();
});
