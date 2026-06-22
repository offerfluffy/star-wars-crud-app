// Fetches all characters from the database
export async function getCharacters() {
  const response = await fetch("php/read.php");
  if (!response.ok) {
    throw new Error("Błąd sieci podczas pobierania danych.");
  }
  return response.json();
}

// Creates a new character in the database
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

// Updates an existing character in the database
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

// Deletes a character from the database
export async function deleteCharacter(id) {
  const response = await fetch(`php/delete.php?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Błąd sieci podczas usuwania postaci.");
  }
  return response.json();
}

// Fetches list of characters from the SWAPI API
export async function fetchFromSWAPI() {
  const response = await fetch("https://swapi.py4e.com/api/people/");
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych ze SWAPI.");
  }
  const data = await response.json();
  
  return data.results.map((c) => {
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
}

// Saves multiple characters to the database in parallel
export async function saveCharactersToDB(characters) {
  const promises = characters.map((c) => {
    return createCharacter(c.name, c.height, c.gender, c.image_url);
  });
  return Promise.all(promises);
}
