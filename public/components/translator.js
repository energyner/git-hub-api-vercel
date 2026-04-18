/* translator.js logica - Maneja el Traductor*/
console.log("0.11- translator.js cargado");
let currentLang = "en";
let translating = false;

// 🔥 NUEVO: cache frontend
window.translationCache = window.translationCache || {};

const baseLang = document.documentElement.lang || "en";

console.log("0.20- BaseLang detectado:", baseLang);

/*------------------------------------------
🆕 0️⃣ FUNCIÓN GLOBAL PARA JS DINÁMICO
------------------------------------------*/
function t(text){

  try{

    if(!text) return text;

    if(currentLang === baseLang) return text;

    const normalized = text.trim().replace(/\s+/g," ");

    // 🔥 cache frontend
    if(window.translationCache[normalized]){
      return window.translationCache[normalized];
    }

    return text; // fallback

  }catch(e){

    console.warn("0.t-error:", e);
    return text;

  }

}

/*------------------------------------------
1️⃣ Cargar selector de idioma externo
------------------------------------------*/
async function loadLanguageSelector(){

  const container = document.getElementById("idioms-container");

  console.log("1.10- Container selector:", container);

  if(!container){
    console.warn("1.12- ❌ No existe #idioms-container");
    return;
  }

  try{

    console.log("1.24- Cargando selector de idioma");

    const res = await fetch("/assets/doc/idioms.html");   
  
    console.log("1.27- Respuesta fetch status:", res.status);

    const html = await res.text();

    console.log("1.29- Selector recibido:", html.length);

    container.innerHTML = html;

    console.log("1.33- Selector insertado");

  }catch(error){

    console.error("1.36- Error:",error);
    const fallback = await fetch("/assets/doc/idioms.html").catch(() => null);
    if(fallback && fallback.ok) container.innerHTML = await fallback.text();

  }

}

/*------------------------------------------
2️⃣ Traducción en lote
------------------------------------------*/
async function translateBatch(texts, lang){

  console.log("2.10 📤 Enviando a API:", { count: texts.length, lang });

  if(texts.length === 0) return {};

  try{

    const response = await fetch('/api/translate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, lang })
    });

    console.log("2.20 📡 Response status:", response.status);

    // 🔥 NUEVO: ver respuesta RAW si hay error
    if (!response.ok){

      let raw;
      try {
        raw = await response.text();
      } catch(e){
        raw = "No raw body";
      }

      console.error("2.25 ❌ API ERROR STATUS:", response.status);
      console.error("2.26 ❌ API ERROR BODY:", raw);

      return {};
    }

    let data;

    try{
      data = await response.json();
      console.log("2.30 ✅ JSON recibido:", Object.keys(data).length, "keys");
    }catch(e){
      console.error("2.31 ❌ Invalid JSON from API");
      return {};
    }

    // 🔥 cache frontend
    Object.keys(data).forEach(k=>{
      window.translationCache[k] = data[k];
    });

    return data;

  }catch(error){

    console.error("2.40 ❌ Network error:", error);
    return {};

  }
}

