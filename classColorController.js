class ColorController {
    constructor() {
        this.mixer = new Mixer();
        this.target = new Target();
        Utilities.createSelect(this.createPalette.bind(this));
        this.createPalette();
    }
    paletteSelection = "";
    paletteLength = 0;
    currentColor = [255,255,255];

    createPalette() {
        this.paletteSelection = document.getElementById("selector").value;

        switch(this.paletteSelection) {
            case "ryb":
                this.removeColorIcons();
                this.paletteLength = Utilities.rybPalette.length;
                for(var i = 0; i < Utilities.rybPalette.length; i++) {
                    Utilities.createColorIcon(i.toString() + "color", "paletteColors", 35, Utilities.rybPalette[i], this.selectColor.bind(this, i.toString() + "color"));
                }
                document.getElementById("0color").setAttribute("class", "color selected");
                break;
            case "cmyk":
                this.removeColorIcons();
                this.paletteLength = Utilities.cmykPalette.length;
                for(var i = 0; i < Utilities.cmykPalette.length; i++) {
                    Utilities.createColorIcon(i.toString() + "color", "paletteColors", 35, Utilities.cmykPalette[i], this.selectColor.bind(this, i.toString() + "color"));
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

        this.paletteSelection = document.getElementById("selector").value;
        switch(this.paletteSelection) {
            case "ryb":
                this.currentColor = Utilities.rybPalette[parseInt(colorId[0])];
                break;
            case "cmyk":
                console.log(color);this.currentColor = Utilities.cmykPalette[parseInt(colorId[0])];
                break;
            case "picker":
                break;
        }
    }

    static assignColor(itemId, color) {
        document.getElementById(itemId).style.backgroundColor = "rgb(" + color[0].toString() +
                                                                ","    + color[1].toString() +
                                                                ","    + color[2].toString() + ")";
        console.log("COLOR CHANGE " + itemId);
    }
}