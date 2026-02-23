(() => {
  // 关闭开关：如果你想某些页面不飘，可以在 body 上加 data-no-sakura
  if (document.body && document.body.dataset && document.body.dataset.noSakura) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // 尊重系统“减少动画”设置

  // 创建画布层
  const canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  const resize = () => {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  // 参数（想更“花”就加数量）
  const COUNT = 28;          // 花瓣数量（建议 20~60）
  const WIND_BASE = 0.35;    // 风
  const GRAVITY = 0.6;       // 下落速度基准

  const petals = [];
  const rand = (a, b) => a + Math.random() * (b - a);

  function newPetal(spawnTop = true) {
    const size = rand(6, 14);
    return {
      x: rand(0, window.innerWidth),
      y: spawnTop ? rand(-window.innerHeight, 0) : rand(0, window.innerHeight),
      r: size,
      vy: rand(0.6, 1.4) * GRAVITY,
      vx: rand(-0.2, 0.8) + WIND_BASE,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      sway: rand(0.6, 1.2),
      sw: rand(0.8, 1.8),
      alpha: rand(0.55, 0.9),
    };
  }

  for (let i = 0; i < COUNT; i++) petals.push(newPetal(false));

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // 粉色花瓣（你站点是红粉系，配色很搭）
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    // 简易花瓣形状（两个贝塞尔）
    ctx.moveTo(0, -p.r * 0.6);
    ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.9, p.r * 1.1, p.r * 0.3, 0, p.r);
    ctx.bezierCurveTo(-p.r * 1.1, p.r * 0.3, -p.r * 0.9, -p.r * 0.9, 0, -p.r * 0.6);
    ctx.closePath();

    // 渐变：边缘更亮
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, p.r * 1.4);
    g.addColorStop(0, 'rgba(255, 215, 230, 1)');
    g.addColorStop(0.6, 'rgba(255, 160, 190, 0.9)');
    g.addColorStop(1, 'rgba(255, 130, 170, 0.0)');
    ctx.fillStyle = g;
    ctx.fill();

    ctx.restore();
  }

  let t = 0;
  function tick() {
    t += 0.016;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of petals) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(t * p.sway) * p.sw;
      p.rot += p.vr;

      drawPetal(p);

      // 出界重生
      if (p.y > window.innerHeight + 30 || p.x > window.innerWidth + 60) {
        Object.assign(p, newPetal(true));
        p.x = rand(-20, window.innerWidth + 20);
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
