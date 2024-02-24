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
let destroyedshipsComp = [
  { damage: 0 },
  { damage: 0 },
  { damage: 0 },
  { damage: 0 },
  { damage: 0 },
];
let destroyedshipsUser = [
  { damage: 0, changed: 0 },
  { damage: 0, changed: 0 },
  { damage: 0, changed: 0 },
  { damage: 0, changed: 0 },
  { damage: 0, changed: 0 },
];
let user_Coords = [];
let user_DupCoords = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    user_Coords.push([i, j]);
    user_DupCoords.push([i, j]);
  }
}
const eborder = document.querySelector(".eborder");
document.querySelector(".start").addEventListener("click", () => {
  nam = document.querySelector(".name").value.trim();
  if (nam !== "") {
    document.querySelector(".pname").innerText = nam;
    document.querySelector(".name").style.border = "";
    document.querySelector(".strategy-panel").classList.add("open");
  } else {
    document.querySelector(".name").style.border = "2px solid red";
  }
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
  pairs.length = 0;
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
  const isval = checkValidy(Placedships);
  if (!isval) {
    handleRandom();
  } else {
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
}
let pairs = [];
function checkValidy(Placedships) {
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
function convertTo2DArray(coords) {
  const result = [];
  let startIndex = 0;
  for (let size of [2, 3, 4, 5]) {
    const ship = coords.slice(startIndex, startIndex + size);
    result.push(ship);
    startIndex += size;
  }
  return result;
}
function checkShipsValidity(shipCoords) {
  for (let i = 0; i < shipCoords.length; i++) {
    const currentShip = shipCoords[i];
    for (let j = 0; j < currentShip.length; j++) {
      const [x, y] = currentShip[j];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const adjacentX = x + dx;
          const adjacentY = y + dy;
          for (let k = 0; k < shipCoords.length; k++) {
            if (k !== i) {
              const otherShip = shipCoords[k];
              for (let l = 0; l < otherShip.length; l++) {
                const [otherX, otherY] = otherShip[l];
                if (adjacentX === otherX && adjacentY === otherY) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
  }

  return true;
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
  if (gamestarted > 0) {
    image.style.cursor = "";
  } else {
    gamestarted++;

    image.style.opacity = "0";
    setTimeout(function () {
      image.src = "Assests/pause1.png";
      image.style.opacity = "1";
      image.style.cursor = "wait";
    }, 150);
  }
}

function doors() {
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
function updatemsg(text, div) {
  typingSpeed = 45;
  let i = 0;
  div.innerHTML = "";
  const interval = setInterval(() => {
    div.textContent += text[i];
    i++;
    if (i === text.length) {
      clearInterval(interval);
    }
  }, typingSpeed);
}
let msgtyped;
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
  if (control != "user") {
    return;
  }
  let first = document.querySelector(".firstcmd");
  let second = document.querySelector(".secondcmd");
  control = "comp";
  let { row, col } = event.target.dataset;
  row = parseInt(row);
  col = parseInt(col);
  let temp = [row, col];
  if (isNaN(row) || isNaN(col)) {
    return;
  }
  const e = `.enemy-item[data-row="${row}"][data-col="${col}"]`;
  let ele = document.querySelector(e);
  if (ele.classList.contains("destroyed")) {
    control = "user";
    return;
  }
  ele.style.backgroundColor = "#006400";
  ele.classList.add("destroyed");
  if (!msgtyped) {
    const text = "You fire a shot into enemy waters ....";
    first.innerHTML = "";
    second.innerHTML = "";
    updatemsg(text, first);
    msgtyped = true;
  }
  let tex = "";
  setTimeout(() => {
    let isrep = false;
    ele.style.backgroundColor = "";
    for (let i = 0; i < 20; i++) {
      if (computerPlacements[i][0] == row && computerPlacements[i][1] == col) {
        isrep = true;
        if (i < 2) {
          destroyedshipsComp[0].damage++;
        } else if (i < 5) {
          destroyedshipsComp[1].damage++;
        } else if (i < 9) {
          destroyedshipsComp[2].damage++;
        } else if (i < 14) {
          destroyedshipsComp[3].damage++;
        } else {
          destroyedshipsComp[4].damage++;
        }
      }
    }
    if (isrep) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.backgroundColor = "red";
      tex = "It's a Hit";
      ele.append(dot);
    } else {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.backgroundColor = "#fff";
      tex = "It's a Miss";
      ele.append(dot);
    }
    updatemsg(tex, second);
    checkdestroyed(destroyedshipsComp);
    if (checkwin()) {
      checkwin();
      const div = document.querySelector(".victory");
      const windata = `Game over! ${won} won!!`;
      const data = document.querySelector(".wintxt");
      data.innerHTML = windata;
      div.classList.add("vic");
      return;
    }
    setTimeout(() => {
      first.innerHTML = "";
      second.innerHTML = "";
      let t = "Your Opponent is Aiming..";
      updatemsg(t, first);
    }, 700);
    setTimeout(() => {
      msgtypedComp = false;
      computerAttack();
    }, 2000);
  }, 2000);
}
function checkdestroyed(ships) {
  if (ships[0].damage == 2) {
    computerships[0].is_sunked = 1;
    addDestroyedships(computerships[0]);
  }
  if (ships[1].damage == 3) {
    computerships[1].is_sunked = 1;
    addDestroyedships(computerships[1]);
  }
  if (ships[2].damage == 4) {
    computerships[2].is_sunked = 1;
    addDestroyedships(computerships[2]);
  }
  if (ships[3].damage == 5) {
    computerships[3].is_sunked = 1;
    addDestroyedships(computerships[3]);
  }
  if (ships[4].damage == 6) {
    computerships[4].is_sunked = 1;
    addDestroyedships(computerships[4]);
  }
}
function addDestroyedships(ship) {
  let row = ship.coords[0][0];
  let col = ship.coords[0][1];
  let endX = ship.coords[1][0];
  let endY = ship.coords[1][1];
  let dir = ship.Ship_axis;
  if (dir == "X") {
    let j = 1;
    for (let i = col; i <= endY; i++) {
      const img = document.createElement("img");
      const link = `Ships/${ship.name}/${ship.name}${j}.png`;
      j++;
      img.src = link;
      img.classList.add("destroyed");
      img.classList.add("sunked");
      setTimeout(() => {
        img.style.opacity = "1";
        img.style.backgroundColor = "#8b0000";
        let e = `.enemy-item[data-row="${row}"][data-col="${i}"]`;
        const imgdiv = document.querySelector(e);
        imgdiv.innerHTML = "";
        imgdiv.appendChild(img.cloneNode(true));
      }, 500);
    }
  } else {
    let j = 1;
    for (let i = row; i <= endX; i++) {
      const img = document.createElement("img");
      const link = `Ships/${ship.name}-vert/${ship.name}${j}.png`;
      j++;
      img.src = link;
      img.classList.add("destoryed");
      img.classList.add("sunked");
      setTimeout(() => {
        img.style.opacity = "1";
        img.style.backgroundColor = "#8b0000";
        let e = `.enemy-item[data-row="${i}"][data-col="${col}"]`;
        const imgdiv = document.querySelector(e);
        imgdiv.innerHTML = "";
        imgdiv.appendChild(img.cloneNode(true));
      }, 500);
    }
  }
}
let computerPlacements;
let compPlacementsarray;
function ArrangeComputer() {
  let data = generateparis();
  const randomCoords = data[0];
  computerPlacements = data[1];
  compPlacementsarray = data[0];
  for (let i = 0; i < 5; i++) {
    computerships[i].coords = randomCoords[i];
    if (randomCoords[i][0][0] == randomCoords[i][1][0]) {
      computerships[i].Ship_axis = "X";
    } else {
      computerships[i].Ship_axis = "Y";
    }
  }
  // arrangeBattlefeild(computerships, "enemy-item");
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
        img.style.backgroundColor = "#215959";
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
        img.style.backgroundColor = "#215959";
        imgdiv.innerHTML = "";
        imgdiv.appendChild(img.cloneNode(true));
      }
    }
  });
}
let nam = "";
generateBattlefeild();
document.querySelector(".highlight-btn").addEventListener("click", () => {
  if (Placedships.length == 5) {
    setTimeout(() => {
      document.querySelector(".battlefeild").style.top = "0";
      setTimeout(() => {
        arrangeBattlefeild(Placedships, "feild-item");
        ArrangeComputer();
        user_placements();
        setTimeout(() => {
          typingSpeed = 20;
          let i = 0;
          const text = `Awaiting orders, Admiral ${nam}`;
          const div = document.querySelector(".firstcmd");
          div.innerHTML = "";
          const interval = setInterval(() => {
            div.textContent += text[i];
            i++;
            if (i === text.length) {
              clearInterval(interval);
            }
          }, typingSpeed);
        }, 100);
      }, 1000);
    }, 4000);
  }
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
function generateparis() {
  pairs.length = 0;
  let randomCoords = generateShipCoordinates(shipLengths);
  let direction;
  for (let i = 0; i < 5; i++) {
    if (randomCoords[i][0][0] == randomCoords[i][1][0]) {
      direction = "X";
    } else {
      direction = "Y";
    }
    let x = randomCoords[i][0][0];
    let y = randomCoords[i][0][1];
    for (let j = 0; j < i + 2; j++) {
      let temp = [];
      if (direction == "X") {
        temp.push(x);
        temp.push(y + j);
      } else {
        temp.push(x + j);
        temp.push(y);
      }
      pairs.push(temp);
    }
  }
  let isval = hasRepeatedPairs(pairs);
  if (isval) {
    return generateparis();
  } else {
    let data = [randomCoords, pairs];
    return data;
  }
}
let prev;
let Pattack_coords;
let memory = [];
let msgtypedComp = false;
function computerAttack() {
  let first = document.querySelector(".firstcmd");
  let second = document.querySelector(".secondcmd");

  if (!msgtypedComp) {
    const text1 = "The enemy fires a shot into your waters ......";
    first.innerHTML = "";
    second.innerHTML = "";
    updatemsg(text1, first);
    msgtyped = true;
  }
  let coord = user_Coords[getRandomNumber()];
  let row = coord[0];
  let col = coord[1];
  const e = `.feild-item[data-row="${row}"][data-col="${col}"]`;
  let ele = document.querySelector(e);
  if (ele.classList.contains("destroyed")) {
    console.log("repedted");
    return;
  }
  ele.style.backgroundColor = "#006400";
  setTimeout(() => {
    if (control == "comp") {
      let t = "";
      ele.style.backgroundColor = "";
      ele.classList.add("destroyed");
      const img = ele.querySelector("img");
      if (img != null) {
        img.style.backgroundColor = "red";
        memory.push([row, col]);
        Pattack_coords = [row, col];
        updateUserDestroyed(row, col);
        t = "It's a Hit";
        user_destroyed();
      } else {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.backgroundColor = "#fff";
        t = "It's a miss";
        ele.append(dot);
      }
      memory.forEach((element) => {
        let x = element[0];
        let y = element[1];
        if (checkdestruction(x, y)) {
          let idx = memory.findIndex((arr) => arr[0] === x && arr[1] === y);
          memory.splice(idx, 1);
        }
      });
      temp = user_Coords.findIndex((c) => c[0] === row && c[1] === col);
      if (destroyed_coords != null) {
        destroyed_coords.push(temp);
      } else {
        destroyed_coords[0] = 100;
      }
      updatemsg(t, second);
      if (checkwin()) {
        checkwin();
        const div = document.querySelector(".victory");
        const windata = `Game over! ${won} won!!`;
        const data = document.querySelector(".wintxt");
        data.innerHTML = windata;
        div.classList.add("vic");
        return;
      }
      setTimeout(() => {
        msgtyped = false;
        control = "user";
      }, 1100);
    }
  }, 2000);
}
let destroyed_coords = [];
function randomGen() {
  let range = user_DupCoords.length;
  let randomNumber = Math.floor(Math.random() * range);
  let vals = user_DupCoords[randomNumber];
  let a = vals[0];
  let b = vals[1];
  user_DupCoords.splice(randomNumber, 1);
  const index = user_Coords.findIndex(
    (coord) => coord[0] === a && coord[1] === b
  );
  return index;
}
function checkdestruction(row, col) {
  let count = 0;
  if (row - 1 >= 0) {
    const e = `.feild-item[data-row="${row - 1}"][data-col="${col}"]`;
    let element = document.querySelector(e);
    if (element.classList.contains("destroyed")) {
      count++;
    }
  } else {
    count++;
  }
  if (row + 1 <= 9) {
    const e = `.feild-item[data-row="${row + 1}"][data-col="${col}"]`;
    let element = document.querySelector(e);
    if (element.classList.contains("destroyed")) {
      count++;
    }
  } else {
    count++;
  }
  if (col - 1 >= 0) {
    const e = `.feild-item[data-row="${row}"][data-col="${col - 1}"]`;
    let element = document.querySelector(e);
    if (element.classList.contains("destroyed")) {
      count++;
    }
  } else {
    count++;
  }
  if (col + 1 <= 9) {
    const e = `.feild-item[data-row="${row}"][data-col="${col + 1}"]`;
    let element = document.querySelector(e);
    if (element.classList.contains("destroyed")) {
      count++;
    }
  } else {
    count++;
  }
  if (count == 4) {
    return true;
  }
  return false;
}
function getRandomNumber() {
  let idx;
  let randomNumber;
  memory.forEach((element) => {
    let x = element[0];
    let y = element[1];
    if (checkdestruction(x, y)) {
      let idx = memory.findIndex((arr) => arr[0] === x && arr[1] === y);
      memory.splice(idx, 1);
    }
  });
  if (memory.length > 0) {
    cords = memory[memory.length - 1];
    idx = intelligence(cords);
  } else {
    return randomGen();
  }
  return idx;
}
function intelligence(Pattack_coords) {
  let ele = Pattack_coords;
  let x = ele[0];
  let y = ele[1];
  let a, b;
  if (isval_attack(x - 1, y)) {
    a = x - 1;
    b = y;
  } else if (isval_attack(x + 1, y)) {
    a = x + 1;
    b = y;
  } else if (isval_attack(x, y + 1)) {
    a = x;
    b = y + 1;
  } else if (isval_attack(x, y - 1)) {
    a = x;
    b = y - 1;
  } else {
    return null;
  }
  const temp = user_DupCoords.findIndex(
    (coord) => coord[0] === a && coord[1] === b
  );
  user_DupCoords.splice(temp, 1);
  const index = user_Coords.findIndex(
    (coord) => coord[0] === a && coord[1] === b
  );
  return index;
}
function isval_attack(x, y) {
  if (x < 0 || x > 9 || y < 0 || y > 9) {
    return false;
  }
  let row = x;
  let col = y;
  const e = `.feild-item[data-row="${row}"][data-col="${col}"]`;
  let ele = document.querySelector(e);
  if (ele.classList.contains("destroyed")) {
    return false;
  }
  if (user_Coords[(x, y)] != null) {
    return true;
  }
  return false;
}
let user_Placed = [];
function user_placements() {
  Placedships.forEach((ship) => {
    let dir = ship.Ship_axis;
    let i = ship.coords[0][0];
    let j = ship.coords[0][1];
    let endX = ship.coords[1][0];
    let endY = ship.coords[1][1];

    if (dir == "X") {
      for (let k = j; k <= endY; k++) {
        user_Placed.push([i, k]);
      }
    } else {
      for (let k = i; k <= endX; k++) {
        user_Placed.push([k, j]);
      }
    }
  });
}
function updateUserDestroyed(row, col) {
  for (let i = 0; i < 20; i++) {
    if (user_Placed[i][0] == row && user_Placed[i][1] == col) {
      isrep = true;
      if (i < 2) {
        destroyedshipsUser[0].damage++;
      } else if (i < 5) {
        destroyedshipsUser[1].damage++;
      } else if (i < 9) {
        destroyedshipsUser[2].damage++;
      } else if (i < 14) {
        destroyedshipsUser[3].damage++;
      } else {
        destroyedshipsUser[4].damage++;
      }
    }
  }
}
function user_destroyed() {
  if (destroyedshipsUser[0].damage == 2) {
    if (destroyedshipsUser[0].changed == 0) {
      changeColUser(0, 2);
      destroyedshipsUser[0].changed = 1;
    }
  }
  if (destroyedshipsUser[1].damage == 3) {
    if (destroyedshipsUser[1].changed == 0) {
      changeColUser(2, 5);
      destroyedshipsUser[1].changed = 1;
    }
  }
  if (destroyedshipsUser[2].damage == 4) {
    if (destroyedshipsUser[2].changed == 0) {
      changeColUser(5, 9);
      destroyedshipsUser[2].changed = 1;
    }
  }
  if (destroyedshipsUser[3].damage == 5) {
    if (destroyedshipsUser[3].changed == 0) {
      changeColUser(9, 14);
      destroyedshipsUser[3].changed = 1;
    }
  }
  if (destroyedshipsUser[4].damage == 6) {
    if (destroyedshipsUser[4].changed == 0) {
      changeColUser(14, 20);
      destroyedshipsUser[4].changed = 1;
    }
  }
}
function changeColUser(start, end) {
  for (let i = start; i < end; i++) {
    let row = user_Placed[i][0];
    let col = user_Placed[i][1];
    const e = `.feild-item[data-row="${row}"][data-col="${col}"]`;
    let ele = document.querySelector(e);
    let img = ele.querySelector("img");
    img.style.backgroundColor = "#8b0000";
  }
}
let won = "";
function checkwin() {
  let ca = destroyedshipsComp[0].damage;
  let cb = destroyedshipsComp[1].damage;
  let cc = destroyedshipsComp[2].damage;
  let cd = destroyedshipsComp[3].damage;
  let ce = destroyedshipsComp[4].damage;
  let ua = destroyedshipsComp[0].damage;
  let ub = destroyedshipsComp[1].damage;
  let uc = destroyedshipsComp[2].damage;
  let ud = destroyedshipsComp[3].damage;
  let ue = destroyedshipsComp[4].damage;
  if (ca == 2 && cb == 3 && cc == 4 && cd == 5 && ce == 6) {
    won = `${nam}`;
    const d = document.querySelector(".blured");
    d.style.top = "0";
    return true;
  }
  if (ua == 2 && ub == 3 && uc == 4 && ud == 5 && ue == 6) {
    won = "Enemy";
    const d = document.querySelector(".blured");
    d.style.top = "0";
    return true;
  }
}
document.querySelector(".playagain").addEventListener("click", () => {
  window.location.reload(false);
});
