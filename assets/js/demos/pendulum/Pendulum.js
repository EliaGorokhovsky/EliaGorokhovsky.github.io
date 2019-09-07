import { rk4 } from "../Solver.js";

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
        this.timeSinceLastSwing = 0;
        this.backswing = false; //Whether the pendulum is about to complete its current period
        this.averagePeriod = 0;
        this.numberOfSwings = 0;
        this.lastPeriod = 0;
    }

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    update(dt) {
        // State is [angle, angular velocity]
        this.timeSinceLastSwing += dt;
        let changeFunction = state => [
            state[1],
            -Math.sin(state[0]) * (this.gravity / this.length)
        ];
        let state = rk4(changeFunction, [this.angle, this.angularVelocity], dt);
        //Update period
        if (Math.sign(state[1]) != Math.sign(this.angularVelocity) && this.timeSinceLastSwing > dt) {
            if (this.backswing) {
                this.lastPeriod = this.timeSinceLastSwing;
                this.timeSinceLastSwing = 0;
                this.averagePeriod = (this.averagePeriod * (this.numberOfSwings++) + this.lastPeriod) / this.numberOfSwings;
            }
            this.backswing = !this.backswing;
        }
        //Compute drag force, using approx. 0.5 C_D
        let drag = this.getDrag() / this.mass;
        //This should be in changeFunction, but isn't for simplicity reasons
        //Apply changes
        this.angle = state[0] % (2 * Math.PI);
        this.angularVelocity = state[1] - Math.sign(state[1]) * drag;
    }

    /**
     * Finds the current drag on the ball based on fluid resistance formula
     */
    getDrag() {
        return 0.25 
            * this.airDensity 
            * Math.PI 
            * this.angularVelocity * this.angularVelocity
            * this.radius * this.radius * this.radius * this.radius 
            / this.length;
    }

    /**
     * Calculates the period using the approximation sin t = t
     * leading to the equation T = 2pi * sqrt(L/g)
     */
    getTheoreticalPeriod() {
        return 2 * Math.PI * Math.sqrt(this.length / this.gravity);
    }

}