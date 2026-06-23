import {
  analyzeFactionAndAvatar,
  getFactionLabel,
  FACTION_OPTIONS,
} from "./factions.js";
import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  fetchFromSWAPI,
  saveCharactersToDB,
} from "./api.js";

export function showStatus(text, type = "info") {
  const statusEl = document.getElementById("status-message");
  statusEl.textContent = text;
  statusEl.style.display = "block";
  statusEl.style.color = type === "error" ? "#ff3838" : "#FFE81F";
  setTimeout(() => {
    statusEl.style.display = "none";
  }, 4000);
}

export function displayData() {
  getCharacters()
    .then((data) => {
      const dane = document.getElementById("dane");
      dane.innerHTML = "";

      if (!data || !data.length) {
        dane.innerHTML = `<div class="loading-placeholder">Brak postaci w Holonecie. Dodaj nową lub pobierz z API.</div>`;
        return;
      }

      data.forEach((item) => {
        const { faction, avatarHTML } = analyzeFactionAndAvatar(
          item.name,
          item.gender,
          item.image_url,
        );
        const factionLabel = getFactionLabel(faction);

        const card = document.createElement("div");
        card.id = `card-${item.id}`;
        card.className = `character-card glow-${faction}`;

        card.innerHTML = `
          <div class="card-header">
            <div class="avatar-container">
              ${avatarHTML}
            </div>
            <div class="card-title-group">
              <h3>${item.name}</h3>
              <span class="character-faction">${factionLabel}</span>
            </div>
          </div>
          <div class="card-details">
            <div class="detail-row">
              <span class="detail-label">Wzrost:</span>
              <span class="detail-value">${item.height} cm</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Płeć:</span>
              <span class="detail-value">${item.gender}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-card btn-edit" data-id="${item.id}"><i class="fas fa-edit"></i> Edytuj</button>
            <button class="btn-card btn-delete" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Usuń</button>
          </div>
        `;

        card.querySelector(".btn-edit").addEventListener("click", () => {
          openModal(item);
        });

        card.querySelector(".btn-delete").addEventListener("click", () => {
          removeCharacter(item.id);
        });

        dane.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Błąd pobierania:", error);
      showStatus("Błąd pobierania danych z bazy.", "error");
    });
}

export function addCharacter(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const faction = document.getElementById("faction").value;
  const customUrl = document.getElementById("image_url").value.trim();

  const imageUrl = customUrl ? customUrl : `faction:${faction}`;

  if (!name || !height || !gender) {
    alert("Proszę wypełnić wszystkie pola.");
    return;
  }

  createCharacter(name, height, gender, imageUrl)
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("formularz").reset();
        showStatus("Dodano nową postać do rejestru.");
        displayData();
      } else {
        alert("Błąd: " + (data.message || "Nie udało się zapisać postaci."));
      }
    })
    .catch((error) => {
      console.error("Błąd zapisu:", error);
      showStatus("Błąd połączenia podczas zapisu.", "error");
    });
}

export function fetchFromApi(event) {
  event.preventDefault();
  showStatus("Łączenie z archiwum SWAPI...");

  fetchFromSWAPI()
    .then((characters) => {
      return saveCharactersToDB(characters);
    })
    .then(() => {
      showStatus("Pomyślnie zsynchronizowano dane z API SWAPI.");
      displayData();
    })
    .catch((error) => {
      console.error("Błąd synchronizacji ze SWAPI:", error);
      showStatus("Nie udało się pobrać danych ze SWAPI.", "error");
    });
}

export function openModal(character) {
  const modal = document.getElementById("edit-modal");

  document.getElementById("edit-id").value = character.id;
  document.getElementById("edit-name").value = character.name;
  document.getElementById("edit-height").value = character.height;
  document.getElementById("edit-gender").value = character.gender;

  const currentImg = character.image_url || "";
  if (currentImg.startsWith("faction:")) {
    const factionName = currentImg.split(":")[1];
    document.getElementById("edit-faction").value = factionName;
    document.getElementById("edit-image-url").value = "";
  } else if (currentImg.startsWith("http")) {
    document.getElementById("edit-image-url").value = currentImg;
    const { faction } = analyzeFactionAndAvatar(
      character.name,
      character.gender,
      currentImg,
    );
    document.getElementById("edit-faction").value = faction;
  } else {
    const { faction } = analyzeFactionAndAvatar(
      character.name,
      character.gender,
      currentImg,
    );
    document.getElementById("edit-faction").value = faction;
    document.getElementById("edit-image-url").value = "";
  }

  modal.classList.remove("hidden");
}

export function closeModal() {
  const modal = document.getElementById("edit-modal");
  modal.classList.add("hidden");
}

export function saveEdit(event) {
  event.preventDefault();

  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("edit-name").value.trim();
  const height = document.getElementById("edit-height").value.trim();
  const gender = document.getElementById("edit-gender").value.trim();
  const faction = document.getElementById("edit-faction").value;
  const customUrl = document.getElementById("edit-image-url").value.trim();

  const imageUrl = customUrl ? customUrl : `faction:${faction}`;

  updateCharacter(id, name, height, gender, imageUrl)
    .then((data) => {
      if (data.status === "success") {
        closeModal();
        showStatus("Pomyślnie zaktualizowano dane postaci.");
        displayData();
      } else {
        alert("Błąd: " + (data.message || "Nie udało się zapisać zmian."));
      }
    })
    .catch((error) => {
      console.error("Błąd edycji:", error);
      showStatus("Błąd połączenia podczas aktualizacji.", "error");
    });
}

export function removeCharacter(id) {
  if (confirm("Czy na pewno chcesz usunąć tę postać z archiwum Holonetu?")) {
    const card = document.getElementById(`card-${id}`);

    if (card) {
      card.classList.add("hidden");
    }

    setTimeout(() => {
      deleteCharacter(id)
        .then((data) => {
          if (data.status === "success") {
            showStatus("Usunięto postać z rejestru.");
            displayData();
          } else {
            alert("Błąd: " + (data.message || "Nie udało się usunąć postaci."));
            displayData();
          }
        })
        .catch((error) => {
          console.error("Błąd usuwania:", error);
          showStatus("Błąd połączenia podczas usuwania.", "error");
          displayData();
        });
    }, 400);
  }
}

export function initFactionDropdowns() {
  const factionSelects = [
    document.getElementById("faction"),
    document.getElementById("edit-faction"),
  ];

  factionSelects.forEach((select) => {
    if (!select) return;
    select.innerHTML = "";
    Object.entries(FACTION_OPTIONS).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
  });
}
