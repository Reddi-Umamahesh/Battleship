const ships = [
  {
    name: "Patrolship",
    len: 2,
    Ship_axis: "X",
    coords: [[], []],
    is_placed: 0,
    is_sunked: 0,
  },
  {
    name: "Submarine",
    len: 3,
    Ship_axis: "X",
    coords: [[], []],
    is_placed: 0,
    is_sunked: 0,
  },
  {
    name: "Destroyer",
    len: 4,
    Ship_axis: "X",
    coords: [[], []],
    is_placed: 0,
    is_sunked: 0,
  },
  {
    name: "Battleship",
    len: 5,
    Ship_axis: "X",
    coords: [[], []],
    is_placed: 0,
    is_sunked: 0,
  },
  {
    name: "Carrier",
    len: 6,
    Ship_axis: "X",
    coords: [[], []],
    is_placed: 0,
    is_sunked: 0,
  },
];
let computerships = JSON.parse(JSON.stringify(ships));
let Placedships = [];
let selectedship;
let ship_dispname = document.querySelector(".sname");
let player_dispname = document.querySelector(".pname");
const shipdivs = document.querySelectorAll(".ships");
let axis = document.querySelector(".axis");
let dir = document.querySelector(".dir");
let grids = document.querySelector(".grids");
const del = document.querySelector(".delete");
const leftdoor = document.querySelector(".left-door");
const rightdoor = document.querySelector(".right-door");
const stamp = document.querySelector(".stamp");
const random = document.querySelector(".random");

document.querySelector(".start").addEventListener("click", () => {
  document.querySelector(".strategy-panel").classList.add("open");
});

del.addEventListener("click", () => deletefunc());
random.addEventListener("click", () => handleRandom());
generateGrid(10, 10);
grids.addEventListener("mouseleave", handlemouseleave);
for (const i of shipdivs) {
  i.addEventListener("click", () => shipSelector(i));
}
axis.addEventListener("click", () => {
  dir.innerText = dir.innerText == "X" ? "Y" : "X";
});
function shipSelector(i) {
  let instruts = document.querySelector(".insrtuctions");
  instruts.innerText = "";
  let temp = selectedship;

  if (temp != null) {
    let t = temp.name;
    let prev = document.querySelector("." + t);
    if (!Placedships.includes(prev)) {
      prev.style.backgroundColor = "#374151";
    }
  }
  if (i.classList.contains("Patrolship")) {
    selectedship = ships[0];
  } else if (i.classList.contains("Submarine")) {
    selectedship = ships[1];
  } else if (i.classList.contains("Destroyer")) {
    selectedship = ships[2];
  } else if (i.classList.contains("Battleship")) {
    selectedship = ships[3];
  } else if (i.classList.contains("Carrier")) {
    selectedship = ships[4];
  }
  let c = selectedship.name;
  ship_dispname.innerText = c;
  let curr = document.querySelector("." + c);
  updatePlaced();
  curr.style.backgroundColor = "#4287f5";
}
function deletefunc() {
  console.log("deleted");
  grids.innerHTML = "";
  Placedships = [];
  selectedship = null;
  updatePlaced();
  checkplay();
  generateGrid(10, 10);
  if (document.querySelector(".highlight-btn").classList.contains("blink")) {
    console.log("blinking");
    document.querySelector(".highlight-btn").classList.toggle("blink");
  }
  var image = document.querySelector(".playimg");
  image.src = "Assests/play1-nbg.png";
  image.style.cursor = "not-allowed";
  gamestarted = 0;
}
function generateGrid(rows, cols) {
  const parentDiv = document.querySelector(".grids");
  grids.addEventListener("mouseleave", handlemouseleave);
  parentDiv.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const gridItem = document.createElement("div");

      gridItem.dataset.row = i;
      gridItem.dataset.col = j;
      gridItem.addEventListener("mouseover", handlemouseover);

      gridItem.addEventListener("click", handlegridclick);

      gridItem.className = "grid-item";
      parentDiv.appendChild(gridItem);
    }
  }
}
function handlemouseover(event) {
  let { row, col } = event.target.dataset;
  if (!selectedship) {
    return;
  }
  row = parseInt(row);
  col = parseInt(col);

  let idplacementvalid = isvalid(row, col);
  updateGridStyles(row, col, idplacementvalid);
  if (idplacementvalid) {
    highletgrid(row, col);
  } else {
    invalidArea(row, col);
  }
  event.stopPropagation();
}
function updateGridStyles(row, col, idplacementvalid) {
  const grids = document.querySelectorAll(".grid-item");
  grids.forEach((gridItem) => {
    const { row: currentRow, col: currentCol } = gridItem.dataset;
    const isCurrentCell =
      parseInt(currentRow) === row && parseInt(currentCol) === col;

    if (isCurrentCell && idplacementvalid) {
      gridItem.style.backgroundColor = "#E5E7EB";
      gridItem.style.cursor = "pointer";
    } else if (isCurrentCell) {
      gridItem.style.cursor = "not-allowed";
    } else {
      gridItem.style.backgroundColor = "";
      gridItem.style.cursor = "";
    }
  });
}
function handlemouseleave() {
  const ele = document.querySelectorAll("grid-item");
  ele.forEach((child) => {
    if (!child.classList.contains("img-container")) {
      child.style.backgroundColor = "";
    }
  });
}
function handlegridclick(event) {
  let { row, col } = event.target.dataset;
  checkplay();
  console.log("clicked");
  // console.log(Placedships);
  if (Placedships.includes(selectedship)) {
    return;
  }
  row = parseInt(row);
  col = parseInt(col);
  const isval = isvalid(row, col);

  if (isval) {
    const direction = dir.innerText;
    insertimg(row, col, direction);
  }
}

