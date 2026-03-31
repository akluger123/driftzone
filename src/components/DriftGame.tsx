import { useEffect, useRef } from "react";
import p5 from "p5";

const DriftGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (p5Ref.current) return;

    const sketch = (p: p5) => {
      // ========== GAME CONSTANTS ==========
      const GAME_STATE = {
        MENU: "menu",
        GARAGE: "garage",
        LEVEL_SELECT: "levelSelect",
        PLAYING: "playing",
        PAUSED: "paused",
        GAME_OVER: "gameOver",
        LEVEL_COMPLETE: "levelComplete",
        DECAL_SHOP: "decalShop",
      };

      // ========== CAR DESIGNS (pixel art style) ==========
      interface CarData {
        color: number[];
        speed: number;
        drift: number;
        drawFn: (p: p5, scale: number, decal: string | null) => void;
      }

      const drawGenericCar = (p: p5, color: number[], _scale: number, decal: string | null) => {
        p.rectMode(p.CENTER);
        p.fill(0, 50);
        p.noStroke();
        p.rect(2, 2, 28, 14, 3);
        p.fill(color[0], color[1], color[2]);
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, 28, 14, 3);
        p.fill(50);
        p.rect(8, 0, 6, 10);
        p.fill(255, 255, 0);
        p.rect(12, -5, 2, 3);
        p.rect(12, 5, 2, 3);
        if (decal) drawDecal(p, decal);
      };

      const drawLambo = (p: p5, _scale: number, decal: string | null) => {
        p.rectMode(p.CENTER);
        // Shadow
        p.fill(0, 50);
        p.noStroke();
        p.rect(1, 1, 26, 12, 1);
        // Main body - ultra-low wedge shape (Huracan silhouette)
        p.fill(255, 165, 0);
        p.stroke(20);
        p.strokeWeight(1);
        p.beginShape();
        p.vertex(-13, -5);  // rear left
        p.vertex(-8, -6);   // rear fender flare
        p.vertex(8, -5);    // front fender
        p.vertex(13, -3);   // nose tip left
        p.vertex(13, 3);    // nose tip right
        p.vertex(8, 5);     // front fender right
        p.vertex(-8, 6);    // rear fender flare right
        p.vertex(-13, 5);   // rear right
        p.endShape(p.CLOSE);
        // Rear diffuser / engine cover
        p.fill(220, 140, 0);
        p.noStroke();
        p.rect(-11, 0, 4, 10, 1);
        // Hexagonal rear vents (Huracan signature)
        p.fill(40);
        p.rect(-12, -3, 2, 2);
        p.rect(-12, 3, 2, 2);
        // Windshield (flat, angular)
        p.fill(25, 25, 45);
        p.stroke(20);
        p.strokeWeight(0.5);
        p.quad(2, -4, 7, -4, 7, 4, 2, 4);
        // Side intake scoops
        p.fill(40);
        p.noStroke();
        p.rect(-2, -5, 4, 1);
        p.rect(-2, 5, 4, 1);
        // Headlights (angular, sharp - Huracan style)
        p.fill(255, 255, 120);
        p.beginShape();
        p.vertex(10, -4);
        p.vertex(13, -2);
        p.vertex(12, -2);
        p.vertex(9, -4);
        p.endShape(p.CLOSE);
        p.beginShape();
        p.vertex(10, 4);
        p.vertex(13, 2);
        p.vertex(12, 2);
        p.vertex(9, 4);
        p.endShape(p.CLOSE);
        // Y-shaped taillights (Huracan signature)
        p.stroke(255, 0, 0);
        p.strokeWeight(1);
        p.line(-13, -4, -11, -3);
        p.line(-13, -2, -11, -3);
        p.line(-13, 4, -11, 3);
        p.line(-13, 2, -11, 3);
        p.noStroke();
        // Wheels
        p.fill(25);
        p.rect(-7, -7, 5, 3, 1);
        p.rect(-7, 7, 5, 3, 1);
        p.rect(6, -7, 5, 3, 1);
        p.rect(6, 7, 5, 3, 1);
        if (decal) drawDecal(p, decal);
      };

      const drawGTR = (p: p5, _scale: number, decal: string | null) => {
        p.rectMode(p.CENTER);
        p.fill(0, 40);
        p.noStroke();
        p.rect(2, 2, 30, 14, 2);
        p.fill(180, 180, 190);
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, 30, 14, 2);
        p.fill(160, 160, 170);
        p.rect(5, 0, 10, 8, 1);
        p.fill(20, 20, 40);
        p.rect(1, 0, 6, 10, 1);
        p.fill(60);
        p.rect(-15, 0, 2, 16);
        p.fill(255, 0, 0);
        p.ellipse(-13, -5, 3, 3);
        p.ellipse(-13, -2, 3, 3);
        p.ellipse(-13, 5, 3, 3);
        p.ellipse(-13, 2, 3, 3);
        p.fill(255, 255, 200);
        p.rect(13, -4, 3, 4, 1);
        p.rect(13, 4, 3, 4, 1);
        p.fill(30);
        p.rect(-8, -8, 6, 3);
        p.rect(-8, 8, 6, 3);
        p.rect(7, -8, 6, 3);
        p.rect(7, 8, 6, 3);
        if (decal) drawDecal(p, decal);
      };

      const drawMustang = (p: p5, _scale: number, decal: string | null) => {
        p.rectMode(p.CENTER);
        p.fill(0, 40);
        p.noStroke();
        p.rect(2, 2, 32, 14, 2);
        p.fill(0, 60, 180);
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(0, 0, 32, 14, 2);
        p.fill(255, 255, 255);
        p.noStroke();
        p.rect(7, -1, 14, 1);
        p.rect(7, 1, 14, 1);
        p.stroke(0);
        p.strokeWeight(1);
        p.fill(30, 30, 50);
        p.rect(1, 0, 7, 10, 1);
        p.fill(0, 40, 140);
        p.rect(-13, 0, 4, 12, 1);
        p.fill(255, 0, 0);
        p.rect(-14, -5, 2, 2);
        p.rect(-14, -3, 2, 2);
        p.rect(-14, 5, 2, 2);
        p.rect(-14, 3, 2, 2);
        p.rect(-14, 0, 2, 2);
        p.fill(255, 255, 150);
        p.rect(14, -5, 3, 3, 1);
        p.rect(14, 5, 3, 3, 1);
        p.fill(30);
        p.rect(-9, -8, 6, 3);
        p.rect(-9, 8, 6, 3);
        p.rect(7, -8, 6, 3);
        p.rect(7, 8, 6, 3);
        if (decal) drawDecal(p, decal);
      };

      const drawDecal = (p: p5, decal: string) => {
        p.noStroke();
        if (decal === "flames") {
          p.fill(255, 100, 0, 180);
          p.triangle(15, -8, 25, -3, 18, -5);
          p.triangle(15, 8, 25, 3, 18, 5);
          p.fill(255, 200, 0, 150);
          p.triangle(12, -7, 20, -2, 15, -4);
          p.triangle(12, 7, 20, 2, 15, 4);
        } else if (decal === "stripes") {
          p.fill(255, 255, 255, 120);
          p.rect(0, -2, 40, 2);
          p.rect(0, 2, 40, 2);
        } else if (decal === "lightning") {
          p.stroke(255, 255, 0);
          p.strokeWeight(2);
          p.line(-5, -8, 0, -2);
          p.line(0, -2, -3, 0);
          p.line(-3, 0, 5, 8);
          p.noStroke();
        } else if (decal === "stars") {
          p.fill(255, 255, 0, 180);
          for (let i = 0; i < 3; i++) {
            const sx = -8 + i * 8;
            const sy = -4 + (i % 2) * 8;
            drawStar(p, sx, sy, 2, 4, 5);
          }
        } else if (decal === "skull") {
          p.fill(255, 255, 255, 200);
          p.ellipse(0, 0, 10, 10);
          p.fill(0);
          p.ellipse(-2, -1, 3, 3);
          p.ellipse(2, -1, 3, 3);
          p.rect(0, 3, 4, 2);
        }
      };

      const drawStar = (p: p5, x: number, y: number, r1: number, r2: number, npoints: number) => {
        const angle = p.TWO_PI / npoints;
        const halfAngle = angle / 2.0;
        p.beginShape();
        for (let a = -p.HALF_PI; a < p.TWO_PI - p.HALF_PI; a += angle) {
          let sx = x + p.cos(a) * r2;
          let sy = y + p.sin(a) * r2;
          p.vertex(sx, sy);
          sx = x + p.cos(a + halfAngle) * r1;
          sy = y + p.sin(a + halfAngle) * r1;
          p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
      };

      const CARS: Record<string, CarData> = {
        "Lambo Huracan": {
          color: [255, 165, 0],
          speed: 0.18,
          drift: 0.82,
          drawFn: drawLambo,
        },
        "Nissan GT-R": {
          color: [180, 180, 190],
          speed: 0.15,
          drift: 0.80,
          drawFn: drawGTR,
        },
        "Ford Mustang": {
          color: [0, 60, 180],
          speed: 0.16,
          drift: 0.85,
          drawFn: drawMustang,
        },
        "Red Pro": {
          color: [200, 30, 30],
          speed: 0.13,
          drift: 0.88,
          drawFn: (p, _s, d) => drawGenericCar(p, [200, 30, 30], 1, d),
        },
        "Blue Turbo": {
          color: [30, 100, 200],
          speed: 0.15,
          drift: 0.92,
          drawFn: (p, _s, d) => drawGenericCar(p, [30, 100, 200], 1, d),
        },
        "Yellow Speed": {
          color: [255, 200, 0],
          speed: 0.18,
          drift: 0.94,
          drawFn: (p, _s, d) => drawGenericCar(p, [255, 200, 0], 1, d),
        },
      };

      // ========== DECALS ==========
      interface DecalInfo {
        name: string;
        cost: number;
        id: string;
      }

      const DECALS: DecalInfo[] = [
        { name: "Flames", cost: 50, id: "flames" },
        { name: "Racing Stripes", cost: 30, id: "stripes" },
        { name: "Lightning", cost: 75, id: "lightning" },
        { name: "Stars", cost: 40, id: "stars" },
        { name: "Skull", cost: 100, id: "skull" },
      ];

      // ========== LEVELS ==========
      interface LevelDef {
        name: string;
        width: number;
        height: number;
        trackWidth: number;
        obstacles: number;
        targetTime: number;
        type: "track" | "openWorld" | "twisty";
      }

      const LEVELS: LevelDef[] = [
        { name: "Open World", width: 2000, height: 2000, trackWidth: 0, obstacles: 0, targetTime: 120, type: "openWorld" },
        { name: "Twisty Track", width: 2400, height: 2400, trackWidth: 120, obstacles: 0, targetTime: 90, type: "twisty" },
        { name: "Beginner", width: 800, height: 600, trackWidth: 150, obstacles: 3, targetTime: 60, type: "track" },
        { name: "Advanced", width: 1200, height: 800, trackWidth: 100, obstacles: 10, targetTime: 40, type: "track" },
      ];

      // ========== GAME STATE ==========
      let gameState = GAME_STATE.MENU;
      let currentCar = "Lambo Huracan";
      let currentLevel = 0;
      let car: any = null;
      let obstacles: any[] = [];
      let cones: any[] = [];
      let coins: any[] = [];
      let twistyTrackPoints: p5.Vector[] = [];
      let score = 0;
      let totalCoins = 0;
      let time = 0;
      let crashDetected = false;
      let ownedDecals: string[] = [];
      let equippedDecal: string | null = null;
      let camX = 0;
      let camY = 0;
      let clickCooldown = 0;
      let garageScroll = 0;
      let shopScroll = 0;

      const CW = 1000;
      const CH = 700;

      // ========== SETUP ==========
      p.setup = () => {
        p.createCanvas(CW, CH);
        p.frameRate(60);
      };

      // ========== DRAW ==========
      p.draw = () => {
        if (clickCooldown > 0) clickCooldown--;
        p.background(26);

        switch (gameState) {
          case GAME_STATE.MENU: drawMenu(); break;
          case GAME_STATE.GARAGE: drawGarage(); break;
          case GAME_STATE.LEVEL_SELECT: drawLevelSelect(); break;
          case GAME_STATE.PLAYING: drawGame(); break;
          case GAME_STATE.PAUSED: drawGame(); drawPauseOverlay(); break;
          case GAME_STATE.LEVEL_COMPLETE: drawLevelCompleteScreen(); break;
          case GAME_STATE.GAME_OVER: drawGameOverScreen(); break;
          case GAME_STATE.DECAL_SHOP: drawDecalShop(); break;
        }
      };

      // ========== MENU ==========
      const drawMenu = () => {
        // Background pattern
        p.noStroke();
        for (let i = 0; i < 20; i++) {
          p.fill(0, 255, 0, 5);
          p.rect(
            p.noise(i * 0.1, p.frameCount * 0.005) * CW,
            p.noise(i * 0.2, p.frameCount * 0.003) * CH,
            p.random(50, 200), p.random(50, 200)
          );
        }

        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(56);
        p.textStyle(p.BOLD);
        p.text("DRIFT GAME - AMI", CW / 2, CH / 2 - 140);

        p.textSize(20);
        p.fill(0, 200, 0);
        p.textStyle(p.NORMAL);
        p.text("Advanced Edition", CW / 2, CH / 2 - 80);

        p.textSize(14);
        p.fill(150);
        p.text(`Coins: ${totalCoins}`, CW / 2, CH / 2 - 50);

        btn(CW / 2 - 100, CH / 2 - 10, 200, 50, "PLAY", () => { gameState = GAME_STATE.LEVEL_SELECT; });
        btn(CW / 2 - 100, CH / 2 + 55, 200, 50, "GARAGE", () => { gameState = GAME_STATE.GARAGE; });
        btn(CW / 2 - 100, CH / 2 + 120, 200, 50, "DECAL SHOP", () => { gameState = GAME_STATE.DECAL_SHOP; });
      };

      // ========== GARAGE ==========
      const drawGarage = () => {
        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(36);
        p.textStyle(p.BOLD);
        p.text("GARAGE", CW / 2, 40);

        p.textSize(14);
        p.fill(150);
        p.textStyle(p.NORMAL);
        p.text("Select Your Car", CW / 2, 75);

        const carNames = Object.keys(CARS);
        const cols = 3;
        const cardW = 260;
        const cardH = 120;
        const gap = 20;
        const startX = CW / 2 - (cols * (cardW + gap) - gap) / 2;
        const startY = 100 - garageScroll;

        carNames.forEach((name, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * (cardW + gap);
          const y = startY + row * (cardH + gap);

          if (y < 80 || y > CH - 120) return;

          const selected = name === currentCar;
          p.fill(selected ? 30 : 15);
          p.stroke(selected ? p.color(0, 255, 0) : p.color(0, 100, 0));
          p.strokeWeight(selected ? 3 : 1);
          p.rect(x, y, cardW, cardH, 8);

          // Draw car preview
          p.push();
          p.translate(x + 60, y + cardH / 2);
          p.scale(1.8);
          CARS[name].drawFn(p, 1, equippedDecal);
          p.pop();

          p.fill(selected ? 0 : 100, 255, selected ? 100 : 0);
          p.noStroke();
          p.textSize(16);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(name, x + 130, y + 30);

          p.fill(140);
          p.textSize(11);
          p.text(`Speed: ${(CARS[name].speed * 100).toFixed(0)}`, x + 130, y + 55);
          p.text(`Drift: ${(CARS[name].drift * 100).toFixed(0)}`, x + 130, y + 72);

          if (p.mouseIsPressed && clickCooldown <= 0 &&
            p.mouseX > x && p.mouseX < x + cardW &&
            p.mouseY > y && p.mouseY < y + cardH &&
            p.mouseY < CH - 70) {
            currentCar = name;
            clickCooldown = 15;
          }
        });

        btn(CW / 2 - 80, CH - 65, 160, 45, "BACK", () => { gameState = GAME_STATE.MENU; });
      };

      // ========== DECAL SHOP ==========
      const drawDecalShop = () => {
        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(36);
        p.textStyle(p.BOLD);
        p.text("DECAL SHOP", CW / 2, 40);

        p.textSize(14);
        p.fill(255, 200, 0);
        p.textStyle(p.NORMAL);
        p.text(`Coins: ${totalCoins}`, CW / 2, 75);

        const startY = 100 - shopScroll;
        const cardW = 200;
        const cardH = 140;
        const gap = 20;
        const cols = 3;
        const sx = CW / 2 - (cols * (cardW + gap) - gap) / 2;

        DECALS.forEach((decal, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = sx + col * (cardW + gap);
          const y = startY + row * (cardH + gap);

          if (y < 80 || y > CH - 90) return;

          const owned = ownedDecals.includes(decal.id);
          const equipped = equippedDecal === decal.id;

          p.fill(equipped ? 20 : 10);
          p.stroke(equipped ? p.color(255, 200, 0) : owned ? p.color(0, 200, 0) : p.color(80));
          p.strokeWeight(equipped ? 3 : 1);
          p.rect(x, y, cardW, cardH, 8);

          // Preview
          p.push();
          p.translate(x + cardW / 2, y + 45);
          p.scale(2);
          const carData = CARS[currentCar];
          carData.drawFn(p, 1, decal.id);
          p.pop();

          p.noStroke();
          p.fill(200);
          p.textSize(14);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(decal.name, x + cardW / 2, y + 95);

          if (owned) {
            if (equipped) {
              p.fill(255, 200, 0);
              p.textSize(11);
              p.text("EQUIPPED", x + cardW / 2, y + 115);
            } else {
              // Equip button
              p.fill(0, 150, 0);
              p.rect(x + cardW / 2 - 35, y + 108, 70, 22, 4);
              p.fill(0);
              p.textSize(11);
              p.text("EQUIP", x + cardW / 2, y + 118);
              if (p.mouseIsPressed && clickCooldown <= 0 &&
                p.mouseX > x + cardW / 2 - 35 && p.mouseX < x + cardW / 2 + 35 &&
                p.mouseY > y + 108 && p.mouseY < y + 130) {
                equippedDecal = decal.id;
                clickCooldown = 15;
              }
            }
          } else {
            p.fill(totalCoins >= decal.cost ? p.color(0, 150, 0) : p.color(80, 0, 0));
            p.rect(x + cardW / 2 - 45, y + 108, 90, 22, 4);
            p.fill(totalCoins >= decal.cost ? 0 : 100);
            p.textSize(11);
            p.text(`BUY ${decal.cost} coins`, x + cardW / 2, y + 118);
            if (p.mouseIsPressed && clickCooldown <= 0 && totalCoins >= decal.cost &&
              p.mouseX > x + cardW / 2 - 45 && p.mouseX < x + cardW / 2 + 45 &&
              p.mouseY > y + 108 && p.mouseY < y + 130) {
              totalCoins -= decal.cost;
              ownedDecals.push(decal.id);
              equippedDecal = decal.id;
              clickCooldown = 15;
            }
          }
        });

        // Unequip button
        if (equippedDecal) {
          btn(CW / 2 + 100, CH - 60, 160, 45, "UNEQUIP", () => { equippedDecal = null; });
        }
        btn(CW / 2 - 80, CH - 60, 160, 45, "BACK", () => { gameState = GAME_STATE.MENU; });
      };

      // ========== LEVEL SELECT ==========
      const drawLevelSelect = () => {
        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(36);
        p.textStyle(p.BOLD);
        p.text("SELECT LEVEL", CW / 2, 50);

        LEVELS.forEach((level, i) => {
          const lx = 80 + i * 220;
          const ly = 150;

          p.fill(25);
          p.stroke(0, 150, 255);
          p.strokeWeight(2);
          p.rect(lx, ly, 190, 200, 10);

          p.fill(0, 255, 0);
          p.noStroke();
          p.textSize(18);
          p.textStyle(p.BOLD);
          p.text(level.name, lx + 95, ly + 35);

          p.textStyle(p.NORMAL);
          p.fill(180);
          p.textSize(12);
          p.text(`Type: ${level.type}`, lx + 95, ly + 65);
          p.text(`Time: ${level.targetTime}s`, lx + 95, ly + 85);

          if (level.type === "openWorld") {
            p.text("Free roam + cones", lx + 95, ly + 110);
          } else if (level.type === "twisty") {
            p.text("Collect coins!", lx + 95, ly + 110);
          } else {
            p.text(`Obstacles: ${level.obstacles}`, lx + 95, ly + 110);
          }

          // Play button
          p.fill(0, 180, 0);
          p.rect(lx + 45, ly + 145, 100, 35, 5);
          p.fill(0);
          p.textSize(14);
          p.text("PLAY", lx + 95, ly + 162);

          if (p.mouseIsPressed && clickCooldown <= 0 &&
            p.mouseX > lx + 45 && p.mouseX < lx + 145 &&
            p.mouseY > ly + 145 && p.mouseY < ly + 180) {
            currentLevel = i;
            startLevel();
            clickCooldown = 20;
          }
        });

        btn(CW / 2 - 80, CH - 60, 160, 45, "BACK", () => { gameState = GAME_STATE.MENU; });
      };

      // ========== START LEVEL ==========
      const startLevel = () => {
        gameState = GAME_STATE.PLAYING;
        const level = LEVELS[currentLevel];
        const carData = CARS[currentCar];

        if (level.type === "openWorld") {
          car = new Drifter(level.width / 2, level.height / 2, carData);
          generateOpenWorld(level);
        } else if (level.type === "twisty") {
          car = new Drifter(level.width / 2, level.height - 200, carData);
          generateTwistyTrack(level);
        } else {
          car = new Drifter(level.width / 2, level.height / 2, carData);
          obstacles = [];
          cones = [];
          coins = [];
          generateObstacles(level.obstacles, level.width, level.height);
        }

        score = 0;
        time = 0;
        crashDetected = false;
      };

      // ========== OPEN WORLD GENERATION ==========
      const generateOpenWorld = (level: LevelDef) => {
        obstacles = [];
        cones = [];
        coins = [];

        // Generate cone clusters (fewer, spaced out)
        for (let cluster = 0; cluster < 3; cluster++) {
          const cx = p.random(300, level.width - 300);
          const cy = p.random(300, level.height - 300);
          const count = p.floor(p.random(3, 6));
          const radius = p.random(80, 150);

          for (let i = 0; i < count; i++) {
            const angle = (p.TWO_PI / count) * i;
            cones.push({
              x: cx + Math.cos(angle) * radius,
              y: cy + Math.sin(angle) * radius,
            });
          }
        }

        // A few scattered cones
        for (let i = 0; i < 8; i++) {
          cones.push({
            x: p.random(200, level.width - 200),
            y: p.random(200, level.height - 200),
          });
        }

        // Coins
        for (let i = 0; i < 25; i++) {
          coins.push({
            x: p.random(150, level.width - 150),
            y: p.random(150, level.height - 150),
            collected: false,
            bobOffset: p.random(p.TWO_PI),
          });
        }
      };

      // ========== TWISTY TRACK GENERATION ==========
      const generateTwistyTrack = (level: LevelDef) => {
        obstacles = [];
        cones = [];
        coins = [];
        twistyTrackPoints = [];

        // Generate a winding path using control points
        const points: p5.Vector[] = [];
        const cx = level.width / 2;
        const cy = level.height / 2;
        const numPoints = 16;

        for (let i = 0; i < numPoints; i++) {
          const angle = (p.TWO_PI / numPoints) * i - p.HALF_PI;
          const r = 400 + p.random(-150, 150);
          points.push(p.createVector(
            cx + Math.cos(angle) * r,
            cy + Math.sin(angle) * r
          ));
        }

        // Interpolate for smooth track
        for (let i = 0; i < points.length; i++) {
          const p0 = points[(i - 1 + points.length) % points.length];
          const p1 = points[i];
          const p2 = points[(i + 1) % points.length];
          const p3 = points[(i + 2) % points.length];

          for (let t = 0; t < 1; t += 0.05) {
            const x = catmullRom(p0.x, p1.x, p2.x, p3.x, t);
            const y = catmullRom(p0.y, p1.y, p2.y, p3.y, t);
            twistyTrackPoints.push(p.createVector(x, y));
          }
        }

        // Place cones along track edges
        for (let i = 0; i < twistyTrackPoints.length; i += 4) {
          const pt = twistyTrackPoints[i];
          const next = twistyTrackPoints[(i + 1) % twistyTrackPoints.length];
          const dx = next.x - pt.x;
          const dy = next.y - pt.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) continue;
          const nx = -dy / len;
          const ny = dx / len;
          const tw = level.trackWidth / 2;

          cones.push({ x: pt.x + nx * tw, y: pt.y + ny * tw });
          cones.push({ x: pt.x - nx * tw, y: pt.y - ny * tw });
        }

        // Scatter coins along the track center
        for (let i = 0; i < twistyTrackPoints.length; i += 12) {
          const pt = twistyTrackPoints[i];
          coins.push({
            x: pt.x + p.random(-30, 30),
            y: pt.y + p.random(-30, 30),
            collected: false,
            bobOffset: p.random(p.TWO_PI),
          });
        }
      };

      const catmullRom = (p0: number, p1: number, p2: number, p3: number, t: number) => {
        return 0.5 * (
          (2 * p1) +
          (-p0 + p2) * t +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
        );
      };

      const generateObstacles = (count: number, w: number, h: number) => {
        for (let i = 0; i < count; i++) {
          let x: number, y: number;
          do {
            x = p.random(100, w - 100);
            y = p.random(100, h - 100);
          } while (p.dist(x, y, w / 2, h / 2) < 150);
          obstacles.push({ x, y, w: 40, h: 40, color: [255, 100, 0] });
        }
      };

      // ========== DRAW GAME ==========
      const drawGame = () => {
        const level = LEVELS[currentLevel];

        // Camera follow
        camX = car.pos.x - CW / 2;
        camY = car.pos.y - CH / 2;
        camX = p.constrain(camX, 0, level.width - CW);
        camY = p.constrain(camY, 0, level.height - CH);

        p.push();
        p.translate(-camX, -camY);

        // Ground
        if (level.type === "openWorld") {
          drawOpenWorldGround(level);
        } else if (level.type === "twisty") {
          drawTwistyTrackGround(level);
        } else {
          drawTrackGround(level);
        }

        // Borders
        p.stroke(255, 0, 0);
        p.strokeWeight(4);
        p.noFill();
        p.rect(0, 0, level.width, level.height);

        // Obstacles
        obstacles.forEach((obs) => {
          p.fill(obs.color[0], obs.color[1], obs.color[2]);
          p.noStroke();
          p.rect(obs.x, obs.y, obs.w, obs.h, 3);
        });

        // Cones + collision check (cones kill the player)
        cones.forEach((cone) => {
          drawCone(cone.x, cone.y);
          if (p.dist(car.pos.x, car.pos.y, cone.x, cone.y) < 22) {
            crashDetected = true;
          }
        });

        // Coins
        coins.forEach((coin) => {
          if (!coin.collected) {
            drawCoin(coin);
            // Collection check
            if (p.dist(car.pos.x, car.pos.y, coin.x, coin.y) < 25) {
              coin.collected = true;
              totalCoins++;
              score += 10;
            }
          }
        });

        // Car
        car.update(level.width, level.height);
        car.display(equippedDecal);

        // Drift score
        if (car.isDrifting()) {
          score += 1;
        }

        // Check obstacle collisions
        obstacles.forEach((obs) => {
          if (car.checkCollision(obs)) {
            crashDetected = true;
          }
        });

        p.pop();

        // Update time
        time += 1 / 60;

        // Check time limit
        if (time > LEVELS[currentLevel].targetTime) {
          gameState = GAME_STATE.LEVEL_COMPLETE;
        }
        if (crashDetected) {
          gameState = GAME_STATE.GAME_OVER;
        }

        // HUD
        drawHUD();
      };

      const drawCone = (x: number, y: number) => {
        p.noStroke();
        // Base plate
        p.fill(200, 80, 0);
        p.rect(x - 16, y + 12, 32, 6, 2);
        // Main cone body
        p.fill(255, 100, 0);
        p.triangle(x - 14, y + 14, x + 14, y + 14, x, y - 16);
        // White stripes
        p.fill(255, 255, 255);
        p.quad(x - 7, y + 4, x + 7, y + 4, x + 4, y - 3, x - 4, y - 3);
        p.quad(x - 3, y - 6, x + 3, y - 6, x + 1, y - 11, x - 1, y - 11);
      };

      const drawCoin = (coin: any) => {
        const bob = Math.sin(p.frameCount * 0.05 + coin.bobOffset) * 3;
        p.fill(255, 215, 0);
        p.stroke(200, 170, 0);
        p.strokeWeight(1);
        p.ellipse(coin.x, coin.y + bob, 16, 16);
        p.fill(255, 235, 50);
        p.noStroke();
        p.ellipse(coin.x, coin.y + bob, 10, 10);
        p.fill(200, 170, 0);
        p.textSize(8);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("$", coin.x, coin.y + bob);
      };

      const drawOpenWorldGround = (level: LevelDef) => {
        // Dark asphalt ground
        p.fill(40);
        p.noStroke();
        p.rect(0, 0, level.width, level.height);

        // Grid lines for depth
        p.stroke(50);
        p.strokeWeight(1);
        for (let x = 0; x < level.width; x += 100) {
          p.line(x, 0, x, level.height);
        }
        for (let y = 0; y < level.height; y += 100) {
          p.line(0, y, level.width, y);
        }

        // Some patches
        p.noStroke();
        p.fill(45);
        for (let i = 0; i < 15; i++) {
          const px = (i * 337) % level.width;
          const py = (i * 571) % level.height;
          p.ellipse(px, py, 150, 100);
        }
      };

      const drawTwistyTrackGround = (level: LevelDef) => {
        // Grass
        p.fill(30, 80, 30);
        p.noStroke();
        p.rect(0, 0, level.width, level.height);

        // Draw track surface
        p.stroke(55);
        p.strokeWeight(level.trackWidth);
        p.noFill();
        p.beginShape();
        twistyTrackPoints.forEach((pt) => {
          p.vertex(pt.x, pt.y);
        });
        p.endShape(p.CLOSE);

        // Center dashed line
        p.stroke(255, 200, 0, 80);
        p.strokeWeight(2);
        for (let i = 0; i < twistyTrackPoints.length; i += 6) {
          if (i % 12 < 6) {
            const a = twistyTrackPoints[i];
            const b = twistyTrackPoints[(i + 3) % twistyTrackPoints.length];
            p.line(a.x, a.y, b.x, b.y);
          }
        }
      };

      const drawTrackGround = (level: LevelDef) => {
        p.fill(40);
        p.noStroke();
        p.rect(0, 0, level.width, level.height);

        p.noFill();
        p.stroke(60);
        p.strokeWeight(level.trackWidth / 2);
        p.rect(100, 100, level.width - 200, level.height - 200, 50);

        p.stroke(255, 200, 0, 80);
        p.strokeWeight(2);
        p.rect(100, 100, level.width - 200, level.height - 200, 50);

        // Finish line
        p.stroke(0, 255, 0);
        p.strokeWeight(3);
        p.line(level.width / 2 - 30, 100, level.width / 2 + 30, 100);
      };

      const drawHUD = () => {
        p.fill(0, 0, 0, 150);
        p.noStroke();
        p.rect(10, 10, 200, 140, 8);

        p.fill(0, 255, 0);
        p.textSize(14);
        p.textAlign(p.LEFT, p.TOP);
        p.textStyle(p.NORMAL);
        p.text(`Speed: ${Math.floor(car.vel.mag() * 10)}`, 20, 20);
        p.text(`Drift Score: ${score}`, 20, 42);
        p.text(`Time: ${Math.floor(time)}s / ${LEVELS[currentLevel].targetTime}s`, 20, 64);
        p.text(`Car: ${currentCar}`, 20, 86);

        p.fill(255, 215, 0);
        p.text(`Coins: ${totalCoins}`, 20, 108);

        const uncollected = coins.filter((c) => !c.collected).length;
        p.fill(180);
        p.text(`Coins left: ${uncollected}`, 20, 128);

        p.fill(150);
        p.textAlign(p.RIGHT, p.TOP);
        p.textSize(12);
        p.text("P = Pause | ESC = Menu | Space = Handbrake", CW - 20, 20);

        // Back button in HUD
        btn(CW - 80, CH - 50, 70, 35, "BACK", () => { gameState = GAME_STATE.MENU; });
      };

      // ========== OVERLAYS ==========
      const drawPauseOverlay = () => {
        p.fill(0, 0, 0, 180);
        p.noStroke();
        p.rect(0, 0, CW, CH);

        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(48);
        p.textStyle(p.BOLD);
        p.text("PAUSED", CW / 2, CH / 2 - 60);
        p.textStyle(p.NORMAL);

        btn(CW / 2 - 100, CH / 2 + 10, 200, 50, "RESUME", () => { gameState = GAME_STATE.PLAYING; });
        btn(CW / 2 - 100, CH / 2 + 75, 200, 50, "MENU", () => { gameState = GAME_STATE.MENU; });
      };

      const drawLevelCompleteScreen = () => {
        p.fill(0, 0, 0, 180);
        p.noStroke();
        p.rect(0, 0, CW, CH);

        p.fill(0, 255, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(48);
        p.textStyle(p.BOLD);
        p.text("LEVEL COMPLETE!", CW / 2, CH / 2 - 100);
        p.textStyle(p.NORMAL);

        p.fill(200);
        p.textSize(22);
        p.text(`Score: ${score}`, CW / 2, CH / 2 - 40);
        p.text(`Time: ${Math.floor(time)}s`, CW / 2, CH / 2 - 10);
        p.fill(255, 215, 0);
        p.text(`Coins: ${totalCoins}`, CW / 2, CH / 2 + 20);

        btn(CW / 2 - 100, CH / 2 + 70, 200, 50, "MENU", () => { gameState = GAME_STATE.MENU; });
      };

      const drawGameOverScreen = () => {
        p.fill(0, 0, 0, 180);
        p.noStroke();
        p.rect(0, 0, CW, CH);

        p.fill(255, 0, 0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(48);
        p.textStyle(p.BOLD);
        p.text("GAME OVER", CW / 2, CH / 2 - 80);
        p.textStyle(p.NORMAL);

        p.fill(200);
        p.textSize(22);
        p.text("Crashed!", CW / 2, CH / 2 - 20);
        p.text(`Score: ${score}`, CW / 2, CH / 2 + 10);

        btn(CW / 2 - 100, CH / 2 + 60, 200, 50, "RETRY", () => { startLevel(); });
        btn(CW / 2 - 100, CH / 2 + 125, 200, 50, "MENU", () => { gameState = GAME_STATE.MENU; });
      };

      // ========== BUTTON HELPER ==========
      const btn = (x: number, y: number, w: number, h: number, label: string, action: () => void) => {
        const hover = p.mouseX > x && p.mouseX < x + w && p.mouseY > y && p.mouseY < y + h;
        p.fill(hover ? p.color(0, 230, 0) : p.color(0, 180, 0));
        p.noStroke();
        p.rect(x, y, w, h, 6);

        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.text(label, x + w / 2, y + h / 2);
        p.textStyle(p.NORMAL);

        if (p.mouseIsPressed && hover && clickCooldown <= 0) {
          action();
          clickCooldown = 15;
        }
      };

      // ========== DRIFTER CLASS ==========
      class Drifter {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        angle: number;
        angularVel: number;
        driftFactor: number;
        friction: number;
        power: number;
        maxSpeed: number;
        steerSpeed: number;
        carKey: string;
        tireMarks: { x: number; y: number; a: number }[];
        handbrake: boolean;
        throttle: number;

        constructor(x: number, y: number, carData: CarData) {
          this.pos = p.createVector(x, y);
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.angle = 0;
          this.angularVel = 0;
          this.driftFactor = carData.drift;
          this.friction = 0.98;
          this.power = carData.speed;
          this.maxSpeed = 8 + carData.speed * 10;
          this.steerSpeed = 0.045;
          this.carKey = currentCar;
          this.tireMarks = [];
          this.handbrake = false;
          this.throttle = 0;
        }

        update(worldW: number, worldH: number) {
          const speed = this.vel.mag();
          this.handbrake = p.keyIsDown(32); // spacebar

          // Throttle
          if (p.keyIsDown(p.UP_ARROW)) {
            this.throttle = p.min(this.throttle + 0.08, 1);
          } else if (p.keyIsDown(p.DOWN_ARROW)) {
            this.throttle = p.max(this.throttle - 0.06, -0.4);
          } else {
            this.throttle *= 0.92;
          }

          // Steering - speed-sensitive, more responsive at speed
          const steerInput = (p.keyIsDown(p.LEFT_ARROW) ? -1 : 0) + (p.keyIsDown(p.RIGHT_ARROW) ? 1 : 0);
          const speedFactor = p.constrain(speed / 3, 0.3, 1.0);
          const driftSteerBoost = this.handbrake ? 1.6 : 1.0;
          const targetAngVel = steerInput * this.steerSpeed * speedFactor * driftSteerBoost;
          this.angularVel = p.lerp(this.angularVel, targetAngVel, 0.3);
          this.angle += this.angularVel;

          // Engine force
          const ef = p5.Vector.fromAngle(this.angle);
          ef.mult(this.throttle * this.power);
          this.acc.add(ef);

          this.vel.add(this.acc);

          // Drift physics - decompose velocity into forward and lateral
          const fDir = p5.Vector.fromAngle(this.angle);
          const lDir = p5.Vector.fromAngle(this.angle + p.HALF_PI);
          const fSpeed = this.vel.dot(fDir);
          const lSpeed = this.vel.dot(lDir);

          // Lateral grip depends on handbrake and drift factor
          // Lower grip = more slide = more drift
          const gripLoss = this.handbrake ? 0.82 : this.driftFactor;
          // Quadratic slip model inspired by Drift Hunters Pro:
          // more slip angle = less grip recovery
          const slipAngle = Math.abs(Math.atan2(lSpeed, Math.abs(fSpeed) + 0.001));
          const slipGrip = gripLoss + (1 - gripLoss) * Math.max(0, 1 - slipAngle * 1.5);

          const nLat = lDir.copy().mult(lSpeed * slipGrip);
          const nFwd = fDir.copy().mult(fSpeed);
          this.vel = nFwd.add(nLat);

          // Rolling friction + drag
          const dragFactor = this.handbrake ? 0.975 : this.friction;
          this.vel.mult(dragFactor);

          // Speed cap
          if (this.vel.mag() > this.maxSpeed) {
            this.vel.setMag(this.maxSpeed);
          }

          // Tire marks anytime the car is turning (steering input)
          const isTurning = Math.abs(this.angularVel) > 0.005 && speed > 0.8;
          if (isTurning) {
            const rearOffset = p5.Vector.fromAngle(this.angle).mult(-8);
            const sideOffset = p5.Vector.fromAngle(this.angle + p.HALF_PI).mult(5);
            this.tireMarks.push(
              { x: this.pos.x + rearOffset.x + sideOffset.x, y: this.pos.y + rearOffset.y + sideOffset.y, a: 150 },
              { x: this.pos.x + rearOffset.x - sideOffset.x, y: this.pos.y + rearOffset.y - sideOffset.y, a: 150 }
            );
            if (this.tireMarks.length > 1500) this.tireMarks.splice(0, 2);
          }

          this.pos.add(this.vel);
          this.acc.mult(0);

          // Borders - soft wall
          const margin = 20;
          const pushBack = 0.3;
          if (this.pos.x < margin) { this.pos.x = margin; this.vel.x *= -pushBack; }
          if (this.pos.x > worldW - margin) { this.pos.x = worldW - margin; this.vel.x *= -pushBack; }
          if (this.pos.y < margin) { this.pos.y = margin; this.vel.y *= -pushBack; }
          if (this.pos.y > worldH - margin) { this.pos.y = worldH - margin; this.vel.y *= -pushBack; }
        }

        isDrifting(): boolean {
          if (this.vel.mag() < 1.5) return false;
          const fDir = p5.Vector.fromAngle(this.angle);
          const dot = Math.abs(p5.Vector.dot(this.vel.copy().normalize(), fDir));
          return dot < 0.88;
        }

        display(decal: string | null) {
          // Draw tire marks
          this.tireMarks.forEach((m) => {
            p.fill(30, 30, 30, m.a);
            p.noStroke();
            p.ellipse(m.x, m.y, 6, 6);
            m.a -= 0.4;
          });
          this.tireMarks = this.tireMarks.filter((m) => m.a > 0);

          p.push();
          p.translate(this.pos.x, this.pos.y);
          p.rotate(this.angle);

          CARS[this.carKey].drawFn(p, 1, decal);

          p.pop();
        }

        checkCollision(obs: any): boolean {
          const dx = this.pos.x - (obs.x + obs.w / 2);
          const dy = this.pos.y - (obs.y + obs.h / 2);
          return Math.sqrt(dx * dx + dy * dy) < 30;
        }
      }

      // ========== INPUT ==========
      p.keyPressed = () => {
        if (p.key === "p" || p.key === "P") {
          if (gameState === GAME_STATE.PLAYING) gameState = GAME_STATE.PAUSED;
          else if (gameState === GAME_STATE.PAUSED) gameState = GAME_STATE.PLAYING;
        }
        if (p.keyCode === 27) { // ESC
          if (gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED) {
            gameState = GAME_STATE.MENU;
          } else if (gameState !== GAME_STATE.MENU) {
            gameState = GAME_STATE.MENU;
          }
        }
      };

      p.mouseWheel = (event: any) => {
        if (gameState === GAME_STATE.GARAGE) {
          garageScroll += event.delta * 0.5;
          garageScroll = Math.max(0, garageScroll);
        } else if (gameState === GAME_STATE.DECAL_SHOP) {
          shopScroll += event.delta * 0.5;
          shopScroll = Math.max(0, shopScroll);
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.15)] border-2 border-foreground/20"
    />
  );
};

export default DriftGame;
