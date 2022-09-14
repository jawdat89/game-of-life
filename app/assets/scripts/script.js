// #region global variables
let grid; // array[x][y]
let resolution = 20;
let cols; // as x
let rows; // as y
let canvas;
// #endregion global variables

// #region game functions
// function for getting two demitional array of nulls
const generateAndFillTwoDimintionalArray = (colsNumber, rowsNumber, maxNumber) => {
  const arr = new Array(colsNumber);
  for (let i = 0; i < colsNumber; i++) {
    arr[i] = new Array(rowsNumber);
    for (let j = 0; j < rowsNumber; j++) {
      arr[i][j] = getRandomInt(maxNumber);
    }
  }
  return arr;
}

const draw = () => {
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          ctx.fillStyle = "black";
          ctx.strokeStyle = "black";
          ctx.strokeRect(x, y, resolution, resolution);
          ctx.fillRect(x, y, resolution - 0.5, resolution - 0.5);
        } else {
          ctx.strokeStyle = "black";
          ctx.strokeRect(x, y, resolution, resolution);
        }
      }
    }
  }
}

const setup = () => {
  // canvas
  canvas = document.querySelector('#canvas');
  const width = canvas.width;
  const height = canvas.height;
  cols = Math.floor(width / resolution); // as x
  rows = Math.floor(height / resolution); // as y
  // create grid of rows and cols and fill it with randoms of (0,1)
  grid = generateAndFillTwoDimintionalArray(cols, rows, 2);

  draw();

}
// #endregion game functions



const init = () => {
  setup();
}

document.addEventListener("DOMContentLoaded", init);


// #region methods
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}
// #endregion methods