function insertimg(row, col, direction) {
  let endX = row,
    endY = col;
  if (direction == "Y") {
    endX = row + selectedship.len - 1;
  } else {
    endY = col + selectedship.len - 1;
  }

  if (!isvalid(row, col)) {
    invalidArea(row, col);
    return;
  }
  updatedetails(row, col, endX, endY);
  updateimg(row, col, endX, endY, direction, selectedship);
}
function updateimg(row, col, endX, endY, direction, selectedship) {
  if (direction == "X") {
    let j = 1;
    for (let i = col; i <= endY; i++) {
      const img = document.createElement("img");
      const link = `Ships/${selectedship.name}/${selectedship.name}${j}.png`;
      j++;

      img.src = link;
      img.classList.add("img-container");

      const e = `.grid-item[data-row="${row}"][data-col="${i}"]`;
      const imgdiv = document.querySelector(e);
      img.style.backgroundColor = "#E5E7EB";
      imgdiv.innerHTML = "";
      imgdiv.appendChild(img.cloneNode(true));
    }
  } else {
    let j = 1;
    for (let i = row; i <= endX; i++) {
      const img = document.createElement("img");
      const link = `Ships/${selectedship.name}-vert/${selectedship.name}${j}.png`;
      j++;
      img.src = link;
      img.style.height = "100%";
      img.style.width = "100%";
      const e = `.grid-item[data-row="${i}"][data-col="${col}"]`;
      const imgdiv = document.querySelector(e);
      img.style.backgroundColor = "#E5E7EB";
      imgdiv.innerHTML = "";
      imgdiv.appendChild(img.cloneNode(true));
    }
  }
}
function updatedetails(row, col, endX, endY) {
  if (isNaN(row) || isNaN(col)) {
    return false;
  }
  selectedship.coords = [
    [row, col],
    [endX, endY],
  ];
  selectedship.is_placed = 1;
  selectedship.Ship_axis = dir.innerText;
  Placedships.push(selectedship);
  checkplay();
  const cls = selectedship.name;
  const getshipdiv = document.querySelector("." + cls);
  getshipdiv.style.backgroundColor = "#718096";
  // console.log(getshipdiv);
}
function updatePlaced() {
  for (const i of ships) {
    if (Placedships.includes(i)) {
      let shipdiv = document.querySelector("." + i.name);
      shipdiv.style.backgroundColor = "#718096";
      shipdiv.style.cursor = "not-allowed";
    } else {
      let shipdiv = document.querySelector("." + i.name);
      shipdiv.style.backgroundColor = "";
      shipdiv.style.cursor = "pointer";
    }
  }
}
function checkplay() {
  if (Placedships.length == 5) {
    const highlightBtn = document.querySelector(".highlight-btn");
    const i = document.querySelector(".playimg");
    i.style.cursor = "pointer";
    highlightBtn.classList.add("blink");
  }
}
function isvalid(row, col) {
  let endX = row,
    endY = col;
  if (isNaN(row) || isNaN(col)) {
    return false;
  }
  if (Placedships.includes(selectedship)) {
    return false;
  }
  if (dir.innerText == "Y") {
    endX = row + selectedship.len - 1;
  } else {
    endY = col + selectedship.len - 1;
  }
  if (endX > 9 || endY > 9) {
    return false;
  }
  if (endX == row) {
    for (let i = col; i <= endY; i++) {
      const ele = `[data-row="${row}"][data-col="${i}"]`;
      const div = document.querySelector(ele);
      if (div.querySelector("img") !== null) {
        return false;
      }
    }
  } else {
    for (let i = row; i <= endX; i++) {
      const ele = `[data-row="${i}"][data-col="${col}"]`;
      const div = document.querySelector(ele);
      if (div.querySelector("img") !== null) {
        return false;
      }
    }
  }
  return true;
}
function highletgrid(row, col) {
  let endX = row,
    endY = col;
  if (dir.innerText == "Y") {
    endX = row + selectedship.len - 1;
  } else {
    endY = col + selectedship.len - 1;
  }
  if (endX == row) {
    for (let i = col; i <= endY; i++) {
      const ele = `[data-row="${row}"][data-col="${i}"]`;
      const div = document.querySelector(ele);
      div.style.backgroundColor = "#E5E7EB";
    }
  } else {
    for (let i = row; i <= endX; i++) {
      const ele = `[data-row="${i}"][data-col="${col}"]`;
      const div = document.querySelector(ele);
      div.style.backgroundColor = "#E5E7EB";
    }
  }
}
function cleargrid() {
  grids.innerHTML = "";
}
function invalidArea(row, col) {
  if (isNaN(row) || isNaN(col)) {
    return false;
  }
  const selector = `[data-row="${row}"][data-col="${col}"]`;
  const divElement = document.querySelector(selector);
  divElement.style.cursor = "not-allowed";
}

