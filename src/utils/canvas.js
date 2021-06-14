export default class CanvasHelper {
    globalRadius = 8;
    constructor(element) {
        this.element = element;
    }


    writeMessage(message) {
        var context = this.element.getContext("2d");

        context.font = "18pt Calibri";
        context.fillStyle = "black";
        context.fillText(message, 10, 25);
    }

    collide(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return (distance < this.globalRadius + this.globalRadius);
    }

    computeDistance(p1, p2) {
        var dx = Math.abs(p1.x - p2.x)
        var dy = Math.abs(p1.y - p2.y)

        return Math.sqrt(dx * dx + dy * dy);
    }

    getMousePosition(event) {
        // get canvas position
        let top = 0;
        let left = 0;

        let canvas = this.element;

        while (canvas && canvas.tagName != "BODY") {
            top += canvas.offsetTop;
            left += canvas.offsetLeft;
            canvas = canvas.offsetParent;
        }

        const x = event.clientX - left + window.pageXOffset;
        const y = event.clientY - top + window.pageYOffset;

        return {
            x,
            y
        };
    }

    clear() {
        const ctx = this.element.getContext("2d");
        const { width, height } = this.element;
        ctx.clearRect(0, 0, width, height);
    }

    drawCursor(x, y) {
        this.drawSpawnIndicator(x, y, "black", this.globalRadius);
    }

    drawSpawnPoint(x, y) {
        this.drawSpawnIndicator(x, y, "blue", this.globalRadius);
    }

    drawSpawnIndicator(x, y, color, radius) {
        const context = this.element.getContext("2d");
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
    }
}
