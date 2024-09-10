const actionsEl = document.querySelector('.actions');
const roundNrEl = document.getElementById('round-nr');
const roundsPlayerEl = document.getElementById('rounds-player');
const roundsOpponentEl = document.getElementById('rounds-opponent');
const pointsPlayerEl = document.getElementById('points-player');
const pointsOpponentEl = document.getElementById('points-opponent');
const resetBtn = document.getElementById('reset');
const stanceEl = document.getElementById('stance');

let ROUND = 0;
let PLAYER_POINTS = 0;
let OPPONENT_POINTS = 0;

let PLAYERS_CHOICES = [];

const actionMap = {
  attack: {
    attack: 1,
    cooperate: 5,
    css: 'round--a',
  },
  cooperate: {
    attack: 0,
    cooperate: 3,
    css: 'round--c',
  },
};

const resetRounds = function () {
  PLAYERS_CHOICES = [];
  ROUND = 0;
  roundNrEl.textContent = ROUND;
  PLAYER_POINTS = 0;
  OPPONENT_POINTS = 0;
  pointsPlayerEl.textContent = PLAYER_POINTS;
  pointsOpponentEl.textContent = OPPONENT_POINTS;
  const freshRounds = `<div class="round"></div>`.repeat(10);
  roundsPlayerEl.innerHTML = '';
  roundsOpponentEl.innerHTML = '';
  roundsPlayerEl.insertAdjacentHTML('afterbegin', freshRounds);
  roundsOpponentEl.insertAdjacentHTML('afterbegin', freshRounds);
};

const getRandomChoice = function () {
  return Math.random() < 0.5 ? 'attack' : 'cooperate';
};
const titForTat = function () {
  return PLAYERS_CHOICES[ROUND - 1];
};

const getAttackByPercent = function (num) {
  return Math.random() < num / 100 ? 'attack' : 'cooperate';
};

const isPreviousRound = function (choice) {
  return PLAYERS_CHOICES[ROUND - 1] === choice;
};

const checkRoundBeforeChoice = function (round, choice) {
  return PLAYERS_CHOICES[ROUND - round] === choice;
};

const isFirstRound = function () {
  return PLAYERS_CHOICES.length === 0;
};

const getOpponentAction = function () {
  const stances = ['random', 'titForTat', 'friendly', 'aggressive', 'butcher', 'trickster'];
  let opponentsStance = stanceEl.value;
  if (opponentsStance === 'random') opponentsStance = stances[Math.floor(Math.random() * stances.length)];

  switch (opponentsStance) {
    case 'random':
      return getAttackByPercent(50);

    case 'titForTat':
      if (isFirstRound()) return getAttackByPercent(50);
      return Math.random() < 0.7 ? titForTat() : getAttackByPercent(50);

    case 'friendly':
      if (isPreviousRound('attack')) return getAttackByPercent(10);
      return getAttackByPercent(0);

    case 'aggressive':
      if (isPreviousRound('attack')) return titForTat();
      if (isPreviousRound('cooperate') && checkRoundBeforeChoice(2, 'cooperate')) return getAttackByPercent(40);
      return getAttackByPercent(85);

    case 'butcher':
      return getAttackByPercent(97.5);

    case 'trickster':
      // if (isPreviousRound('attack') && checkRoundBeforeChoice(2, 'attack')) return getAttackByPercent(100);
      if (isPreviousRound('cooperate') && checkRoundBeforeChoice(2, 'cooperate')) return getAttackByPercent(100);
      if (isPreviousRound('cooperate')) return getAttackByPercent(80);
      return Math.random() < 0.25 ? titForTat() : getAttackByPercent(25);

    default:
      return getAttackByPercent(50);
  }
};

const calcActionResult = function (playerAction, opponentAction) {
  const playerPoints = actionMap[playerAction][opponentAction];
  const opponentPoints = actionMap[opponentAction][playerAction];
  PLAYER_POINTS += playerPoints;
  OPPONENT_POINTS += opponentPoints;
  pointsPlayerEl.textContent = PLAYER_POINTS;
  pointsOpponentEl.textContent = OPPONENT_POINTS;
  roundsPlayerEl.childNodes[ROUND].classList.add(actionMap[playerAction].css);
  roundsPlayerEl.childNodes[ROUND].textContent = playerPoints;
  roundsOpponentEl.childNodes[ROUND].classList.add(actionMap[opponentAction].css);
  roundsOpponentEl.childNodes[ROUND].textContent = opponentPoints;
  ROUND++;
  roundNrEl.textContent = ROUND;
};

const handleAction = function (e) {
  if (ROUND === 10) {
    resetRounds();
    return;
  }
  const btn = e.target.closest('button');
  if (!btn) return;
  const playerAction = btn.id;
  PLAYERS_CHOICES.push(playerAction);

  const opponentAction = getOpponentAction();

  calcActionResult(playerAction, opponentAction);
};

const startGame = function () {
  resetRounds();

  actionsEl.addEventListener('click', handleAction);
  resetBtn.addEventListener('click', resetRounds);
};

window.addEventListener('load', startGame);
