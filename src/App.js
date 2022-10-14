// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './vendor/fontawesome-free/css/all.min.css';
// import './Test.css';

import { useState, useEffect } from 'react';
import { Container, Navbar, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';

function App() {
  const [player, setPlayer] = useState(1);
  const [computer, setComputer] = useState(3);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [move, setMove] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [winner, setWinner] = useState(0);
  const [turn, setTurn] = useState(player);
  const [grid, setGrid] = useState(createGrid());
  const [modal, setModal] = useState({ info: true, result: false });

  const handleRestart = () => {
    setGameStart(true);
  }

  const handleOption = () => {
    setModal({ info: true, result: false });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setDifficulty(e.target.mode.value);
    setGameStart(true);
  }

  const handleClick = (cell) => {
    if (gameOver || winner > 0 || turn !== player && grid[cell] > 0) {
      return false;
    }

    grid.splice(cell, 1, player);

    setGrid(grid);
    setMove(move + 1);
  }

  const handleComputer = () => {
    let cell = -1;
    let freeCell = getFreeCellIndex(grid);
    let arr = [];
    let corner = [0, 2, 6, 8];

    if (gameOver || winner > 0 || turn !== computer && freeCell.length === 0) {
      return false;
    }

    if (move >= 3) {
      cell = getFirstWithTwoInARow(grid, computer, [player, computer]);

      if (cell === false) {
        cell = getFirstWithTwoInARow(grid, player, [player, computer]);
      }

      if (cell === false) {
        if (grid[4] === 0 && difficulty === 1) {
          cell = 4
        } else {
          arr = getFreeCellIndex(grid);
          cell = arr[intRandom(0, arr.length - 1)];
        }
      }

      // Avoid a catch-22 situation:
      if (move === 3 && grid[4] === computer && difficulty === 1) {
        if (grid[7] === player && (grid[0] === player || grid[2] === player)) {
          arr = [6, 8];
          cell = arr[intRandom(0, 1)];
        } else if (grid[5] === player && (grid[0] === player || grid[6] === player)) {
          arr = [2, 8];
          cell = arr[intRandom(0, 1)];
        } else if (grid[3] === player && (grid[2] === player || grid[8] === player)) {
          arr = [0, 6];
          cell = arr[intRandom(0, 1)];
        } else if (grid[1] === player && (grid[6] === player || grid[8] === player)) {
          arr = [0, 2];
          cell = arr[intRandom(0, 1)];
        }
      }

      if (move === 3 && grid[4] === player && difficulty === 1) {
        if (grid[2] === player && grid[6] === computer) {
          cell = 8;
        } else if (grid[0] === player && grid[8] === computer) {
          cell = 6;
        } else if (grid[8] === player && grid[0] === computer) {
          cell = 2;
        } else if (grid[6] === player && grid[2] === computer) {
          cell = 0;
        }
      }
    } else if (move === 1 && grid[4] === player && difficulty === 1) {
        // if player is X and played center, play one of the corners
        cell = corner[intRandom(0, 3)];
    } else if (move === 2 && grid[4] === player && difficulty === 1) {
      // if player is O and played center, take two opposite corners
      if (grid[0] === computer) {
        cell = 8;
      }

      if (grid[2] === computer) {
        cell = 6;
      }

      if (grid[6] === computer) {
        cell = 2;
      }

      if (grid[8] === computer) {
        cell = 0;
      }
    } else if (move === 0 && intRandom(1, 10) < 8) {
        // if computer is X, start with one of the corners sometimes
        cell = corner[intRandom(0, 3)];
    } else {
      // choose the center of the board if possible
      if (grid[4] === 0 && difficulty === 1) {
        cell = 4;
      } else {
        arr = getFreeCellIndex(grid);
        cell = arr[intRandom(0, arr.length - 1)];
      }
    }

    if (grid[cell] > 0) {
      return false;
    }

    grid.splice(cell, 1, computer);

    setGrid(grid);
    setMove(move + 1);
  }

  useEffect(() => {
    function initGame() {
      setGrid(createGrid());
      setMove(0);
      setWinner(0);
      setGameOver(false);
      setTurn(player);
      setGameStart(false);
      setModal({ info: false, result: false });
    }

    if (gameStart === true) initGame();
  }, [gameStart]);

  useEffect(() => {
    if (move > 0) {
      let nextTurn = turn === player ? computer : player;
      setTurn(nextTurn);

      if (move >= 5) {
        setWinner(checkWinner(grid, player, computer));
      }
    }
  }, [move])
console.log(difficulty)
  useEffect(() => {
    if (winner > 0) {
      setGameOver(true);
      setModal({ ...modal, result: !modal.result });
    } else if (winner === 0 && turn === computer) {
      handleComputer();
    }
  }, [winner, turn])

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            React Tic-Tac-Toe
            {difficulty == 0 && <span className="text-muted"> Normal Mode</span>}
            {difficulty == 1 && <span className="text-muted"> Hard Mode</span>}
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col lg={{ span: 6, offset: 3 }} className="py-4">
            <Table bordered responsive width="100%">
              <tbody>
                <tr>
                  {[...Array(3)].map((x, i) =>
                    <td key={i} onClick={() => handleClick(i)}>
                      {grid[i] === 1 && <i className="fas fa-times fa-4x"></i>}
                      {grid[i] === 3 && <i className="far fa-circle fa-4x"></i>}
                    </td>
                  )}
                </tr>
                <tr>
                  {[...Array(3)].map((x, i) =>
                    <td key={i + 3} onClick={() => handleClick(i + 3)}>
                      {grid[i + 3] === 1 && <i className="fas fa-times fa-4x"></i>}
                      {grid[i + 3] === 3 && <i className="far fa-circle fa-4x"></i>}
                    </td>
                  )}
                </tr>
                <tr>
                  {[...Array(3)].map((x, i) =>
                    <td key={i + 6} onClick={() => handleClick(i + 6)}>
                      {grid[i + 6] === 1 && <i className="fas fa-times fa-4x"></i>}
                      {grid[i + 6] === 3 && <i className="far fa-circle fa-4x"></i>}
                    </td>
                  )}
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <Modal show={modal.info} backdrop="static" keyboard={false}>
        <Modal.Header closeButton={false}>
          <Modal.Title>YOU PLAY AS <i className="fas fa-times"></i></Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="text-center">
            <Form.Group className="py-3">
              <h6>SELECT DIFFICULTY</h6>
              <Form.Check inline label="Mode Normal" name="mode" id="modeNormal" type="radio" value="0" defaultChecked />
              <Form.Check inline label="Mode Hard" name="mode" id="modeHard" type="radio" value="1" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="info" size="sm">Start Game</Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={modal.result} backdrop="static" keyboard={false}>
        <Modal.Header closeButton={false}>
          <Modal.Title>GAME OVER</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {winner === player && <h2>YOU WIN!</h2>}
          {winner === computer && <h2>YOU LOSE!</h2>}
          {winner === 10 && <h2>IT'S DRAW!</h2>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleRestart}>Restart Game</Button>
          <Button variant="warning" onClick={handleOption}>Change Difficulty</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const createGrid = () => {
  let arr = [];

  for (let i = 0; i < 9; i++) {
    arr.push(0);
  }

  return arr;
}

const getRowValues = (grid, i) => {
  if ([0, 1, 2].includes(i)) {
    let j = i * 3;

    return grid.slice(j, j + 3);
  }

  return false;
}

const getRowIndex = (grid, i) => {
  if ([0, 1, 2].includes(i)) {
    let arr = [];

    for (let j = 0; j <= 2; j++) {
      arr.push((i * 3) + j);
    }

    return arr;
  }

  return false;
};

const getColumnValues = (grid, i) => {
  if ([0, 1, 2].includes(i)) {
    let arr = [];

    for (let j = i; j < grid.length; j += 3) {
      arr.push(grid[j]);
    }

    return arr;
  }

  return false;
}

const getColumnIndex = (grid, i) => {
  if ([0, 1, 2].includes(i)) {
    let arr = [];

    for (let j = i; j < grid.length; j += 3) {
      arr.push(j);
    }

    return arr;
  }

  return false;
}

const getDiagonalValues = (grid, i) => {
  if ([0, 1].includes(i)) {
    let cells = [];

    if (i === 0) {
      cells.push(grid[0]);
      cells.push(grid[4]);
      cells.push(grid[8]);
    } else {
      cells.push(grid[2]);
      cells.push(grid[4]);
      cells.push(grid[6]);
    }

    return cells;
  }

  return false;
}

const getDiagonalIndex = (grid, i) => {
  if ([0, 1].includes(i)) {
    if (i === 0) {
      return [0, 4, 8];
    }

    return [2, 4, 6];
  }

  return false;
}

const getFreeCellIndex = (grid) => {
  let arr = [];

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === 0) {
      arr.push(i);
    }
  }

  return arr;
}

const checkWinner = (grid, player, computer) => {
  let winner = 0;

  // check rows
  for (let i = 0; i <= 2; i ++) {
    let row = getRowValues(grid, i);

    if (row[0] > 0 && row[0] === row[1] && row[0] === row[2]) {
      if (row[0] === player) {
        winner = player;
        console.log('winner player');
      } else {
        winner = computer;
        console.log('winner computer');
      }

      return winner;
    }
  }

  // check columns
  for (let i = 0; i <= 2; i++) {
    let column = getColumnValues(grid, i);

    if (column[0] > 0 && column[0] === column[1] && column[0] === column[2]) {
      if (column[0] === player) {
        winner = player;
        console.log('winner player');
      } else {
        winner = computer;
        console.log('winner computer');
      }

      return winner;
    }
  }

  // check diagonals
  for (let i = 0; i <= 1; i++) {
    let diagonal = getDiagonalValues(grid, i);

    if (diagonal[0] > 0 && diagonal[0] === diagonal[1] && diagonal[0] === diagonal[2]) {
      if (diagonal[0] === player) {
        winner = player;
        console.log('winner player');
      } else {
        winner = computer;
        console.log('winner computer');
      }

      return winner;
    }
  }

  let freeCell = getFreeCellIndex(grid);

  if (freeCell.length === 0) {
    winner = 10;
  }

  return winner;
}

const getFirstWithTwoInARow = (grid, agent, arr) => {
  if (arr.includes(agent)) {
    let sum = agent * 2;
    let freeCell = shuffleArray(getFreeCellIndex(grid));

    for (let i = 0; i < freeCell.length; i++) {
      for (let m = 0; m <= 2; m++) {
        let vRow = getRowValues(grid, m);
        let iRow = getRowIndex(grid, m);
        let vColumn = getColumnValues(grid, m);
        let iColumn = getColumnIndex(grid, m);

        if (sumArray(vRow) === sum && isInArray(freeCell[i], iRow)) {
          return freeCell[i];
        }

        if (sumArray(vColumn) === sum && isInArray(freeCell[i], iColumn)) {
          return freeCell[i];
        }
      }

      for (let n = 0; n < 2; n++) {
        let vDiagonal = getDiagonalValues(grid, n);
        let iDiagonal = getDiagonalIndex(grid, n);

        if (sumArray(vDiagonal) === sum && isInArray(freeCell[i], iDiagonal)) {
          return freeCell[i];
        }
      }
    }
  }

  return false;
}

const shuffleArray = (arr) => {
  let count = arr.length;

  while (count > 0) {
    let i = Math.floor(Math.random() * count);
    count--;
    let temp = arr[count];

    arr[count] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

const sumArray = (arr) => {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
}

const isInArray = (cell, arr) => {
  if (arr.indexOf(cell) > -1) {
    return true;
  }

  return false;
}

const intRandom = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export default App;