function handleRandom() {
  deletefunc();
  const randomCoords = generateShipCoordinates(shipLengths);
  for (let i = 0; i < 5; i++) {
    ships[i].coords = randomCoords[i];
    if (randomCoords[i][0][0] == randomCoords[i][1][0]) {
      ships[i].Ship_axis = "X";
    } else {
      ships[i].Ship_axis = "Y";
    }
    Placedships.push(ships[i]);
  }
  if (!checkValidy(Placedships)) {
    handleRandom();
  }

  Placedships.forEach((ship) => {
    const row = ship.coords[0][0];
    const col = ship.coords[0][1];
    const endX = ship.coords[1][0];
    const endY = ship.coords[1][1];
    const direction = ship.Ship_axis;
    updateimg(row, col, endX, endY, direction, ship);
  });
  checkplay();
}

function checkValidy(Placedships) {
  let pairs = [];
  Placedships.forEach((element) => {
    let dir = element.Ship_axis;
    let x = element.coords[0][0];
    let y = element.coords[0][1];
    for (let i = 0; i < element.len; i++) {
      let temp = [];
      if (dir == "X") {
        temp.push(x);
        temp.push(y + i);
      } else {
        temp.push(x + i);
        temp.push(y);
      }
      pairs.push(temp);
    }
  });
  if (pairs.length < 20) {
    return false;
  }
  const val = hasRepeatedPairs(pairs);
  if (val) {
    return false;
  } else {
    return true;
  }
}
function hasRepeatedPairs(pairs) {
  const pairSet = new Set();
  for (const pair of pairs) {
    const pairString = JSON.stringify(pair);
    if (pairSet.has(pairString)) {
      return true;
    } else {
      pairSet.add(pairString);
    }
  }

  return false;
}

