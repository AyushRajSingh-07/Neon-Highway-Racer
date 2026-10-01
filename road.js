/**
 * Neon Highway - 2.5D Perspective Road Engine
 * Implements segmented perspective projection, curves, rolling hills,
 * parallax synthwave horizon, and roadside cyber scenery.
 */

class RoadEngine {
  constructor() {
    this.segments = [];
    this.segmentLength = 200; // Z distance per segment
    this.rumbleLength = 3;    // segments per color stripe
    this.trackLength = null;  // total Z distance (calculated)
    this.drawDistance = 280;  // segments visible ahead
    this.roadWidth = 2000;    // full 3-lane highway width in world units
    this.lanes = 3;           // 3 distinct lanes

    // Camera settings
    this.fieldOfView = 100;
    this.cameraHeight = 650;
    this.cameraDepth = null; // calculated from FOV

    // Parallax background offsets
    this.skyOffset = 0;
    this.mountainOffset = 0;
    this.cityOffset = 0;

    // Roadside sprite templates
    this.initTrack();
  }

  init(width, height) {
    this.cameraDepth = 1 / Math.tan((this.fieldOfView / 2) * Math.PI / 180);
  }

  // --- Track Generation ---
  initTrack() {
    this.segments = [];
    
    // Build a seamless looping cyber-highway with straights, sweeping curves, and rolling neon hills
    this.addSection(40, 0, 0);                 // Start straight
    this.addSection(60, 2.5, 0);               // Gentle sweeping right
    this.addSection(50, 0, 800);               // Cresting hill
    this.addSection(70, -3.2, -600);           // High-speed left downhill
    this.addSection(50, 0, 0);                 // Fast straight
    this.addSection(80, 4.0, 1000);            // Steep right uphill climb
    this.addSection(60, -2.0, -1200);          // Sweeping drop into neon valley
    this.addSection(50, -4.5, 0);              // Sharp chicane left
    this.addSection(50, 4.5, 400);             // Chicane counter-right
    this.addSection(80, 0, -400);              // Downhill highway stretch
    this.addSection(60, -3.0, 600);            // Climbing left sweeper
    this.addSection(50, 2.0, -600);            // Rollercoaster dip
    this.addSection(50, 0, 0);                 // Home straightaway

    // Ensure seamless track loop closure
    if (this.segments.length > 0) {
      this.segments[this.segments.length - 1].p2.world.y = this.segments[0].p1.world.y;
    }

    this.trackLength = this.segments.length * this.segmentLength;

    // Decorate roadside with cyber palm trees, light pillars, billboards, and overhead highway gantries
    this.populateScenery();
  }

  addSegment(curve, y) {
    const n = this.segments.length;
    const prevY = n > 0 ? this.segments[n - 1].p2.world.y : 0;
    
    // Alternating dark cyber road colors & glowing neon shoulder strips
    const isDark = Math.floor(n / this.rumbleLength) % 2 === 0;
    const colors = {
      road: isDark ? '#0b0c1e' : '#080917',
      rumble: isDark ? '#ff007f' : '#00f0ff', // alternating neon magenta / cyan rumbles
      lane: isDark ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.15)', // bright dashes vs dark road gaps
      shoulder: isDark ? '#050510' : '#03030c'
    };

