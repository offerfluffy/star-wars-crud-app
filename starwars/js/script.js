document.addEventListener("DOMContentLoaded", () => {
  wyswietlDane();
  document.getElementById("formularz").addEventListener("submit", dodajPostac);
  document.getElementById("api-btn").addEventListener("click", pobierzZApi);
});

function dodajPostac(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const gender = document.getElementById("gender").value.trim();

  if (!name || !height || !gender) {
    alert("Proszę wypełnić wszystkie pola.");
    return;
  }

  fetch("php/create.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("formularz").reset();
        wyswietlDane();
      } else {
        alert("Błąd: " + (data.message || "Nie udało się dodać postaci."));
      }
    })
    .catch((error) => console.error("Błąd zapisu:", error));
}

function pobierzZApi(event) {
  event.preventDefault();
  fetch("https://swapi.dev/api/people/")
    .then((res) => res.json())
    .then((data) => {
      const characters = data.results.map((c) => ({
        name: c.name,
        height: c.height,
        gender: c.gender,
      }));
      zapiszDoBazy(characters);
    });
}

function zapiszDoBazy(characters) {
  let promises = characters.map((c) => {
    return fetch("php/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${encodeURIComponent(c.name)}&height=${encodeURIComponent(c.height)}&gender=${encodeURIComponent(c.gender)}`,
    });
  });

  Promise.all(promises)
    .then(() => {
      wyswietlDane();
    })
    .catch((error) => console.error("Błąd zapisu:", error));
}

function wyswietlDane() {
  fetch("php/read.php")
    .then((res) => res.json())
    .then((data) => {
      const dane = document.getElementById("dane");
      dane.innerHTML = "";
      if (!data || !data.length) {
        dane.textContent = "Brak danych do wyświetlenia.";
        return;
      }
      data.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>Imię: ${item.name}</h3>
          <p>Wzrost: ${item.height}</p>
          <p>Płeć: ${item.gender}</p>
          <button onclick="usun(${item.id})"><i class="fas fa-trash"></i></button>
          <button onclick="edytuj(${item.id})"><i class="fas fa-edit"></i></button>
        `;
        dane.appendChild(div);
      });
    })
    .catch((error) => console.error("Błąd pobierania:", error));
}

function edytuj(id) {
  let name = prompt("Wprowadź nowe imię:");
  let height = prompt("Wprowadź nowy wzrost:");
  let gender = prompt("Wprowadź nową płeć:");
  if (name !== null && height !== null && gender !== null) {
    fetch("php/update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}&name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        wyswietlDane();
      })
      .catch((error) => console.error("Błąd:", error));
  }
}

function usun(id) {
  if (confirm("Czy na pewno chcesz usunąć tę postać?")) {
    fetch(`php/delete.php?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        wyswietlDane();
      })
      .catch((error) => console.error("Błąd:", error));
  }
}
