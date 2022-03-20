class BrushController {
    constructor() {
        this.createBrushIcons();
        this.createDropperIcon();
    }
    brushSizes = [5, 3, 2, 1.2];

    createBrushIcons() {
        for(let i = 0; i < this.brushSizes.length; i++) {
            Utilities.createBrushIcon("brush" + i, "brushes", this.brushSizes[i], this.selectBrush.bind(this, "brush" + i));
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
            document.getElementById("brush" + i.toString()).setAttribute("class", "brush");
        }

        let brush = document.getElementById(brushId);
        brush.setAttribute("class", "brush selected");
    }
}