let appController = new AppController();

/*
let colorA = getRandomColor();
let colorB = getRandomColor();

let amountA = getRandom(5,20);
let amountB = getRandom(5,20);

let sRGB_A = new Matrix(colorA, 3, 1, "values");
let sRGB_B = new Matrix(colorB, 3, 1, "values");

let rhoA = LHTSS(T, sRGB_A).pow(amountA/(amountA+amountB));
let rhoB = LHTSS(T, sRGB_B).pow(amountB/(amountA+amountB));

let rhoC = rhoA.hadamardProduct(rhoB);

let colorC = convert_RGB_to_sRGB(T.multiply(rhoC)).outputArray().flat();

console.log(colorA);
console.log(colorB);
console.log(colorC);

let parent = document.getElementById("swatches");
let swatchA = document.createElement("div");
swatchA.setAttribute("id", "swatchA");
swatchA.setAttribute("class", "swatch");
swatchA.style.backgroundColor = "rgb(" + colorA[0] + "," +
                                         colorA[1] + "," +
                                         colorA[2] + ")";
parent.appendChild(swatchA);

let swatchB = document.createElement("div");
swatchB.setAttribute("id", "swatchB");
swatchB.setAttribute("class", "swatch");
swatchB.style.backgroundColor = "rgb(" + colorB[0] + "," +
                                         colorB[1] + "," +
                                         colorB[2] + ")";
parent.appendChild(swatchB);

let swatchC = document.createElement("div");
swatchC.setAttribute("id", "swatchC");
swatchC.setAttribute("class", "swatch");
swatchC.style.backgroundColor = "rgb(" + colorC[0] + "," +
                                         colorC[1] + "," +
                                         colorC[2] + ")";
parent.appendChild(swatchC);

console.log(document.getElementById("swatchA"));

function getRandom(min, max) {
    return parseInt(Math.random() * (max-min) + min);
}

function getRandomColor() {
    let color = [];
    for(let i = 0; i < 3; i++) {
        color.push(getRandom(0, 255));
    }
    return color;
}

*/
