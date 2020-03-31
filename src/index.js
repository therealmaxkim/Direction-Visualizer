import App from "./js/components/App";

import Meyda from "Meyda";
import StartAudioContext from "startaudiocontext";
import p5 from "p5";
import dat from "dat.gui";


let lastFeatures = null;
let bufferSize = 512;
let canvasWidth = 1600;
let canvasHeight = 570;
let params = {
    movingStarSizeScale: 0.5,
    starSpeed: 20,
    barSizeScale: 0.5,
    drawBeforeReset: 50,
    starSizeScale: 0.5
};

//a function that returns a random X coordinate within canvas width range
function randomX() {
    return Math.floor(Math.random() * canvasWidth);
}
//a function that returns a random Y coordinate within canvas height range
function randomY() {
    return Math.floor(Math.random() * canvasHeight);
}

//a function that sets up the analyzer and connects the audio features to the website to show levels changing
function setupAnalyzer() {
    const audioContext = new AudioContext();
    StartAudioContext(audioContext);
    const htmlAudioElement = document.getElementById("audio");
    const source = audioContext.createMediaElementSource(htmlAudioElement);
    source.connect(audioContext.destination);

    //show all of the audio features on the website
    const rmsRangeElement = document.getElementById("rmsRange");
    const zcrRangeElement = document.getElementById("zcrRange");
    const energyRangeElement = document.getElementById("energyRange");
    const spectralcentroidRangeElement = document.getElementById("spectralcentroidRange");
    const spectralflatnessRangeElement = document.getElementById("spectralflatnessRange");
    const spectralslopeRangeElement = document.getElementById("spectralslopeRange");
    const spectralrolloffRangeElement = document.getElementById("spectralrolloffRange");
    const spectralspreadRangeElement = document.getElementById("spectralspreadRange");
    const spectralskewnessRangeElement = document.getElementById("spectralskewnessRange");
    const spectralkurtosisRangeElement = document.getElementById("spectralkurtosisRange");

    if (typeof Meyda === "undefined") {
        console.log("Meyda could not be found! Have you included it?");
    }
    else {
        const analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": audioContext,
            "source": source,
            "bufferSize": 512,
            "featureExtractors": ["rms", "zcr", "energy", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "loudness"],
            "callback": features => {
                //console.log(features);
                lastFeatures = features;
                rmsRangeElement.value = features.rms;
                zcrRangeElement.value = features.zcr;
                energyRangeElement.value = features.energy;
                spectralcentroidRangeElement.value = features.spectralCentroid;
                spectralflatnessRangeElement.value = features.spectralFlatness;
                spectralslopeRangeElement.value = features.spectralSlope;
                spectralrolloffRangeElement.value = features.spectralRolloff;
                spectralspreadRangeElement.value = features.spectralSpread;
                spectralskewnessRangeElement.value = features.spectralSkewness;
                spectralkurtosisRangeElement.value = features.spectralKurtosis;
            }
        });
        analyzer.start();
    }
}

function setupDrawing() {
    //the first drawing, a bunch of moving stars.
    const dots = (p) => {
        let gui = new dat.GUI();
        gui.add(params, "movingStarSizeScale", 0, 1);
        gui.add(params, "starSpeed", 1, 50);

        p.setup = () => {
            p.createCanvas(canvasWidth, canvasHeight);
            p.background('darkblue');
        }

        p.draw = () => {
            p.noStroke();
            //reset the drawing every draw
            p.background('darkblue');   
            //check that audio feature exists
            if (lastFeatures && !Number.isNaN(lastFeatures.spectralSpread)) {
                //defines the number of stars that should be drawn every "draw", emulates speed of drawing
                for (let i=0; i<params.starSpeed; i++) {
                    //remember the original position at (0,0)
                    p.push();
                    let dotHeight = lastFeatures.spectralSpread*params.movingStarSizeScale;
                    //draw after translating from (0,0)
                    p.translate(randomX(), randomY());
                    //draw the star
                    for (let j=0; j<10; j++) {
                        p.ellipse(0, dotHeight, 10, 50);
                        p.rotate((p.PI/5));
                    }
                    //reset back to the original position (0,0) because translating is cumulative
                    p.pop();
                }
            } 
        }
    }

    //the second drawing with bars
    const bars = (p) => {
        let gui = new dat.GUI();
        gui.add(params, "barSizeScale", 0, 1);

        p.setup = () => {
            p.createCanvas(canvasWidth, canvasHeight);
            p.background('lightblue');
        }

        p.draw = () => {
            //reset the drawing at every "draw"
            p.background('lightblue');
            p.noStroke();
            //check that the audio feature exists
            if (lastFeatures && !Number.isNaN(lastFeatures.rms)) {
                let barHeight = lastFeatures.rms*params.barSizeScale*800;
                let colors = ['white', 'yellow', 'green', 'brown'];
                let barsPerColumn = 3;

                //start the starting at a height slightly below the top
                p.translate(0, 75);
                for (let i=0; i<12; i++) {
                    //change the color and width of the next column. 
                    if (i % barsPerColumn == 0) {
                        p.translate(125, 0);
                        let index = (i == 0) ? 0 : Math.floor(i/barsPerColumn);
                        p.fill(colors[index]);
                    }
                    //draw the bar
                    p.rect(0, 175*(i%barsPerColumn), 50, barHeight);
                }
            }
        }
    }

    const stars = (p) => {
        let gui = new dat.GUI();
        gui.add(params, "starSizeScale", 0, 1);
        gui.add(params, "drawBeforeReset", 1, 500);
        //a variable to remember how many shapes you draw before resetting the canvas
        var shapeLeft;

        p.setup = () => {
            p.createCanvas(canvasWidth, canvasHeight);
            p.background('darkblue');
            shapeLeft = params.drawBeforeReset;
        }

        p.draw = () => {
            p.noStroke();

            //check if the number of shapes is less than or equal to zero. Less than may occur if we update the drawBeforeReset on GUI
            if (shapeLeft <= 0) {
                p.background('#fae');
                shapeLeft = params.drawBeforeReset;
            }
            
            if (lastFeatures && !Number.isNaN(lastFeatures.spectralSpread)) {
                let starHeight = lastFeatures.spectralSpread*params.starSizeScale;
                //draw the star at a random coordinate
                p.translate(randomX(), randomY());
                for (let j=0; j<10; j++) {
                    p.ellipse(0, starHeight, 10, 50);
                    p.rotate((p.PI/5));
                }
                //decrement the shapeLeft so that we keep track of how many remaining shapes to draw before reset
                shapeLeft--;
            }
        }
    }

    const mydots = new p5(dots, "drawing");
    const mybars = new p5(bars, "drawing2");
    const mystars = new p5(stars, "drawing3");

}

//wait for the window to load before setting up
window.onload = function() { 
    setupAnalyzer();
    setupDrawing();
}
