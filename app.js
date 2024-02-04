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
let Placedships = [];
let selectedship;
let ship_dispname = document.querySelector(".sname");
let player_dispname = document.querySelector(".pname");
const shipdivs = document.querySelectorAll(".ships");
let axis = document.querySelector(".axis");
let dir = document.querySelector(".dir");
let grids = document.querySelector(".grids");

generateGrid(10, 10);
grids.addEventListener("mouseleave", handlemouseleave);
for (const i of shipdivs) {
  i.addEventListener("click", () => shipSelector(i));
}
axis.addEventListener("click", () => {
  dir.innerText = dir.innerText == "X" ? "Y" : "X";
});
function shipSelector(i) {
  let temp = selectedship;
  if (temp != null) {
    let t = temp.name;
    let prev = document.querySelector("." + t);
    prev.style.backgroundColor = "#374151";
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
  curr.style.backgroundColor = "#4287f5";
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
  console.log("clicked");
  row = parseInt(row);
  col = parseInt(col);
  const isval = isvalid(row, col);

  if (isval) {
    insertimg(row, col);
  }
}

function insertimg(row, col) {
  let endX = row,
    endY = col;
  let width, height, link;
  if (dir.innerText == "Y") {
    endX = row + selectedship.len - 1;
  } else {
    endY = col + selectedship.len - 1;
  }
  selectedship.coords = [
    [row, col],
    [endX, endY],
  ];
  selectedship.is_placed = 1;
  selectedship.Ship_axis = dir.innerText;
  Placedships.push(selectedship);
  console.log(row, col, endX, endY);
  if (dir.innerText == "X") {
    let j = 1;
    for (let i = col; i <= endY; i++) {
      const img = document.createElement("img");
      const link = `Ships/${selectedship.name}/${selectedship.name}${j}.png`;
      j++;
      console.log(row, col, endX, endY, link);
      img.src = link;
      img.classList.add("img-container");

      const e = `[data-row="${row}"][data-col="${i}"]`;
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
      console.log(row, col, endX, endY, link);
      img.src = link;
      img.style.height = "100%";
      img.style.width = "100%";
      const e = `[data-row="${i}"][data-col="${col}"]`;
      const imgdiv = document.querySelector(e);
      img.style.backgroundColor = "#E5E7EB";
      imgdiv.innerHTML = "";
      imgdiv.appendChild(img.cloneNode(true));
    }
  }
}

function isvalid(row, col) {
  let endX = row,
    endY = col;
  if (dir.innerText == "Y") {
    endX = row + selectedship.len - 1;
  } else {
    endY = col + selectedship.len - 1;
  }
  if (endX > 9 || endY > 9) {
    return false;
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
  console.log(row, col, endX, endY);
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
  const selector = `[data-row="${row}"][data-col="${col}"]`;
  const divElement = document.querySelector(selector);
  divElement.style.cursor = "not-allowed";
}

console.log("working");
