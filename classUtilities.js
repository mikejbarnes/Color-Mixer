class Utilities {
    static rybPalette = [[255,255,255],
                         [225,255,  0],
                         [255,200,  0],
                         [255, 50,  0],
                         [255,  0, 50],
                         [  0,150,255],
                         [  0,  0,150]];
    static cmykPalette = [[255,255,255],
                          [255,255,  0],
                          [255,  0,255],
                          [  0,255,255],
                          [0,    0,  0]];

    static createBrushIcon(brushId, parentId, size, method) {
        let parent = document.getElementById(parentId);

        let brush = document.createElement("div");
        brush.setAttribute("id", brushId);
        brush.setAttribute("class", "brush");
        brush.addEventListener("click", method);
        brush.style.width = size.toString() + "px";
        brush.style.height = size.toString() + "px";

        parent.appendChild(brush);
    }

    static createColorIcon(colorId, parentId, size, color, method) {
        let parent = document.getElementById(parentId);

        let colorIcon = document.createElement("div");
        colorIcon.setAttribute("id", colorId);
        colorIcon.setAttribute("class", "color");
        colorIcon.addEventListener("click", method);
        colorIcon.style.width = size.toString() + "px";
        colorIcon.style.height = size.toString() + "px";
        colorIcon.style.backgroundColor = "rgb(" + color[0].toString() +
                                          ","    + color[1].toString() +
                                          ","    + color[2].toString() + ")";
    
        parent.appendChild(colorIcon);
    }

    static createSelect(method) {
        let parent = document.getElementById("paletteSelect");

        let optionsText = ["RYB","CMYk","Color Picker"];
        let optionValues = ["ryb","cmyk","picker"];

        let select = document.createElement("select");
        select.setAttribute("id", "selector");
        select.addEventListener("change", method);

        for(var i = 0; i < optionsText.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", optionValues[i]);
            option.textContent = optionsText[i];
            select.appendChild(option);
        }

        parent.appendChild(select);
    }
}