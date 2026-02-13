// Данные по десятилетиям (краткая выжимка и ссылка на страницу)
const gameEras = [
  {
    id: '1970s',
    decade: '1970‑e',
    yearLabel: '1970–1979',
    summary: '⚡ Pong, Atari 2600, первые аркады.',
    link: 'pages/1970s.html'
  },
  {
    id: '1980s',
    decade: '1980‑e',
    yearLabel: '1980–1989',
    summary: '👾 Кризис и возрождение: NES, Pac‑Man.',
    link: 'pages/1980s.html'
  },
  {
    id: '1990s',
    decade: '1990‑e',
    yearLabel: '1990–1999',
    summary: '🎮 3D, PlayStation, Doom, эра CD.',
    link: 'pages/1990s.html'
  },
  {
    id: '2000s',
    decade: '2000‑e',
    yearLabel: '2000–2009',
    summary: '🌐 Xbox, Steam, World of Warcraft.',
    link: 'pages/2000s.html'
  },
  {
    id: '2010s',
    decade: '2010‑e',
    yearLabel: '2010–2019',
    summary: '📱 Minecraft, Fortnite, VR, киберспорт.',
    link: 'pages/2010s.html'
  },
  {
    id: '2020s',
    decade: '2020‑e',
    yearLabel: '2020–2029',
    summary: '☁️ Облака, метавселенные, ИИ, Steam Deck.',
    link: 'pages/2020s.html'
  }
];

// Координаты для змейки (в процентах от родителя)
const snakePositions = [
  { left: '15%', top: '20%' },   // 1970-е
  { left: '70%', top: '30%' },   // 1980-е
  { left: '25%', top: '60%' },   // 1990-е
  { left: '80%', top: '70%' },   // 2000-е
  { left: '35%', top: '85%' },   // 2010-е
  { left: '65%', top: '45%' }    // 2020-е (возврат вверх)
];

document.addEventListener('DOMContentLoaded', function() {
  const pointsLayer = document.getElementById('pointsLayer');
  const svg = document.getElementById('roadSvg');

  // Очистка
  pointsLayer.innerHTML = '';

  // Создание точек
  gameEras.forEach((era, index) => {
    const pos = snakePositions[index];
    const stop = document.createElement('div');
    stop.className = 'path-stop';
    stop.style.left = pos.left;
    stop.style.top = pos.top;

    stop.innerHTML = `
      <div class="stop-marker">${era.decade.replace('‑e','')}</div>
      <span class="year-tag">${era.yearLabel}</span>
      <div class="summary-note">${era.summary}</div>
    `;

    // При клике переходим на страницу десятилетия
    stop.addEventListener('click', function() {
      window.location.href = era.link;
    });

    pointsLayer.appendChild(stop);
  });

  // Рисуем извилистую линию (SVG path)
  function drawSnakePath() {
    const points = [];
    document.querySelectorAll('.path-stop').forEach(el => {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement.getBoundingClientRect();
      const x = rect.left + rect.width/2 - parentRect.left;
      const y = rect.top + rect.height/2 - parentRect.top;
      points.push({ x, y });
    });

    if (points.length < 2) return;

    let pathData = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Кубические кривые для плавных изгибов
      const prev = points[i-1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) * 0.3;
      const cpY1 = prev.y;
      const cpX2 = curr.x - (curr.x - prev.x) * 0.3;
      const cpY2 = curr.y;
      pathData += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${curr.x},${curr.y}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#6b4e3a');
    path.setAttribute('stroke-width', '8');
    path.setAttribute('stroke-dasharray', '15 15');
    path.setAttribute('fill', 'none');
    path.setAttribute('filter', 'url(#shadow)');
    svg.innerHTML = ''; // очистить
    svg.appendChild(path);
  }

  // Подождём немного, чтобы элементы отрисовались
  setTimeout(drawSnakePath, 50);
  window.addEventListener('resize', drawSnakePath);
});