    this.segments.push({
      index: n,
      p1: { world: { x: 0, y: prevY, z: n * this.segmentLength }, camera: {}, screen: {} },
      p2: { world: { x: 0, y: y, z: (n + 1) * this.segmentLength }, camera: {}, screen: {} },
      curve: curve,
      sprites: [],
      cars: [],
      color: colors
    });
  }

  addSection(enterLength, curve, targetYDelta) {
    const startY = this.segments.length > 0 ? this.segments[this.segments.length - 1].p2.world.y : 0;
    const endY = startY + targetYDelta;

    for (let i = 0; i < enterLength; i++) {
      // Ease-in / ease-out for road elevation
      const t = i / enterLength;
      const easedY = startY + (endY - startY) * (0.5 - 0.5 * Math.cos(t * Math.PI));
      // Ease curve in and out
      const currentCurve = curve * Math.sin(t * Math.PI);
      this.addSegment(currentCurve, easedY);
    }
  }

  populateScenery() {
    const total = this.segments.length;
    for (let i = 0; i < total; i += 4) {
      const seg = this.segments[i];

      // Roadside neon light towers / pylons
      if (i % 8 === 0) {
        seg.sprites.push({
          type: 'pylon',
          offset: -1.45, // Left road side
          color: (i % 16 === 0) ? '#ff007f' : '#00f0ff'
        });
        seg.sprites.push({
          type: 'pylon',
          offset: 1.45, // Right road side
          color: (i % 16 === 0) ? '#00f0ff' : '#ff007f'
        });
      }

      // Cyber Palm trees
      if (i % 12 === 0) {
        seg.sprites.push({
          type: 'palmtree',
          offset: -1.95,
          color: '#ff00aa'
        });
        seg.sprites.push({
          type: 'palmtree',
          offset: 1.95,
          color: '#00e5ff'
        });
      }

      // Overhead digital highway gantries / arches
      if (i % 90 === 30) {
        const banners = ['NEON HIGHWAY', 'TURBO SPEED', 'SYNTHWAVE 84', 'OVERDRIVE', 'GRIDRUNNER'];
        seg.sprites.push({
          type: 'gantry',
          offset: 0,
          text: banners[Math.floor(i / 90) % banners.length]
        });
      }

      // Roadside holographic billboards
      if (i % 60 === 15) {
        seg.sprites.push({
          type: 'billboard',
          offset: i % 120 === 15 ? -2.2 : 2.2,
          tag: i % 120 === 15 ? 'NITRO-FUEL' : 'CYBER-X'
        });
      }
    }
  }

  findSegment(z) {
    const idx = Math.floor(z / this.segmentLength) % this.segments.length;
    return this.segments[(idx + this.segments.length) % this.segments.length];
  }

  // --- 3D Projection Math ---
  project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    
    // Scale factor inversely proportional to distance Z
    p.screen.scale = cameraDepth / Math.max(1, p.camera.z);
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    p.screen.w = Math.round(p.screen.scale * roadWidth * width / 2);
  }

  // --- Background Synthwave Horizon ---
  renderBackground(ctx, width, height, cameraCurve, speedRatio) {
    // 1. Synthwave Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.58);
    skyGrad.addColorStop(0, '#060017');
    skyGrad.addColorStop(0.4, '#1b003a');
    skyGrad.addColorStop(0.75, '#4b0055');
    skyGrad.addColorStop(1, '#ff3366');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.6);

    const horizonY = height * 0.52;

    // 2. Parallax scrolling retro wireframe mountain ridge
    this.mountainOffset = (this.mountainOffset + cameraCurve * 0.0015 * speedRatio) % width;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 150, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    const mSteps = 30;
    const mWidth = width / mSteps;
    for (let i = -1; i <= mSteps + 1; i++) {
      const mx = i * mWidth - (this.mountainOffset % mWidth);
      const seed = Math.sin((i + Math.floor(this.mountainOffset / mWidth)) * 0.7);
      const my = horizonY - 45 - Math.abs(seed) * 55;
      ctx.lineTo(mx, my);
    }
    ctx.lineTo(width, horizonY);
    ctx.fillStyle = 'rgba(15, 0, 35, 0.9)';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. Giant Synthwave Horizon Sun with horizontal laser cuts
    const sunRadius = Math.min(width, height) * 0.22;
    const sunX = width * 0.5 - cameraCurve * 15;
    const sunY = horizonY - sunRadius * 0.35;

    ctx.save();
    const sunGrad = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.1, sunX, sunY, sunRadius);
    sunGrad.addColorStop(0, '#ffff80');
    sunGrad.addColorStop(0.4, '#ff007f');
    sunGrad.addColorStop(1, 'rgba(128, 0, 128, 0)');
    
    // Outer sun corona glow
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal retro slats cut through lower half of sun
    ctx.fillStyle = '#060017';
    const numStripes = 8;
    for (let i = 0; i < numStripes; i++) {
      const stripeH = 2 + i * 1.5;
      const sy = sunY + (i / numStripes) * sunRadius * 0.95;
      ctx.fillRect(sunX - sunRadius, sy, sunRadius * 2, stripeH);
    }
    ctx.restore();

    // 4. Parallax Neon Cyber City Skyline silhouettes
    this.cityOffset = (this.cityOffset + cameraCurve * 0.003 * speedRatio) % width;
    ctx.save();
    const buildingWidth = 32;
    const bCount = Math.ceil(width / buildingWidth) + 2;
    for (let i = -1; i < bCount; i++) {
      const bx = i * buildingWidth - (this.cityOffset % buildingWidth);
      const hash = Math.sin(i * 12.9898 + Math.floor(this.cityOffset / buildingWidth)) * 43758.5453;
      const bHeight = 30 + Math.abs(hash % 90);
      const by = horizonY - bHeight;

      // Dark futuristic skyscraper body
      ctx.fillStyle = '#0a001a';
      ctx.fillRect(bx, by, buildingWidth - 3, bHeight);

      // Neon rooftop antenna or window accents
      if (Math.abs(hash % 3) > 1) {
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 0, 128, 0.8)';
        ctx.fillRect(bx + 4, by + 4, 3, 3);
        ctx.fillRect(bx + 12, by + 10, 3, 3);
        ctx.fillRect(bx + 20, by + 6, 3, 3);

        // Antenna
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx + buildingWidth / 2, by);
        ctx.lineTo(bx + buildingWidth / 2, by - 8);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 5. Horizon Grid Glow
    const glowGrad = ctx.createLinearGradient(0, horizonY - 10, 0, horizonY + 20);
    glowGrad.addColorStop(0, 'rgba(255, 0, 128, 0)');
    glowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.45)');
    glowGrad.addColorStop(1, 'rgba(255, 0, 128, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, horizonY - 10, width, 30);
  }

  // --- Main Road Rendering ---
  renderRoad(ctx, width, height, cameraX, cameraZ, speedRatio) {
    if (!this.cameraDepth) this.init(width, height);

    const baseSegment = this.findSegment(cameraZ);
    const basePercent = (cameraZ % this.segmentLength) / this.segmentLength;
    const playerSegment = this.findSegment(cameraZ + 500); // player position slightly ahead of camera
    
    // Dynamic camera height following hill contours
    const cameraY = this.cameraHeight + (baseSegment.p1.world.y + (baseSegment.p2.world.y - baseSegment.p1.world.y) * basePercent);

    let maxy = height;
    let x = 0;
    let dx = -(baseSegment.curve * basePercent);

    // Project visible road segments from near to far
    for (let n = 0; n < this.drawDistance; n++) {
      const segment = this.segments[(baseSegment.index + n) % this.segments.length];
      const looped = segment.index < baseSegment.index;
      const segmentLoopedZ = looped ? this.trackLength : 0;

      // Project front and back of segment
      this.project(
        segment.p1,
        cameraX * (this.roadWidth / 2) - x,
        cameraY,
        cameraZ - segmentLoopedZ,
        this.cameraDepth,
        width,
        height,
        this.roadWidth
      );

      this.project(
        segment.p2,
        cameraX * (this.roadWidth / 2) - x - dx,
        cameraY,
        cameraZ - segmentLoopedZ,
        this.cameraDepth,
        width,
        height,
        this.roadWidth
      );

      x += dx;
      dx += segment.curve;
    }

    // Render road segments & roadside scenery back-to-front (painter's algorithm)
    for (let n = this.drawDistance - 1; n >= 0; n--) {
      const segment = this.segments[(baseSegment.index + n) % this.segments.length];

      if (segment.p1.camera.z <= this.cameraDepth) {
        continue;
      }

      // Draw segment polygons: Ground shoulders, Rumble strips, Road asphalt, and 3-lane dashes
      this.drawSegment(
        ctx,
        width,
        segment.p1.screen.x,
        segment.p1.screen.y,
        segment.p1.screen.w,
        segment.p2.screen.x,
        segment.p2.screen.y,
        segment.p2.screen.w,
        segment.color,
        n / this.drawDistance
      );

      // Render roadside scenery attached to this segment
      for (let s = 0; s < segment.sprites.length; s++) {
        const sprite = segment.sprites[s];
        this.renderRoadsideSprite(ctx, width, height, segment.p1, sprite);
      }
    }

    return {
      baseSegment,
      playerSegment,
      curve: baseSegment.curve
    };
  }

  // --- Draw Polygon Helper ---
  drawPolygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  drawSegment(ctx, width, x1, y1, w1, x2, y2, w2, color, fogRatio) {
    const r1 = w1 / 6; // Rumble width
    const r2 = w2 / 6;

    // 1. Off-road Cyber Grid shoulders (left & right polygons outside the road)
    this.drawPolygon(ctx, 0, y1, x1 - w1 - r1, y1, x2 - w2 - r2, y2, 0, y2, color.shoulder);
    this.drawPolygon(ctx, x1 + w1 + r1, y1, width, y1, width, y2, x2 + w2 + r2, y2, color.shoulder);

    // Subtle neon gridlines on the shoulders
    if (Math.floor(y1) % 6 === 0) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y1);
      ctx.lineTo(x1 - w1 - r1, y1);
      ctx.moveTo(x1 + w1 + r1, y1);
      ctx.lineTo(width, y1);
      ctx.stroke();
    }

    // 2. Rumble Strips (Neon side borders with bright glow)
    this.drawPolygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    this.drawPolygon(ctx, x1 + w1, y1, x1 + w1 + r1, y1, x2 + w2 + r2, y2, x2 + w2, y2, color.rumble);

    // 3. Road Surface (Dark asphalt with neon tint)
    this.drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    // 4. Three-Lane Markings (2 inner dashed glowing neon lines)
    if (color.lane) {
      const laneWidth1 = w1 * 0.05;
      const laneWidth2 = w2 * 0.05;

      // Divider 1 (Left / Center)
      const l1_x1 = x1 - w1 * 0.333;
      const l1_x2 = x2 - w2 * 0.333;
      this.drawPolygon(ctx, l1_x1 - laneWidth1 / 2, y1, l1_x1 + laneWidth1 / 2, y1, l1_x2 + laneWidth2 / 2, y2, l1_x2 - laneWidth2 / 2, y2, color.lane);

      // Divider 2 (Center / Right)
      const l2_x1 = x1 + w1 * 0.333;
      const l2_x2 = x2 + w2 * 0.333;
      this.drawPolygon(ctx, l2_x1 - laneWidth1 / 2, y1, l2_x1 + laneWidth1 / 2, y1, l2_x2 + laneWidth2 / 2, y2, l2_x2 - laneWidth2 / 2, y2, color.lane);
    }

    // 5. Atmospheric Neon Distance Fog
    if (fogRatio > 0.45) {
      const alpha = Math.min(1, (fogRatio - 0.45) / 0.55);
      ctx.fillStyle = `rgba(11, 0, 35, ${alpha * 0.9})`;
      ctx.fillRect(x2 - w2 - r2, y2, (w2 + r2) * 2, y1 - y2);
    }
  }

  // --- Roadside Sprite Renderer ---
  renderRoadsideSprite(ctx, width, height, p, sprite) {
    const scale = p.screen.scale;
    if (scale <= 0) return;

    const sScale = scale * (width / 2);
    // Sprite position relative to road center
    const spriteX = p.screen.x + (sprite.offset * p.screen.w);
    const spriteY = p.screen.y;

    ctx.save();

    if (sprite.type === 'palmtree') {
      const trunkW = Math.max(2, 7 * sScale);
      const treeH = Math.max(16, 260 * sScale);
      
      // Neon Trunk
      ctx.strokeStyle = '#4a0072';
      ctx.lineWidth = trunkW;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(spriteX, spriteY);
      ctx.quadraticCurveTo(spriteX + (sprite.offset > 0 ? 15 : -15) * sScale, spriteY - treeH * 0.6, spriteX, spriteY - treeH);
      ctx.stroke();

      // Glowing Palm Fronds
      const crownY = spriteY - treeH;
      ctx.strokeStyle = sprite.color;
      ctx.lineWidth = Math.max(1.5, 3 * sScale);
      ctx.shadowColor = sprite.color;
      ctx.shadowBlur = 10;
      
      const angles = [-0.8, -0.4, 0, 0.4, 0.8, -0.6, 0.6];
      const frondLen = 65 * sScale;
      for (const a of angles) {
        ctx.beginPath();
        ctx.moveTo(spriteX, crownY);
        ctx.quadraticCurveTo(
          spriteX + Math.sin(a) * frondLen * 0.8,
          crownY - Math.cos(a) * frondLen * 0.4,
          spriteX + Math.sin(a) * frondLen,
          crownY + 15 * sScale
        );
        ctx.stroke();
      }
    } else if (sprite.type === 'pylon') {
      // Futuristic Neon Light Tower
      const pylonH = Math.max(16, 300 * sScale);
      const pylonW = Math.max(4, 18 * sScale);

      ctx.fillStyle = '#110522';
      ctx.fillRect(spriteX - pylonW / 2, spriteY - pylonH, pylonW, pylonH);

      // Glowing light bar & beacon
      ctx.fillStyle = sprite.color;
      ctx.shadowColor = sprite.color;
      ctx.shadowBlur = 12;
      ctx.fillRect(spriteX - pylonW * 0.8, spriteY - pylonH, pylonW * 1.6, Math.max(4, 14 * sScale));

      // Vertical neon strip down the pylon
      ctx.fillStyle = sprite.color;
      ctx.fillRect(spriteX - 1, spriteY - pylonH, 2, pylonH);
    } else if (sprite.type === 'gantry') {
      // Overhead Highway Sign Gantry spanning all 3 lanes
      const gantryH = Math.max(20, 240 * sScale);
      const spanW = p.screen.w * 2.3;
      const leftX = p.screen.x - spanW / 2;
      const rightX = p.screen.x + spanW / 2;
      const topY = spriteY - gantryH;

      ctx.strokeStyle = '#220044';
      ctx.lineWidth = Math.max(2, 6 * sScale);

      // Pillars
      ctx.beginPath();
      ctx.moveTo(leftX, spriteY);
      ctx.lineTo(leftX, topY);
      ctx.moveTo(rightX, spriteY);
      ctx.lineTo(rightX, topY);
      // Top Crossbar
      ctx.lineTo(leftX, topY);
      ctx.stroke();

      // Illuminated Digital Overhead Sign
      const signW = spanW * 0.55;
      const signH = Math.max(12, 50 * sScale);
      const signX = p.screen.x - signW / 2;
      const signY = topY + 2;

      ctx.fillStyle = 'rgba(10, 0, 25, 0.9)';
      ctx.fillRect(signX, signY, signW, signH);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(signX, signY, signW, signH);

      // Sign text if close enough to read
      if (scale > 0.0006) {
        ctx.fillStyle = '#ff007f';
        ctx.font = `bold ${Math.max(8, Math.round(20 * sScale))}px 'Orbitron', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 8;
        ctx.fillText(sprite.text, p.screen.x, signY + signH / 2);
      }
    } else if (sprite.type === 'billboard') {
      // Roadside Holographic Sign
      const bW = Math.max(20, 160 * sScale);
      const bH = Math.max(14, 100 * sScale);
      const postH = Math.max(10, 110 * sScale);

      ctx.fillStyle = '#220033';
      ctx.fillRect(spriteX - 2, spriteY - postH - bH, 4, postH + bH);

      ctx.fillStyle = 'rgba(20, 0, 40, 0.85)';
      ctx.fillRect(spriteX - bW / 2, spriteY - postH - bH, bW, bH);

      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(spriteX - bW / 2, spriteY - postH - bH, bW, bH);

      if (scale > 0.0008) {
        ctx.fillStyle = '#00ffff';
        ctx.font = `bold ${Math.max(7, Math.round(14 * sScale))}px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sprite.tag, spriteX, spriteY - postH - bH / 2);
      }
    }

    ctx.restore();
  }
}

if (typeof window !== 'undefined') window.RoadEngine = RoadEngine;
if (typeof module !== 'undefined') module.exports = RoadEngine;
