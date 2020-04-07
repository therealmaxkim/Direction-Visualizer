A Direction Visualizer built using p5 and jsfeat and kylemcdonald's CV examples. Created by Max Kim


1. All of the code is located at /src/index.html and /src/app.js. A majority of the code is located under the function, "drawCompass". 

2. Run "npm install" and then "npm start". Navigate to localhost:3000

3. Click on a certain point and move it around. The direction of which it moves will be shown on the top left. 


4. Basic overview of how this works

When you click on the video, a point is made and the coordinates are saved. It is tracked and when it has a precious lockon, the point should turn blue. At every draw, I determine the compass direction that the point has moved based on the difference between current and previous coordinates at each draw. Then, I use a frequency map to keep track of how many times the code thinks a certain direction was made. If it determines that the point is going "west", say 10 times, then it will display "west" on the screen. I use a frequency map because it is easy to use and I also need a way to stablize the output because the code will fluctuate between different compass directions. However, when it is certain that a point is moving in "southwest", it will output "southwest" say 50 times in a row. I keep track of what direction the code has determined and update that to render the text. 

I have put constants to determine the threshold that the code has to output a compass direction before it shows it on the screen, on top of app.js
