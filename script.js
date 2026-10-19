// ╔══════════════════════════════════════════════════════════════════╗
// ║  A PERSONNALISER ICI !                                          ║
// ║  Remplace chaque [TODO : ...] par TES propres mots.              ║
// ║  Tous les petits textes personnels sont regroupés ici.          ║
// ╚══════════════════════════════════════════════════════════════════╝

// La vraie date au format AAAA-MM-JJ, ex. "2026-10-25".
// Déverrouillage à 00h00, heure suisse. Laisse vide tant que tu édites.
const DATE_ANNIVERSAIRE = "2026-10-20"; // TODO : renseigner la date exacte !

const TEXTES = {
  etiquette: "Petit cadeaux pour bb",
  badgeAccueil: "Heeeeey babe!",
  titrePrincipal: "Je te souhaite un Joyeux Anniversaire",
  titreAccent: "ma petite Canaille",
  sousTitre: "et joyeux 2 ANS OMGGGG bb",
  avatarNom: "Alfred Chagasse",
  bulleAvant: "Une petite enveloppe digitale pour toi bb",
  bulleTropTot: "EHLAAA! Tu vas devoir attendre un peu hihihih",
  bulleOuvert: "Ohhhhhh bb, c'est open! Tu peux cliquer hihi",
  bulleOuverture: "Ehhhh voiliiiii",
  enveloppe: "Une enveloppe remplie de cadeaux",
  indiceAvant: "Que-ce que ça peut bien être ?",
  indiceTropTot: "Même si c'est la fête aujourd'hui, il va falloir faire preuve de patience bb hihi",
  indiceOuvert: "Ah bah ça alors, le compteur a disparu",
  indiceOuverture: "Ohhhhh",
  noteCompte: "",
  bulleApres: "Je te propose une petite journée les deux, commençant par un atelier créatif et se terminant par un moment détente rien que les deux!",
  titreSurprise: "Surpriiiise baby!",
  titreSurpriseAccent: "Deux activités rien que pour toi (et moi hihi). Date à convenir ensemble, mais je te propose de les faire le même jour.",
  introCadeaux: "",
  cadeau1Titre: "Pendentif fleuri",
  cadeau1SousTitre: "Atelier créatif pour fabriquer un pendentif en intégrant de vraies fleures séchées.",
  cadeau2Titre: "Sauna privatif",
  cadeau2SousTitre: "Sauna privatif pour se détendre au bord du lac soit à Monruz, soit à Hauterive.",
  motFinal: "Je t'aime de tout mon coeur mon amour, je suis tellement heureux de partager ma vie avec toi. Ces deux années sont passées à une vitesse folle, et je n'ai l'impression que ce n'est que le début de notre histoire. J'ai tellement hâte de vivre la suite à tes côtés. Gros bisous, je t'aime fort fort fort.",
  signature: "Ton Baleaineau Cassé adoré",
};

// Textes de la petite fenêtre qui apparaît quand elle clique sur chaque cadeau.
const CADEAUX = {
  flower: {
    title: "Pendentif fleuri",
    description: "Atelier proposé par pétale vagabonde pour créer un pendentif avec incrusté des fleurs séchées et de la résine (sinon il y a aussi la possibilité de faire des boucles d'oreilles). La date reste encore à convenir comme c'est un petit atelier, mais je suis en contact avec la respo qui a l'air super choouue.",
    image: "assets/pixel-flower.png",
  },
  sauna: {
    title: "Sauna privatif",
    description: "Petite cabine de sauna proposé par Phenix Reload, a réserver en ligne pour une durée de 2 heures. On pourra faire des cycles chaud-froid comme tu aimes bien hihi",
    image: "assets/pixel-sauna.png",
  },
};

// Les deux GIF sont issus du dépôt indiqué par l'utilisateur.
// Ils chargent en ligne, avec un GIF de secours local quand GitHub est inaccessible.
const GIFS = {
  heart: {
    url: "https://raw.githubusercontent.com/lovesulei/valentine-ask/main/cat_heart.gif",
    secours: "assets/chat_coeur_secours.gif",
  },
  dance: {
    url: "https://raw.githubusercontent.com/lovesulei/valentine-ask/main/cat_dance.gif",
    secours: "assets/chat_danse_secours.gif",
  },
};

// Applique les textes aux éléments concernés, sans devoir modifier le HTML.
for (const element of document.querySelectorAll("[data-copy]")) {
  const id = element.dataset.copy;
  if (Object.prototype.hasOwnProperty.call(TEXTES, id)) {
    element.textContent = TEXTES[id];
  }
}

for (const img of document.querySelectorAll("[data-gif]")) {
  const source = GIFS[img.dataset.gif];
  if (!source) continue;
  img.addEventListener("error", () => {
    if (img.src.endsWith(source.secours)) return;
    img.src = source.secours;
  });
  img.src = source.url;
}

const $ = id => document.getElementById(id);
const intro = $("introScreen");
const reveal = $("revealScreen");
const envelope = $("envelopeButton");
const bubble = $("bubbleText");
const hint = $("clickHint");
const panel = $("countdownPanel");
const modal = $("giftDialog");
let unlocked = false;
let animating = false;

