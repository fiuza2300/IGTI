const green = document.querySelector("#rangeGreen");
const red = document.querySelector("#rangeRed");
const blue = document.querySelector("#rangeBlue");

function TextData() {
  const txtGreen = document.querySelector("#txtGreen");
  const txtRed = document.querySelector("#txtRed");
  const txtBlue = document.querySelector("#txtBlue");

  txtGreen.value = green.value;
  txtRed.value = red.value;
  txtBlue.value = blue.value;
}

function SquareColor() {
  const square = document.querySelector("#square");
  const corSquare = `rgb(${red.value},${green.value},${blue.value})`;
  square.style.border = `60px solid rgb(${red.value},${green.value},${blue.value})`;
}

window.addEventListener("load", () => {
  red.value = 80;
  green.value = red.value;
  blue.value = red.value;
  TextData();
  SquareColor();
});

window.addEventListener("change", (event) => {
  switch (event.target.id) {
    case "#rangeRed":
      red.value = event.target.value;
      break;
    case "#rangeGreen":
      green.value = event.target.value;
      break;
    case "#rangeBlue":
      blue.value = event.target.value;
      break;
  }
  TextData();
  SquareColor();
});
