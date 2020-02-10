var green_day;
var smaller;
var w,h;
var scl;
var green_day2;
var left_g;
var top_g

var wg;

var leftButton;
var rightButton;
var topButton;
var downButton;

//const scl = 10;

function preload(){
  green_day = loadImage('data/GREEN-DAY.jpg');



  // smaller.copy(green_day,0,0,green_day.width,green_day.height,0,0,w,h)
  // put preload code here
}

function setup() {
  createCanvas(700,700);
  scl = 7;
  wg = 700;
  left_g = 0;
  top_g = 0;

   //smaller = copy(green_day, 0, 0, green_day.width,green_day.height, 0,0,w,h);
   green_day2 = image(green_day, 0, 0, width, height);

   var zoomButton = createButton('zoom-in');
   zoomButton.mousePressed(zoom);
   zoomButton.class('zoom');

   var zoom_out = createButton('zoom-out');
   zoom_out.mousePressed(zoom_out_function);
   zoom_out.class('zoom');

   rightButton = createButton('right');
   rightButton.mousePressed(right_function);
   rightButton.class('zoom');

   leftButton = createButton('left');
   leftButton.mousePressed(left_function);
   leftButton.class('zoom');

   topButton = createButton('top');
   topButton.mousePressed(top_function);
   topButton.class('zoom');

   downButton = createButton('down');
   downButton.mousePressed(down_function);
   downButton.class('zoom');


    leftButton.hide();
    rightButton.hide();
    topButton.hide();
    downButton.hide();

  // put setup code here
}

function draw() {

  green_day2 = image(green_day, left_g, top_g, wg, wg);
  console.log(scl);
  w = (width)/scl;
  h = (height)/scl;
  // image(smaller, 0, 0);
  loadPixels();
  for (var x = 0; x < w; x++) {
      for (var y = 0; y < h; y++){
        let c = get(x*scl,y*scl);
        fill(c);
        noStroke();
        rect(x*scl,y*scl,scl,scl)
    }
  }
  // image(green_day, 0, 0);
  //

  //
//noLoop();
}

function zoom(){

  leftButton.show();
  rightButton.show();
  topButton.show();
  downButton.show();

  if(wg==700){
  scl = 10;
  wg = 1000;
}
else if (wg==1000){
  wg = 2000;
  scl = 20;
}
}

function zoom_out_function(){
    left_g=0;
    top_g=0;

  if(wg==2000){
  scl = 10;
  wg = 1000;

}
else if (wg==1000){
  wg = 700;
  scl = 7;

  leftButton.hide();
  rightButton.hide();
  topButton.hide();
  downButton.hide();

  }

}

function right_function(){
  leftButton.show();
  if(left_g==0){
    left_g=0;
  }
  else{
  left_g+=50;
}
}

function left_function(){
  if (left_g== (-(wg-canvas.width))){
    left_g=(-(wg-canvas.width));
  }
  else{
  left_g-=50;
}
}

function top_function(){
  if (top_g== (-(wg-canvas.height))){
    top_g=(-(wg-canvas.height));
  }
  else{
  top_g-=50;
}
}

function down_function(){
  if(top_g==0){
    top_g=0;
  }
  else{
  top_g+=50;
  }
}
