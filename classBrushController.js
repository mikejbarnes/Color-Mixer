class BrushController {
    constructor() {
        this.createBrushIcons();
        this.createDropperIcon();
    }
    brushSizes = [5, 3, 2, 1.2];
    currentSize = 0;
    currentColor = [255,255,255];

    createBrushIcons() {
        for(let i = 0; i < this.brushSizes.length; i++) {
            Utilities.createBrushIcon(i.toString() + "brush", "brushes", this.brushSizes[i], this.selectBrush.bind(this, i.toString() + "brush"));
            if(i == 0) {
                document.getElementById("0brush").setAttribute("class","brush selected");
            }
        }
    }

    createDropperIcon() {
        let parent = document.getElementById("brushes");

        let dropperWrapper = document.createElement("div");
        dropperWrapper.setAttribute("id", "dropperWrapper");

        let dropperTip = document.createElement("div");
        dropperTip.setAttribute("id", "dropperTip");
        let dropperPipe = document.createElement("div");
        dropperPipe.setAttribute("id", "dropperPipe");
        let dropperHilt = document.createElement("div");
        dropperHilt.setAttribute("id", "dropperHilt");
        let dropperBulb = document.createElement("div");
        dropperBulb.setAttribute("id", "dropperBulb");

        dropperWrapper.appendChild(dropperTip);
        dropperWrapper.appendChild(dropperPipe);
        dropperWrapper.appendChild(dropperHilt);
        dropperWrapper.appendChild(dropperBulb);

        parent.appendChild(dropperWrapper);
    }

    selectBrush(brushId) {
        for(let i = 0; i < this.brushSizes.length; i++) {
            document.getElementById(i.toString() + "brush").setAttribute("class", "brush");
        }

        this.currentSize = parseInt(brushId[0]);
        let brush = document.getElementById(brushId);
        brush.setAttribute("class", "brush selected");
    }
}