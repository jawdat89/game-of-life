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

const draw = ({ canvasId, grid, resolution, cols, rows, speed }) => {

  const canvas = document.querySelector(canvasId);
  const genLabel = document.querySelector('.gen-label');
  let generation = 0;

  if (canvas.getContext) {
    document.addEventListener("keydown", () => {
      grid = generateAndFillTwoDimintionalArray(cols, rows);
      generation = 0;
    });

    const renderGeneration = () => {
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


      let next = gameOfLifeRandom(grid);

      grid = next;
      generation++;
      genLabel.textContent = `Gen: ${generation}`;
    };

    let life = setInterval(renderGeneration, speed);

    document.addEventListener("click", () => {
      if (life) {
        clearInterval(life);
        life = undefined;
      } else {
        life = setInterval(renderGeneration, speed);
      }
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
  const resolution = 5;
  const speed = 1;
  let cols; // as x
  let rows; // as y

  const setupElements = setup({ canvasId: '#canvas', resolution });
  grid = setupElements.grid;
  cols = setupElements.cols;
  rows = setupElements.rows;
  draw({ canvasId: '#canvas', grid, resolution, cols, rows, speed: speed });
}

document.addEventListener("DOMContentLoaded", init);


const gameOfLifeRandom = (current) => {
  const [cols, rows] = current;

  // const next = [...current];
  const next = generateAndFillTwoDimintionalArray(cols.length, rows.length);

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