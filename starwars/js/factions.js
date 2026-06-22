export const FACTIONS = Object.freeze({
  JEDI: "jedi",
  SITH: "sith",
  REBEL: "rebel",
  EMPIRE: "empire",
  DROID: "droid",
  BOUNTY_HUNTER: "bounty_hunter",
});

export const factions = Object.values(FACTIONS);

const svgCache = {};

// Prefetch SVGs dynamically from assets folder and inject classes if needed
export async function prefetchSVGs() {
  const promises = factions.map(async (faction) => {
    try {
      const res = await fetch(`assets/${faction}.svg`);
      if (res.ok) {
        let svgText = await res.text();
        // Add class="avatar-svg" to svg tag if not present
        if (!svgText.includes('class="avatar-svg"')) {
          svgText = svgText.replace("<svg", '<svg class="avatar-svg"');
        }
        svgCache[faction] = svgText;
      }
    } catch (e) {
      console.warn(`Failed to prefetch SVG for ${faction}.`, e);
    }
  });
  await Promise.all(promises);
}

// Zwraca kod SVG powiązany z daną frakcją
export function getFactionSVG(faction) {
  return svgCache[faction] || "";
}

// Globalny handler błędu dla brakujących obrazków postaci
window.handleAvatarError = function (imgElement, faction) {
  imgElement.outerHTML = getFactionSVG(faction);
};

// Zwraca polską nazwę frakcji
export function getFactionLabel(faction) {
  const labels = {
    [FACTIONS.JEDI]: "Zakon Jedi",
    [FACTIONS.SITH]: "Imperium Sithów",
    [FACTIONS.REBEL]: "Sojusz Rebeliantów",
    [FACTIONS.EMPIRE]: "Imperium Galaktyczne",
    [FACTIONS.DROID]: "Droid",
    [FACTIONS.BOUNTY_HUNTER]: "Łowca Nagród",
  };
  return labels[faction] || "Galaktyka";
}

const FACTION_KEYWORDS = {
  [FACTIONS.JEDI]: [
    "luke",
    "obi-wan",
    "yoda",
    "anakin",
    "windu",
    "qui-gon",
    "rey",
    "ahsoka",
    "kenobi",
    "jedi",
  ],
  [FACTIONS.SITH]: [
    "vader",
    "palpatine",
    "sidious",
    "maul",
    "kylo",
    "ren",
    "dooku",
    "sith",
  ],
  [FACTIONS.DROID]: [
    "r2",
    "c-3",
    "c3",
    "bb-8",
    "droid",
    "k-2",
    "chopper",
    "bb8",
  ],
  [FACTIONS.BOUNTY_HUNTER]: [
    "boba",
    "jango",
    "fett",
    "mando",
    "hunter",
    "greedo",
  ],
  [FACTIONS.REBEL]: [
    "leia",
    "han",
    "chewbacca",
    "organa",
    "rebel",
    "ackbar",
    "lando",
    "solo",
  ],
};

// Pomocnicza funkcja wykrywająca frakcję na podstawie słów kluczowych w imieniu
export function wykryjFrakcjePoNazwie(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase();

  // Specjalny przypadek dla Skywalkerów (oprócz Vadera)
  if (lowerName.includes("skywalker") && !lowerName.includes("vader")) {
    return FACTIONS.JEDI;
  }

  for (const [faction, keywords] of Object.entries(FACTION_KEYWORDS)) {
    if (keywords.some((keyword) => lowerName.includes(keyword))) {
      return faction;
    }
  }

  return null;
}

// Określa frakcję oraz kod awatara dla postaci
export function analizujFrakcjeIAwatar(name, gender, imageUrl) {
  let faction = FACTIONS.EMPIRE;

  // 1. Sprawdzenie czy w bazie zapisany jest jawny prefiks frakcji
  if (imageUrl && imageUrl.startsWith("faction:")) {
    faction = imageUrl.split(":")[1];
  } else {
    // 2. Automatyczne mapowanie frakcji po słowach kluczowych w imieniu
    const detected = wykryjFrakcjePoNazwie(name);
    if (detected) {
      faction = detected;
    } else {
      // Fallback na podstawie płci
      const lowerGender = (gender || "").toLowerCase();
      if (lowerGender === "n/a" || lowerGender === "none") {
        faction = FACTIONS.DROID;
      } else {
        faction = FACTIONS.EMPIRE;
      }
    }
  }

  // 3. Generowanie kodu HTML awatara (obrazek lub SVG)
  let avatarHTML = "";
  if (imageUrl && imageUrl.startsWith("http")) {
    // Podawany zewnętrzny URL
    avatarHTML = `<img src="${imageUrl}" class="avatar-img" alt="${name}" onerror="if(typeof handleAvatarError==='function') handleAvatarError(this, '${faction}'); else this.style.display='none';" />`;
  } else {
    // Brak obrazka lub zdefiniowana frakcja - renderuj SVG
    avatarHTML = getFactionSVG(faction);
  }

  return { faction, avatarHTML };
}
