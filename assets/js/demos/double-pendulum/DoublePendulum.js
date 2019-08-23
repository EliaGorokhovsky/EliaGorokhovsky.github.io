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
    constructor(length1, length2, angle1, angle2, mass1, mass2, gravity) {
        this.angularVelocity1 = 0;
        this.angularVelocity2 = 0;
        this.length1 = length1;
        this.length2 = length2;
        this.mass1 = mass1;
        this.mass2 = mass2;
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.gravity = gravity;
    }

    /**
     * Use RK4 to update the angle and angular velocity of the bob
     */
    update(dt) {
        // State is [angle1, angle2, angular velocity 1, angular velocity 2]
        let changeFunction = state => [
            state[2],
            state[3],
            (-this.gravity * (2 * this.mass1 + this.mass2) * Math.sin(state[0])
                - this.mass2 * this.gravity * Math.sin(state[0] - 2 * state[1])
                - 2 * Math.sin(state[0] - state[1]) * this.mass2 
                * (state[2] * state[2] * this.length2 + state[3] * state[3] * this.length1 * Math.cos(state[0] - state[1])))
                / (this.length1 * (2 * this.mass1 + this.mass2 - this.mass2 * Math.cos(2 * (state[0] - state[1])))),
            2 * Math.sin(state[0] - state[1]) *
                (state[2] * state[2] * this.length1 * (this.mass1 + this.mass2)
                + this.gravity * (this.mass1 + this.mass2) * Math.cos(state[0])
                + state[3] * state[3] * this.length2 * this.mass2 * Math.cos(state[0] - state[1]))
                / (this.length2 * (2 * this.mass1 + this.mass2 - this.mass2 * Math.cos(2 * (state[0] - state[1]))))
        ];
        let state = rk4(changeFunction, [this.angle1, this.angle2, this.angularVelocity1, this.angularVelocity2], dt);
        this.angle1 = state[0] % (2 * Math.PI);
        this.angle2 = state[1] % (2 * Math.PI);
        this.angularVelocity1 = state[2];
        this.angularVelocity2 = state[3];
        /*let potential = -(this.mass1 + this.mass2) * this.gravity * this.length1 * Math.cos(this.angle1) 
            - this.mass2 * this.gravity * this.length2 * Math.cos(this.angle2);
        let kinetic = 0.5 * this.mass1 * this.length1 * this.length1 * this.angularVelocity1 * this.angularVelocity1 
            + 0.5 * this.mass2 * 
                (this.length1 * this.length1 * this.angularVelocity1 * this.angularVelocity1 
                    + this.length2 * this.length2 * this.angularVelocity2 * this.angularVelocity2 
                    + 2 * this.length1 * this.length2 * this.angularVelocity1 * this.angularVelocity2 * Math.cos(this.angle1 - this.angle2)
                );
        console.log(`Energy: ${potential + kinetic}`);*/
    }

}