//---- DECLARE OBJECT CLASSES ----//

class UserInterfaceItem {
  constructor(element, classType, text, append) {
    this.element = element;
    this.class = classType;
    this.text = text;
    this.append = append;  
  }
  buildUI(appendTo) {
    this.tag = document.createElement(`${this.element}`);
    this.tag.classList.add(`${this.class}`);
    this.tag.innerText = `${this.text}`;
    appendTo.append(this.tag);
  }
  removeUI() {
    this.tag.remove();
  }
  updateScore(points) {
    scoreValue += points;
    this.tag.innerText = scoreValue;
  };
}
class Player {
  constructor(name, colour, coordX, coordY) {
    this.name = name;
    this.colour = colour;
    this.coordX = coordX;
    this.coordY = coordY;
  }
  render() {
    this.tag = document.createElement('div');
    this.tag.classList.add('player');
    this.tag.style.left = `${this.coordX}px`;
    this.tag.style.top = `${this.coordY}px`;
    this.tag.style.background = `${this.colour}`;
    gameWindow.append(this.tag);
  }
  movePlayer(distance) {
    this.coordX += distance;
    this.tag.style.left = `${this.coordX}px`
  }
  fireLaser () {
    lasers.push(new Laser((this.coordX + 47), this.coordY - 20));
    lasers[lasers.length-1].render();
  }
}
class Alien {
  constructor(index, groupSize, level) {
    this.index = index,
    this.groupSize = groupSize,
    this.level = level
  }
  get row() {
    return Math.ceil((this.index + 1) / 10);
  }
  get column() {
    if (this.index < 10) {
      return this.index + 1;
    } else if (this.index < 20) {
      return this.index - 9;
    } else if (this.index < 30) {
      return this.index - 19;
    } else if (this.index < 40) {
      return this.index - 29;
    }
  }
  get coordX() {
    return (((this.column-1)*60)+110)
  }
  get coordY() {
    return (((this.row-1)*60)+20)
  }
  get background() {
    return `url('./assets/virus-green.png')`;
  }
  render() {
    this.tag = document.createElement('tag');
    this.tag.classList.add('alien');
    this.tag.style.left = `${this.coordX}px`;
    this.tag.style.top = `${this.coordY}px`;
    this.tag.style.background = `${this.background}`;
    gameWindow.append(this.tag);
  }
}
class Laser {
  constructor(coordX, coordY) {
    this.colour = "lightcyan";
    this.coordX = coordX,
    this.coordY = coordY
  }
  render() {
    this.tag = document.createElement('tag');
    this.tag.classList.add('laser');
    this.tag.style.left = `${this.coordX}px`;
    this.tag.style.top = `${this.coordY}px`;
    this.tag.style.background = `${this.colour}`;
    gameWindow.append(this.tag);
  }
  move() {
    this.coordY -= 20; 
    this.tag.style.top = `${this.coordY}px`;
    }
  collisonDetection() {
    aliens.forEach((alien, aIndex) => {
      if ((this.coordY < alien.coordY + 40) &&
          (this.coordY > alien.coordY) &&
          (this.coordX > alien.coordX) &&
          (this.coordX <   alien.coordX + 40)) { 
      lasers.splice(lasers.indexOf(this), 1);
      this.tag.remove();
      aliens[aIndex].tag.remove();
      aliens.splice(aIndex, 1);
      score.updateScore(10);
      if (aliens.length < 1) levelComplete();
      }
    });
  }
  offScreen() {
    if (this.coordY < -10) {
      lasers.splice(lasers.indexOf(this), 1);
      this.tag.remove(); 
    }
  }
}

//---- GET HTML ELEMENTS ----//

const gameWindow = document.querySelector('.game-container');

//---- VARIABLES ----//

const titleTop = new UserInterfaceItem('h2', 'title', 'PREVENT');
const titleMiddle = new UserInterfaceItem('h2', 'title', 'THE');
const titleBottom = new UserInterfaceItem('h2', 'title', 'SPREAD');
const scoreBox = new UserInterfaceItem('div', 'score-box', '');
const scoreTitle = new UserInterfaceItem('p', 'score-title', 'Score');
const score = new UserInterfaceItem('p', 'score', '0');
const livesBox = new UserInterfaceItem('div', 'lives-box', '');
const livesTitle = new UserInterfaceItem('p', 'lives.title', 'Lives');
const lives = new UserInterfaceItem('p', 'lives', '3');
const startGameButton = new UserInterfaceItem('div', 'start-game', "Start Game");

let player = new Player("Player One", `url('./assets/spray.png')`, 350, 540);
let aliens = [];
let lasers = [];
let scoreValue = 0;

//---- FUNCTIONS ----//

const renderStartMenu = () => {
  titleTop.buildUI(gameWindow);
  titleMiddle.buildUI(gameWindow);
  titleBottom.buildUI(gameWindow);
  scoreBox.buildUI(gameWindow);
  scoreTitle.buildUI(scoreBox.tag);
  score.buildUI(scoreBox.tag);
  livesBox.buildUI(gameWindow);
  livesTitle.buildUI(livesBox.tag);
  lives.buildUI(livesBox.tag);
  startGameButton.buildUI(gameWindow);
}
const generateAliens = (numberOfAliens) => {
  for (let alien = 0; alien < numberOfAliens; alien++) {
    aliens.push(new Alien(alien, numberOfAliens, 1));
  }
  aliens.forEach((alien) => alien.render());  
}
const generatePlayer = () => {
  player.render();
}
const gameLoop = () => {
  setTimeout(gameLoop, 75);
  lasers.forEach((laser) => {
    laser.move();
    laser.collisonDetection();
    laser.offScreen();
  });
}
const startGame = () => {
  titleTop.removeUI();
  titleMiddle.removeUI();
  titleBottom.removeUI();
  startGameButton.removeUI();
  generatePlayer();
  generateAliens(40);
  gameLoop();
}
//---- RUN GAME ----//

renderStartMenu();

//---- USER INPUTS ----//

startGameButton.tag.addEventListener('click', () => {
  startGame();
});

document.onkeydown = (e) => { 
  switch(e.key) {
    case "ArrowLeft" :
      player.movePlayer(-10);
    break;
    case "ArrowRight" : 
      player.movePlayer(10);
    break;
    case " " : 
      player.fireLaser();
    break;
  }
}
