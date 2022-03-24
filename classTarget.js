class Target {
    constructor() {
        this.color = this.getNewTargetColor();
    }

    getNewTargetColor() {
        let color = this.getRandomColor();
        ColorController.assignColor("targetDab", color);
        console.log(color);
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

    calculateMatchPercentage(mixerColor) {
        let rDiff = mixerColor[0] - this.color[0];
        let gDiff = mixerColor[1] - this.color[1];
        let bDiff = mixerColor[2] - this.color[2];

        return Math.round(100 - (rDiff+gDiff+bDiff)/(3*255) * 100);
    }
}