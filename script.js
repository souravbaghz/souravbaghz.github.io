'use strict';



// header border on scroll
const header = document.querySelector("[data-header]");

const headerScrollFunc = function () {
  header.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", headerScrollFunc, { passive: true });
headerScrollFunc();



// mobile navigation toggle
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

navToggle.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  this.setAttribute("aria-expanded", isOpen);
  this.querySelector("ion-icon").setAttribute("name", isOpen ? "close-outline" : "menu-outline");
});

// close mobile nav after picking a link
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.querySelector("ion-icon").setAttribute("name", "menu-outline");
  });
});



// highlight nav link for the section in view
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link[href^='#']");

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(function (section) { sectionObserver.observe(section); });



// project filter
const filterBtns = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll(".project[data-category]");

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {

    const selected = this.dataset.filter;

    filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });

    projects.forEach(function (project) {
      project.classList.toggle("hidden", selected !== "all" && project.dataset.category !== selected);
    });

  });
});



// candump-style CAN trace in the hero
const candump = document.querySelector("[data-candump]");

const frames = [
  ["7DF", "02 10 03 00 00 00 00 00", "diag session req"],
  ["7E8", "06 50 03 00 32 01 F4 AA", "positive response", true],
  ["0C9", "84 0D 21 00 00 00 9A 00"],
  ["1A0", "00 00 7F 3C 00 00 00 10"],
  ["7E0", "02 27 01 00 00 00 00 00", "security access seed"],
  ["7E8", "06 67 01 3A 9F 12 C4 AA", "seed received", true],
  ["3E9", "00 12 00 00 00 00 41 00"],
  ["0F1", "04 00 FF 00 00 00 00 00"],
  ["7E0", "03 22 F1 90 00 00 00 00", "read VIN"],
  ["7E8", "10 14 62 F1 90 57 30 4C", "VIN frame", true],
  ["2C1", "00 00 00 08 00 00 00 00"],
  ["7E0", "02 3E 00 00 00 00 00 00", "tester present"],
  ["4F1", "00 80 00 00 C0 00 00 00"],
  ["7E8", "02 7E 00 AA AA AA AA AA", "", true],
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lines = [];
let frameIndex = 0;

const renderFrame = function () {

  const [id, data, note, hit] = frames[frameIndex % frames.length];

  let line = `can0  <span class="id">${id}</span>   [8]  ${hit ? `<span class="hit">${data}</span>` : data}`;
  if (note) line += `  <span class="cmt"># ${note}</span>`;

  lines.push(line);
  if (lines.length > 14) lines.shift();
  candump.innerHTML = lines.join("\n");

  frameIndex++;

}

if (reduceMotion) {
  for (let i = 0; i < 12; i++) renderFrame();
} else {
  for (let i = 0; i < 6; i++) renderFrame();
  setInterval(renderFrame, 700);
}



// footer year
document.querySelector("[data-year]").textContent = new Date().getFullYear();