document.querySelector(".play").addEventListener("click", (event) => {
  if (Placedships.length < 4) {
    console.log("returned");
    return;
  }
  changeimg();
  if (gamestarted > 1) {
    return;
  }
  gamestarted++;
  console.log("started");
  console.log("work");
  rightdoor.style.right = "0";
  leftdoor.style.left = "0";
  leftdoor.style.borderRight = "30px solid #fff";
  rightdoor.style.borderLeft = "30px solid #fff";
  doors();
  printstamp();
});
let gamestarted = 0;
function changeimg() {
  var image = document.querySelector(".playimg");
  console.log(image.src);
  if (gamestarted > 0) {
    image.style.cursor = "";
  } else {
    gamestarted++;
    console.log("img");
    image.style.opacity = "0";
    setTimeout(function () {
      image.src = "Assests/pause1.png";
      image.style.opacity = "1";
      image.style.cursor = "wait";
    }, 150);
  }
}

function doors() {
  console.log("doors");
  setTimeout(() => {
    leftdoor.style.borderRight = "30px solid #333";
    rightdoor.style.borderLeft = "30px solid #333";
  }, 2000);
}

function printstamp() {
  setTimeout(() => {
    stamp.style.visibility = "visible";
    stamp.style.top = "15%";
    setTimeout(() => {
      battlebegins();
    }, 500);
  }, 2400);
}

function battlebegins() {
  stamp.style.visibility = "hidden";
  setTimeout(() => {
    rightdoor.style.right = "-500%";
    leftdoor.style.left = "-500%";
  }, 1200);
}

function generateBattlefeild() {
  console.log("working");
  const parent = document.querySelectorAll(".feild");
  const friendly = document.querySelector(".friendly");
  const enemy = document.querySelector(".enemy");
  friendly.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const feildItem = document.createElement("div");
      feildItem.dataset.row = i;
      feildItem.dataset.col = j;
      feildItem.className = "feild-item";
      friendly.appendChild(feildItem);
    }
  }
  enemy.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const feildItem = document.createElement("div");
      feildItem.dataset.row = i;
      feildItem.dataset.col = j;

      feildItem.addEventListener("mouseover", handleEnemyhover);
      feildItem.addEventListener("click", handleEnemyclick);

      feildItem.className = "enemy-item";
      enemy.appendChild(feildItem);
    }
  }
}
function handleEnemyhover(event) {
  if (control != "user") {
    return;
  }
  let { row, col } = event.target.dataset;
  row = parseInt(row);
  col = parseInt(col);
  if (isNaN(row) || isNaN(col)) {
    return;
  }
  const e = `.enemy-item[data-row="${row}"][data-col="${col}"]`;
  let ele = document.querySelector(e);
}
function handleEnemyclick(event) {
  console.log("clicked");
}
function ArrangeComputer() {
  const randomCoords = generateShipCoordinates(shipLengths);
  for (let i = 0; i < 5; i++) {
    computerships[i].coords = randomCoords[i];
    if (randomCoords[i][0][0] == randomCoords[i][1][0]) {
      computerships[i].Ship_axis = "X";
    } else {
      computerships[i].Ship_axis = "Y";
    }
  }
  if (!checkValidy(computerships)) {
    ArrangeComputer();
  }
  console.log(computerships);
  arrangeBattlefeild(computerships, "enemy-item");
}

function arrangeBattlefeild(shipsArr, childname) {
  shipsArr.forEach((ship) => {
    const row = ship.coords[0][0];
    const col = ship.coords[0][1];
    const endX = ship.coords[1][0];
    const endY = ship.coords[1][1];
    const direction = ship.Ship_axis;
    if (direction == "X") {
      let j = 1;
      for (let i = col; i <= endY; i++) {
        const img = document.createElement("img");
        const link = `Ships/${ship.name}/${ship.name}${j}.png`;
        j++;
        img.src = link;
        img.classList.add("img-container");
        let e;
        if (childname == "enemy-item") {
          e = `.enemy-item[data-row="${row}"][data-col="${i}"]`;
        } else {
          e = `.feild-item[data-row="${row}"][data-col="${i}"]`;
        }
        const imgdiv = document.querySelector(e);
        img.style.backgroundColor = "#E5E7EB";
        imgdiv.innerHTML = "";
        imgdiv.appendChild(img.cloneNode(true));
      }
    } else {
      let j = 1;
      for (let i = row; i <= endX; i++) {
        const img = document.createElement("img");
        const link = `Ships/${ship.name}-vert/${ship.name}${j}.png`;
        j++;
        img.src = link;
        img.style.height = "100%";
        img.style.width = "100%";
        let e;
        if (childname == "enemy-item") {
          e = `.enemy-item[data-row="${i}"][data-col="${col}"]`;
        } else {
          e = `.feild-item[data-row="${i}"][data-col="${col}"]`;
        }
        const imgdiv = document.querySelector(e);
        img.style.backgroundColor = "#E5E7EB";
        imgdiv.innerHTML = "";
        imgdiv.appendChild(img.cloneNode(true));
      }
    }
  });
}

