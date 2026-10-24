// High-fidelity procedural Earth texture generator with Delhi geographic focus

export function createEarthCanvasTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Deep Ocean Base with subtle depth gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a192f');
  oceanGrad.addColorStop(0.5, '#071527');
  oceanGrad.addColorStop(1, '#05101d');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Latitude & Longitude Technical Grid Lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;

  // Latitudes
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Longitudes
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Helper to convert lat/lon to canvas (x, y)
  const toXY = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 180) / 360) * canvas.width;
    const y = ((90 - lat) / 180) * canvas.height;
    return [x, y];
  };

  // 3. Render Landmass Polygons (Asia, Europe, Africa, Americas, Australia, India)
  ctx.fillStyle = '#1e3a5f';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;

  // Simplified Continental Polygons
  const continents: [number, number][][] = [
    // Indian Subcontinent (Prominent & High Definition)
    [
      [36, 74], [35, 78], [32, 79], [28, 88], [26, 90], [22, 89],
      [21, 87], [18, 83], [13, 80], [8.5, 77.5], [8.2, 77.2],
      [10, 76], [15, 74], [19, 73], [23, 69], [24, 68],
      [27, 71], [30, 71], [33, 75], [36, 74]
    ],
    // Central & East Asia
    [
      [36, 74], [40, 70], [45, 60], [55, 60], [60, 70], [65, 80],
      [70, 110], [65, 140], [55, 135], [45, 130], [38, 120],
      [32, 121], [25, 118], [20, 108], [15, 100], [22, 92],
      [28, 88], [32, 79], [35, 78], [36, 74]
    ],
    // Southeast Asia & Indonesia
    [
      [15, 100], [10, 104], [2, 102], [1, 104], [4, 114],
      [7, 118], [15, 120], [18, 106], [15, 100]
    ],
    // Europe
    [
      [36, -5], [43, -9], [48, -4], [55, 8], [60, 5], [70, 25],
      [68, 50], [55, 55], [45, 50], [40, 28], [38, 24], [36, 14],
      [37, 0], [36, -5]
    ],
    // Africa
    [
      [36, -5], [37, 11], [32, 32], [28, 34], [12, 44], [12, 51],
      [-5, 40], [-15, 40], [-25, 33], [-34, 18], [-34, 25],
      [-22, 14], [-5, 12], [5, 2], [5, -4], [15, -17], [25, -14],
      [35, -6], [36, -5]
    ],
    // North America
    [
      [15, -92], [20, -105], [30, -115], [38, -123], [48, -125],
      [60, -140], [70, -160], [72, -140], [70, -100], [60, -75],
      [50, -65], [44, -66], [35, -75], [25, -80], [18, -88], [15, -92]
    ],
    // South America
    [
      [12, -72], [10, -62], [5, -52], [-5, -35], [-12, -37],
      [-23, -43], [-35, -53], [-55, -67], [-50, -75], [-40, -73],
      [-20, -70], [-5, -81], [5, -77], [12, -72]
    ],
    // Australia
    [
      [-12, 131], [-12, 136], [-15, 145], [-25, 153], [-37, 150],
      [-38, 144], [-32, 132], [-35, 117], [-22, 114], [-16, 123],
      [-12, 131]
    ]
  ];

  continents.forEach(poly => {
    ctx.beginPath();
    poly.forEach(([lat, lon], idx) => {
      const [x, y] = toXY(lat, lon);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 4. Subtle Topographic Elevation Fill for India & Himalayas
  const himalayas = [
    [35, 75], [36, 78], [34, 82], [30, 88], [28, 94],
    [26, 92], [27, 86], [30, 80], [33, 76]
  ];
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  himalayas.forEach(([lat, lon], idx) => {
    const [x, y] = toXY(lat, lon);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  // 5. Delhi Focal Region Pulse Ring (Lat 28.6139, Lon 77.2090)
  const [delhiX, delhiY] = toXY(28.6139, 77.2090);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(delhiX, delhiY, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(delhiX, delhiY, 14, 0, Math.PI * 2);
  ctx.stroke();

  // Outer radar ring
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(delhiX, delhiY, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  return canvas;
}
