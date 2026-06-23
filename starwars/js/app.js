import { prefetchSVGs } from "./factions.js";
import {
  displayData,
  addCharacter,
  fetchFromApi,
  closeModal,
  saveEdit,
  initFactionDropdowns,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  initFactionDropdowns();

  await prefetchSVGs();

  displayData();

  document.getElementById("formularz").addEventListener("submit", addCharacter);
  document.getElementById("api-btn").addEventListener("click", fetchFromApi);

  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeModal);
  document
    .getElementById("close-modal-x")
    .addEventListener("click", closeModal);
  document.getElementById("edit-form").addEventListener("submit", saveEdit);
});