// Les paramètres de démonstration fonctionnent uniquement en local.
// http://localhost:8000/?preview=open   /   ?preview=locked
const localhost = ["localhost", "127.0.0.1", ""].includes(window.location.hostname) && window.location.protocol !== "https:";
const preview = localhost ? new URLSearchParams(window.location.search).get("preview") : null;
const previewTarget = Date.now() + (3*24+8)*60*60*1000;

const zurichDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit"
});
const zurichDateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});

function partMap(formatter, date) {
  const p = {};
  for (const entry of formatter.formatToParts(date)) if (entry.type !== "literal") p[entry.type] = Number(entry.value);
  return p;
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y,m,d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y,m-1,d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m-1 && dt.getUTCDate() === d;
}
function swissMidnightTimestamp(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const probe = Date.UTC(year, month - 1, day); // UTC minuit du jour choisi
  const local = partMap(zurichDateTime, new Date(probe));
  const localAsUTC = Date.UTC(local.year,local.month-1,local.day,local.hour,local.minute,local.second);
  const offset = localAsUTC - probe;
  return probe - offset;
}
function updateCountdown() {
  const today = partMap(zurichDate, new Date());
  const todaySwiss = `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;
  const reached = preview === "open" || (preview !== "locked" && validDate(DATE_ANNIVERSAIRE) && todaySwiss >= DATE_ANNIVERSAIRE);
  unlocked = reached;
  envelope.classList.toggle("is-ready", reached);
  envelope.classList.toggle("is-locked", !reached);

  if (reached) {
    panel.hidden = true;
    if (!animating && !reveal.classList.contains("is-visible")) {
      hint.textContent = TEXTES.indiceOuvert;
      bubble.textContent = TEXTES.bulleOuvert;
    }
    return;
  }
  panel.hidden = false;
  if (!validDate(DATE_ANNIVERSAIRE) && preview !== "locked") {
    // On reste volontairement discret tant que la date n'a pas été renseignée.
    $("countdownNote").textContent = TEXTES.noteCompte;
    return;
  }
  const target = preview === "locked"
    ? previewTarget
    : swissMidnightTimestamp(DATE_ANNIVERSAIRE);
  const remaining = Math.max(0, target - Date.now());
  const units = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining % 86400000 / 3600000),
    Math.floor(remaining % 3600000 / 60000),
    Math.floor(remaining % 60000 / 1000),
  ];
  ["days","hours","minutes","seconds"].forEach((id, i) => $(id).textContent = String(units[i]).padStart(2,"0"));
}
function wiggleLocked() {
  envelope.classList.remove("is-shaking");
  void envelope.offsetWidth;
  envelope.classList.add("is-shaking");
  bubble.textContent = TEXTES.bulleTropTot;
  hint.textContent = TEXTES.indiceTropTot;
  setTimeout(() => {
    if (!unlocked) bubble.textContent = TEXTES.bulleAvant;
    envelope.classList.remove("is-shaking");
  }, 1200);
}
function showReveal() {
  intro.hidden = true;
  reveal.hidden = false;
  reveal.classList.add("is-visible");
  envelope.setAttribute("aria-expanded", "true");
  spawnHearts();
}
function spawnHearts() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 16; i++) {
    const heart = document.createElement("span");
    heart.textContent = i % 4 === 0 ? "✦" : "♥";
    heart.setAttribute("aria-hidden", "true");
    heart.style.cssText = `position:fixed;left:${15 + Math.random()*70}vw;top:${10+Math.random()*60}vh;color:${i%2===0?'#e57fa9':'#b1d5ca'};font-size:${16+Math.random()*22}px;z-index:50;pointer-events:none;`;
    document.body.append(heart);
    heart.animate([
      {transform:'translateY(20px) scale(.5)',opacity:0},
      {transform:'translateY(-16px) scale(1.2)',opacity:1,offset:.35},
      {transform:'translateY(-100px) scale(.8)',opacity:0}
    ],{duration:1100+Math.random()*550,easing:'ease-out'}).onfinish=()=>heart.remove();
  }
}
envelope.addEventListener("click", () => {
  if (!unlocked) return wiggleLocked();
  if (animating) return;
  animating = true;
  bubble.textContent = TEXTES.bulleOuverture;
  hint.textContent = TEXTES.indiceOuverture;
  envelope.classList.add("opening");
  setTimeout(showReveal, 1050);
});
$("backButton").addEventListener("click", () => {
  reveal.hidden = true;
  reveal.classList.remove("is-visible");
  intro.hidden = false;
  envelope.classList.remove("opening");
  envelope.setAttribute("aria-expanded", "false");
  animating = false;
  updateCountdown();
  window.scrollTo({top:0, behavior:'smooth'});
});
for (const button of document.querySelectorAll("[data-gift]")) {
  button.addEventListener("click", () => {
    const gift = CADEAUX[button.dataset.gift];
    $("dialogTitle").textContent = gift.title;
    $("dialogDescription").textContent = gift.description;
    $("dialogIcon").src = gift.image;
    modal.showModal();
  });
}
$("closeDialog").addEventListener("click", () => modal.close());
$("dialogDone").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => {if (e.target === modal) modal.close()});
updateCountdown();
setInterval(updateCountdown,1000);
