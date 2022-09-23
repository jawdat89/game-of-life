// #region global variables
// #endregion global variables

// #region game functions
// function for getting two demitional array of nulls
const generateAndFillTwoDimintionalArray = (cols, rows) => {
  const arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
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

const gameOfLifeRandom = (current) => {
  const [cols, rows] = current;
  const next = [...current];
  for (let i = 0; i < cols.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      let state = current[i][j];

      // count live neighbors
      const neighbors = countLiveNeighbors(current, i, j, cols.length, rows.length);

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
  return next;
}

const generateNextGenByRule30 = (current) => {
  // #Rule (0,2,5,7,8,10,12,15) - fire
  // #Rule (0,2,5,7,8,10,12,14) - The matrix

  const [cols, rows] = current;
  const arr = new Array(cols.length);
  for (let i = 0; i < cols.length; i++) {
    arr[i] = new Array(rows.length);
    for (let j = 0; j < rows.length; j++) {
      const gridValue = current[i][j];
      if (i > 0 && i + 1 < cols.length && j + 1 < rows.length) {
        if (
          // (current[i - 1][j] === 1 && current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||  // 15
          (current[i - 1][j] === 1 && current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 0) ||  // 14
          // (current[i - 1][j] === 1 && current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||  // 13
          (current[i - 1][j] === 1 && current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 0) ||  // 12
          // (current[i - 1][j] === 1 && current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||  // 11
          (current[i - 1][j] === 1 && current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 0) ||  // 10
          // (current[i - 1][j] === 1 && current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||  // 9
          (current[i - 1][j] === 1 && current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 0) ||  // 8
          (current[i - 1][j] === 0 && current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||  // 7
          // (current[i - 1][j] === 0 && current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 0) || // 6
          (current[i - 1][j] === 0 && current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||  // 5
          // (current[i - 1][j] === 0 && current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 0)  // 4
          // (current[i - 1][j] === 0 && current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||  // 3
          (current[i - 1][j] === 0 && current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 0) ||  // 2
          // (current[i - 1][j] === 0 && current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||  // 1
          (current[i - 1][j] === 0 && current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 0)     // 0
        ) {
          arr[i][j] = 0;
        } else {
          arr[i][j] = 1;
        }
      } else {
        if (i === 0 && j + 1 < rows.length) {
          if (
            (current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||
            // (current[i][j] === 1 && current[i + 1][j] === 1 && current[i][j + 1] === 0) ||
            // (current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||
            (current[i][j] === 1 && current[i + 1][j] === 0 && current[i][j + 1] === 0) ||
            (current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 1) ||
            // (current[i][j] === 0 && current[i + 1][j] === 1 && current[i][j + 1] === 0) ||
            // (current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 1) ||
            (current[i][j] === 0 && current[i + 1][j] === 0 && current[i][j + 1] === 0)
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i + 1 === cols.length) {
          if (
            (current[i - 1][j] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) ||
            (current[i - 1][j] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) ||
            // (current[i - 1][j] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) ||
            (current[i - 1][j] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) ||
            // (current[i - 1][j] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) ||
            // (current[i - 1][j] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) ||
            // (current[i - 1][j] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) ||
            (current[i - 1][j] === 0 && current[i][j] === 0 && current[i][j + 1] === 0)
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else {
          arr[i][j] = 1;
        }
      }
    }
  }

  return arr;
}


const draw = ({ canvasId, grid, resolution, cols, rows }) => {

  const canvas = document.querySelector(canvasId);
  const genLabel = document.querySelector('.gen-label');
  let generation = 0;
  if (canvas.getContext) {
    setInterval(() => {
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


      // let next = gameOfLifeRandom(grid);
      let next = generateNextGenByRule30(grid);

      grid = next;
      generation++;
      genLabel.textContent = `Gen: ${generation}`;
    }, 10);
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