const { useEffect, useMemo } = React;

function startHeartsCanvas() {
  const canvas = document.getElementById("hearts-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const hearts = [];
  const MAX = 120;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnHeart(initial = false) {
    if (hearts.length >= MAX) return;

    const size = rand(10, 26);
    const x = rand(0, w);
    const y = initial ? rand(0, h) : rand(-h * 0.2, -40);
    const speed = rand(0.7, 2.4);
    const sway = rand(0.8, 2.2);
    const swayPhase = rand(0, Math.PI * 2);
    const rot = rand(-0.6, 0.6);
    const rotSpeed = rand(-0.01, 0.01);
    const alpha = rand(0.35, 0.85);

    hearts.push({ x, y, size, speed, sway, swayPhase, rot, rotSpeed, alpha });
  }

  for (let i = 0; i < 70; i++) spawnHeart(true);

  function drawHeart(x, y, size, rotation, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    const g = ctx.createLinearGradient(-size, -size, size, size);
    g.addColorStop(0, "rgba(255, 59, 106, 0.95)");
    g.addColorStop(1, "rgba(255, 107, 107, 0.85)");
    ctx.fillStyle = g;

    ctx.beginPath();
    const s = size;
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(s * 0.9, -s * 0.25, s * 0.95, s * 0.9, 0, s * 1.2);
    ctx.bezierCurveTo(-s * 0.95, s * 0.9, -s * 0.9, -s * 0.25, 0, s * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "rgba(255, 59, 106, 0.35)";
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.restore();
  }

  let raf = 0;
  function tick(t) {
    ctx.clearRect(0, 0, w, h);

    if (hearts.length < 90 && Math.random() < 0.35) spawnHeart(false);
    if (hearts.length < 120 && Math.random() < 0.15) spawnHeart(false);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const p = hearts[i];
      p.y += p.speed;
      p.rot += p.rotSpeed;

      const swayX = Math.sin((t / 1000) * p.sway + p.swayPhase) * 0.9;
      const x = p.x + swayX * 12;

      drawHeart(x, p.y, p.size, p.rot, p.alpha);

      if (p.y > h + 60) hearts.splice(i, 1);
    }

    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

function App() {
  const headerLeftImage = "src/Photo-ronde-droite.jpg";
  const headerRightImage = "src/Photo-ronde-gauche.jpg";

  const title = "À notre Saint Valentin";
  const subtitle =
    "Un petit endroit rien qu’à nous, pour revivre notre histoire 🥰";

  const badges = useMemo(
    () => ["Nos souvenirs ✨", "Nos photos 📸", "Toi & moi ❤️"],
    []
  );

  const chapters = useMemo(
    () => [
      {
        title: "Le début de notre amour",
        text:
          "Le jour où tout a commencé. J’aime repenser à ce moment et me dire qu'on a eu tellement de chance de se rencontrer 😍",
        images: ["src/photo 1.jpg"],
      },
      {
        title: "Chapitre 2 — Nos premiers souvenirs",
        text:
          "Nos premières habitudes, nos rires, nos petits trucs à nous… et cette évidence : j’étais bien, avec toi.",
        images: ["src/photo 2.jpg", "src/photo 3.jpg", "src/photo 4.jpg", "src/c2-4.jpg"],
      },
      {
        title: "Chapitre 3 — Aujourd’hui",
        text:
          "Je te choisis, chaque jour. Pour ce que tu es, pour ce que tu m’apportes, et pour tout ce qu’on construit.",
        images: ["src/c3-1.jpg", "src/c3-2.jpg"],
      },
    ],
    []
  );

  const finalMessage =
    "Je te souhaite une bonne Saint Valentin ma chérie, merci d’exister et de faire partie de ma vie. Je t’aime ❤️";

  useEffect(() => {
    const cleanup = startHeartsCanvas();
    return cleanup;
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <div className="hero-top">
          <div className="avatar">
            <img src={headerLeftImage} alt="Nous (gauche)" />
          </div>

          <div className="hero-center">
            <h1>
              {title} <span className="heart">❤️</span>
            </h1>
            <p>{subtitle}</p>

            <div className="badges">
              {badges.map((b) => (
                <span className="badge" key={b}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="avatar">
            <img src={headerRightImage} alt="Nous (droite)" />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="timeline">
          {chapters.map((ch, idx) => {
            const gridClass = ch.images.length === 4 ? "four" : "two";
            return (
              <div className="chapter" key={idx}>
                <h3>{ch.title}</h3>
                <p>{ch.text}</p>

                <div className={`photos-grid ${gridClass}`}>
                  {ch.images.map((src, i) => (
                    <div className="chapter-photo" key={i}>
                      <img src={src} alt={`${ch.title} photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="footer-love">
          <strong>Un dernier mot</strong>
          <div style={{ height: 8 }} />
          {finalMessage}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
