/* Vexora Labs Christmas effects. No dependencies; safe decorative overlay. */
(() => {
  "use strict";
  if (window.__vexoraChristmasEffectsLoaded) return;
  window.__vexoraChristmasEffectsLoaded = true;

  const reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function addSantaHat() {
    const brand = document.querySelector(".site-brand");
    if (!brand || brand.querySelector(".vx-santa-hat")) return;
    const hat = document.createElement("span");
    hat.className = "vx-santa-hat";
    hat.setAttribute("aria-hidden", "true");
    const pom = document.createElement("span");
    pom.className = "vx-hat-pom";
    hat.appendChild(pom);
    brand.appendChild(hat);
  }

  function addLights() {
    if (document.getElementById("vx-christmas-lights")) return;
    const lights = document.createElement("div");
    lights.id = "vx-christmas-lights";
    lights.setAttribute("aria-hidden", "true");
    const count = window.innerWidth < 600 ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const bulb = document.createElement("span");
      bulb.className = "vx-light";
      bulb.style.left = `${(i / Math.max(count - 1, 1)) * 100}%`;
      bulb.style.animationDelay = `${(i % 7) * 0.19}s`;
      lights.appendChild(bulb);
    }
    document.body.appendChild(lights);
  }

  function addSnow() {
    if (reducedMotion || document.getElementById("vx-snow-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "vx-snow-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0, flakes = [], raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 600 ? 28 : 58;
      flakes = Array.from({length:count}, () => ({
        x:Math.random()*width, y:Math.random()*height,
        r:Math.random()*2.1+.7, speed:Math.random()*.65+.35,
        drift:(Math.random()-.5)*.35, opacity:Math.random()*.48+.28
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(235,244,255,${f.opacity})`;
        ctx.fill();
        f.y += f.speed;
        f.x += f.drift + Math.sin(f.y*.008)*.18;
        if (f.y > height+5) { f.y=-6; f.x=Math.random()*width; }
        if (f.x > width+5) f.x=-5;
        if (f.x < -5) f.x=width+5;
      }
      if (!document.hidden) raf = requestAnimationFrame(draw);
    }

    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    });
    window.addEventListener("resize", resize, {passive:true});
    resize();
    raf = requestAnimationFrame(draw);
  }

  function init() { addSantaHat(); addLights(); addSnow(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
