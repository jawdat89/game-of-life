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


      let next = gameOfLifeRandom(grid);
      // let next = generateNextGenByRule(grid);

      grid = next;
      generation++;
      genLabel.textContent = `Gen: ${generation}`;
    }, speed);
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

const generateNextGenByRule = (current) => {
  // RULE (31,28,27,26,23,18,17,15,14,12,11,9,8,2,1,0) WWIII

  const [cols, rows] = current;
  const arr = new Array(cols.length);
  for (let i = 0; i < cols.length; i++) {
    arr[i] = new Array(rows.length);
    for (let j = 0; j < rows.length; j++) {
      const gridValue = current[i][j];
      if (i > 0 && i + 1 < cols.length && j + 1 < rows.length && j > 0) {
        if (
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //255
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //254
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //253
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //252
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //251
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //250
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //249
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //248
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //247
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //246
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //245
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //244
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //243
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //242
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //241
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //240
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //239
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //238
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //237
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //236
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //235
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //234
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //233
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //232
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //231
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //230
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //229
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //228
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //227
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //226
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //225
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //224
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //223
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //222
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //221
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //220
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //219
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //218
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //217
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //216
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //215
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //214
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //213
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //212
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //211
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //210
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //209
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //208
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //207
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //206
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //205
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //204
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //203
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //202
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //201
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //200
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //199
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //198
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //197
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //196
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //195
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //194
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //193
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //192
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //191
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //190
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //189
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //188
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //187
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //186
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //185
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //184
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //183
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //182
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //181
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //180
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //179
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //178
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //177
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //176
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //175
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //174
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //173
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //172
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //171
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //170
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //169
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //168
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //167
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //166
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //165
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //164
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //163
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //162
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //161
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //160
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //159
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //158
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //157
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //156
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //155
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //154
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //153
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //152
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //151
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //150
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //149
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //148
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //147
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //146
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //145
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //144
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //143
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //142
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //141
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //140
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //139
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //138
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //137
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //136
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //135
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //134
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //133
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //132
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //131
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //130
          (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //129
          // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //128
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //127
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //126
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //125
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //124
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //123
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //122
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //121
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //120
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //119
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //118
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //117
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //116
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //115
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //114
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //113
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //112
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //111
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //110
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //109
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //108
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //107
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //106
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //105
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //104
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //103
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //102
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //101
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //100
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //99
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //98
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //97
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //96
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //95
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //94
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //93
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //92
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //91
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //90
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //89
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //88
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //87
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //86
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //85
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //84
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //83
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //82
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //81
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //80
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //79
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //78
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //77
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //76
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //75
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //74
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //73
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //72
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //71
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //70
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //69
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //68
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //67
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //66
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //65
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //64
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //63
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //62
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //61
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //60
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //59
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //58
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //57
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //56
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //55
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //54
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //53
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //52
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //51
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //50
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //49
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //48
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //47
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //46
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //45
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //44
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //43
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //42
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  //41
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //40
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  //39
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  //38
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 37
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 36
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 35
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 34
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 33
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 32
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 31
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 30
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 29
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 28
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 27
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 26
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 25
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 24
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 23
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 22
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 21
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 20
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 19
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 18
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || // 17
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || // 16
          // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 15
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 14
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 13
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 12
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 11
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 10
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || // 9
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||   // 8
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 7
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) ||  // 6
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 5
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  // 4
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) ||  // 3
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || // 2
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) ||  // 1
          (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0)     // 0 
        ) {
          arr[i][j] = 0;
        } else {
          arr[i][j] = 1;
        }
      } else {
        if (i === 0 && j + 1 < rows.length && j > 0) {
          if (
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //31
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //30
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //29
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //28
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //27
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //26
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //25
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //24
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //23
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //22
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //21
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //20
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //19
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //18
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //17
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //16
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //15
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //14
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //13
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //12
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //11
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //10
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //9
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0)  //8
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //7
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //6
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //5
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //4
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //3
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //2
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //1
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i + 1 === cols.length && j + 1 < rows.length && j > 0) {
          if (
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //31
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) || //30
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) || //29
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //28
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //27
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //26
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0) || //25
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //24
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) || //23
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) || //22
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) || //21
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //20
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //19
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //18
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0) || //17
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //16
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) || //15
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //14
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //13
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) || //12
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //11
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) || //10
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //9
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0) || //8
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) || //7
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //6
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //5
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) || //4
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //3
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) || //2
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //1
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j - 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i === 0 && j === 0) {
          if (
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //15
            (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //14
            // (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //13
            // (current[i][j] === 1 && current[i][j + 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //12
            (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //11
            (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //10
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //9
            // (current[i][j] === 1 && current[i][j + 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) || //8
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //7
            (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) || //6
            // (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //5
            // (current[i][j] === 0 && current[i][j + 1] === 1 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0) ||  //4
            (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 1) || //3
            (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j] === 1 && current[i + 1][j + 1] === 0) //2
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 1) || //1
            // (current[i][j] === 0 && current[i][j + 1] === 0 && current[i + 1][j] === 0 && current[i + 1][j + 1] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i === 0 && j + 1 === rows.length) {
          if (
            // (current[i][j - 1] === 1 && current[i][j] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1) || //15
            // (current[i][j - 1] === 1 && current[i][j] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0) || //14
            (current[i][j - 1] === 1 && current[i][j] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1) || //13
            (current[i][j - 1] === 1 && current[i][j] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0) || //12
            // (current[i][j - 1] === 1 && current[i][j] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1) || //11
            // (current[i][j - 1] === 1 && current[i][j] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0) || //10
            (current[i][j - 1] === 1 && current[i][j] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1) || //9
            (current[i][j - 1] === 1 && current[i][j] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0) || //8
            // (current[i][j - 1] === 0 && current[i][j] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1) || //7
            // (current[i][j - 1] === 0 && current[i][j] === 1 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0) || //6
            (current[i][j - 1] === 0 && current[i][j] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1) || //5
            (current[i][j - 1] === 0 && current[i][j] === 1 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0) || //4
            // (current[i][j - 1] === 0 && current[i][j] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 1) || //3
            // (current[i][j - 1] === 0 && current[i][j] === 0 && current[i + 1][j - 1] === 1 && current[i + 1][j] === 0) || //2
            (current[i][j - 1] === 0 && current[i][j] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 1) || //1
            (current[i][j - 1] === 0 && current[i][j] === 0 && current[i + 1][j - 1] === 0 && current[i + 1][j] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i + 1 === cols.length && j === 0) {
          if (
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) || //15
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //14
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //13
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) || //12
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //11
            (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0) || //10
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //9
            // (current[i - 1][j] === 1 && current[i - 1][j + 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0) || //8
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 1) || //7
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j] === 1 && current[i][j + 1] === 0) || //6
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 1) || //5
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 1 && current[i][j] === 0 && current[i][j + 1] === 0) //4
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 1) || //3
            (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j] === 1 && current[i][j + 1] === 0)  //2
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 1) || //1
            // (current[i - 1][j] === 0 && current[i - 1][j + 1] === 0 && current[i][j] === 0 && current[i][j + 1] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        } else if (i + 1 === cols.length && j + 1 === rows.length) {
          if (
            // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i][j - 1] === 1 && current[i][j] === 1) || //15
            // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i][j - 1] === 1 && current[i][j] === 0) || //14
            (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i][j - 1] === 0 && current[i][j] === 1) || //13
            (current[i - 1][j - 1] === 1 && current[i - 1][j] === 1 && current[i][j - 1] === 0 && current[i][j] === 0) || //12
            // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i][j - 1] === 1 && current[i][j] === 1) || //11
            // (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i][j - 1] === 1 && current[i][j] === 0) || //10
            (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i][j - 1] === 0 && current[i][j] === 1) || //9
            (current[i - 1][j - 1] === 1 && current[i - 1][j] === 0 && current[i][j - 1] === 0 && current[i][j] === 0) || //8
            // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i][j - 1] === 1 && current[i][j] === 1) || //7
            // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i][j - 1] === 1 && current[i][j] === 0) || //6
            (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i][j - 1] === 0 && current[i][j] === 1) || //5
            (current[i - 1][j - 1] === 0 && current[i - 1][j] === 1 && current[i][j - 1] === 0 && current[i][j] === 0) || //4
            // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i][j - 1] === 1 && current[i][j] === 1) || //3
            // (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i][j - 1] === 1 && current[i][j] === 0) || //2
            (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i][j - 1] === 0 && current[i][j] === 1) || //1
            (current[i - 1][j - 1] === 0 && current[i - 1][j] === 0 && current[i][j - 1] === 0 && current[i][j] === 0)    //0
          ) {
            arr[i][j] = 1;
          } else {
            arr[i][j] = 0;
          }
        }

      }
    }
  }

  return arr;
}