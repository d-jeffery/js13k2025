import {vec2} from "littlejsengine";
import {WindowSill} from "./sprites.ts";

export class Building {

    constructor() {

        new WindowSill(vec2(-5, -6), vec2(2.5, 0.5));

        new WindowSill(vec2(5, -6), vec2(2.5, 0.5));

        for (let i = 0; i <= 24; i += 6) {
            new WindowSill(vec2(-5, i), vec2(2.5, 0.5));
            new WindowSill(vec2(0, i), vec2(2.5, 0.5));
            new WindowSill(vec2(5, i), vec2(2.5, 0.5));
        }
    }


}