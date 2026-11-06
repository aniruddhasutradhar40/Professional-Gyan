/*!
 * Pop-up Advertisement (WhatsApp CTA)
 * - 2 সেকেন্ড পর দেখায়, ১০ সেকেন্ড পর অটো বন্ধ হয়
 * - Close (×) বাটন, Esc কী এবং ব্যাকগ্রাউন্ডে ক্লিক করলেও বন্ধ হয়
 * - পুরো পোস্টারে ক্লিক করলে WhatsApp চ্যাট খোলে (মেসেজ আগে থেকে লেখা)
 */
(function () {
  "use strict";

  var CONFIG = {
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjv3_9dunPEUeDjTLn-v-ehF6IoQXxk3U9dCTCO-SB9r85Dmy4Tmtk22IK5f7SJUPNP1cbeQb4SODtM1cz5pNBhd0X0G5_5BA8bHiWIclYeaaqFoXRxDUxTxnl2zmVn262eTvFnGycfBBEyhwKGeLRfRhrzzvFREUMPKWnyL3w0JZYH5pkuAKHXUlzA5mOM/s1402/LinkedIn%20Profile%20and%20ATS%20CV%20Service%20Banner.png",
    whatsappUrl: "https://wa.me/8801570219399",
    message:
      "আমি 950 টাকার মধ্যে ATS Friendly CV/Resume, LinkedIn Profile Making, Professional Website Making এবং LinkedIn Personal Branding E-book নিতে চাই। বিস্তারিত জানতে চাই।",
    showAfterMs: 2000,
    visibleForMs: 10000,
    altText: "ATS CV ও LinkedIn Profile সার্ভিস বিজ্ঞাপন"
  };

  if (window.__popupAdLoaded) return;
  window.__popupAdLoaded = true;

  var startTime = Date.now();
  var overlay = null;
  var hideTimer = null;
  var lastFocused = null;

  var css =
    ".pa-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;" +
    "padding:24px 20px;background:rgba(0,0,0,.6);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;" +
    "box-sizing:border-box}" +
    ".pa-overlay.pa-show{opacity:1;visibility:visible}" +
    ".pa-box{position:relative;display:inline-block;max-width:100%;line-height:0;transform:scale(.92);" +
    "transition:transform .3s ease}" +
    ".pa-overlay.pa-show .pa-box{transform:scale(1)}" +
    ".pa-link{display:block;cursor:pointer;border-radius:10px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.45);" +
    "background:#fff;-webkit-tap-highlight-color:transparent}" +
    ".pa-img{display:block;width:auto;height:auto;max-width:min(92vw,640px);max-height:80vh;object-fit:contain}" +
    ".pa-close{position:absolute;top:-14px;right:-14px;z-index:2;width:36px;height:36px;padding:0;border:2px solid #fff;" +
    "border-radius:50%;background:#e11d48;color:#fff;font:700 22px/1 Arial,sans-serif;cursor:pointer;" +
    "display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.4)}" +
    ".pa-close:hover{background:#be123c}" +
    ".pa-close:focus-visible{outline:3px solid #fff;outline-offset:2px}" +
    "@media (max-width:480px){.pa-overlay{padding:20px 16px}.pa-img{max-width:92vw;max-height:75vh}" +
    ".pa-close{top:-12px;right:-8px;width:34px;height:34px}}" +
    "@media (prefers-reduced-motion:reduce){.pa-overlay,.pa-box{transition:none}}";

  function addStyles() {
    var style = document.createElement("style");
    style.setAttribute("data-popup-ad", "");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function buildLink() {
    return CONFIG.whatsappUrl + "?text=" + encodeURIComponent(CONFIG.message);
  }

  function buildPopup(img) {
    overlay = document.createElement("div");
    overlay.className = "pa-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", CONFIG.altText);

    var box = document.createElement("div");
    box.className = "pa-box";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "pa-close";
    closeBtn.setAttribute("aria-label", "বিজ্ঞাপন বন্ধ করুন");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closePopup();
    });

    var link = document.createElement("a");
    link.className = "pa-link";
    link.href = buildLink();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.addEventListener("click", function () {
      closePopup();
    });

    img.className = "pa-img";
    img.alt = CONFIG.altText;
    img.decoding = "async";

    link.appendChild(img);
    box.appendChild(closeBtn);
    box.appendChild(link);
    overlay.appendChild(box);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePopup();
    });

    document.body.appendChild(overlay);
    return closeBtn;
  }

  function onKeydown(e) {
    if (e.key === "Escape" || e.key === "Esc") closePopup();
  }

  function showPopup(img) {
    if (overlay) return;
    lastFocused = document.activeElement;
    var closeBtn = buildPopup(img);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add("pa-show");
        try { closeBtn.focus({ preventScroll: true }); } catch (err) {}
      });
    });

    document.addEventListener("keydown", onKeydown);
    hideTimer = setTimeout(closePopup, CONFIG.visibleForMs);
  }

  function closePopup() {
    if (!overlay) return;
    clearTimeout(hideTimer);
    document.removeEventListener("keydown", onKeydown);

    var el = overlay;
    overlay = null;
    el.classList.remove("pa-show");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 350);

    if (lastFocused && typeof lastFocused.focus === "function") {
      try { lastFocused.focus({ preventScroll: true }); } catch (err) {}
    }
  }

  function init() {
    addStyles();

    var img = new Image();
    var imgReady = false;
    var timeReady = false;

    function tryShow() {
      if (imgReady && timeReady) showPopup(img);
    }

    img.onload = function () {
      imgReady = true;
      tryShow();
    };
    img.onerror = function () {};

    var wait = Math.max(0, CONFIG.showAfterMs - (Date.now() - startTime));
    setTimeout(function () {
      timeReady = true;
      tryShow();
    }, wait);

    img.src = CONFIG.imageUrl;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
