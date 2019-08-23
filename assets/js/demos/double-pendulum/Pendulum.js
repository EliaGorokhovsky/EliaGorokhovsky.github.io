import { rk4 } from "./Solver.js";

/**
 * Stores state variables of a single pendulum
 */
export class Pendulum {

    /**
     * Initialize the pendulum
     * @param length: length of the rod in meters
     * @param angle: start angle from vertical
     * @param gravity: gravitational acceleration in meters per second squared
     */
    constructor(radius, length, angle, gravity, mass, airDensity) {
        this.radius = radius;
        this.angularVelocity = 0;
        this.length = length;
        this.angle = angle;
        this.gravity = gravity;
        this.mass = mass;
        this.airDensity = airDensity;
    }

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    update(dt) {
        // State is [angle, angular velocity]
        let changeFunction = state => [
            state[1],
            -Math.sin(state[0]) * (this.gravity / this.length)
        ];
        let state = rk4(changeFunction, [this.angle, this.angularVelocity], dt);
        //Compute drag force, using approx. 0.5 C_D
        let drag = 0.25 
            * this.airDensity 
            * Math.PI 
            * this.angularVelocity * this.angularVelocity
            * this.radius * this.radius * this.radius * this.radius 
            / this.mass;
        //This should be in changeFunction, but isn't for simplicity reasons
        //Apply changes
        this.angle = state[0] % (2 * Math.PI);
        this.angularVelocity = state[1] - Math.sign(state[1]) * this.length * drag;
    }

}