import { DoublePendulum } from "./DoublePendulum.js";

/**
 * Handles drawing directly to the canvas
 */
class DrawingApp {

    /**
     * Set up the canvas
     */
    constructor() {
        this.canvas = document.getElementsByClassName("demoCanvas")[0];
        this.context = this.canvas.getContext("2d");
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        this.lastRender = 0;
        this.tracing = true;
        this.traceLength = 500;
        
        this.pendulum = new DoublePendulum(0.1, 0.06, 0.7, 1, Math.PI / 2, Math.PI / 6, 2, 1, 9.8, 0);
        let x1 = this.canvas.width / 2 + this.canvas.width / 4 * this.pendulum.length1 * Math.sin(this.pendulum.angle1);
        let y1 = this.canvas.height / 2 + this.canvas.width / 4 * this.pendulum.length1 * Math.cos(this.pendulum.angle1);
        let x2 = x1 + this.canvas.width / 4 * this.pendulum.length2 * Math.sin(this.pendulum.angle2);
        let y2 = y1 + this.canvas.width / 4 * this.pendulum.length2 * Math.cos(this.pendulum.angle2);
        this.timeseries1 = [{x: x1, y: y1}];
        this.timeseries2 = [{x: x2, y: y2}];
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
        // Calculate position
        let x1 = this.canvas.width / 2 + this.canvas.width / 4 * this.pendulum.length1 * Math.sin(this.pendulum.angle1);
        let y1 = this.canvas.height / 2 + this.canvas.width / 4 * this.pendulum.length1 * Math.cos(this.pendulum.angle1);
        let x2 = x1 + this.canvas.width / 4 * this.pendulum.length2 * Math.sin(this.pendulum.angle2);
        let y2 = y1 + this.canvas.width / 4 * this.pendulum.length2 * Math.cos(this.pendulum.angle2);
        this.timeseries1.push({x: x1, y: y1});
        this.timeseries2.push({x: x2, y: y2});
        if (this.timeseries1.length > this.traceLength) {
            this.timeseries1.splice(0, 1);
        }
        if (this.timeseries2.length > this.traceLength) {
            this.timeseries2.splice(0, 1);
        }
        //Draw timeseries
        if (this.tracing) {
            let style = this.context.strokeStyle;
            this.context.strokeStyle = "red";
            this.context.beginPath();
            this.context.moveTo(this.timeseries1[0].x, this.timeseries1[0].y);
            this.timeseries1.forEach(element => {
                this.context.lineTo(element.x, element.y);
            });
            this.context.stroke();
            this.context.beginPath();
            this.context.strokeStyle = "blue";
            this.context.moveTo(this.timeseries2[0].x, this.timeseries2[0].y);
            this.timeseries2.forEach(element => {
                this.context.lineTo(element.x, element.y);
            });
            this.context.stroke();
            this.context.strokeStyle = style;
        }
        //Draw pendulum
        this.context.beginPath();
        this.context.moveTo(this.canvas.width / 2,this.canvas.height / 2);
        this.context.lineTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(x1, y1, this.canvas.width / 4 * this.pendulum.radius1, 0, 2 * Math.PI);
        this.context.fill();
        this.context.beginPath();
        this.context.arc(x2, y2, this.canvas.width / 4 * this.pendulum.radius2, 0, 2 * Math.PI);
        this.context.fill();
    }

    /**
     * Update the graphics and logic
     */
    update(timestamp) {
        let delta = timestamp - this.lastRender;
        this.pendulum.update(Math.min(delta / 1000, 0.05));
        this.draw();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.update.bind(this));
    }

}

let app = new DrawingApp();
app.update(0);