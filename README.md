# Handwriting recognition for Thamizh (Tamil)
Online handwriting recognition and input tool for Thamizh (Tamil).

## Attribution
**Original source for Malayalam:** https://gitlab.com/santhoshtr/hand
**Original demo site:**  https://thottingal.in/projects/hand/

## How it works?
The core logic of recognition is **curve matching**. Predefined curves are saved for each ligatures of Thamizh letters (which is configurable too). Based on the characters drawn by the users, a matching score will be calculated and suggestions will be printed over the screen.

Since people write the letters in random styles, the curve matching should take care of these variations. Scaling up or down, rotation, distortions in the curve, some amount of flexibility for errors etc. For this kind of curve matching we use https://github.com/chanind/curve-matcher which is a https://en.wikipedia.org/wiki/Procrustes_analysis basd curve matching implementation.

## Caution 
There may be false positives as well, due to resemblance between each ligatures

## Training
To add a shape that is not already supported,
1. Open the demo application in a desktop browser (Firefox prefarably)
2. Also open the browser debugger. Draw the shape in the pad, and note down the curve representation printed in the console. This representation is array of coordinates. 
3. Copy the coordinates and add to `src/thamizh.json` file just like other entries in that file. 
4. Remember to re-build the application and refresh the webpage to see the new shape being recognized.

## Building the application
1. After checking out the source code. Run `npm install` to install all dependencies and building tools. 
2. Then run `npm run build`. You will see a dist foler created and production ready JS library in it.
