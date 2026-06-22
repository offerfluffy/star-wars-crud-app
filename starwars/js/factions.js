const svgCache = {};

// Fallback inline SVGs in case assets fail to load
const fallbackSVGs = {
  jedi: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 2L9 9h6l-3-7zm0 18v2m-3-4l3 2 3-2M4 12c0 4.41 3.59 8 8 8s8-3.59 8-8c0-3.17-1.84-5.91-4.5-7.18L12 9l-3.5-4.18C5.84 6.09 4 8.83 4 12z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sith: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 2l2.5 5.5L20 8l-4.5 4.5 1.5 6-5-3.5-5 3.5 1.5-6L4 8l5.5-.5z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  rebel: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 21c-1.5-2.5-3-5.5-3-8.5 0-3.5 1.5-6.5 3-8.5 1.5 2 3 5 3 8.5 0 3-1.5 6-3 8.5z" fill="currentColor"/><path d="M12 2C6.5 5.5 3 10.5 3 16c0 1.5.5 3 1.5 4 .5-3.5 3-7 7.5-8.5-4.5 1.5-7 5-7.5 8.5C5.5 21 7 21 8.5 21c2.5-2 3.5-4.5 3.5-7s1 5 3.5 7c1.5 0 3 0 4-.5-.5-3.5-3-7-7.5-8.5 4.5 1.5 7 5 7.5 8.5 1-1 1.5-2.5 1.5-4 0-5.5-3.5-10.5-9-14z" fill="currentColor"/></svg>`,
  empire: `<svg class="avatar-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M5.64 18.36L18.36 5.64" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
  droid: `<svg class="avatar-svg" viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><path d="M12 8V5m0 0h3M9 5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 19v2m8-2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  bounty_hunter: `<svg class="avatar-svg" viewBox="0 0 24 24"><path d="M12 3v18M6 8h12M9 13h6M5 18l3-3 4 4 4-4 3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C8 2 5 5 5 9v3c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};

// Prefetch SVGs dynamically from assets folder and inject classes if needed
export async function prefetchSVGs() {
  const factions = ["jedi", "sith", "rebel", "empire", "droid", "bounty_hunter"];
  const promises = factions.map(async (faction) => {
    try {
      const res = await fetch(`assets/${faction}.svg`);
      if (res.ok) {
        let svgText = await res.text();
        // Add class="avatar-svg" to svg tag if not present
        if (!svgText.includes('class="avatar-svg"')) {
          svgText = svgText.replace('<svg', '<svg class="avatar-svg"');
        }
        svgCache[faction] = svgText;
      }
    } catch (e) {
      console.warn(`Failed to prefetch SVG for ${faction}, falling back to inline default.`, e);
    }
  });
  await Promise.all(promises);
}

// Zwraca kod SVG powiązany z daną frakcją
export function getFactionSVG(faction) {
  return svgCache[faction] || fallbackSVGs[faction] || fallbackSVGs.empire;
}

// Globalny handler błędu dla brakujących obrazków postaci
window.handleAvatarError = function(imgElement, faction) {
  imgElement.outerHTML = getFactionSVG(faction);
};

// Zwraca polską nazwę frakcji
export function getFactionLabel(faction) {
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
export function analizujFrakcjeIAwatar(name, gender, imageUrl) {
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
    avatarHTML = `<img src="${imageUrl}" class="avatar-img" alt="${name}" onerror="if(typeof handleAvatarError==='function') handleAvatarError(this, '${faction}'); else this.style.display='none';" />`;
  } else {
    // Brak obrazka lub zdefiniowana frakcja - renderuj SVG
    avatarHTML = getFactionSVG(faction);
  }

  return { faction, avatarHTML };
}
