// https://kylemcdonald.github.io/cv-examples/

const p5 = require("p5");
const jsfeat = require("./jsfeat.js");

var cnv;
var capture;
var curpyr, prevpyr, pointCount, pointStatus, prevxy, curxy;
var w = 640;
var h = 480;
var maxPoints = 1000;



//Define a variable that determines how many times a compass direction must appear before it is set
var minFreq = 10;
//Define a map with key as compass direction and value as the number of occurences. Used as a frequency map
var compassFreq = new Map([
    ['', 0], ['N', 0], ['S', 0], ['W', 0], ['E', 0], ['NE', 0], ['SE', 0], ['NW', 0], ['SW', 0]
]);
//Remember the old direction that was being drawn 
var oldDirection;




function addPoint(x, y) {
    if (pointCount < maxPoints) {
        var pointIndex = pointCount * 2;
        curxy[pointIndex] = x;
        curxy[pointIndex + 1] = y;
        pointCount++;
    }
}

function prunePoints() {
    var outputPoint = 0;
    for (var inputPoint = 0; inputPoint < pointCount; inputPoint++) {
        if (pointStatus[inputPoint] == 1) {
            if (outputPoint < inputPoint) {
                var inputIndex = inputPoint * 2;
                var outputIndex = outputPoint * 2;
                curxy[outputIndex] = curxy[inputIndex];
                curxy[outputIndex + 1] = curxy[inputIndex + 1];
            }
            outputPoint++;
        }
    }
    pointCount = outputPoint;
}

//a function that calculates the direction between two points and draws it on the video
function drawCompass(p, x1, y1, x2, y2) {
    //previous(1) and current (2) coordinates

    //modify the direction string to add in the compass directions
    let direction = "";
    direction = direction.concat((y2 > y1 ? "N" : y2 < y1 ? "S" : ""));
    direction = direction.concat((x2 > x1 ? "W" : x2 < x1 ? "E" : ""));
    console.log(direction)

    //check if this direction occured enough times. If so, set oldDirection and reset frequencies
    if (compassFreq.get(direction) + 1 >= minFreq) {
        oldDirection = direction;
        for (let key of compassFreq.keys()) {
            compassFreq.set(key, 0);
        }
    } else {    //otherwise, increment the direction
        compassFreq.set(direction, compassFreq.get(direction) + 1);
    }

    //Always draw the old direction. This direction may change
    if (oldDirection) {
        p.textSize(32);
        p.text(oldDirection, 10, 30);
        p.fill(0, 102, 153);
    }
}


const p5Flow = (p) => {
    p.setup = () => {
        capture = p.createCapture({
            audio: false,
            video: {
                width: w,
                height: h
            }
        }, function() {
            console.log('capture ready.')
        });
        capture.elt.setAttribute('playsinline', '');
        cnv = p.createCanvas(w, h);
        capture.size(w, h);
        capture.hide();
    
        curpyr = new jsfeat.pyramid_t(3);
        prevpyr = new jsfeat.pyramid_t(3);
        curpyr.allocate(w, h, jsfeat.U8C1_t);
        prevpyr.allocate(w, h, jsfeat.U8C1_t);
    
        pointCount = 0;
        pointStatus = new Uint8Array(maxPoints);
        prevxy = new Float32Array(maxPoints * 2);
        curxy = new Float32Array(maxPoints * 2);
    }

    p.draw = () => {
        p.image(capture, 0, 0, w, h);
        capture.loadPixels();
        if (capture.pixels.length > 0) { // don't forget this!
            var xyswap = prevxy;
            prevxy = curxy;
            curxy = xyswap;
            var pyrswap = prevpyr;
            prevpyr = curpyr;
            curpyr = pyrswap;

            // these are options worth breaking out and exploring
            var winSize = 20;
            var maxIterations = 30;
            var epsilon = 0.01;
            var minEigen = 0.001;

            jsfeat.imgproc.grayscale(capture.pixels, w, h, curpyr.data[0]);
            curpyr.build(curpyr.data[0], true);
            jsfeat.optical_flow_lk.track(
                prevpyr, curpyr,
                prevxy, curxy,
                pointCount,
                winSize, maxIterations,
                pointStatus,
                epsilon, minEigen);
            prunePoints();

            for (var i = 0; i < pointCount; i++) {
                var pointOffset = i * 2;
                p.ellipse(curxy[pointOffset], curxy[pointOffset + 1], 8, 8);
            }

            //Determine the direction that points are moving by looking at 
            //curxy and prevxy. Note that the arrays were swapped at this point
            //only draw if there is at least 1 point drawn.
            if (pointCount != 0) {
                drawCompass(p, curxy[0], curxy[1], prevxy[0], prevxy[1]);
            }
        }
    }

    //add a point if the mouse is pressed
    p.mousePressed = () => {
        addPoint(p.mouseX, p.mouseY);
    }
}

const myp5 = new p5(p5Flow, "visual1");