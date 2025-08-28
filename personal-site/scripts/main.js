const myImage = document.querySelector("img");

myImage.addEventListener("click", () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/girl-enea.png") {
    myImage.setAttribute("src", "images/retarded-enea.png");
  } else {
    myImage.setAttribute("src", "images/girl-enea.png");
  }
});