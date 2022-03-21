class AppController {
    constructor() {
        this.brushController = new BrushController();
        document.getElementById("mixer").addEventListener("click", this.updateMixer.bind(this));
        this.targetColor = this.getNewTargetColor();
        Utilities.createSelect(this.createPalette.bind(this));
    }
    paletteSelection = "";
    paletteLength = 0;
    
    getNewTargetColor() {
        let color = this.getRandomColor();
        this.assignColor("targetDab", color);
        return color;
    }

    getRandomNumber(min, max) {
        return parseInt(Math.random() * (max-min) + min);
    }
    
    getRandomColor() {
        let color = [];
        for(let i = 0; i < 3; i++) {
            color.push(this.getRandomNumber(0, 255));
        }
        return color;
    }

    updateMixer() {
        console.log("UPDATE");
    }

    assignColor(itemId, color) {
        document.getElementById(itemId).style.backgroundColor = "rgb(" + color[0].toString() +
                                                                ","    + color[1].toString() +
                                                                ","    + color[2].toString() + ")";
    }

    createPalette() {
        this.paletteSelection = document.getElementById("selector").value;

        switch(this.paletteSelection) {
            case "ryb":
                this.removeColorIcons();
                this.paletteLength = Utilities.rybPalette.length;
                for(var i = 0; i < Utilities.rybPalette.length; i++) {
                    Utilities.createColorIcon(i.toString() + "color", "paletteColors", 2.8, Utilities.rybPalette[i], this.selectColor.bind(this, i.toString() + "color"));
                }
                document.getElementById("0color").setAttribute("class", "color selected");
                break;
            case "cmyk":
                this.removeColorIcons();
                this.paletteLength = Utilities.cmykPalette.length;
                for(var i = 0; i < Utilities.cmykPalette.length; i++) {
                    Utilities.createColorIcon(i.toString() + "color", "paletteColors", 3, Utilities.cmykPalette[i], this.selectColor.bind(this, i.toString() + "color"));
                }
                document.getElementById("0color").setAttribute("class", "color selected");
                break;
            case "picker":
                break;
        }
    }

    removeColorIcons() {
        let palette = document.getElementById("paletteColors");
        while(palette.childNodes.length > 0) {
            palette.childNodes[0].remove();
        }
    }

    selectColor(colorId) {
        console.log("SELECT");
        for(let i = 0; i < this.paletteLength; i++) {
            document.getElementById(i.toString() + "color").setAttribute("class", "color");
        }

        let color = document.getElementById(colorId);
        color.setAttribute("class", "color selected");
    }
}
