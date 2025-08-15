import {Color, drawCircle, Vector2} from "littlejsengine";

export function drawGradientCircle(center: Vector2, radius: number, colorStart: Color, colorEnd: Color, steps: number = 20) {
    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const r = radius * (1 - t);
        // Linear interpolation for color
        const color = new Color(
            colorStart.r * (1 - t) + colorEnd.r * t,
            colorStart.g * (1 - t) + colorEnd.g * t,
            colorStart.b * (1 - t) + colorEnd.b * t,
            colorStart.a * (1 - t) + colorEnd.a * t
        );
        drawCircle(center, r, color);
    }
}