
/*
    Little JS TypeScript Demo
    - A simple starter project
    - Shows how to use LittleJS with modules
*/

'use strict';

import {engineInit, glSetAntialias, setCanvasMaxSize, setGravity, vec2} from 'littlejsengine';
import {GameScene, IntroScene, Scene} from "./scene.ts";

let currentScene: Scene;

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    currentScene = new IntroScene()
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

setCanvasMaxSize(vec2(720, 1280));
setGravity(-0.01)
// setTouchGamepadEnable(true)
glSetAntialias( false)

// Startup LittleJS Engine
engineInit(
    gameInit,
    gameUpdate,
    gameUpdatePost,
    gameRender,
    gameRenderPost,
    ['black_cat.png']);