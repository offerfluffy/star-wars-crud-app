document.addEventListener("DOMContentLoaded", () => {
  wyswietlDane();
  document.getElementById("formularz").addEventListener("submit", dodajPostac);
  document.getElementById("api-btn").addEventListener("click", pobierzZApi);

  // Handlery modalu edycji
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", zamknijModal);
  document
    .getElementById("close-modal-x")
    .addEventListener("click", zamknijModal);
  document.getElementById("edit-form").addEventListener("submit", zapiszEdycje);
});

// Zwraca kod SVG powiązany z daną frakcją
function getFactionSVG(faction) {
  const svgs = {
    jedi: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 2L9 9h6l-3-7zm0 18v2m-3-4l3 2 3-2M4 12c0 4.41 3.59 8 8 8s8-3.59 8-8c0-3.17-1.84-5.91-4.5-7.18L12 9l-3.5-4.18C5.84 6.09 4 8.83 4 12z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sith: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 2l2.5 5.5L20 8l-4.5 4.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8l5.5-.5z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
    rebel: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 21c-1.5-2.5-3-5.5-3-8.5 0-3.5 1.5-6.5 3-8.5 1.5 2 3 5 3 8.5 0 3-1.5 6-3 8.5z" fill="currentColor"/><path d="M12 2C6.5 5.5 3 10.5 3 16c0 1.5.5 3 1.5 4 .5-3.5 3-7 7.5-8.5-4.5 1.5-7 5-7.5 8.5C5.5 21 7 21 8.5 21c2.5-2 3.5-4.5 3.5-7s1 5 3.5 7c1.5 0 3 0 4-.5-.5-3.5-3-7-7.5-8.5 4.5 1.5 7 5 7.5 8.5 1-1 1.5-2.5 1.5-4 0-5.5-3.5-10.5-9-14z" fill="currentColor"/></svg>`,
    empire: `<svg class="avatar-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M5.64 18.36L18.36 5.64" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
    droid: `<svg class="avatar-svg" viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><path d="M12 8V5m0 0h3M9 5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 19v2m8-2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    bounty_hunter: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 3v18M6 8h12M9 13h6M5 18l3-3 4 4 4-4 3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C8 2 5 5 5 9v3c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  };
  return svgs[faction] || svgs.empire;
}

// Zwraca polską nazwę frakcji
function getFactionLabel(faction) {
  const labels = {
    jedi: "Zakon Jedi",
    sith: "Imperium Sithów",
    rebel: "Sojusz Rebeliantów",
    empire: "Imperium Galaktyczne",
    droid: "Droid",
    bounty_hunter: "Łowca Nagród",
  };
  return labels[faction] || "Galaktyka";
}

// Określa frakcję oraz kod awatara dla postaci
function analizujFrakcjeIAwatar(name, gender, imageUrl) {
  let faction = "empire";

  // 1. Sprawdzenie czy w bazie zapisany jest jawny prefiks frakcji
  if (imageUrl && imageUrl.startsWith("faction:")) {
    faction = imageUrl.split(":")[1];
  } else {
    // 2. Automatyczne mapowanie frakcji po słowach kluczowych w imieniu
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("luke") ||
      lowerName.includes("obi-wan") ||
      lowerName.includes("yoda") ||
      lowerName.includes("anakin") ||
      lowerName.includes("windu") ||
      lowerName.includes("qui-gon") ||
      lowerName.includes("rey") ||
      lowerName.includes("ahsoka") ||
      lowerName.includes("kenobi") ||
      lowerName.includes("jedi") ||
      (lowerName.includes("skywalker") && !lowerName.includes("vader"))
    ) {
      faction = "jedi";
    } else if (
      lowerName.includes("vader") ||
      lowerName.includes("palpatine") ||
      lowerName.includes("sidious") ||
      lowerName.includes("maul") ||
      lowerName.includes("kylo") ||
      lowerName.includes("ren") ||
      lowerName.includes("dooku") ||
      lowerName.includes("sith")
    ) {
      faction = "sith";
    } else if (
      lowerName.includes("r2") ||
      lowerName.includes("c-3") ||
      lowerName.includes("c3") ||
      lowerName.includes("bb-8") ||
      lowerName.includes("droid") ||
      lowerName.includes("k-2") ||
      lowerName.includes("chopper") ||
      lowerName.includes("bb8")
    ) {
      faction = "droid";
    } else if (
      lowerName.includes("boba") ||
      lowerName.includes("jango") ||
      lowerName.includes("fett") ||
      lowerName.includes("mando") ||
      lowerName.includes("hunter") ||
      lowerName.includes("greedo")
    ) {
      faction = "bounty_hunter";
    } else if (
      lowerName.includes("leia") ||
      lowerName.includes("han") ||
      lowerName.includes("chewbacca") ||
      lowerName.includes("organa") ||
      lowerName.includes("rebel") ||
      lowerName.includes("ackbar") ||
      lowerName.includes("lando") ||
      lowerName.includes("solo")
    ) {
      faction = "rebel";
    } else {
      // Fallback na podstawie płci
      const lowerGender = gender.toLowerCase();
      if (lowerGender === "n/a" || lowerGender === "none") {
        faction = "droid";
      } else {
        faction = "empire";
      }
    }
  }

  // 3. Generowanie kodu HTML awatara (obrazek lub SVG)
  let avatarHTML = "";
  if (imageUrl && imageUrl.startsWith("http")) {
    // Podawany zewnętrzny URL
    avatarHTML = `<img src="${imageUrl}" class="avatar-img" alt="${name}" onerror="this.onerror=null; this.outerHTML=\`${getFactionSVG(faction)}\`;" />`;
  } else {
    // Brak obrazka lub zdefiniowana frakcja - renderuj SVG
    avatarHTML = getFactionSVG(faction);
  }

  return { faction, avatarHTML };
}

