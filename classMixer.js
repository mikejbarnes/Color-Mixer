class Mixer {
    constructor() {
        this.clearMixer();
    }
    paintAmount = 0;
    diameter = 0;
    color = [255,255,255];

    clearMixer() {
        document.getElementById("mixerDab").style.backgroundColor = null;
        this.paintAmount = 0;
        this.diameter = 0;
    }

    updateColor(brushSize, mixColor) {
        console.log(mixColor);

        let brushArea = Math.PI * Math.pow(brushSize/2, 2);
        this.paintAmount += brushArea;
   
        let sRGB;
        if(this.paintAmount != brushArea) {
            let rCurveA = LHTSS.calculateLHTSS(new Matrix(mixColor, 3, 1, "values"));
            let rCurveB = LHTSS.calculateLHTSS(new Matrix(this.color, 3, 1, "values"));
            
            let rCurveC = rCurveA.pow(brushArea/this.paintAmount).hadamardProduct(rCurveB.pow((this.paintAmount - brushArea)/this.paintAmount));
            sRGB = LHTSS.convert_RGB_to_sRGB(LHTSS.T.multiply(rCurveC)).outputArray().flat();

            for(let i = 0; i < 3; i++) {
                if(sRGB[i] < 0) {
                    sRGB[i] = 0;
                }
                if(sRGB[i] > 255) {
                    sRGB[i] = 255;
                }
            }
            console.log(sRGB);
            this.color = sRGB;
        } else {
            sRGB = mixColor;
            this.color = sRGB;
        }
        console.log(this.color, mixColor, sRGB);
        ColorController.assignColor("mixerDab", sRGB);

        if(this.paintAmount > Math.PI*Math.pow(90, 2)) {
            this.paintAmount = Math.PI*Math.pow(90, 2);
        }
        this.diameter = 2 * Math.sqrt(this.paintAmount/Math.PI);
        document.getElementById("mixerDab").style.width = this.diameter.toString() + "px";
        document.getElementById("mixerDab").style.height = this.diameter.toString() + "px";
    }
}