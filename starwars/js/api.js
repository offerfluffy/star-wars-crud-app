import { detectFactionByName } from "./factions.js";

export async function getCharacters() {
  const response = await fetch("php/read.php");
  if (!response.ok) {
    throw new Error("Błąd sieci podczas pobierania danych.");
  }
  return response.json();
}

export async function createCharacter(name, height, gender, imageUrl) {
  const response = await fetch("php/create.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}&image_url=${encodeURIComponent(imageUrl)}`,
  });
  if (!response.ok) {
    throw new Error("Błąd sieci podczas dodawania postaci.");
  }
  return response.json();
}

export async function updateCharacter(id, name, height, gender, imageUrl) {
  const response = await fetch("php/update.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${id}&name=${encodeURIComponent(name)}&height=${encodeURIComponent(height)}&gender=${encodeURIComponent(gender)}&image_url=${encodeURIComponent(imageUrl)}`,
  });
  if (!response.ok) {
    throw new Error("Błąd sieci podczas edycji postaci.");
  }
  return response.json();
}

export async function deleteCharacter(id) {
  const response = await fetch(`php/delete.php?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Błąd sieci podczas usuwania postaci.");
  }
  return response.json();
}

export async function fetchFromSWAPI() {
  const response = await fetch("https://swapi.py4e.com/api/people/");
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych ze SWAPI.");
  }
  const data = await response.json();

  return data.results.map((c) => {
    const detectedFaction = detectFactionByName(c.name) || "empire";

    return {
      name: c.name,
      height: c.height,
      gender: c.gender,
      image_url: `faction:${detectedFaction}`,
    };
  });
}

export async function saveCharactersToDB(characters) {
  const promises = characters.map((c) => {
    return createCharacter(c.name, c.height, c.gender, c.image_url);
  });
  return Promise.all(promises);
}
