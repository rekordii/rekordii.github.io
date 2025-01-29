const objects = document.querySelectorAll("section");

// Create and style the overlay element
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
overlay.style.display = "none";
overlay.style.zIndex = "999"; // Just below the floating element
document.body.appendChild(overlay);

console.log(objects);

let clickedArray = [];
for (let i = 0; i < objects.length; ++i) {
    clickedArray.push(false);
}

objects.forEach((object, index) => {
    object.addEventListener("mouseover", (event) => {
        object.style.border = "2px solid #fdf0d5";
    });
    object.addEventListener("mouseout", (event) => {
        object.style.border = "";
    });
    object.addEventListener("click", (event) => {
        if (clickedArray[index]) {
            object.style.transition = "0.1s";
            object.style.position = "";
            object.style.top = "";
            object.style.left = "";
            object.style.transform = "";
            object.style.zIndex = "";
            object.style.padding = "";
            clickedArray[index] = false;
            overlay.style.display = "none";
        } else {
            objects.forEach((obj, i) => {
                if (clickedArray[i]) {
                    obj.style.transition = "0.1s";
                    obj.style.position = "";
                    obj.style.top = "";
                    obj.style.left = "";
                    obj.style.transform = "";
                    obj.style.zIndex = "";
                    obj.style.padding = "";
                    clickedArray[i] = false;
                }
            });
            object.style.transition = "0.1s";
            object.style.position = "fixed";
            object.style.top = "50%";
            object.style.left = "50%";
            object.style.transform = "translate(-50%, -50%)";
            object.style.zIndex = "1000"; // High z-index to ensure it is on top
            object.style.padding = "20px";
            clickedArray[index] = true;
            overlay.style.display = "block";
        }
    });
});