/*------------------------------------------
3️⃣ Traducir DOM (VERSIÓN CORREGIDA)
------------------------------------------*/
async function translatePage(lang) {

  if (translating) return;

  translating = true;
  currentLang = lang;

  try {

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodesToTranslate = [];
    const uniqueTexts = new Set();
    let node;

    const ignorePatterns = [
      /^\d+(\.\d+)+/,
      /^[\d\s\.\-\=\:\|]+$/,
      /^[A-Z0-9_\-]+$/
    ];

    // ============================================================
    // PRIMERA PASADA: Recopilar y preparar nodos
    // ============================================================
    while ((node = walker.nextNode())) {

      const parentNode = node.parentNode;
      if (!parentNode) continue;

      const raw = node.nodeValue;
      if (!raw || !raw.trim()) continue;

      const parentTag = parentNode.tagName;

      // Excluir etiquetas que no deben traducirse
      if (
        parentTag === "SCRIPT" ||
        parentTag === "STYLE" ||
        parentTag === "CODE" ||
        parentTag === "PRE" ||
        parentTag === "INPUT" ||
        parentTag === "TEXTAREA" ||
        parentTag === "SELECT"
      ) continue;

      // Excluir áreas especiales
      if (parentNode.closest("#idioms-container")) continue;
      if (parentNode.closest("form")) continue;

      // -----------------------------------------------------------------
      // 1. Guardar el texto original SIEMPRE en inglés (idioma base)
      // -----------------------------------------------------------------
      if (!node._originalText) {
        node._originalText = node.nodeValue;
      }

      // -----------------------------------------------------------------
      // 2. IMPORTANTE: Usar el texto ORIGINAL para identificar el menú
      // -----------------------------------------------------------------
      const originalText = node._originalText.trim();
      const isHamburgerMenu = parentNode.closest('nav') || 
                               parentNode.closest('.menu') || 
                               parentNode.closest('.hamburger') ||
                               parentNode.closest('[class*="menu"]') ||
                               parentNode.closest('[class*="nav"]') ||
                               parentNode.tagName === 'A'; // Links también
      
      // 🔥 CORREGIDO: Usar originalText en lugar de text
      const isTargetLink = originalText.includes("Home") || 
                           originalText.includes("Training") || 
                           originalText.includes("Books") || 
                           originalText.includes("Contact") ||
                           originalText.includes("Learning Management System");

      if (originalText.length < 3) continue;
      if (ignorePatterns.some(r => r.test(originalText))) continue;

      // Debug opcional
      if (isHamburgerMenu && isTargetLink) {
        console.log(`🔍 [DEBUG] Nodo menú encontrado: "${originalText}"`);
      }

      // -----------------------------------------------------------------
      // 3. Si cambió el idioma, restaurar el texto original
      // -----------------------------------------------------------------
      if (node._translatedLang !== lang) {
        node.nodeValue = node._originalText;
        node._translatedLang = null;
      }

      // -----------------------------------------------------------------
      // 4. Si es el idioma base, restaurar original y saltar
      // -----------------------------------------------------------------
      if (lang === baseLang) {
        node.nodeValue = node._originalText;
        node._translatedLang = lang;
        continue;
      }

      // -----------------------------------------------------------------
      // 5. Si ya está traducido a este idioma, saltar
      // -----------------------------------------------------------------
      if (node._translatedLang === lang) {
        continue;
      }

      // -----------------------------------------------------------------
      // 6. Normalizar texto para cache/búsqueda (usando original)
      // -----------------------------------------------------------------
      const normalized = originalText.trim().replace(/\s+/g, " ");
      const cacheKey = `${lang}|${normalized}`;

      // -----------------------------------------------------------------
      // 7. Verificar cache ANTES de agregar a la cola
      // -----------------------------------------------------------------
      if (window.translationCache[cacheKey]) {
        node.nodeValue = window.translationCache[cacheKey];
        node._translatedLang = lang;
        continue;
      }

      // -----------------------------------------------------------------
      // 8. Si llegamos aquí, necesita traducción
      // -----------------------------------------------------------------
      nodesToTranslate.push({
        node: node,
        originalText: normalized,
        cacheKey: cacheKey
      });

      uniqueTexts.add(normalized);
    }

    // ============================================================
    // SEGUNDA PASADA: Traducir textos únicos vía API
    // ============================================================
    const textsArray = Array.from(uniqueTexts);

    console.log("3.200 📦 Textos únicos a traducir:", textsArray.slice(0, 5));
    console.log("3.201 📊 Total textos únicos:", textsArray.length);

    let translations = {};

    if (textsArray.length > 0) {
      console.log("3.210 🚀 Llamando API...");
      translations = await translateBatch(textsArray, lang);
    }

    // ============================================================
    // TERCERA PASADA: Aplicar traducciones a los nodos
    // ============================================================
    let appliedCount = 0;

    for (const item of nodesToTranslate) {

      const translatedText = 
        translations[item.originalText] || 
        window.translationCache[item.cacheKey];

      if (translatedText) {
        item.node.nodeValue = translatedText;
        item.node._translatedLang = lang;
        window.translationCache[item.cacheKey] = translatedText;
        appliedCount++;
      }
    }

    // ============================================================
    // REPORTE FINAL
    // ============================================================
    const coverage = nodesToTranslate.length > 0
      ? ((appliedCount / nodesToTranslate.length) * 100).toFixed(1)
      : "100";

    console.log(`🌐 Traducción aplicada: ${appliedCount} de ${nodesToTranslate.length}`);
    console.log(`📊 Cobertura real: ${coverage}%`);

  } catch (error) {
    console.error("❌ translatePage error:", error);
  } finally {
    translating = false;
  }
}



/*------------------------------------------
4️⃣ Configurar selector
------------------------------------------*/
function initLanguageSwitcher(lang){

  console.log("4.132- Init:",lang);

  const switcher = document.getElementById("languageSwitcher");

  if(!switcher){
    console.warn("4.135- ❌ No switcher");
    return;
  }

  switcher.value = lang;

  switcher.addEventListener("change",function(){

    const selected = this.value;

    console.log("4.142- Cambio detectado");

    localStorage.setItem("site_lang",selected);

    translatePage(selected);

    console.log("4.148- Idioma:",selected);

  });

}

/*------------------------------------------
5️⃣ Detectar idioma
------------------------------------------*/
function detectLanguage(){

  let lang = localStorage.getItem("site_lang");

  console.log("5.205:",lang);

  if(!lang) lang = document.documentElement.lang;
  if(!lang) lang = navigator.language;

  if (lang) {
  lang = lang.toLowerCase();

  // manejar chino correctamente
  if (lang.startsWith("zh")) {
    if (lang.includes("tw")) {
      lang = "zh-TW"; // tradicional
    } else {
      lang = "zh-CN"; // simplificado
    }
  } else {
    // otros idiomas → solo código base
    lang = lang.split("-")[0];
  }
}

  const supported = ["es","en","pt","fr","it","de","ru","hi","zh-CN","zh-TW"];

  if(!supported.includes(lang)){
    console.warn("5.230- fallback EN");
    lang = "en";
  }

  console.log("5.235:",lang);

  return lang;

}

/*------------------------------------------
6️⃣ Observer dinámico
------------------------------------------*/
function observeDynamicContent(){

  console.log("6.181- Observer ON");

  const observer = new MutationObserver((mutations)=>{

    if(translating) return;
    if(currentLang === baseLang) return;

    let shouldTranslate = false;

    mutations.forEach(m=>{
      if(m.addedNodes && m.addedNodes.length>0){
        shouldTranslate = true;
      }
    });

    if(shouldTranslate){
      console.log("6.185- DOM dinámico detectado");
      translatePage(currentLang);
    }

  });

  observer.observe(document.body,{
    childList:true,
    subtree:true
  });

}

/*------------------------------------------
7️⃣ Init
------------------------------------------*/
document.addEventListener("DOMContentLoaded",async()=>{

  console.log("7.205- INIT");

  await loadLanguageSelector();

  const lang = detectLanguage();

  initLanguageSwitcher(lang);

  if(lang !== baseLang){
    translatePage(lang);
  }

  observeDynamicContent();

});

