/* =========================
   CONFIGURACIÓN PRINCIPAL
   ========================= */
const CONFIG = {
  siteTitle: "Nuestra Historia",
  startDate: "1991-10-16",      // YYYY-MM-DD  <-- CAMBIA ESTA FECHA
  startDateLabel: "10 de octubre de 2010",

  heroQuote: "“Porque contigo, hasta los días comunes se vuelven inolvidables.”",

  // Música opcional:
  // Pon tu archivo en assets/ y escribe por ejemplo: "assets/music.mp3"
  musicSrc: "assets/music.mp3", // "assets/music.mp3"

  // Galería: fotos (type:"img") y videos (type:"video")
  gallery: [
    { type:"img",   src:"https://picsum.photos/1200/900?random=11", label:"Recuerdo 1" },
    { type:"img",   src:"https://picsum.photos/1200/900?random=12", label:"Recuerdo 2" },
    { type:"video", src:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", label:"Video 1" },
    { type:"img",   src:"https://picsum.photos/1200/900?random=13", label:"Recuerdo 3" }
  ],
  slideshowIntervalMs: 4500,

  // Carta de amor
  letterTitle: "Mi amor,",
  letter: [
    "Hoy quería regalarte algo distinto: un pedacito de nuestra historia guardado en un lugar que siempre puedas abrir.",
    "Gracias por ser hogar, por ser calma, por ser aventura. Gracias por quedarte, incluso cuando el día pesa.",
    "Te amo en lo simple: en las risas, en las miradas, en la forma en que el mundo se siente mejor cuando estás.",
    "Si pudiera elegir de nuevo, volvería a encontrarte. Siempre."
  ],
  signature: "Tu persona Favorita💖",
  signatureDate: "Febrero 2026",

  // Promesas / metas
  promiseCategories: [
    {
      name: "Viajar a… ✈️",
      items: [
        { title:"Viajar a la playa", note:"Atardecer, fotos y cero prisa.", done:false },
        { title:"Conocer una ciudad nueva", note:"Perdernos y encontrarnos juntos.", done:false }
      ]
    },
    {
      name: "Lograr… 🏁",
      items: [
        { title:"Ahorrar para nuestro plan", note:"Un paso a la vez, pero juntos.", done:false },
        { title:"Construir un proyecto en pareja", note:"Algo nuestro, con nuestra firma.", done:false }
      ]
    },
    {
      name: "Soñar con… 🌙",
      items: [
        { title:"Un hogar bonito", note:"Donde el amor se note en cada detalle.", done:false },
        { title:"Muchos años más", note:"Elegirnos incluso en lo cotidiano.", done:false }
      ]
    }
  ],

  // Sorpresa final
  secretCode: "ANDY",
  secretHint: "nuestra palabra",
  surpriseMessage: "Tengo un plan para nosotros: una cena especial este fin de semana. 💖 ¿Aceptas?",
  // Video oculto opcional (pon el archivo en assets/ y usa "assets/sorpresa.mp4")
  surpriseVideoSrc: "assets/sorpresa.mp4"
};

/* =========================
   HELPERS
   ========================= */
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function escapeHTML(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatESDate(date){
  try{
    return new Intl.DateTimeFormat("es-MX", { year:"numeric", month:"long", day:"numeric" }).format(date);
  }catch{
    return date.toISOString().slice(0,10);
  }
}

/* =========================
   INIT: HEADER / HERO
   ========================= */
$("#siteTitle").textContent = CONFIG.siteTitle;
$("#miniDate").textContent = "Juntos desde " + (CONFIG.startDateLabel || formatESDate(new Date(CONFIG.startDate + "T00:00:00")));
$("#startDateLabel").textContent = CONFIG.startDateLabel || formatESDate(new Date(CONFIG.startDate + "T00:00:00"));
$("#heroQuote").textContent = CONFIG.heroQuote;

/* =========================
   TIMELINE (toggle open)
   ========================= */
const timeline = $("#timeline");
timeline.addEventListener("click", (e) => {
  const item = e.target.closest(".t-item");
  if(!item) return;
  item.classList.toggle("open");
});

let expandedAll = false;
$("#expandAllBtn").addEventListener("click", () => {
  expandedAll = !expandedAll;
  $$(".t-item").forEach(el => el.classList.toggle("open", expandedAll));
  $("#expandAllBtn").textContent = expandedAll ? "📕 Contraer todo" : "📖 Expandir todo";
});

/* =========================
   GALERÍA + SLIDESHOW
   ========================= */
const slider = $("#slider");
const dots = $("#dots");
const slideCounter = $("#slideCounter");
let slideIndex = 0;
let playing = true;
let timer = null;

function buildSlides(){
  $$(".slide").forEach(n => n.remove());
  dots.innerHTML = "";

  CONFIG.gallery.forEach((g, i) => {
    const s = document.createElement("div");
    s.className = "slide" + (i===0 ? " active" : "");

    if(g.type === "video"){
      const v = document.createElement("video");
      v.src = g.src;
      v.preload = "metadata";
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.autoplay = i===0;
      s.appendChild(v);
    }else{
      const img = document.createElement("img");
      img.src = g.src;
      img.alt = g.label || ("Recuerdo " + (i+1));
      s.appendChild(img);
    }

    slider.insertBefore(s, slider.firstChild);

    const d = document.createElement("div");
    d.className = "dot" + (i===0 ? " active" : "");
    d.title = g.label || ("Slide " + (i+1));
    d.addEventListener("click", () => goToSlide(i, true));
    dots.appendChild(d);
  });

  updateSlideCounter();
}

function updateSlideCounter(){
  slideCounter.textContent = (slideIndex + 1) + " / " + CONFIG.gallery.length;
  $$(".dot").forEach((d, i) => d.classList.toggle("active", i===slideIndex));
  $$(".slide").forEach((s, i) => s.classList.toggle("active", i===slideIndex));

  const active = $$(".slide")[slideIndex];
  if(active){
    const v = active.querySelector("video");
    if(v){
      v.currentTime = 0;
      v.play().catch(()=>{});
    }
  }
}

function goToSlide(i, userAction=false){
  slideIndex = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
  updateSlideCounter();
  if(userAction) restartTimer();
}

function nextSlide(userAction=false){ goToSlide(slideIndex + 1, userAction); }
function prevSlide(userAction=false){ goToSlide(slideIndex - 1, userAction); }

function startTimer(){
  stopTimer();
  timer = setInterval(() => {
    if(playing) nextSlide(false);
  }, CONFIG.slideshowIntervalMs);
}
function stopTimer(){
  if(timer) clearInterval(timer);
  timer = null;
}
function restartTimer(){ startTimer(); }

$("#nextBtn").addEventListener("click", () => nextSlide(true));
$("#prevBtn").addEventListener("click", () => prevSlide(true));
$("#playBtn").addEventListener("click", () => {
  playing = !playing;
  $("#playBtn").textContent = playing ? "⏯️ Pausar" : "▶️ Reanudar";
});

buildSlides();
startTimer();

/* =========================
   MÚSICA (opcional)
   ========================= */
const bgMusic = $("#bgMusic");
const toggleMusicBtn = $("#toggleMusicBtn");
const musicState = $("#musicState");
const musicLabel = $("#musicLabel");
let musicOn = false;

if(CONFIG.musicSrc){
  bgMusic.src = CONFIG.musicSrc;
  //musicLabel.textContent = "Lista (archivo: " + CONFIG.musicSrc + ")";
}else{
 // musicLabel.textContent = "Sin música configurada (opcional).";
}

function setMusic(on){
  musicOn = on;
  musicState.textContent = musicOn ? "ON" : "OFF";

  if(!CONFIG.musicSrc) return;

  if(musicOn){
    bgMusic.volume = 0.55;
    bgMusic.play().catch(()=>{});
  }else{
    bgMusic.pause();
  }
}

toggleMusicBtn.addEventListener("click", () => setMusic(!musicOn));

/* =========================
   CARTA DE AMOR
   ========================= */
$("#letterTitle").textContent = CONFIG.letterTitle;
$("#sigName").textContent = CONFIG.signature;
$("#sigDate").textContent = CONFIG.signatureDate;

$("#letterText").innerHTML = CONFIG.letter
  .map(p => `<p>${escapeHTML(p)}</p>`)
  .join("");

const envelope = $("#envelope");
$("#toggleLetterBtn").addEventListener("click", () => envelope.classList.toggle("open"));

/* =========================
   CONTADOR (años / meses / días)
   ========================= */
const start = new Date(CONFIG.startDate + "T00:00:00");

function calcDiffYMD(from, to){
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if(days < 0){
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if(months < 0){
    months += 12;
    years -= 1;
  }
  return { years, months, days };
}

function updateCounter(){
  const now = new Date();
  const diff = calcDiffYMD(start, now);

  const ms = now.getTime() - start.getTime();
  const totalDays = Math.floor(ms / (1000*60*60*24));

  $("#years").textContent = Math.max(0, diff.years);
  $("#months").textContent = Math.max(0, diff.years * 12 + diff.months); // meses totales
  $("#days").textContent = Math.max(0, totalDays);
}
updateCounter();
setInterval(updateCounter, 60_000);

/* =========================
   PROMESAS / METAS (tabs)
   ========================= */
const tabs = $("#tabs");
const promiseList = $("#promiseList");
let activeCat = 0;

function renderTabs(){
  tabs.innerHTML = "";
  CONFIG.promiseCategories.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "tab" + (i===activeCat ? " active" : "");
    b.textContent = c.name;
    b.addEventListener("click", () => {
      activeCat = i;
      renderTabs();
      renderPromises();
    });
    tabs.appendChild(b);
  });
}

function renderPromises(){
  promiseList.innerHTML = "";
  const cat = CONFIG.promiseCategories[activeCat];

  cat.items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "promise" + (it.done ? " done" : "");
    row.innerHTML = `
      <div>
        <b>${escapeHTML(it.title)}</b>
        <small>${escapeHTML(it.note || "")}</small>
      </div>
      <div class="check" title="Marcar / desmarcar"></div>
    `;
    row.addEventListener("click", () => {
      it.done = !it.done;
      renderPromises();
    });
    promiseList.appendChild(row);
  });
}

renderTabs();
renderPromises();

/* =========================
   SORPRESA FINAL (unlock)
   ========================= */
$("#hintText").textContent = CONFIG.secretHint;
$("#surpriseMessage").textContent = CONFIG.surpriseMessage;

if(CONFIG.surpriseVideoSrc){
  $("#surpriseVideoWrap").classList.remove("hidden");
  $("#surpriseVideo").src = CONFIG.surpriseVideoSrc;
}

function unlock(){
  const val = $("#secretInput").value.trim();
  const ok = val.toUpperCase() === String(CONFIG.secretCode).toUpperCase();

  if(ok){
    $("#surpriseContent").classList.remove("hidden");
    $("#unlockHint").textContent = "✨ Desbloqueado";
    $("#secretInput").value = "";
    $("#surpriseContent").scrollIntoView({ behavior:"smooth", block:"start" });
  }else{
    $("#unlockHint").textContent = "❌ Código incorrecto. Pista: " + CONFIG.secretHint;
  }
}

$("#unlockBtn").addEventListener("click", unlock);
$("#secretInput").addEventListener("keydown", (e) => {
  if(e.key === "Enter") unlock();
});
