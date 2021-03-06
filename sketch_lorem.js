var cover;

var smaller;

var scl;

var w, h;

var allImages = [];

var brgValues = [];


//Firebase
var database;
//END Firebase


var immaginiDaUsare = [];
var quadratiNeri = 0;
var fotoUsate = 0;

var numeroUtilizzi = [];
var numeroMaxUtilizzi = 30;


//elisa
var zoom0 = 10;
var zoom1 = 18;
var zoom2 = 45;
var zoom3 = 80;

var cnv;
var mosaic_w;
var mosaic_y;
var mosaic_x;

var zoomInButton;
var zoomOutButton;
var leftButton;
var rightButton;
var topButton;
var downButton;

var mosaic_shift;

var elisa_x = 0;
var elisa_y = 0;

var loading = 0;
var loadingText;
var spinner;
////////////////////////////////////

function preload() {
  //load cover
  cover = loadImage('assets/cover14-a.jpg');

  firebaseConfiguration();
}

function firebaseConfiguration() {

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDRzxo_AJMjYQC75jb67nC006ayqVKuB1g",
    authDomain: "photo-mosaic-a57e8.firebaseapp.com",
    databaseURL: "https://photo-mosaic-a57e8.firebaseio.com",
    projectId: "photo-mosaic-a57e8",
    storageBucket: "photo-mosaic-a57e8.appspot.com",
    messagingSenderId: "176965774377",
    appId: "1:176965774377:web:d4739cd2e523076ef28038"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  var ref = database.ref('photos');
  ref.once('value', gotData, errData);
}


function gotData(data) {
  //if loading == 1 --> downloading the images
  loading++;

  console.log('gotData starting');
  var photolistings = selectAll('photolisting');

  for (let i = 0; i < photolistings.length; i++) {
    photolistings[i].remove();
  }

  var photos = data.val();
  var keys = Object.keys(photos);
  console.log('numero di foto caricate = ' + keys.length);

  for (let j = 0; j < keys.length; j++) {
    let k = keys[j];
    let photo_img = photos[k].photo_img;
    //load tiles for the mosaic
    allImages[j] = loadImage(photo_img);

    //  console.log(j);
    //console.log(allImages[j]);

    if (j == keys.length - 1) {
      findNumeroMaxUtilizzi();
      setTimeout(findImageBrightness, keys.length);
    }
  }

  // numeroUtilizzi.length = allImages.length;
  for (var l = 0; l < allImages.length; l++) {
    numeroUtilizzi[l] = 0;
  }
  console.log('numeroUtilizzi');
  //console.log(numeroUtilizzi);

  console.log('gotData ending');
  //console.log(allImages);
}

function errData(err) {
  console.log('Error');
  console.log(err);
}


function findNumeroMaxUtilizzi() {
  var tilesNeeded = w * h;
  console.log(tilesNeeded);
  var tilesAvailable = allImages.length;
  var tilesRatio = (tilesAvailable / tilesNeeded) * 100;

  if (tilesRatio <= 1) {
    numeroMaxUtilizzi = 25;
  } else if (tilesRatio > 1 && tilesRatio <= 2.5) {
    numeroMaxUtilizzi = 20;
  } else if (tilesRatio > 2.5 && tilesRatio <= 5) {
    numeroMaxUtilizzi = 15;
  } else if (tilesRatio > 5 && tilesRatio <= 10) {
    numeroMaxUtilizzi = 8;
  } else if (tilesRatio > 10 && tilesRatio <= 20) {
    numeroMaxUtilizzi = 4;
  } else if (tilesRatio > 20 && tilesRatio <= 40) {
    numeroMaxUtilizzi = 3;
  } else if (tilesRatio > 40 && tilesRatio <= 65) {
    numeroMaxUtilizzi = 2;
  } else if (tilesRatio > 65) {
    numeroMaxUtilizzi = 1;
  }
}

