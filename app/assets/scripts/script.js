// #region global variables
// #endregion global variables

// #region game functions
// function for getting two demitional array of nulls
const generateAndFillTwoDimintionalArray = (colsNumber, rowsNumber) => {
  const arr = new Array(colsNumber);
  for (let i = 0; i < colsNumber; i++) {
    arr[i] = new Array(rowsNumber);
    for (let j = 0; j < rowsNumber; j++) {
      arr[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return arr;
}

const countLiveNeighbors = (arr, x, y, cols, rows) => {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {

      const col = (x + i + cols) % cols;
      const row = (y + j + rows) % rows;

      sum += arr[col][row];
    }
  }

  sum -= arr[x][y];

  return sum;
}


const draw = ({ canvasId, grid, resolution, cols, rows }) => {

  const canvas = document.querySelector(canvasId);
  if (canvas.getContext) {

    let renderer = setInterval(() => {
      let ctx = canvas.getContext('2d');
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = i * resolution;
          let y = j * resolution;
          if (grid[i][j] === 1) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, resolution, resolution);
            ctx.fillRect(x, y, resolution - 0.5, resolution - 0.5);
          } else {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.strokeRect(x, y, resolution, resolution);
          }
        }
      }


      let next = grid;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let state = grid[i][j];

          // count live neighbors
          const neighbors = countLiveNeighbors(grid, i, j, cols, rows);

          if (state === 1 && (neighbors === 2 || neighbors === 3)) {
            // Rule # 1
            // Survival: Each live cell with either two or three live neighbors will remain alive for the next generation. 
            next[i][j] = 1;
          } else if (state === 0 && neighbors === 3) {
            // Rule # 2
            // Births: Each dead cell adjacent to exactly three live neighbors will become live in the next generation.
            next[i][j] = 1;
          } else {
            // Death by isolation: Each live cell with one or fewer live neighbors will die in the next generation.
            // Death by overcrowding: Each live cell with four or more live neighbors will die in the next generation. 
            next[i][j] = 0;
          }
        }
      }

      grid = next;
    }, 100);

    canvas.addEventListener("click", () => {
      clearInterval(renderer);
    });
  }
}

const setup = ({ canvasId, resolution }) => {
  // canvas
  const canvas = document.querySelector(canvasId);
  const width = canvas.width;
  const height = canvas.height;
  const cols = Math.floor(width / resolution); // as x
  const rows = Math.floor(height / resolution); // as y
  // create grid of rows and cols and fill it with randoms of (0,1)
  const grid = generateAndFillTwoDimintionalArray(cols, rows);

  return {
    grid,
    cols,
    rows
  };
}
// #endregion game functions

const init = () => {
  let grid; // array[x][y]
  let resolution = 5;
  let cols; // as x
  let rows; // as y

  const setupElements = setup({ canvasId: '#canvas', resolution });
  grid = setupElements.grid;
  cols = setupElements.cols;
  rows = setupElements.rows;
  draw({ canvasId: '#canvas', grid, resolution, cols, rows });
}

document.addEventListener("DOMContentLoaded", init);