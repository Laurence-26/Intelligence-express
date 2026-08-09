/* Intelligence Express — site behaviour
   - Swahili / English switching
   - Shipment tracking (demo dataset, no backend)
   - Pickup form -> pre-filled WhatsApp message
   - Mobile navigation + booking modal
*/
(function () {
  "use strict";

  var WHATSAPP = "https://wa.me/255690500000";
  var STORAGE_KEY = "ie-lang";

  /* ------------------------------------------------------------------ copy */

  var COPY = {
    sw: {
      docTitle: "Intelligence Express — Usafirishaji wa mizigo Dar es Salaam na mikoani",
      skipLink: "Nenda kwenye maudhui",
      navServices: "Huduma", navWhy: "Kwa nini sisi", navTeam: "Timu", navContact: "Wasiliana",
      navCta: "Tuma mzigo",

      heroBadge: "Dar es Salaam · Mikoani · Nchi za jirani",
      heroTitle: "Hatubebi tu mizigo — tunabeba na biashara yako.",
      heroBody: "Usafirishaji wa cargo, parcels na bidhaa za biashara, pamoja na huduma za kuhamisha ofisi, biashara au makazi. Huna haja ya kuleta mzigo kwetu — sisi tunakufuata ulipo.",
      ctaBook: "Panga pickup",
      ctaWhatsapp: "WhatsApp",
      ctaCall: "Piga 0690 500 000",
      heroCardTitle: "Pickup ni bure",
      heroCardBody: "Tunakuja ulipo kuchukua mzigo bila gharama yoyote ya ziada.",
      stat1K: "7+", stat1V: "Miaka ya uzoefu",
      stat2K: "Door to door", stat2V: "Kuchukua na kufikisha",
      stat3K: "Hatua kwa hatua", stat3V: "Taarifa za mzigo",

      trackLabel: "Fuatilia mzigo",
      trackTitle: "Mzigo wako umefika wapi?",
      trackHint: "Jaribu: IE-4821, IE-7390 au IE-1156",
      trackBtn: "Fuatilia",
      trackNotFound: "Namba hii haipo kwenye mfumo. Piga 0690 500 000 tukusaidie.",
      trackRoute: "Safari", trackStatus: "Hali", trackReceiver: "Mpokeaji",

      svcLabel: "Huduma zetu",
      svcTitle: "Wewe uza, sisi tutadeliver.",
      svcBody: "Intelligence Express ipo kwa ajili ya mfanyabiashara anayetuma bidhaa, mtu anayepokea mzigo kutoka kwa supplier, na kila mtu anayethamini usalama, uharaka, uaminifu na gharama nafuu.",
      svc1Title: "Cargo mikoani", svc1Body: "Mizigo mikubwa kutoka Dar es Salaam kwenda mikoani na kutoka mikoani kuja Dar.",
      svc2Title: "Parcel na vifurushi", svc2Body: "Kutuma parcel ndogo au vifurushi kwa usalama na kwa muda uliopangwa.",
      svc3Title: "Door to door", svc3Body: "Tunachukua mzigo ulipo na kumfikishia mpokeaji hasa alipo.",
      svc4Title: "Kuhama", svc4Body: "Kuhamisha nyumba, ofisi au biashara — kupakia, kusafirisha na kupakua.",
      svc5Title: "Delivery ya biashara", svc5Body: "Kwa maduka ya online: mzigo unatoka kwako na kumfikia mteja kwa experience nzuri.",
      svc6Title: "Nchi za jirani", svc6Body: "Usafirishaji kwenda nchi za jirani kwa mizigo ya biashara.",

      pickupLabel: "Sehemu nzuri zaidi",
      pickupTitle: "Huna haja ya kuleta mzigo kwetu.",
      pickupBody: "Sisi tunakufuata ulipo na kuuchukua bila gharama yoyote ya ziada. Tukufuate mzigo wako popote ulipo na kuufikisha kwa usalama, uharaka na uaminifu mkubwa.",
      pickupCta: "Tuambie ulipo",
      pick1: "Unatuma bidhaa kwa wateja wako",
      pick2: "Unapokea mzigo kutoka kwa supplier wako",
      pick3: "Unahitaji kutuma parcel au kusafirisha vifurushi",
      pick4: "Unahama nyumba au ofisi",
      pick5: "Unahitaji door to door delivery",

      whyLabel: "Delivery ni sehemu ya customer experience",
      whyTitle: "Pale wafanyabiashara wengi wanapokosea.",
      whyBody1: "Unaweza kuongea na mteja vizuri sana wakati wa kumuuzia, akakuamini, akatuma pesa na kulipia bidhaa — lakini kama mtu wa delivery anampelekea mzigo kama anamrushia, ile experience nzuri yote uliyoijenga inaishia hapo.",
      whyBody2: "Mbaya zaidi, mteja tayari ameshakulipa lakini bado analazimika kufanya kazi ya ziada:",
      q1: "“Mzigo wangu umetoka?”",
      q2: "“Umefika wapi?”",
      q3: "“Utafika saa ngapi?”",
      q4: "“Nimpigie nani?”",
      whyQuote: "Mteja wako hatakiwi kuwa tracking system ya mzigo wake mwenyewe.",

      flowLabel: "Ndiyo sababu tukaleta Intelligence Express",
      flowTitle: "Hatua kwa hatua, mpaka mzigo unapopokelewa.",
      flowBody: "Hatujali tu kuhusu mzigo wako — tunajali pia biashara yako na experience anayopata mteja wako.",
      step1Title: "Ukituma mzigo", step1Body: "Tunawasiliana na mpokeaji kumjulisha kwamba mzigo umetoka.",
      step2Title: "Mzigo ukifika", step2Body: "Tunawasiliana naye tena kumfahamisha kuwa mzigo umefika.",
      step3Title: "Delivery mpaka alipo", step3Body: "Akitaka kufikishiwa alipo, tunamfikishia.",
      step4Title: "Hakufuatilii wewe", step4Body: "Hatakiwi kukufuatilia kila dakika, wala kuhangaika kufuatilia mzigo aliolipia.",

      valueTitle: "Zaidi ya usafirishaji",
      valueBody: "Tunajali mzigo wako, lakini tunajali zaidi biashara yako — kwa sababu biashara yako ikikua na sisi tunakua.",
      value1: "Nafasi ya kufikiwa na wateja wengi zaidi kupitia platform zetu",
      value2: "Free business consultation kwa uzoefu wa zaidi ya miaka saba",
      value3: "Support kwenye ukuaji wa biashara",
      value4: "Free high quality content creation na collaboration",

      teamLabel: "Timu yetu",
      teamTitle: "Watu wanaobeba mzigo wako.",
      teamBody: "Baada ya muda mrefu wa kufanya operations offline, leo tunaanza rasmi safari mpya. Karibu kwenye mapinduzi ya usafirishaji.",
      teamCardTitle: "Mteja ni mfalme, mteja ni boss.",
      teamCardBody: "Kila mzigo unaotoka kwenye biashara yako umfikie mteja kwa experience inayolingana na namna unavyotaka biashara yako ikumbukwe.",

      contactLabel: "Wasiliana nasi",
      contactTitle: "Tuko Kariakoo. Tunakufuata ulipo.",
      contactBody: "Piga simu, tuma WhatsApp, au jaza fomu na tutakupigia kupanga pickup.",
      contactOffice: "Ofisi zetu", contactStreets: "Mtaa wa Likoma na Pemba", contactPhones: "Simu",

      formTitle: "Panga pickup",
      formBody: "Tupe taarifa za mzigo wako, tunakuja kuchukua bila malipo ya ziada.",
      fName: "Jina lako", fPhone: "Namba ya simu", fFrom: "Mzigo unatoka", fTo: "Unakwenda", fItem: "Aina ya mzigo",
      formSubmit: "Tuma kwa WhatsApp",
      formNote: "Fomu hii inafungua WhatsApp na taarifa zako tayari zimeandikwa.",
      modalTitle: "Panga pickup",
      modalBody: "Jaza taarifa hizi, tunakupigia kuthibitisha.",
      footerSlogan: "Tunabeba zaidi ya mzigo — tunabeba reputation ya biashara yako."
    },

    en: {
      docTitle: "Intelligence Express — Cargo and parcel delivery from Dar es Salaam",
      skipLink: "Skip to content",
      navServices: "Services", navWhy: "Why us", navTeam: "Team", navContact: "Contact",
      navCta: "Send a package",

      heroBadge: "Dar es Salaam · Regions · Neighbouring countries",
      heroTitle: "We don't just carry cargo — we carry your business.",
      heroBody: "Cargo, parcels and business deliveries, plus office, business and home relocation. You never have to bring the package to us — we come to you.",
      ctaBook: "Book a pickup",
      ctaWhatsapp: "WhatsApp",
      ctaCall: "Call 0690 500 000",
      heroCardTitle: "Pickup is free",
      heroCardBody: "We come to wherever you are and collect the package at no extra cost.",
      stat1K: "7+", stat1V: "Years of experience",
      stat2K: "Door to door", stat2V: "Collection and delivery",
      stat3K: "Step by step", stat3V: "Shipment updates",

      trackLabel: "Track a shipment",
      trackTitle: "Where is your package?",
      trackHint: "Try: IE-4821, IE-7390 or IE-1156",
      trackBtn: "Track",
      trackNotFound: "We can't find that number. Call 0690 500 000 and we'll help.",
      trackRoute: "Route", trackStatus: "Status", trackReceiver: "Receiver",

      svcLabel: "Our services",
      svcTitle: "You sell. We deliver.",
      svcBody: "Intelligence Express is for the trader sending goods, the buyer receiving from a supplier, and anyone who values safety, speed, reliability and fair pricing.",
      svc1Title: "Upcountry cargo", svc1Body: "Large loads from Dar es Salaam to the regions, and from the regions back to Dar.",
      svc2Title: "Parcels and packages", svc2Body: "Small parcels and packages moved safely and on the agreed schedule.",
      svc3Title: "Door to door", svc3Body: "We collect where you are and deliver exactly where the receiver is.",
      svc4Title: "Relocation", svc4Body: "Moving a home, office or business — loading, transport and unloading.",
      svc5Title: "Business delivery", svc5Body: "For online shops: goods leave you and reach your customer with the right experience.",
      svc6Title: "Neighbouring countries", svc6Body: "Cross-border transport for business consignments.",

      pickupLabel: "The best part",
      pickupTitle: "You never bring the package to us.",
      pickupBody: "We come to you and collect it at no extra cost, then deliver it safely, quickly and reliably — wherever you are.",
      pickupCta: "Tell us where you are",
      pick1: "You send goods to your customers",
      pick2: "You receive cargo from your supplier",
      pick3: "You need to send a parcel or packages",
      pick4: "You are moving house or office",
      pick5: "You need door to door delivery",

      whyLabel: "Delivery is part of customer experience",
      whyTitle: "Where most businesses get it wrong.",
      whyBody1: "You can talk to a customer beautifully while selling, earn their trust and take their money — but if the delivery person tosses the package at them, every bit of that good experience ends right there.",
      whyBody2: "Worse still, the customer has already paid you and yet is left doing extra work:",
      q1: "“Has my package left?”",
      q2: "“Where has it reached?”",
      q3: "“What time will it arrive?”",
      q4: "“Who do I call?”",
      whyQuote: "Your customer should not have to be the tracking system for their own package.",

      flowLabel: "That is why we built Intelligence Express",
      flowTitle: "Step by step, until the package is received.",
      flowBody: "We don't only care about your cargo — we care about your business and the experience your customer gets.",
      step1Title: "You send it", step1Body: "We contact the receiver to let them know the package is on its way.",
      step2Title: "It arrives", step2Body: "We contact them again to confirm the package has arrived.",
      step3Title: "Delivered to them", step3Body: "If they want it brought to their door, we bring it.",
      step4Title: "No chasing you", step4Body: "They never have to call you every minute or chase a package they already paid for.",

      valueTitle: "More than transport",
      valueBody: "We care about your cargo, but we care more about your business — because when your business grows, we grow.",
      value1: "Reach more customers through our platforms",
      value2: "Free business consultation from over seven years of experience",
      value3: "Support as your business grows",
      value4: "Free high quality content creation and collaboration",

      teamLabel: "Our team",
      teamTitle: "The people carrying your cargo.",
      teamBody: "After a long time operating offline, today we formally begin a new journey. Welcome to a new way of moving cargo.",
      teamCardTitle: "The customer is king. The customer is boss.",
      teamCardBody: "Every package that leaves your business should reach your customer with an experience that matches how you want your business remembered.",

      contactLabel: "Contact us",
      contactTitle: "We're in Kariakoo. We come to you.",
      contactBody: "Call, send a WhatsApp, or fill the form and we'll ring you to arrange the pickup.",
      contactOffice: "Our offices", contactStreets: "Likoma and Pemba streets", contactPhones: "Phone",

      formTitle: "Book a pickup",
      formBody: "Give us your shipment details and we'll collect it at no extra cost.",
      fName: "Your name", fPhone: "Phone number", fFrom: "Collect from", fTo: "Deliver to", fItem: "What are we carrying",
      formSubmit: "Send via WhatsApp",
      formNote: "This opens WhatsApp with your details already written.",
      modalTitle: "Book a pickup",
      modalBody: "Fill this in and we'll call you to confirm.",
      footerSlogan: "We carry more than cargo — we carry your business's reputation."
    }
  };

  /* ------------------------------------------------- demo shipment dataset */

  var SHIPMENTS = {
    "IE-4821": {
      route: "Dar es Salaam → Mwanza",
      receiver: "Neema S.",
      sw: {
        status: "Njiani",
        events: [
          { title: "Mzigo umepokelewa kwa mtumaji", meta: "Kariakoo, Dar es Salaam · 07:40" },
          { title: "Umeingia kwenye gari la mikoani", meta: "Hub ya Kariakoo · 09:15" },
          { title: "Njiani kwenda Mwanza", meta: "Imepita Singida · 18:20" },
          { title: "Mpokeaji ameshajulishwa", meta: "SMS na simu · 18:25" }
        ]
      },
      en: {
        status: "In transit",
        events: [
          { title: "Collected from sender", meta: "Kariakoo, Dar es Salaam · 07:40" },
          { title: "Loaded for upcountry", meta: "Kariakoo hub · 09:15" },
          { title: "On the road to Mwanza", meta: "Passed Singida · 18:20" },
          { title: "Receiver notified", meta: "SMS and call · 18:25" }
        ]
      }
    },
    "IE-7390": {
      route: "Dar es Salaam → Arusha",
      receiver: "Duka la Baraka",
      sw: {
        status: "Imefikishwa",
        events: [
          { title: "Mzigo umepokelewa kwa mtumaji", meta: "Ilala · 08:05" },
          { title: "Umefika Arusha", meta: "Ofisi ya Arusha · 06:10" },
          { title: "Mpokeaji ameshajulishwa", meta: "Simu · 06:15" },
          { title: "Imefikishwa mpaka alipo", meta: "Sokoni II, Arusha · 11:30" }
        ]
      },
      en: {
        status: "Delivered",
        events: [
          { title: "Collected from sender", meta: "Ilala · 08:05" },
          { title: "Arrived in Arusha", meta: "Arusha office · 06:10" },
          { title: "Receiver notified", meta: "Phone call · 06:15" },
          { title: "Delivered to the door", meta: "Sokoni II, Arusha · 11:30" }
        ]
      }
    },
    "IE-1156": {
      route: "Mbeya → Dar es Salaam",
      receiver: "Hamisi J.",
      sw: {
        status: "Imechukuliwa",
        events: [
          { title: "Ombi la pickup limepokelewa", meta: "WhatsApp · 14:02" },
          { title: "Mzigo umechukuliwa ulipo", meta: "Mbeya mjini · 16:40" },
          { title: "Inasubiri gari la Dar", meta: "Hub ya Mbeya · 17:10" }
        ]
      },
      en: {
        status: "Collected",
        events: [
          { title: "Pickup request received", meta: "WhatsApp · 14:02" },
          { title: "Collected from your location", meta: "Mbeya town · 16:40" },
          { title: "Awaiting the Dar vehicle", meta: "Mbeya hub · 17:10" }
        ]
      }
    }
  };

  /* ---------------------------------------------------------------- helpers */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var state = {
    lang: "sw",
    foundCode: null
  };

  /* --------------------------------------------------------------- language */

  function storedLang() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storeLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  // Swahili is the default for everyone; English is only shown once chosen.
  function initialLang() {
    var saved = storedLang();
    return saved === "en" ? "en" : "sw";
  }

  function applyLang(lang) {
    var t = COPY[lang];
    if (!t) return;
    state.lang = lang;

    document.documentElement.lang = lang;
    document.title = t.docTitle;

    $$("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });

    $$("[data-placeholder-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-placeholder-i18n");
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    $$(".lang-toggle button").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    if (state.foundCode) renderShipment(state.foundCode);
    storeLang(lang);
  }

  /* --------------------------------------------------------------- tracking */

  function renderShipment(code) {
    var ship = SHIPMENTS[code];
    var result = $("#track-result");
    if (!ship || !result) return;

    var detail = ship[state.lang] || ship.sw;

    $("#track-route").textContent = ship.route;
    $("#track-status").textContent = detail.status;
    $("#track-receiver").textContent = ship.receiver;

    var list = $("#track-events");
    list.textContent = "";

    detail.events.forEach(function (ev) {
      var li = document.createElement("li");

      var rail = document.createElement("span");
      rail.className = "timeline-rail";
      var dot = document.createElement("span");
      dot.className = "timeline-dot";
      var line = document.createElement("span");
      line.className = "timeline-line";
      rail.appendChild(dot);
      rail.appendChild(line);

      var body = document.createElement("div");
      var title = document.createElement("div");
      title.className = "timeline-title";
      title.textContent = ev.title;
      var meta = document.createElement("div");
      meta.className = "timeline-meta";
      meta.textContent = ev.meta;
      body.appendChild(title);
      body.appendChild(meta);

      li.appendChild(rail);
      li.appendChild(body);
      list.appendChild(li);
    });

    result.hidden = false;
  }

  function initTracking() {
    var form = $("#track-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = ($("#track-input").value || "").trim().toUpperCase();
      var hit = Object.prototype.hasOwnProperty.call(SHIPMENTS, code) ? code : null;

      state.foundCode = hit;
      $("#track-error").hidden = !(code.length > 0 && !hit);
      $("#track-result").hidden = !hit;

      if (hit) renderShipment(hit);
    });
  }

  /* ------------------------------------------------------------------ forms */

  function initForms() {
    $$("[data-pickup-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;

        var t = COPY[state.lang];
        var data = new FormData(form);
        var val = function (k) { return (data.get(k) || "").toString().trim() || "-"; };

        var lines = [
          t.modalTitle + " — Intelligence Express",
          t.fName + ": " + val("name"),
          t.fPhone + ": " + val("phone"),
          t.fFrom + ": " + val("from"),
          t.fTo + ": " + val("to"),
          t.fItem + ": " + val("item")
        ];

        window.open(WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      });
    });
  }

  /* ------------------------------------------------------------------ modal */

  function initModal() {
    var modal = $("#pickup-modal");
    if (!modal) return;
    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      var first = modal.querySelector("input, textarea, button");
      if (first) first.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    $$("[data-open-modal]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });

    $$("[data-close-modal]", modal).forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    // Keep focus inside the dialog while it is open.
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusable = $$("button, input, textarea, a[href]", modal).filter(function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* -------------------------------------------------------------- mobile nav */

  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------- init */

  function init() {
    $$(".lang-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });

    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    initNav();
    initTracking();
    initForms();
    initModal();
    applyLang(initialLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
