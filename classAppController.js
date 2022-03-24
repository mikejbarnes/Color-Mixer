class AppController {
    constructor() {
        this.brushController = new BrushController();
        this.colorController = new ColorController(); 
        document.getElementById("mixer").addEventListener("click", this.updateMixer.bind(this)); 
    }

    updateMixer() {
        this.colorController.mixer.updateColor(this.brushController.getBrushSize(), this.colorController.currentColor);
    }
}
