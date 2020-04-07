A Direction Visualizer built using p5 and jsfeat and kylemcdonald's CV examples. Created by Max Kim


1. All of the code is located at /src/index.html and /src/app.js. A majority of the code is located under the function, "drawCompass". 

2. Run "npm install" and then "npm start". Navigate to localhost:3000

3. Click on a certain point and move it around. The direction of which it moves will be shown on the top left. 


4. Basic overview of how this works

When you click on the video, a point is made and the coordinates are saved. It is tracked and when it has a precious lockon, the point should turn blue. At every draw, I determine the compass direction that the point has moved based on the difference between current and previous coordinates at each draw. 

One problem I had was that even though the directions were correct, the output (which compass direction) would fluctate and you get some outliers. For example, you would get 50 "southwest" in a row and then 1 "southeast" thrown in there. The display would change fast because I was drawing this at every "draw" function call. I needed a way to "remember" the past outputs and go with the "majority" of the outputs.

I decided to solve this using a frequency map. I have a constant that is the threshold of when a direction has to occur before it is shown on the screen. I increment on the frequency map when a direction occurs, and if it hits a threshold, I show it on the screen and then reset my map. 

But I still needed a way to stop the text from showing at every "draw" function. The text would only show up for a second and then be erased because in between the frequency map being updated - for example, if my threshold was 10, and I got 50 "northeast" in a row, then it would show for that 1 second after 10 of thoses, then need to wait until the next 10 got filled. Which would make my text blink on and off instead of staying on screen. 

I went with something simple: a variable "oldDirection". I just update this variable to whatever my last code determined to be the direction. This worked well because it would also reset along with the code - for example, if no movement is detected then the compass direction would be an empty string. (which would then erase the text). If 100 of "north" occured and my threshold was 10, it would consistently show that "north" text. 

I have put constants to determine the threshold that the code has to output a compass direction before it shows it on the screen, on top of app.js


One drawback of using the frequency map to determine the majority is that there could be a situation where if I go in a circle, and for every single direction I reach the threshold-1 occurences, then by some chance "southeast" hits the threshold - even if the other directions are just below the cutoff, it would still show "southeast". This implementation only works well for "straight" lines that are consistent - and not for circular motions or curves. 
