let mapImg;
let stamps = [];
let spaceMono;
let topOffset = 0; // amount of space to push the map down

let debugLines = [];
let DEBUG = true;
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

  let details = navigator.userAgent;

  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details
  it returns boolean value*/
  let isMobileDevice = regexp.test(details);
  logDebug(details);
  logDebug(isMobileDevice);

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
    if(s.isHovered && (clicked || isMobileDevice){
      
      window.open(s.link, "_blank");
      clicked = false;
    }

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

function handlePress(px, py, source = "unknown") {
let p = getCanvasPointer(px, py);
  px = p.x;
  py = p.y;
  logDebug(source + " press @ " + px.toFixed(1) + ", " + py.toFixed(1));

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
  
  let hitIndex = -1;

  for (let i = 0; i < stamps.length; i++) {
    let s = stamps[i];

    let stampX = mapX - drawWidth / 2 + drawWidth * s.xPercent;
    let stampY = mapY - drawHeight / 2 + drawHeight * s.yPercent;

    let stampW = drawWidth * s.sizePercent;
    let hitRadius = stampW * 0.7; // bigger tap target for mobile
    
logDebug(
  "stamp " + i +
  " | X: " + stampX.toFixed(1) +
  " | Y: " + stampY.toFixed(1) +
  " | mapX: " + mapX +
  " | mapY: " + mapY +
  " | drawW: " + drawWidth +
  " | drawH: " + drawHeight
);
    if (dist(px, py, stampX, stampY) < hitRadius) {
      hitIndex = i;
      logDebug("✅ HIT stamp " + i);
      window.open(s.link, "_blank");
      break;
    }
  }

  if (hitIndex === -1) logDebug("❌ NO HIT");
}

function mousePressed() {
  //handlePress(mouseX, mouseY, "mouse");
  clicked = true;
  logDebug("✅ mouse press default" );
}

function mouseReleased() {
  console.log("Mouse button released!");
  clicked = false;
}


  


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
