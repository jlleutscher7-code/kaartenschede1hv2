// ============================================================
//  Fietsroute Enschede — logica
// ============================================================

const ADMIN_PASSWORD = "enschede1862";

let stops = [
  {
    id: "stop-01",
    km: "0,0",
    title: "Van Heekplein",
    subtitle: "Het hart van de wederopgebouwde stad",
    text: "Hier begint de tocht, op de plek waar fabrikant G.J. van Heek zijn naam aan het stadshart gaf. Na de grote brand van 1862, die bijna de hele binnenstad verwoestte, werd Enschede opnieuw opgebouwd met brede straten en stenen gevels — een stad die zich niet liet breken door het vuur dat haar textielindustrie ooit dreigde te vernietigen.",
    photo: null
  },
  {
    id: "stop-02",
    km: "0,8",
    title: "Oude Markt",
    subtitle: "Marktplein sinds de middeleeuwen",
    text: "Al voor de komst van de textielindustrie was dit het kloppend hart van Enschede. Boeren uit de omliggende Twentse dorpen kwamen hier handelen, lang voordat de schoorstenen van de fabrieken de skyline gingen bepalen.",
    photo: null
  },
  {
    id: "stop-03",
    km: "1,5",
    title: "Het Rozendaal",
    subtitle: "Arbeiderswijk uit de textieltijd",
    text: "In deze straten woonden de arbeiders die de weefgetouwen draaiende hielden. Kleine huisjes, dicht op elkaar gebouwd, vertellen het verhaal van een stad die groeide op het ritme van de fabrieksfluit.",
    photo: null
  },
  {
    id: "stop-04",
    km: "2,3",
    title: "Fabriekscomplex Jannink",
    subtitle: "Een van de grote textielbaronnen",
    text: "De familie Jannink bouwde hier een van de grootste textielfabrieken van Twente. De rode bakstenen gebouwen, met hun karakteristieke sheddaken, staan nog deels overeind als stille getuigen van een industrieel tijdperk.",
    photo: null
  },
  {
    id: "stop-05",
    km: "3,1",
    title: "Spoorzone",
    subtitle: "De lijn die textiel de wereld in stuurde",
    text: "De spoorlijn Enschede–Salzbergen, geopend in 1865, was de levensader van de textielindustrie. Hier werden balen katoen aangevoerd en kisten vol geweven stof verscheept naar heel Europa.",
    photo: null
  },
  {
    id: "stop-06",
    km: "4,0",
    title: "Twentse Courant Tubantia",
    subtitle: "De stem van de fabrieksstad",
    text: "Vanaf hier berichtte de regionale krant over staking, groei en neergang van de textielindustrie — een eeuw aan koppen die het lot van duizenden Twentse families volgde.",
    photo: null
  },
  {
    id: "stop-07",
    km: "5,2",
    title: "Volkspark",
    subtitle: "Groen voor de arbeider",
    text: "Aangelegd zodat fabrieksarbeiders een plek hadden om te ademen buiten de rokerige fabriekshallen. Het park markeert het begin van een sociaal bewustzijn binnen de industriestad.",
    photo: null
  },
  {
    id: "stop-08",
    km: "6,4",
    title: "Fabriek Het Roessingh",
    subtitle: "Spinnerij aan de rand van de stad",
    text: "Een van de spinnerijen die de ruwe katoen omspon tot draad. Het gebouw herinnert aan het complete proces dat zich in Enschede afspeelde: van ruwe grondstof tot afgewerkt weefsel.",
    photo: null
  },
  {
    id: "stop-09",
    km: "7,7",
    title: "Watertorens van Twente",
    subtitle: "Infrastructuur van een groeiende stad",
    text: "De snelle industriële groei vroeg om snelle voorzieningen. De watertorens die hier verrezen voorzagen niet alleen huishoudens, maar ook de waterhongerige textielfabrieken.",
    photo: null
  },
  {
    id: "stop-10",
    km: "9,0",
    title: "Textielmuseum",
    subtitle: "Het verhaal compleet verteld",
    text: "Hier wordt het hele verhaal van Twentse textiel bewaard: de weefgetouwen, de stoommachines, de stakingen en de geleidelijke neergang toen goedkopere productie naar het buitenland verdween.",
    photo: null
  },
  {
    id: "stop-11",
    km: "10,4",
    title: "Drienerlo",
    subtitle: "Van weiland naar kenniscampus",
    text: "Op de plek waar ooit boerenland lag, verrees in de jaren '60 de Technische Hogeschool Twente — de stad die zich opnieuw uitvond toen de textielindustrie verdween, dit keer rond technologie en kennis.",
    photo: null
  },
  {
    id: "stop-12",
    km: "12,0",
    title: "Eindpunt: Glanerbrug",
    subtitle: "De grens als afsluiting",
    text: "De tocht eindigt bij de grens met Duitsland, waar textiel ooit moeiteloos overheen ging. Een symbolisch eindpunt voor een route die de opkomst, bloei en transformatie van Enschede volgt.",
    photo: null
  }
];

let isAdmin = false;
let editingId = null;
let editPhoto = null;
let mapPhoto = null;

// ── Routekaart ────────────────────────────────────────────────

