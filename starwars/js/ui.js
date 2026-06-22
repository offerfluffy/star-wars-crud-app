import { analizujFrakcjeIAwatar, getFactionLabel } from "./factions.js";
import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  fetchFromSWAPI,
  saveCharactersToDB,
} from "./api.js";

// Pokazuje komunikat statusu
export function pokazStatus(tekst, typ = "info") {
  const statusEl = document.getElementById("status-message");
  statusEl.textContent = tekst;
  statusEl.style.display = "block";
  statusEl.style.color = typ === "error" ? "#ff3838" : "#FFE81F";
  setTimeout(() => {
    statusEl.style.display = "none";
  }, 4000);
}

// Pobiera i wyświetla listę postaci z bazy danych
export function wyswietlDane() {
  getCharacters()
    .then((data) => {
      const dane = document.getElementById("dane");
      dane.innerHTML = "";

      if (!data || !data.length) {
        dane.innerHTML = `<div class="loading-placeholder">Brak postaci w Holonecie. Dodaj nową lub pobierz z API.</div>`;
        return;
      }

      data.forEach((item) => {
        const { faction, avatarHTML } = analizujFrakcjeIAwatar(
          item.name,
          item.gender,
          item.image_url
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

        // Dodaj zdarzenia do przycisków w karcie
        card.querySelector(".btn-edit").addEventListener("click", () => {
          otworzModal(item);
        });

        card.querySelector(".btn-delete").addEventListener("click", () => {
          usun(item.id);
        });

        dane.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Błąd pobierania:", error);
      pokazStatus("Błąd pobierania danych z bazy.", "error");
    });
}

// Dodaje nową postać
export function dodajPostac(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const faction = document.getElementById("faction").value;
  const customUrl = document.getElementById("image_url").value.trim();

  // Zapisz albo jawny URL albo prefiks frakcji
  const imageUrl = customUrl ? customUrl : `faction:${faction}`;

  if (!name || !height || !gender) {
    alert("Proszę wypełnić wszystkie pola.");
    return;
  }

  createCharacter(name, height, gender, imageUrl)
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("formularz").reset();
        pokazStatus("Dodano nową postać do rejestru.");
        wyswietlDane();
      } else {
        alert("Błąd: " + (data.message || "Nie udało się zapisać postaci."));
      }
    })
    .catch((error) => {
      console.error("Błąd zapisu:", error);
      pokazStatus("Błąd połączenia podczas zapisu.", "error");
    });
}

// Pobiera listę postaci ze SWAPI
export function pobierzZApi(event) {
  event.preventDefault();
  pokazStatus("Łączenie z archiwum SWAPI...");

  fetchFromSWAPI()
    .then((characters) => {
      return saveCharactersToDB(characters);
    })
    .then(() => {
      pokazStatus("Pomyślnie zsynchronizowano dane z API SWAPI.");
      wyswietlDane();
    })
    .catch((error) => {
      console.error("Błąd synchronizacji ze SWAPI:", error);
      pokazStatus("Nie udało się pobrać danych ze SWAPI.", "error");
    });
}

// Otwiera modal edycji i uzupełnia formularz
export function otworzModal(character) {
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
    // Wykryj frakcję na potrzeby formularza
    const { faction } = analizujFrakcjeIAwatar(
      character.name,
      character.gender,
      currentImg
    );
    document.getElementById("edit-faction").value = faction;
  } else {
    // Wykryj domyślną frakcję i wyczyść URL
    const { faction } = analizujFrakcjeIAwatar(
      character.name,
      character.gender,
      currentImg
    );
    document.getElementById("edit-faction").value = faction;
    document.getElementById("edit-image-url").value = "";
  }

  modal.classList.remove("hidden");
}

// Zamyka modal edycji
export function zamknijModal() {
  const modal = document.getElementById("edit-modal");
  modal.classList.add("hidden");
}

// Zapisuje edytowaną postać
export function zapiszEdycje(event) {
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
        zamknijModal();
        pokazStatus("Pomyślnie zaktualizowano dane postaci.");
        wyswietlDane();
      } else {
        alert("Błąd: " + (data.message || "Nie udało się zapisać zmian."));
      }
    })
    .catch((error) => {
      console.error("Błąd edycji:", error);
      pokazStatus("Błąd połączenia podczas aktualizacji.", "error");
    });
}

// Usuwa postać z animacją wyjścia
export function usun(id) {
  if (confirm("Czy na pewno chcesz usunąć tę postać z archiwum Holonetu?")) {
    const card = document.getElementById(`card-${id}`);

    // Uruchomienie animacji wyjścia
    if (card) {
      card.classList.add("hidden");
    }

    // Opóźnienie wysłania żądania o czas animacji (400ms)
    setTimeout(() => {
      deleteCharacter(id)
        .then((data) => {
          if (data.status === "success") {
            pokazStatus("Usunięto postać z rejestru.");
            wyswietlDane();
          } else {
            alert("Błąd: " + (data.message || "Nie udało się usunąć postaci."));
            wyswietlDane(); // Przywróć widok w przypadku błędu
          }
        })
        .catch((error) => {
          console.error("Błąd usuwania:", error);
          pokazStatus("Błąd połączenia podczas usuwania.", "error");
          wyswietlDane();
        });
    }, 400);
  }
}
