/* I Chat — the Intelligence Express assistant.
 *
 * This runs entirely in the browser against a written knowledge base. It is
 * not a language model: a static page cannot hold an API key, so calling one
 * from here would mean publishing that key to every visitor. See the README
 * for the server-side proxy that would be needed to change that.
 *
 * The rule the answers follow: never invent a fact about the business. Prices,
 * transit times, insurance and opening hours are handed to WhatsApp or the
 * phone rather than guessed at.
 */
(function () {
  "use strict";

  var WHATSAPP = "https://wa.me/255690500000";
  var PHONE = "tel:+255690500000";

  /* ------------------------------------------------------------- knowledge */

  var UI = {
    sw: {
      welcome: "Habari! Mimi ni I Chat, msaidizi wa Intelligence Express. Naweza kukusaidia na huduma zetu, pickup, kufuatilia mzigo, au kukuunganisha na timu yetu.",
      fallback: "Samahani, sijaelewa vizuri. Naweza kukusaidia na: huduma, pickup, kufuatilia mzigo, kuhama, au maeneo tunayofika. Kwa jambo lingine lolote, nitakuunganisha na timu.",
      whatsapp: "Fungua WhatsApp",
      call: "Piga 0690 500 000",
      chips: ["Huduma zenu", "Pickup ni bure?", "Fuatilia mzigo", "Bei ni ngapi?", "Ongea na mtu"],
      trackAsk: "Nipe namba ya mzigo — mfano IE-4821.",
      trackFound: function (code, s, d) {
        return "Mzigo " + code + ":\n• Safari: " + s.route +
          "\n• Hali: " + d.status +
          "\n• Inatarajiwa: " + d.eta +
          "\n• Mpokeaji: " + s.receiver +
          "\n\nNimekuonyesha maelezo kamili kwenye ukurasa.";
      },
      trackMissing: "Namba hiyo haipo kwenye mfumo wa majaribio. Namba za majaribio ni: IE-4821, IE-7390, IE-1156, IE-2044, IE-6310, IE-9075. Kwa mzigo halisi, piga 0690 500 000."
    },
    en: {
      welcome: "Hello! I'm I Chat, the Intelligence Express assistant. I can help with our services, pickup, tracking a shipment, or connect you with our team.",
      fallback: "Sorry, I didn't quite catch that. I can help with: services, pickup, tracking a shipment, relocation, or where we deliver. For anything else, I'll connect you with the team.",
      whatsapp: "Open WhatsApp",
      call: "Call 0690 500 000",
      chips: ["Your services", "Is pickup free?", "Track a shipment", "How much does it cost?", "Talk to a person"],
      trackAsk: "Give me the tracking number — for example IE-4821.",
      trackFound: function (code, s, d) {
        return "Shipment " + code + ":\n• Route: " + s.route +
          "\n• Status: " + d.status +
          "\n• Expected: " + d.eta +
          "\n• Receiver: " + s.receiver +
          "\n\nI've opened the full detail on the page.";
      },
      trackMissing: "That number isn't in the demo system. The demo numbers are: IE-4821, IE-7390, IE-1156, IE-2044, IE-6310, IE-9075. For a real shipment, call 0690 500 000."
    }
  };

  // Each topic scores against the message; highest score answers.
  var TOPICS = [
    {
      id: "greeting",
      keys: ["habari", "hujambo", "mambo", "shikamoo", "niaje", "salama", "hello", "hi ", "hey", "good morning", "good evening"],
      sw: "Habari! Naweza kukusaidiaje leo? Uliza kuhusu huduma zetu, pickup, au fuatilia mzigo wako.",
      en: "Hello! How can I help today? Ask about our services, pickup, or track your shipment."
    },
    {
      id: "services",
      keys: ["huduma", "mnafanya", "unafanya", "service", "services", "offer", "what do you do", "msaada gani"],
      sw: "Tunafanya haya:\n• Cargo kwenda mikoani na kurudi Dar\n• Parcel na vifurushi\n• Door to door — tunachukua ulipo, tunafikisha alipo\n• Kuhama nyumba, ofisi au biashara\n• Delivery kwa maduka ya online\n• Nchi za jirani\n\nIpi unahitaji?",
      en: "Here's what we do:\n• Cargo to the regions and back to Dar\n• Parcels and packages\n• Door to door — we collect where you are and deliver where they are\n• Moving a home, office or business\n• Delivery for online shops\n• Neighbouring countries\n\nWhich one do you need?"
    },
    {
      id: "pickup",
      keys: ["pickup", "kuchukua", "chukua", "bure", "free", "collect", "njoo", "come to me", "mnakuja"],
      sw: "Ndiyo — pickup ni bure. Huna haja ya kuleta mzigo ofisini kwetu; tunakuja ulipo kuuchukua bila gharama yoyote ya ziada. Nipe eneo lako kwa WhatsApp tupange.",
      en: "Yes — pickup is free. You never have to bring the package to our office; we come to you and collect it at no extra cost. Send us your location on WhatsApp and we'll arrange it.",
      actions: ["whatsapp"]
    },
    {
      id: "price",
      keys: ["bei", "gharama", "pesa", "price", "cost", "how much", "ngapi", "charge", "malipo", "nauli", "quote"],
      sw: "Bei inategemea ukubwa wa mzigo, unakotoka na unakokwenda — sipendi kukupa namba ya kubahatisha. Tuma maelezo ya mzigo wako WhatsApp au piga 0690 500 000 upate bei ya uhakika.",
      en: "The price depends on the size of the load and the route, and I'd rather not guess a number at you. Send your shipment details on WhatsApp or call 0690 500 000 for a firm quote.",
      actions: ["whatsapp", "call"]
    },
    {
      id: "tracking",
      keys: ["fuatilia", "track", "tracking", "umefika", "where is", "iko wapi", "hali ya mzigo", "mzigo wangu", "status"],
      sw: "Nipe namba ya mzigo (mfano IE-4821) nikuonyeshe ilipofika.\n\nKumbuka: kufuatilia hapa ni mfumo wa majaribio kwa sasa — namba za majaribio pekee ndizo zinafanya kazi. Kwa mzigo halisi, piga 0690 500 000.",
      en: "Give me the tracking number (for example IE-4821) and I'll show you where it is.\n\nNote: tracking here is a demo for now — only the demo numbers work. For a real shipment, call 0690 500 000."
    },
    {
      id: "coverage",
      keys: ["mikoa", "mkoa", "region", "wapi", "where", "nchi", "jirani", "border", "kampala", "nairobi", "kigali", "mwanza", "arusha", "dodoma", "mbeya", "mtwara", "tanga", "deliver to"],
      sw: "Tunasafirisha kutoka Dar es Salaam kwenda mikoani, kutoka mikoani kuja Dar, na kwenda nchi za jirani kwa mizigo ya biashara. Niambie unatoka wapi na unakwenda wapi.",
      en: "We move goods from Dar es Salaam to the regions, from the regions back to Dar, and across to neighbouring countries for business consignments. Tell me where it's coming from and where it's going."
    },
    {
      id: "moving",
      keys: ["kuhama", "hama", "moving", "relocat", "nyumba", "house move", "office move", "furniture", "samani"],
      sw: "Ndiyo — tunahamisha nyumba, ofisi na biashara: kupakia, kusafirisha na kupakua. Tuambie una vitu vingi kiasi gani na unahamia wapi, tukupangie.",
      en: "Yes — we move homes, offices and businesses: loading, transport and unloading. Tell us roughly how much there is and where you're moving to, and we'll arrange it.",
      actions: ["whatsapp"]
    },
    {
      id: "business",
      keys: ["biashara", "business", "duka", "shop", "online", "wateja", "customer", "e-commerce", "instagram"],
      sw: "Kwa maduka ya online: tunachukua mzigo kwako na kumfikishia mteja wako, huku tukimjulisha hatua kwa hatua ili asikufuatilie wewe. Pia mteja wetu anapata free business consultation na support ya content.",
      en: "For online shops: we collect from you and deliver to your customer, keeping them updated step by step so they don't have to chase you. Our clients also get free business consultation and content support."
    },
    {
      id: "time",
      keys: ["muda", "siku ngapi", "how long", "lini", "when will", "days", "haraka", "urgent", "leo"],
      sw: "Muda unategemea safari na aina ya mzigo. Ili nisikupe jibu la kubahatisha, piga 0690 500 000 au tuma WhatsApp — watakwambia muda halisi wa safari yako.",
      en: "Transit time depends on the route and the load. Rather than guess, call 0690 500 000 or message us on WhatsApp and the team will give you the real timing for your route.",
      actions: ["whatsapp", "call"]
    },
    {
      id: "contact",
      keys: ["ofisi", "office", "address", "anwani", "kariakoo", "simu", "phone", "namba ya simu", "call you", "wasiliana", "contact", "location"],
      sw: "Ofisi zetu ziko Kariakoo, mtaa wa Likoma na Pemba, Dar es Salaam.\nSimu: 0690 500 000 na 0690 300 000.",
      en: "Our offices are in Kariakoo, on Likoma and Pemba streets, Dar es Salaam.\nPhone: 0690 500 000 and 0690 300 000.",
      actions: ["call", "whatsapp"]
    },
    {
      id: "safety",
      keys: ["usalama", "salama", "safe", "bima", "insurance", "kuvunjika", "damage", "kupotea", "lost", "fragile"],
      sw: "Tunashughulikia mzigo kwa uangalifu na tunakupa taarifa hatua kwa hatua mpaka mpokeaji apokee. Kwa maswali ya bima au mizigo maalum (fragile, ya thamani kubwa), piga 0690 500 000 wakueleze utaratibu kamili.",
      en: "We handle every load carefully and keep you updated step by step until the receiver has it. For insurance questions or special cargo (fragile or high value), call 0690 500 000 and the team will explain exactly how it works.",
      actions: ["call"]
    },
    {
      id: "human",
      keys: ["mtu", "human", "agent", "ongea na", "talk to", "binadamu", "msaidizi halisi", "customer care", "someone"],
      sw: "Sawa — timu yetu iko WhatsApp na kwenye simu, watakusaidia moja kwa moja.",
      en: "Of course — our team is on WhatsApp and on the phone, and they'll help you directly.",
      actions: ["whatsapp", "call"]
    },
    {
      id: "thanks",
      keys: ["asante", "shukrani", "thanks", "thank you", "nashukuru"],
      sw: "Karibu sana! Kama kuna kingine, niko hapa.",
      en: "You're very welcome! I'm here if anything else comes up."
    }
  ];

  /* ---------------------------------------------------------------- helpers */

  var lang = document.documentElement.lang === "en" ? "en" : "sw";
  var started = false;

  var launch = document.getElementById("ichat-launch");
  var panel = document.getElementById("ichat-panel");
  var log = document.getElementById("ichat-log");
  var chips = document.getElementById("ichat-chips");
  var form = document.getElementById("ichat-form");
  var input = document.getElementById("ichat-input");
  var closeBtn = document.getElementById("ichat-close");

  if (!launch || !panel || !log || !form || !input) return;

  function normalise(text) {
    return " " + String(text).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ") + " ";
  }

  function addMessage(text, who, actions) {
    var div = document.createElement("div");
    div.className = "ichat-msg from-" + who;
    div.textContent = text;

    (actions || []).forEach(function (kind) {
      div.appendChild(document.createElement("br"));
      var a = document.createElement("a");
      if (kind === "whatsapp") {
        a.href = WHATSAPP;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = UI[lang].whatsapp;
      } else {
        a.href = PHONE;
        a.textContent = UI[lang].call;
      }
      div.appendChild(a);
    });

    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function renderChips() {
    chips.textContent = "";
    UI[lang].chips.forEach(function (label) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", function () { send(label); });
      chips.appendChild(btn);
    });
  }

  /* ---------------------------------------------------------------- answers */

  function trackingCodeIn(text) {
    var m = String(text).toUpperCase().match(/IE[\s-]?(\d{4})/);
    return m ? "IE-" + m[1] : null;
  }

  function answerTracking(code) {
    var ships = window.IE_SHIPMENTS || {};
    var ship = ships[code];

    if (!ship) return { text: UI[lang].trackMissing, actions: ["call"] };

    if (typeof window.IE_TRACK === "function") window.IE_TRACK(code);
    var detail = ship[lang] || ship.sw;
    return { text: UI[lang].trackFound(code, ship, detail) };
  }

  function answer(text) {
    var code = trackingCodeIn(text);
    if (code) return answerTracking(code);

    var haystack = normalise(text);
    var best = null;
    var bestScore = 0;

    TOPICS.forEach(function (topic) {
      var score = 0;
      topic.keys.forEach(function (key) {
        if (haystack.indexOf(key) > -1) score += key.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = topic;
      }
    });

    if (!best) return { text: UI[lang].fallback, actions: ["whatsapp"] };
    return { text: best[lang], actions: best.actions };
  }

  /* ------------------------------------------------------------------ flow */

  function send(text) {
    var clean = String(text || "").trim();
    if (!clean) return;

    addMessage(clean, "user");
    input.value = "";

    var reply = answer(clean);
    window.setTimeout(function () {
      addMessage(reply.text, "bot", reply.actions);
    }, 280);
  }

  function open() {
    panel.hidden = false;
    launch.setAttribute("aria-expanded", "true");
    launch.hidden = true;

    if (window.matchMedia("(max-width: 560px)").matches) {
      document.body.classList.add("ichat-open");
    }

    if (!started) {
      started = true;
      addMessage(UI[lang].welcome, "bot");
      renderChips();
    }
    input.focus();
  }

  function close() {
    panel.hidden = true;
    launch.hidden = false;
    launch.setAttribute("aria-expanded", "false");
    document.body.classList.remove("ichat-open");
    launch.focus();
  }

  launch.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) close();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });

  // Follow the site's SW / EN toggle.
  document.addEventListener("ie:lang", function (e) {
    var next = e.detail && e.detail.lang === "en" ? "en" : "sw";
    if (next === lang) return;
    lang = next;
    if (started) {
      addMessage(UI[lang].welcome, "bot");
      renderChips();
    }
  });
})();