function updateMapUI() {
  const img     = document.getElementById("mapImg");
  const ph      = document.getElementById("mapPlaceholder");
  const hint    = document.getElementById("mapAdminHint");
  const editBtn = document.getElementById("mapEditBtn");
  const frame   = document.getElementById("mapFrame");

  if (mapPhoto) {
    img.src = mapPhoto;
    img.style.display = "block";
    ph.style.display = "none";
  } else {
    img.style.display = "none";
    ph.style.display = "flex";
  }

  if (isAdmin) {
    hint.style.display = "block";
    editBtn.className = "map-edit-btn visible";
    frame.style.cursor = "pointer";
  } else {
    hint.style.display = "none";
    editBtn.className = "map-edit-btn";
    frame.style.cursor = "default";
  }
}

function handleMapFile(input) {
  const f = input.files?.[0];
  if (!f) return;
  if (f.size > 8 * 1024 * 1024) { alert("Afbeelding groter dan 8MB."); return; }
  const r = new FileReader();
  r.onload = () => { mapPhoto = r.result; updateMapUI(); showToast(); };
  r.readAsDataURL(f);
}

// ── Route renderen ────────────────────────────────────────────

function photoHTML(src, title) {
  if (!src) return '<div class="stop-photo-ph"><p>nog geen foto</p></div>';
  return '<img src="' + src + '" alt="' + title + '" loading="lazy"/>';
}

function renderRoute() {
  const list = document.getElementById("routeList");
  list.innerHTML = '<div class="timeline-line"></div>';
  stops.forEach(s => {
    const li = document.createElement("li");
    li.className = "stop-item";
    li.innerHTML =
      '<div class="stop-bubble">' + s.km + '<span class="km-lbl">KM</span></div>' +
      '<div class="stop-card">' +
        '<div class="stop-photo">' + photoHTML(s.photo, s.title) + '</div>' +
        '<div class="stop-body">' +
          '<div class="stop-title">' + s.title + '</div>' +
          '<div class="stop-sub">' + s.subtitle + '</div>' +
          '<p class="stop-text">' + s.text + '</p>' +
          (isAdmin ? '<button class="btn-edit" onclick="openEdit(\'' + s.id + '\')">Bewerken</button>' : '') +
        '</div>' +
      '</div>';
    list.appendChild(li);
  });
}

// ── Toast ─────────────────────────────────────────────────────

function showToast() {
  const t = document.getElementById("toast");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

// ── Beheer / login ────────────────────────────────────────────

function onHeaderBtn() {
  if (isAdmin) {
    isAdmin = false;
    document.getElementById("headerBtn").className = "btn-beheer";
    document.getElementById("headerBtn").textContent = "beheer";
    renderRoute();
    updateMapUI();
  } else {
    openLogin();
  }
}

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
  setTimeout(() => document.getElementById("pwInput").focus(), 50);
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("pwInput").value = "";
  document.getElementById("loginError").style.display = "none";
}

function doLogin() {
  const pw = document.getElementById("pwInput").value;
  if (pw === ADMIN_PASSWORD) {
    isAdmin = true;
    closeLogin();
    document.getElementById("headerBtn").className = "btn-uitloggen";
    document.getElementById("headerBtn").textContent = "uitloggen";
    renderRoute();
    updateMapUI();
  } else {
    document.getElementById("loginError").style.display = "block";
    document.getElementById("pwInput").classList.add("err");
  }
}

// ── Stop bewerken ─────────────────────────────────────────────

function openEdit(id) {
  const s = stops.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  editPhoto = s.photo;
  document.getElementById("editKm").value       = s.km;
  document.getElementById("editTitle").value    = s.title;
  document.getElementById("editSubtitle").value = s.subtitle;
  document.getElementById("editText").value     = s.text;
  renderEditPhoto();
  document.getElementById("editModal").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
  editingId = null;
  editPhoto = null;
  document.getElementById("photoFile").value = "";
}

function renderEditPhoto() {
  const c = document.getElementById("editPhotoPreview");
  if (editPhoto) {
    c.innerHTML = '<img src="' + editPhoto + '" alt="foto" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;"/>';
    document.getElementById("photoHintText").textContent = "Andere foto kiezen";
  } else {
    c.innerHTML = '<div style="width:100%;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;background:#F7F7F7;border:2px dashed #E0E0E0;border-radius:8px;color:#bbb;"><p style="font-family:monospace;font-size:11px;">nog geen foto</p></div>';
    document.getElementById("photoHintText").textContent = "Foto uploaden";
  }
}

function handlePhotoFile(input) {
  const f = input.files?.[0];
  if (!f) return;
  if (f.size > 4 * 1024 * 1024) { alert("Foto groter dan 4MB."); return; }
  const r = new FileReader();
  r.onload = () => { editPhoto = r.result; renderEditPhoto(); };
  r.readAsDataURL(f);
}

function saveStop() {
  if (!editingId) return;
  stops = stops.map(s =>
    s.id === editingId
      ? {
          ...s,
          km:       document.getElementById("editKm").value,
          title:    document.getElementById("editTitle").value,
          subtitle: document.getElementById("editSubtitle").value,
          text:     document.getElementById("editText").value,
          photo:    editPhoto
        }
      : s
  );
  closeEdit();
  renderRoute();
  showToast();
}

// ── Start ─────────────────────────────────────────────────────
renderRoute();