generateBattlefeild();
document.querySelector(".highlight-btn").addEventListener("click", () => {
  setTimeout(() => {
    document.querySelector(".battlefeild").style.top = "0";
    setTimeout(() => {
      arrangeBattlefeild(Placedships, "feild-item");
      ArrangeComputer();
    }, 1000);
  }, 4000);
});
let control = "user";
function userTurn() {}

const shipLengths = [6, 5, 4, 3, 2];

function generateShipCoordinates(shipLengths) {
  if (!shipLengths || !Array.isArray(shipLengths) || shipLengths.length !== 5) {
    throw new Error(
      "Invalid ship lengths: Must be an array of 5 integer lengths."
    );
  }

  const boardSize = 10;
  const shipCoordinates = [];

  const directions = ["horizontal", "vertical"];

  for (let i = shipLengths.length - 1; i >= 0; i--) {
    let shipLength = shipLengths[i];
    let validPlacement = false;

    while (!validPlacement) {
      const startingX = Math.floor(
        Math.random() * (boardSize - shipLength + 1)
      );
      const startingY = Math.floor(randomIntInRange(0, boardSize - shipLength));

      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      let endX, endY;
      if (direction === "horizontal") {
        endX = startingX + shipLength - 1;
      } else {
        endY = startingY + shipLength - 1;
      }

      if (
        (direction === "horizontal" && endX >= boardSize) ||
        (direction === "vertical" && endY >= boardSize)
      ) {
        continue;
      }

      let collision = false;
      for (let j = 0; j < shipCoordinates.length; j++) {
        const existingShip = shipCoordinates[j];
        if (
          isCollidingWithArea(startingX, startingY, endX, endY, existingShip)
        ) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        validPlacement = true;

        if (direction === "horizontal") {
          shipCoordinates.push([
            [startingX, startingY],
            [endX, startingY],
          ]);
        } else {
          shipCoordinates.push([
            [startingX, startingY],
            [startingX, endY],
          ]);
        }
      }
    }
  }

  return shipCoordinates;
}

function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isCollidingWithArea(x1, y1, x2, y2, ship) {
  const [[shipStartingX, shipStartingY], [shipEndX, shipEndY]] = ship;

  const expandedStartingX = x1 - 1;
  const expandedStartingY = y1 - 1;
  const expandedEndX = x2 + 1;
  const expandedEndY = y2 + 1;

  return (
    (expandedStartingX >= shipStartingX - 1 &&
      expandedStartingX <= shipEndX + 1 &&
      expandedStartingY >= shipStartingY - 1 &&
      expandedStartingY <= shipEndY + 1) ||
    (expandedEndX >= shipStartingX - 1 &&
      expandedEndX <= shipEndX + 1 &&
      expandedEndY >= shipStartingY - 1 &&
      expandedEndY <= shipEndY + 1) ||
    (shipStartingX >= expandedStartingX - 1 &&
      shipStartingX <= expandedEndX + 1 &&
      shipStartingY >= expandedStartingY - 1 &&
      shipStartingY <= expandedEndY + 1) ||
    (shipEndX >= expandedStartingX - 1 &&
      shipEndX <= expandedEndX + 1 &&
      shipEndY >= expandedStartingY - 1 &&
      shipEndY <= expandedEndY + 1)
  );
}
