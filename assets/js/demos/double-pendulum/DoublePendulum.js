import { rk4, euler } from "./Solver.js";

/**
 * Stores state variables of a single pendulum
 */
export class DoublePendulum {

    /**
     * Initialize the pendulum
     * @param length1: length of the first rod in meters
     * @param angle1: first start angle
     * @param length1: length of the second rod in meters
     * @param angle1: second start angle
     * @param gravity: gravitational acceleration in meters per second squared
     */
    constructor(radius1, radius2, length1, length2, angle1, angle2, mass1, mass2, gravity, airDensity) {
        this.angularVelocity1 = 0;
        this.angularVelocity2 = 0;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.length1 = length1;
        this.length2 = length2;
        this.mass1 = mass1;
        this.mass2 = mass2;
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.gravity = gravity;
        this.airDensity = airDensity;
    }

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     * Change function is Hamiltonian formalization of equatios of motion
     * from http://scienceworld.wolfram.com/physics/DoublePendulum.html
     */
    update(dt) {
        //State is [angle1, angle2, momentum1, momentum2]
        let changeFunction = state => {
            let denom = this.length1 * this.length2 * (this.mass1  + this.mass2 * Math.pow(Math.sin(state[0] - state[1]), 2));
            let c1 = (state[2] * state[3] * Math.sin(state[0] - state[1])) / denom;
            let c2 = Math.sin(2 * (state[0] - state[1])) * 
                (this.length2 * this.length2 * this.mass2 * state[2] * state[2] +
                    this.length1 * this.length1 * (this.mass1 + this.mass2) * state[3] * state[3] -
                    this.length1 * this.length2 * this.mass2 * state[2] * state[3] * Math.cos(state[0] - state[1])) /
                    (2 * denom * denom);
            return [
            (this.length2 * state[2] - this.length1 * state[3] * Math.cos(state[0] - state[1])) /
                (this.length1 * denom),
            (this.length1 * (this.mass1 + this.mass2) * state[3] - this.length2 * this.mass2 * state[2] * Math.cos(state[0] - state[1])) /
                (this.length2 * this.mass2 * denom),
            -(this.mass1 + this.mass2) * this.gravity * this.length1 * Math.sin(state[0]) - c1 + c2,
            -this.mass2 * this.gravity * this.length2 * Math.sin(state[1]) + c1 - c2
            ];
        }
        let state = rk4(changeFunction, [this.angle1, this.angle2, this.angularVelocity1, this.angularVelocity2], dt);
        //Compute drag, approximating C_D as 0.5--should be in changefunction
        let drag1 = 0.25 
            * this.airDensity 
            * Math.PI 
            * this.angularVelocity1 * this.angularVelocity1
            * this.radius1 * this.radius1 * this.radius1 * this.radius1
            / this.length1;
        let drag2 = 0.25 
            * this.airDensity 
            * Math.PI 
            * this.angularVelocity2 * this.angularVelocity2
            * this.radius2 * this.radius2 * this.radius2 * this.radius2
            / this.length2;
        //Apply changes 
        this.angle1 = state[0] % (2 * Math.PI);
        this.angle2 = state[1] % (2 * Math.PI);
        this.angularVelocity1 = state[2] - Math.sign(state[2]) * drag1;
        this.angularVelocity2 = state[3] - Math.sign(state[3]) * drag2;
    }

}