export const FACTIONS = Object.freeze({
  JEDI: "jedi",
  SITH: "sith",
  REBEL: "rebel",
  EMPIRE: "empire",
  DROID: "droid",
  BOUNTY_HUNTER: "bounty_hunter",
});

export const factions = Object.values(FACTIONS);

export const FACTION_OPTIONS = Object.freeze({
  [FACTIONS.JEDI]: "Zakon Jedi",
  [FACTIONS.SITH]: "Imperium Sithów",
  [FACTIONS.REBEL]: "Sojusz Rebeliantów",
  [FACTIONS.EMPIRE]: "Imperium Galaktyczne",
  [FACTIONS.DROID]: "Droidy",
  [FACTIONS.BOUNTY_HUNTER]: "Łowcy Nagród",
});

const svgCache = {};

export async function prefetchSVGs() {
  const promises = factions.map(async (faction) => {
    try {
      const res = await fetch(`assets/${faction}.svg`);
      if (res.ok) {
        let svgText = await res.text();
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

export function getFactionSVG(faction) {
  return svgCache[faction] || "";
}

window.handleAvatarError = function (imgElement, faction) {
  imgElement.outerHTML = getFactionSVG(faction);
};

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

export function detectFactionByName(name) {
  if (!name) return null;
  const lowerName = name.toLowerCase();

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

export function analyzeFactionAndAvatar(name, gender, imageUrl) {
  let faction = FACTIONS.EMPIRE;

  if (imageUrl && imageUrl.startsWith("faction:")) {
    faction = imageUrl.split(":")[1];
  } else {
    const detected = detectFactionByName(name);
    if (detected) {
      faction = detected;
    } else {
      const lowerGender = (gender || "").toLowerCase();
      if (lowerGender === "n/a" || lowerGender === "none") {
        faction = FACTIONS.DROID;
      } else {
        faction = FACTIONS.EMPIRE;
      }
    }
  }

  let avatarHTML = "";
  if (imageUrl && imageUrl.startsWith("http")) {
    avatarHTML = `<img src="${imageUrl}" class="avatar-img" alt="${name}" onerror="if(typeof handleAvatarError==='function') handleAvatarError(this, '${faction}'); else this.style.display='none';" />`;
  } else {
    avatarHTML = getFactionSVG(faction);
  }

  return { faction, avatarHTML };
}
