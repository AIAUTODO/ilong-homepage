/* iLONG 工具页公共脚本：语言切换 + 公共小工具 */
(function(){
  window.IlongTools = window.IlongTools || {};

  // ---------- 语言切换 ----------
  var lang = "en";
  try { lang = localStorage.getItem("portal-lang") || "en"; } catch(e) {}

  function apply(l){
    lang = l;
    document.documentElement.lang = (l === "zh" ? "zh-CN" : "en");
    var nodes = document.querySelectorAll("[data-zh]");
    for (var i = 0; i < nodes.length; i++){
      var v = nodes[i].getAttribute("data-" + l);
      if (v !== null) nodes[i].textContent = v;
    }
    var ph = document.querySelectorAll("[data-ph-zh]");
    for (var j = 0; j < ph.length; j++){
      var p = ph[j].getAttribute("data-ph-" + l);
      if (p !== null) ph[j].setAttribute("placeholder", p);
    }
    var btns = document.querySelectorAll(".lang button");
    for (var k = 0; k < btns.length; k++){
      btns[k].classList.toggle("on", btns[k].getAttribute("data-lang") === l);
    }
    try { localStorage.setItem("portal-lang", l); } catch(e) {}
    if (typeof window.onLangChange === "function") window.onLangChange(l);
  }

  window.IlongTools.lang = function(){ return lang; };
  window.IlongTools.apply = apply;

  document.addEventListener("DOMContentLoaded", function(){
    var saved = "en";
    try { saved = localStorage.getItem("portal-lang") || "en"; } catch(e) {}
    apply(saved);
    var btns = document.querySelectorAll(".lang button");
    for (var i = 0; i < btns.length; i++){
      btns[i].addEventListener("click", function(){ apply(this.getAttribute("data-lang")); });
    }
  });

  // ---------- 工具函数 ----------
  // 复制到剪贴板
  window.IlongTools.copy = function(text, btn){
    function done(ok){
      if (!btn) return;
      var old = btn.getAttribute("data-label") || btn.textContent;
      if (!btn.getAttribute("data-label")) btn.setAttribute("data-label", old);
      btn.textContent = ok ? (lang === "zh" ? "已复制" : "Copied") : (lang === "zh" ? "失败" : "Failed");
      setTimeout(function(){ btn.textContent = btn.getAttribute("data-label"); }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ done(true); }, function(){ done(false); });
    } else {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy");
        document.body.removeChild(ta); done(true);
      } catch(e){ done(false); }
    }
  };

  // 下载文件
  window.IlongTools.download = function(content, filename, mime){
    var blob = new Blob([content], {type: mime || "text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  };
})();
