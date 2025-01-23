// import pageLoad from "./modules/ui-controller";

// const contentDiv = document.getElementById("content");
// contentDiv.innerHTML = "Initial Page";

// console.log("It works!");

import ui from "./modules/dom.js";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  ui.init();
});
