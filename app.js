const { useEffect, useMemo, useState } = React;

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
  const headerLeftImage = "src/Photo-ronde-gauche.jpg";
  const headerRightImage = "src/Photo-ronde-droite.jpg";

  const title = "À notre Saint Valentin";
  const subtitle =
    "Un petit endroit rien qu’à nous, pour revivre notre histoire, notre relation 🥰";

const startDate = useMemo(() => new Date("2023-06-02T00:00:00"), []);

function formatElapsed(from, to) {
  let start = new Date(from);
  let now = new Date(to);

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  // Ajustement si jours négatifs
  if (days < 0) {
    months--;

    const daysInPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();

    days += daysInPrevMonth;
  }

  // Ajustement si mois négatifs
  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} an${years > 1 ? "s" : ""} `
       + `${months} mois `
       + `${days} jour${days > 1 ? "s" : ""}`;
}

const [elapsed, setElapsed] = useState(() =>
  formatElapsed(startDate, new Date())
);

useEffect(() => {
  const id = setInterval(() => {
    setElapsed(formatElapsed(startDate, new Date()));
  }, 60000); // update chaque minute suffit

  return () => clearInterval(id);
}, [startDate]);

const badges = useMemo(
  () => ["Nos souvenirs ✨", "Nos photos 📸", "Toi & moi ❤️"],
  []
);


  const chapters = useMemo(
    () => [
      {
        title: "Le début de notre amour 💝",
        text:
          "Le jour où tout a commencé. J’aime tellement repenser à ce moment et me dire qu'on a eu tellement de chance de se rencontrer 😍",
        images: ["src/photo 1.jpg"],
      },
      {
        title: "Passion amoureuse 💖",
        text:
          "Ainsi débuta nos premiers moments romantiques, remplis de partages et d'amour plus merveilleux les uns que les autres 🎀",
        images: ["src/photo 2.jpg", "src/photo 3.jpg", "src/photo 4.jpg", "src/photo 5.jpg"],
      },
      {
        title: "Nos premières vacances ensemble 🚗⛰️",
        text:
          "Je me souviendrais toujours de ces premières vacances tous les deux, où tu m'as invité à venir avec toi et ta famille en Auvergne alors que notre relation ne faisait qu'encore quelques mois 🤩",
        images: ["src/Photo 6.jpg", "src/photo 7.jpg"],
      },
      {
        title: "Début d'une nouvelle année ⌛",
        text:
          "Quelques souvenirs encore en notre fin d'année 2023 mais aussi du début de 2024, quand je regarde nos photos je me dis que l'on est fait pour être ensemble et de vivre notre amour 😉",
        images: ["src/Photo 8.jpg", "src/Photo 9.jpg", "src/Photo 10.jpg", "src/Photo 11.jpg"],
      },
      {
        title: "Un moment symbolique 💐",
        text:
          "Un grand moment de notre couple, nous passions notre première Saint-Valentin en étant ensemble et c'est là que je t'ai offert ton premier bouquet de fleurs, moment inoubliable 😊😘",
        images: ["src/Saint Valentin 2024.jpg"],
      },
      {
        title: "Deuxième voyage à deux 🌊🍦",
        text:
          "Cette fois ci ce n'est pas moi qui suit venu en Auvergne mais toi qui est venue en Bretagne avec moi et mes parents, que de beaux moments nostalgiques 🥹",
        images: ["src/Photo 14.jpg","src/Photo 12.jpg", "src/Photo 13.jpg"],
      },
      {
        title: "Nos 1 ans ✨",
        text:
          "Le temps avait passé si vite, nous fêtions déjà nos 1 ans de couple en montant à bord de la célèbre montgolfière de Disney 🏰🐭",
        images: ["src/Photo 15.jpg","src/Photo 16.jpg", "src/Nos 1 an.jpg", "src/Nos 1 an (2).jpg"],
      },
      {
        title: "Été 2024🌞",
        text:
          "Cet été à été riche en expérience, ton anniversaire où tu as fêté tes 18 ans et auquel je t'ai offert les places pour le parc DisneyLand 🥳🎁, je pense que l'on est d'accord pour dire que ces jours resteront à jamais dans nos mémoires ♾️",
        images: ["src/Photo 17.jpg","src/Photo 18.jpg", "src/Photo 19.jpg", "src/Photo 20.jpg", "src/Photo 21.jpg"],
      },
      {
        title: "Décembre 2024 ❄️",
        text:
          "Tu continuais de partager ton amour avec moi, t'as présence le jour de mes 18 ans, l'un des moments les plus importants de ma vie, tu étais là ! Puis est venu le moment de notre location AirBNB où nous avons vécu notre vie d'adulte, rien que tous les deux dans notre intimité😜🎉⛪🎡",
        images: ["src/Photo 22.jpg","src/Photo 23.jpg", "src/Photo 24.jpg", "src/Photo 25.jpg"],
      },
      {
        title: "Été 2025🌞 + stage",
        text:
          "Ce moment très important où nous nous sommes retrouvés à nouveau, où tu m'as apporté ton soutien et ton moral lors de mon stage qui nous a ouvert à d'autres moments de partage. C'est aussi à cette période que nous avons fêter tes 19 ans encore une fois ensemble 🤝",
        images: ["src/Photo 26.jpg","src/Photo 27.jpg", "src/Photo 28.jpg", "src/Photo 29.jpg", "src/Photo 30.jpg", "src/photo1.jpg"],
      },
      {
        title: "Été 2025🌞 + stage 2",
        text:
          "Tu es également venu me soutenir pour mon deuxième stage. Alors que je vivais seul, ta présence me réconfortait et j'étais heureux d'avoir la femme que j'aime à mes côtés, habitant avec moi pendants ces vacances d'été 🫶🏻💘",
        images: ["src/Photo 31.jpg","src/Photo 32.jpg", "src/photo3.jpg", "src/Photo 33.jpg", "src/Photo 34.jpg"],
      },
      {
        title: "Fin d'année 2025 ⚜️",
        text:
          "Cette année aura été remplit d'innombrables souvenirs, en partageant ma fête d'anniversaire de mes 19 ans pour laquelle tu es resté à la maison plusieurs jours, menant à la sortie au Musée Grévin qui nous a émerveillé 📷",
        images: ["src/Photo 35.jpg","src/Photo 36.jpg", "src/Photo 37.jpg"],
      },
      {
        title: "Aujourd'hui",
        text:
          "Tout ce parcours nous a amené jusqu'ici, en février 2026 où nous allons vivre notre nouvelle Saint-Valentin ensemble, ainsi que notre week-end dans l'hôtel de Noisy-le-Grand qui sera déjà sans aucun doute un véritable bonheur 🥹💝",
        images: ["src/Photo 39.jpg","src/Photo 40.jpg"],
      },
    ],
    []
  );

  const finalMessage = `
Je ne te remercierai jamais assez de faire partie de ma vie.
Tu as fait de moi un homme.
Je souhaite passer cette Saint-Valentin à tes côtés.
Mais je te pose tout de même la question

Aurélie, veux-tu être ma valentine ❤️🙏 ?

Sache que je t’aime plus que tout ❤️
Je t'aime 💖
`;


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
            <h1 className="hero-title">
              <span className="title-text">
                {title} <span className="heart">❤️</span>
              </span>

              <span className="timer">{elapsed}</span>
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
        <p className="final-message">{finalMessage}</p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
