let mapImg;
let stamps = [];
let spaceMono;
let topOffset = 0; // amount of space to push the map down

let debugLines = [];
let DEBUG = false;
let mapX, mapY, drawWidth, drawHeight;

let cnv;
let clicked = false;

function logDebug(msg) {
  if (!DEBUG) return;
  debugLines.unshift(msg);
  if (debugLines.length > 8) debugLines.pop(); // keep last 8 logs
}

function preload() {
  // Load font
  spaceMono = loadFont('SpaceMono-Regular.ttf');

  // Background map
  mapImg = loadImage('mapFinal.png');

  // Stamps (color + BW pairs)
  stamps = [
    {
      colorImg: loadImage('3.png'),
      bwImg: loadImage('PFP_Black.png'),
      xPercent: 0.58,
      yPercent: 0.38,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/pfpf"
    },
    {
      colorImg: loadImage('1.png'),
      bwImg: loadImage('SJBlack.png'),
      xPercent: 0.68,
      yPercent: 0.52,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/sjf"
    },
    {
      colorImg: loadImage('2.png'),
      bwImg: loadImage('SJB_Black.png'),
      xPercent: 0.43,
      yPercent: 0.42,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/sjbf"
    },
    {
      colorImg: loadImage('5.png'),
      bwImg: loadImage('SMG_Y.png'),
      xPercent: 0.92,
      yPercent: 0.50,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/smgf"
    },
    {
      colorImg: loadImage('6.png'),
      bwImg: loadImage('EC_Black.png'),
      xPercent: 0.31,
      yPercent: 0.77,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/ecf"
    },
    {
      colorImg: loadImage('7.png'),
      bwImg: loadImage('SPW_black.png'),
      xPercent: 0.43,
      yPercent: 0.90,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/spwf"
    },
    {
      colorImg: loadImage('8.8.png'),
      bwImg: loadImage('SMM_Black.png'),
      xPercent: 0.56,
      yPercent: 0.57,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/smmf"
    },
    {
      colorImg: loadImage('8.png'),
      bwImg: loadImage('SGG_Black.png'),
      xPercent: 0.82,
      yPercent: 0.16,
      sizePercent: 0.08,
      link: "https://timothyufit.cargo.site/sggf"
    }
  ];
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

let showMessage = true;
let messagePadding = 10;

function draw() {
  background(23, 22, 22);


  let mapX = width / 2;
  let mapY = height / 2 + topOffset;
  // --- Draw map ---
  let mapAspect = mapImg.width / mapImg.height;
  let canvasAspect = width / height;
  let drawWidth, drawHeight;

  if (canvasAspect > mapAspect) {
    drawHeight = height;
    drawWidth = mapAspect * height;
  } else {
    drawWidth = width;
    drawHeight = width / mapAspect;
  }


  mapX = width / 2;
  mapY = height / 2 + topOffset;

  image(mapImg, mapX, mapY, drawWidth, drawHeight);

  let hovered = false;

  // --- Draw each stamp ---
  for (let s of stamps) {
    let stampX = mapX - drawWidth / 2 + drawWidth * s.xPercent;
    let stampY = mapY - drawHeight / 2 + drawHeight * s.yPercent;
    let stampW = drawWidth * s.sizePercent;
    let stampH = (s.colorImg.height / s.colorImg.width) * stampW;

    // Hover detection
    s.isHovered = dist(mouseX, mouseY, stampX, stampY) < stampW / 2;


    // ✅ REVERSED BEHAVIOR:
    // Default: color
    // Hover: black & white
    let imgToShow = s.isHovered ? s.bwImg : s.colorImg;

    image(imgToShow, stampX, stampY, stampW, stampH);

    if (s.isHovered) hovered = true;

  }

  cursor(hovered ? HAND : ARROW);

  // --- Hide message permanently after first stamp hover ---
  if (hovered) {
    showMessage = false;
  }

  // --- Draw message near cursor until first interaction ---
  if (showMessage) {
    let msg = "Click on the stamp to interact";
    textFont(spaceMono);
    textSize(10);
    textAlign(LEFT, CENTER);

    let tWidth = textWidth(msg);
    let boxWidth = tWidth + messagePadding * 2;
    let boxHeight = 26;

    let x = mouseX + 15;
    let y = mouseY;

    noStroke();
    fill(241, 237, 231);
    rect(x - messagePadding / 2, y - boxHeight / 2, boxWidth, boxHeight, 4);

    fill(0);
    text(msg, x + messagePadding / 2, y);
  }

 // --- DEBUG OVERLAY ---
  if (DEBUG) {
    textFont(spaceMono);
    textSize(11);
    textAlign(LEFT, TOP);

    let padding = 10;
    let lineHeight = 14;
    let boxHeight = debugLines.length * lineHeight + padding * 2;

    noStroke();
    fill(0, 180);
    rect(10, 10, 360, boxHeight, 6);

    fill(0, 255, 0);
    for (let i = 0; i < debugLines.length; i++) {
      text(debugLines[i], 20, 20 + i * lineHeight);
    }
  }

}

function getCanvasPointer(px, py) {
  let rect = cnv.elt.getBoundingClientRect();

  let scaleX = width / rect.width;
  let scaleY = height / rect.height;

  return {
    x: (px - rect.left) * scaleX,
    y: (py - rect.top) * scaleY
  };
}

// Simplified handlePress: only detect clicks and open links — DO NOT redraw the canvas here.
function handlePress() {
  // Compute map draw dimensions (same logic as in draw)
  let mapAspect = mapImg.width / mapImg.height;
  let canvasAspect = width / height;
  let dWidth, dHeight;

  if (canvasAspect > mapAspect) {
    dHeight = height;
    dWidth = mapAspect * height;
  } else {
    dWidth = width;
    dHeight = width / mapAspect;
  }

  let mapCenterX = width / 2;
  let mapCenterY = height / 2 + topOffset;

  // Check each stamp for a click without drawing anything
  for (let s of stamps) {
    let stampX = mapCenterX - dWidth / 2 + dWidth * s.xPercent;
    let stampY = mapCenterY - dHeight / 2 + dHeight * s.yPercent;
    let stampW = dWidth * s.sizePercent;

    if (dist(mouseX, mouseY, stampX, stampY) < stampW / 2) {
      logDebug("click link");
      // Try opening in a new tab; if blocked, navigate in the same tab
      let newWin = window.open(s.link, "_blank");
      if (!newWin) {
        window.location.href = s.link;
      }
      // Stop after first matching stamp
      return;
    }
  }
}

function mousePressed() {
  handlePress();
  logDebug("✅ mouse press default" );
}

// --- Add touch support for mobile Safari ---
function touchStarted(e) {
  // Use the first touch point
  let clientX = null;
  let clientY = null;

  if (touches && touches.length > 0) {
    // p5 'touches' may have x/y relative to the canvas; to be safe, use client coords if available
    clientX = touches[0].clientX !== undefined ? touches[0].clientX : touches[0].x;
    clientY = touches[0].clientY !== undefined ? touches[0].clientY : touches[0].y;
  } else if (e && e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else if (e && e.clientX !== undefined) {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  if (clientX !== null && clientY !== null) {
    let p = getCanvasPointer(clientX, clientY);
    // update p5's mouse coordinates so existing logic that uses mouseX/mouseY works
    mouseX = p.x;
    mouseY = p.y;
  }

  handlePress();
  logDebug("✅ touch start");
  // preventDefault so Safari doesn't also interpret it as a passive scroll or similar
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}