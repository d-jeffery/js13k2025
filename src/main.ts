
/*
    Little JS TypeScript Demo
    - A simple starter project
    - Shows how to use LittleJS with modules
*/

'use strict';

import {
    engineInit,
    glSetAntialias,
    setCanvasFixedSize, setGamepadsEnable,
    setGravity, setTouchGamepadAnalog,
    setTouchGamepadEnable, setTouchGamepadSize,
    vec2
} from 'littlejsengine';
import {GameScene, IntroScene, Scene} from "./scene.ts";
// import {initPostProcess} from "./postProcessing.ts";


let currentScene: Scene;

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    currentScene = new IntroScene()

    /*const code =
        "void mainImage(out vec4 fragColor, in vec2 fragCoord)" +
        "{" +
            "vec2 uv = fragCoord.xy / iResolution.xy;" +
            "vec4 waterColor = vec4(1.0);" +
            "float reflactionY = 0.16;" +
            "if (uv.y <= reflactionY) {" +
                "float oy = uv.y;" +
                "uv.y = 2.0*reflactionY - uv.y;" +
                "uv.x = uv.x - ((uv.x-0.5)*0.2) * (1.0-oy/reflactionY);" +
                "uv.y = uv.y + sin(1.0/(oy-reflactionY) + iTime *10.0)*0.003;" +
                "waterColor = vec4(0.7, 0.85, 1.0, 1.0);" +
            "}" +
            //"uv.y = 1.0 - uv.y;" +
            "fragColor = texture(iChannel0, uv) * waterColor;" +
        "}"

    initPostProcess(code, false)*/
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    currentScene.update()

    if (currentScene.isFinished()) {
        // Switch to the next scene
        currentScene = new GameScene(); // Replace with your next scene
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {

}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    currentScene.draw()

}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
}

setCanvasFixedSize(vec2(720, 1280))
setGravity(-0.01)
setTouchGamepadEnable(true)
setTouchGamepadAnalog(true)
setTouchGamepadSize(175)
setGamepadsEnable(true)
glSetAntialias( false)

// Startup LittleJS Engine
engineInit(
    gameInit,
    gameUpdate,
    gameUpdatePost,
    gameRender,
    gameRenderPost,
    ['black_cat.png']);