function setup() {
  cnv = createCanvas(800, 800);
  cnv.class('mosaic');

  cover.width = 800;
  cover.height = 800;

  scl = zoom0;
  mosaic_w = cover.width;
  mosaic_y = cover.x;
  mosaic_x = cover.y;

  mosaic_y = 400;

  console.log('width ' + mosaic_w);

  w = floor(cover.width / scl);
  h = floor(cover.height / scl);
  smaller = createImage(w, h);
  smaller.copy(cover, 0, 0, cover.width, cover.height, 0, 0, w, h);

  showButtons();
}

function showButtons() {

  this.newButton = function(_name, _class, _action, _parent) {
    const button = createButton(_name);
    button.addClass(_class);
    button.parent(_parent);
    button.mousePressed(_action);
    return button;
  }

  this.openIndex = function() {
    window.open('index.html', '_self');
  }

  this.initialize = function() {
    // open homepage
    let backIcon = '<svg style="width:100px;height:100px" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>';
    backButton = this.newButton(backIcon, "iconButton", openIndex, "header");
    backButton.hide();
    zoomInButton = this.newButton('zoom In', "zoomInButton, mosaicButton", zoomIn, "header");
    zoomInButton.hide();
    zoomOutButton = this.newButton('zoom Out', "zoomOutButton, mosaicButton", zoomOut, "header");
    zoomOutButton.hide();
    leftButton = this.newButton('left', "leftButton, mosaicButton", left, "header");
    leftButton.hide();
    rightButton = this.newButton('right', "rightButton, mosaicButton", right, "header");
    rightButton.hide();
    topButton = this.newButton('top', "topButton, mosaicButton", up, "header");
    topButton.hide();
    downButton = this.newButton('down', "downButton, mosaicButton", down, "header");
    downButton.hide();

  }
  this.initialize();
}


function draw() {
  loadingText = select('#loading_text');
  spinner = select('#spinner');

  if (loading == 0) {
    loadingText.html('');
  } else if (loading == 1) {
    loadingText.html('Downloading ' + allImages.length +' images');
  } else if (loading == 2) {
    loadingText.html('Analyzing the average brightness of each image');
  } else if (loading == 3) {
    loadingText.html('Analyzing the brightness of each pixel of the cover');
  }

}

function zoomIn() {
  mosaic_shift = w;

  leftButton.show();
  rightButton.show();
  topButton.show();
  downButton.show();

  if (scl == zoom0) {
    scl = zoom1;
    mosaic_shift = w;

  } else if (scl == zoom1) {
    scl = zoom2;
    mosaic_shift = w * 2;
  } else if (scl == zoom2) {
    scl = zoom3;
    mosaic_shift = w * 3;
  }
  drawMosaic();
}

function zoomOut() {

  if (scl == zoom3) {
    scl = zoom2;
    mosaic_shift = w * 2;
  } else if (scl == zoom2) {
    scl = zoom1;
    mosaic_shift = w;
  } else if (scl == zoom1) {
    elisa_x = 0;
    elisa_y = 0;
    scl = zoom0;
    leftButton.hide();
    rightButton.hide();
    topButton.hide();
    downButton.hide();
  }
  drawMosaic();
}

function right() {
  if (elisa_x <= (cnv.width - w * scl)) {
    elisa_x = (cnv.width - w * scl);
  } else {
    elisa_x -= mosaic_shift;
    console.log(cnv.width - w * scl);
    console.log('elisa x :' + elisa_x);
  }
  drawMosaic();
}

function left() {
  if (elisa_x >= 0) {
    elisa_x = 0;
  } else {
    elisa_x += mosaic_shift;
  }
  drawMosaic();
}

function down() {
  if (elisa_y <= (cnv.height - h * scl)) {
    elisa_y = cnv.height - h * scl;
  } else {
    elisa_y -= mosaic_shift;
  }
  drawMosaic();
}

function up() {
  if (elisa_y >= 0) {
    elisa_y = 0;
  } else {
    elisa_y += mosaic_shift;
  }
  drawMosaic();
}

