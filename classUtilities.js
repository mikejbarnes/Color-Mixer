class Utilities {
    static createColor(colorId, parentId) {

    }

    static createBrushIcon(brushId, parentId, size, method) {
        let parent = document.getElementById(parentId);

        let brush = document.createElement("div");
        brush.setAttribute("id", brushId);
        brush.setAttribute("class", "brush");
        brush.addEventListener("click", method);
        brush.style.width = size.toString() + "em";
        brush.style.height = size.toString() + "em";

        parent.appendChild(brush);
    }
}