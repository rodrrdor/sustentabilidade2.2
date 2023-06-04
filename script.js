const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");
var score = 0, mistakes = 0, timer = 3600, totalTrash = 1, trashTotal = 1;
var mouse = {x: 0, y: 0, down: false, downX: 0, downY: 0, holds: false};
var trashes = [], colors = ["red", "blue", "yellow", "green"];
var wid = window.innerWidth, hei = window.innerHeight;
var trashCans = new Image(), car = new Image();
var carX = window.innerWidth, run = false;
var homeScreen = true;

class Trash {
    constructor() {
        this.x = Math.random() * wid / 1.1 + wid / 20;
        this.y = Math.random() * hei / 4 + hei / 1.5;
        this.r = wid / 32;
        this.color = Math.ceil(Math.random() * 4) - 1;
        this.hold = false;
    }

    update() {      
        if (!mouse.holds) {
            let hipo = this.r - Math.sqrt((mouse.downX - this.x) * (mouse.downX - this.x)  + (mouse.downY - this.y) * (mouse.downY - this.y));
            if (hipo > 0) {
                this.hold = true;
                mouse.holds = true;
            }
        }

        if (mouse.down == false) {
            this.hold = false;
            mouse.holds = false;
        }
    
        if (this.hold) {
            this.x = mouse.x;
            this.y = mouse.y;
        }

        let index = trashes.indexOf(this);
        if (this.x > (wid / 4) && this.x < (wid / 1.35) && this.y > (hei / 5) && this.y < (hei / 1.8) && !this.hold) {
            if (this.x < wid / 2.7)
                (this.color == 0) ? win() : lose();

            else if (this.x < cnv.width / 2) 
                (this.color == 1) ? win() : lose();

            else if (this.x < cnv.width / 1.6)
                (this.color == 2) ? win() : lose();

            else
                (this.color == 3) ? win() : lose();
        }
        
        if (score + mistakes == trashTotal) {
            run = true; 
            timer += 120;
        }

        function win() {
            score++;
            timer += 120;
            trashes.splice(index, 1);
        }

        function lose() {
            mistakes++;
            timer -= 120;
            trashes.splice(index, 1);
        }
    }

    draw() {
        ctx.strokeStyle = colors[this.color];
        ctx.fillStyle = colors[this.color];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

(function init() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    trashCans.src = "images/trashcans.png";
    car.src = "images/car.png";

    for (let trash = 0; trash < totalTrash; trash++)
        trashes.push(new Trash());

    addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    addEventListener("mousedown", () => {
        mouse.downX = mouse.x;
        mouse.downY = mouse.y;
        mouse.down = true;
    });

    addEventListener("mouseup", () => {
        mouse.down = false;
    });

    requestAnimationFrame(main);
}());

function main() {
    update();
    draw();
    requestAnimationFrame(main);
}

function update() {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    wid = cnv.width;
    hei = cnv.height;

    if (homeScreen) {
        if (wid / 2 - 250 < mouse.x && hei / 2 - 100 < mouse.y && wid / 2 + 250 > mouse.x && hei / 2 + 100 > mouse.y)
            if (mouse.down) {
                cnv.requestFullscreen();
                homeScreen = false;
            }
        return;
    }

    for (let trash in trashes)
        trashes[trash].update();

    if (run) {
        carX -= wid / 10;
        if (carX <= 0 - wid / 1.3) {
            run = false;
            carX = wid;
            totalTrash++;
            trashTotal += totalTrash;
            for (let trash = 0; trash < totalTrash; trash++)
                trashes.push(new Trash());
        }
    }
    (timer > 0) ? timer-- : reset();
}

function draw() {
    drawRect("#20a0ff", 0, 0, wid, hei);
    drawRect("black", 0, hei / 1.8, wid, hei / 2);
    drawRect("gray", 0, hei / 1.9, wid, hei / 15);
    for (let i = 5; i < wid; i += wid / 10) 
        drawRect("white", i, hei / 1.3, wid / 20, hei / 30);

    if (homeScreen) {
        drawRect("orange", wid / 2, hei / 2, 500, 200, true);
        drawRect("coral", wid / 2, hei / 2, 450, 150, true);
        write("Sustentabilidade", 120, 1);
        write("Começar", 80, hei / 153);
        return;
    }

    ctx.drawImage(trashCans, wid / 4, hei / 5, wid / 2, hei / 2.75);

    for (let trash in trashes.reverse()) 
        trashes[trash].draw();
    trashes.reverse();

    ctx.drawImage(car, carX, hei / 1.65, wid / 1.3, hei / 2.75);

    write("Acertos: " + score, 40, 1);
    write("Erros: " + mistakes, 40, 2);
    write("Tempo: " + (timer / 60).toFixed(0), 40, 3);

}

function write(text, size, space) {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = size + "px Comic Sans MS";
    ctx.fillText(text, wid / 2, space * size);
}

function drawRect(color, x, y, w, h, middle) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    (middle) ? ctx.fillRect(x - w / 2, y - h / 2, w, h) : ctx.fillRect(x, y, w, h);
    ctx.stroke();
}

function reset() {
    homeScreen = true;
    trashes = [];
    score = 0; mistakes = 0; 
    totalTrash = 1; trashTotal = 1;
    timer = 3600;

    for (let trash = 0; trash < totalTrash; trash++) 
        trashes.push(new Trash());
}