function analyzeCoverPixels() {
  //if loading == 3 --> analyzing the brightness of the cover
  loading++;

  //console.log(brgValues);

  smaller.loadPixels();
  // for every pixel of the cover (resized)
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      //index = numero del pixel della cover
      var index = x + y * w;

      //get the color of the pixel
      var tempC = smaller.get(x, y);

      // push();

      var tempB = int(brightness(tempC));

      //find the fist submitted photo with brightness == to the pixel of the cover
      for (i = 0; i < allImages.length; i++) {

        if (tempB == brgValues[i]) {
          var index = x + y * w;

          if (numeroUtilizzi[i] < numeroMaxUtilizzi) {
            //console.log(allImages[i] + ' used');
            numeroUtilizzi[i] += 1;
            immaginiDaUsare[index] = allImages[i];

            //in order not to have the same tile in many adjacent pixel with the same brightness value
            //copy the values at the end of the array
            allImages.push(allImages[i]);
            brgValues.push(brgValues[i]);
            numeroUtilizzi.push(numeroUtilizzi[i]);
            //and remove the used image from its original position in the arrays
            //and probably in the next cycle another matching image will be find before the one used here
            allImages.splice(i, 1);
            brgValues.splice(i, 1);
            numeroUtilizzi.splice(i, 1);

          } else if (numeroUtilizzi[i] == numeroMaxUtilizzi) {
            //console.log(allImages[i] + ' removed');
            allImages.splice(i, 1);
            brgValues.splice(i, 1);
            numeroUtilizzi.splice(i, 1);
          }
          //end the for cycle
          //analyze the next pixel of the cover
          i = allImages.length;
        }
      }
    }
  }

  drawMosaic();

  var tiles_utilizzate = quadratiNeri + fotoUsate
  //console.log('tiles necessarie = ' + smaller.width * smaller.height);
  //console.log('tiles utilizzate = ' + tiles_utilizzate);

  console.log(numeroUtilizzi);
  noLoop();
}

function drawMosaic() {
  spinner.hide();
  loadingText.hide();

  zoomInButton.show();
  zoomOutButton.show();
  backButton.show();

  clear();
  fill('black');
  rect(0, 0, width, height);
  //for every pixel of the cover (resized)
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {

      let index = x + y * w;

      if (immaginiDaUsare[index] != null) {
        //draw the image corresponding to each cover pixel
        image(immaginiDaUsare[index], (x * scl) + elisa_x, (y * scl) + elisa_y, scl, scl);

        fotoUsate++;
        // console.log('foto usate = ' + fotoUsate);
      }
    }
  }
}



//for each image available...
function findImageBrightness() {
  //if loading == 2 --> mesuring the average brightness of each image
  loading++;

  for (let i = 0; i < allImages.length; i++) {
    // allImages[i].filter(GRAY);
    allImages[i].loadPixels();

    var rSum = 0;
    var gSum = 0;
    var bSum = 0;
    var r, g, b;
    var c;

    //...sum the r,g,b values of each pixel...
    for (let x = 0; x < allImages[i].width; x++) {
      for (let y = 0; y < allImages[i].height; y++) {
        c = allImages[i].get(x, y);
        rSum += c[0];
        gSum += c[1];
        bSum += c[2];
      }
    }

    //...then divide for the number of pixels that compose the image to find the average r,g,b values...
    var pixNumber = allImages[i].pixels.length / 4;
    r = floor(rSum / pixNumber);
    g = floor(gSum / pixNumber);
    b = floor(bSum / pixNumber);

    //...and find the hue ov the average color of the image...
    var avgRGB = color(r, g, b);
    push();
    colorMode(HSB, 360, 100, 100, 1);

    var avgBrg = floor(brightness(avgRGB));
    pop();

    //...and store the average brightness value of each image in an array
    brgValues[i] = avgBrg;

    //console.log('immagine ' + i);
    //  console.log('brightness ' + avgBrg);
  }
  analyzeCoverPixels();
}