// Pokazuje komunikat statusu
function pokazStatus(tekst, typ = "info") {
  const statusEl = document.getElementById("status-message");
  statusEl.textContent = tekst;
  statusEl.style.display = "block";
  statusEl.style.color = typ === "error" ? "#ff3838" : "#FFE81F";
  setTimeout(() => {
    statusEl.style.display = "none";
  }, 4000);
}

// Pobiera i wyświetla listę postaci z bazy danych
function wyswietlDane() {
  fetch("php/read.php")
    .then((res) => res.json())
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
function dodajPostac(event) {
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

  fetch("php/create.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}&image_url=${encodeURIComponent(imageUrl)}`,
  })
    .then((response) => response.json())
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
function pobierzZApi(event) {
  event.preventDefault();
  pokazStatus("Łączenie z archiwum SWAPI...");

  fetch("https://swapi.py4e.com/api/people/")
    .then((res) => res.json())
    .then((data) => {
      const characters = data.results.map((c) => {
        // Auto-przypisanie frakcji do image_url dla pobranych postaci
        let detectedFaction = "empire";
        const lowerName = c.name.toLowerCase();

        if (
          lowerName.includes("luke") ||
          lowerName.includes("obi-wan") ||
          lowerName.includes("yoda") ||
          lowerName.includes("anakin") ||
          lowerName.includes("windu") ||
          lowerName.includes("qui-gon") ||
          lowerName.includes("rey") ||
          lowerName.includes("ahsoka") ||
          lowerName.includes("kenobi")
        ) {
          detectedFaction = "jedi";
        } else if (
          lowerName.includes("vader") ||
          lowerName.includes("palpatine") ||
          lowerName.includes("sidious") ||
          lowerName.includes("maul") ||
          lowerName.includes("kylo") ||
          lowerName.includes("dooku")
        ) {
          detectedFaction = "sith";
        } else if (
          lowerName.includes("r2") ||
          lowerName.includes("c-3") ||
          lowerName.includes("c3") ||
          lowerName.includes("bb-8") ||
          lowerName.includes("droid")
        ) {
          detectedFaction = "droid";
        } else if (
          lowerName.includes("boba") ||
          lowerName.includes("jango") ||
          lowerName.includes("fett") ||
          lowerName.includes("mando") ||
          lowerName.includes("hunter")
        ) {
          detectedFaction = "bounty_hunter";
        } else if (
          lowerName.includes("leia") ||
          lowerName.includes("han") ||
          lowerName.includes("chewbacca") ||
          lowerName.includes("rebel") ||
          lowerName.includes("solo")
        ) {
          detectedFaction = "rebel";
        }

        return {
          name: c.name,
          height: c.height,
          gender: c.gender,
          image_url: `faction:${detectedFaction}`,
        };
      });
      zapiszDoBazy(characters);
    })
    .catch((error) => {
      console.error("Błąd pobierania z API:", error);
      pokazStatus("Nie udało się pobrać danych ze SWAPI.", "error");
    });
}

// Zapisuje pobrane postacie w bazie danych seryjnie
function zapiszDoBazy(characters) {
  let promises = characters.map((c) => {
    return fetch("php/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${encodeURIComponent(c.name)}&height=${encodeURIComponent(c.height)}&gender=${encodeURIComponent(c.gender)}&image_url=${encodeURIComponent(c.image_url)}`,
    });
  });

  Promise.all(promises)
    .then(() => {
      pokazStatus("Pomyślnie zsynchronizowano dane z API SWAPI.");
      wyswietlDane();
    })
    .catch((error) => {
      console.error("Błąd zapisu serii:", error);
      pokazStatus(
        "Wystąpił błąd podczas zapisywania pobranych danych.",
        "error",
      );
    });
}

// Otwiera modal edycji i uzupełnia formularz
function otworzModal(character) {
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
      currentImg,
    );
    document.getElementById("edit-faction").value = faction;
  } else {
    // Wykryj domyślną frakcję i wyczyść URL
    const { faction } = analizujFrakcjeIAwatar(
      character.name,
      character.gender,
      currentImg,
    );
    document.getElementById("edit-faction").value = faction;
    document.getElementById("edit-image-url").value = "";
  }

  modal.classList.remove("hidden");
}

// Zamyka modal edycji
function zamknijModal() {
  const modal = document.getElementById("edit-modal");
  modal.classList.add("hidden");
}

// Zapisuje edytowaną postać
function zapiszEdycje(event) {
  event.preventDefault();

  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("edit-name").value.trim();
  const height = document.getElementById("edit-height").value.trim();
  const gender = document.getElementById("edit-gender").value.trim();
  const faction = document.getElementById("edit-faction").value;
  const customUrl = document.getElementById("edit-image-url").value.trim();

  const imageUrl = customUrl ? customUrl : `faction:${faction}`;

  fetch("php/update.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${id}&name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}&image_url=${encodeURIComponent(imageUrl)}`,
  })
    .then((response) => response.json())
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
function usun(id) {
  if (confirm("Czy na pewno chcesz usunąć tę postać z archiwum Holonetu?")) {
    const card = document.getElementById(`card-${id}`);

    // Uruchomienie animacji wyjścia
    if (card) {
      card.classList.add("hidden");
    }

    // Opóźnienie wysłania żądania o czas animacji (400ms)
    setTimeout(() => {
      fetch(`php/delete.php?id=${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
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
