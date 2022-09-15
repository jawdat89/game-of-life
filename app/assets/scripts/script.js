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

const countLiveNeighbors = (arr, x, y) => {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      sum += arr[x + i][y + j];
    }
  }

  sum -= arr[x][y];

  return sum;
}


const draw = () => {
  if (canvas.getContext) {
    let notClicked = true;

    let renderer = setInterval(() => {
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


      let next = generateAndFillTwoDimintionalArray(cols, rows, 2);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let state = grid[i][j];

          // edge
          if (i === 0 || i === cols - 1 || j === 0 || j === rows - 1) {
            next[i][j] = state === 0 ? 0 : 1;
          } else {
            // count live neighbors
            const neighbors = countLiveNeighbors(grid, i, j);

            if (state === 1 && (neighbors > 2 || neighbors < 3)) {
              // Rule # 1
              next[i][j] = 1;
            } else if (state === 0 && neighbors === 3) {
              // Rule # 2
              next[i][j] = 1;
            } else {
              next[i][j] = 0;
            }

          }
        }
      }

      grid = next;
    }, 500);

    canvas.addEventListener("click", () => {
      notClicked = false;
      clearInterval(renderer);
    });
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
