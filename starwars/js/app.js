import { prefetchSVGs } from "./factions.js";
import {
  wyswietlDane,
  dodajPostac,
  pobierzZApi,
  zamknijModal,
  zapiszEdycje,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Prefetch SVGs
  await prefetchSVGs();
  
  // Render character data
  wyswietlDane();
  
  // Bind main page actions
  document.getElementById("formularz").addEventListener("submit", dodajPostac);
  document.getElementById("api-btn").addEventListener("click", pobierzZApi);

  // Bind edit modal actions
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", zamknijModal);
  document
    .getElementById("close-modal-x")
    .addEventListener("click", zamknijModal);
  document.getElementById("edit-form").addEventListener("submit", zapiszEdycje);
});
