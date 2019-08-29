import { Pendulum } from "./Pendulum.js";
import { roundTo } from "../../Util.js";

/**
 * Handles drawing directly to the canvas
 */
class DrawingApp {

    /**
     * Set up the canvas
     */
    constructor() {
        this.canvas = document.getElementsByClassName("pendulumCanvas")[0];
        this.context = this.canvas.getContext("2d");
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        this.lastRender = 0;
                
        this.pendulum = new Pendulum(0.25, 2, Math.PI / 12, 9.8, 1, 0);
    }

    /**
     * Redraws the canvas
     */
    draw() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // The pin at which the pendulum is fixed
        this.context.beginPath();
        this.context.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width / 128,
            0,
            2 * Math.PI
        );
        this.context.fill();
        //Single pendulum
        let x = this.canvas.width / 2 + this.canvas.width / 4 * this.pendulum.length * Math.sin(this.pendulum.angle);
        let y = this.canvas.height / 2 + this.canvas.width / 4 * this.pendulum.length * Math.cos(this.pendulum.angle);
        this.context.beginPath();
        this.context.moveTo(this.canvas.width / 2,this.canvas.height / 2);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(
            x,
            y,
            this.canvas.width / 4 * this.pendulum.radius,
            0,
            2 * Math.PI
        );
        this.context.fill();
    }

    /**
     * User interface: update variables and take input
     */
    updateParams() {
        document.getElementById("lengthParam").textContent = `length: ${this.pendulum.length} m`;
        document.getElementById("massParam").textContent = `mass: ${this.pendulum.mass} g`;
        document.getElementById("radiusParam").textContent = `radius: ${this.pendulum.radius} m`;
        document.getElementById("gravityParam").textContent = `gravity acc.: ${this.pendulum.gravity} ms^-2`;
        document.getElementById("airDensityParam").textContent = `air density: ${this.pendulum.airDensity} gm^-3`;
        document.getElementById("theoryPeriodParam").textContent = `calculated period: ${roundTo(this.pendulum.getTheoreticalPeriod(), 3)} s`;
        document.getElementById("lastPeriodParam").textContent = `last period: ${roundTo(this.pendulum.lastPeriod, 3)} s`;
        document.getElementById("meanPeriodParam").textContent = `mean period: ${roundTo(this.pendulum.averagePeriod, 3)} s`;
    }

    /**
     * Update the graphics and logic
     */
    update(timestamp) {
        let container = document.getElementsByClassName("canvasContainer")[0]
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientWidth;
        let delta = timestamp - this.lastRender;
        this.pendulum.update(Math.min(delta / 1000, 0.05));
        this.updateParams();
        this.draw();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.update.bind(this));
    }

}

let app = new DrawingApp();
app.update(0);