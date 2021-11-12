import * as React from "react";

type RowType = {
  width: number;
  rowNumber: number;
  snake: number[];
  food: number | null;
};

type BlockType = {
  id: number;
  snake: boolean;
  food: boolean;
};

type GameState = {
  snake: number[];
  food: number | null;
};

enum Direction {
  Right = 1,
  Left = -1,
  Up = -20,
  Down = 20,
}

const Block = ({ id, snake, food }: BlockType) => {
  const color = snake ? "white" : food ? "red" : "black";

  return (
    <div
      className={`${id}`}
      style={{
        height: "20px",
        width: "20px",
        margin: "1px",
        backgroundColor: `${color}`,
      }}
    ></div>
  );
};

const Row = ({ width, rowNumber, snake, food }: RowType) => {
  const renderRow = () => {
    const row = [];

    for (let x = 0; x < width; x++) {
      row.push(
        <Block
          id={rowNumber + x}
          snake={snake.includes(rowNumber + x) ? true : false}
          food={rowNumber + x === food ? true : false}
        />
      );
    }

    return row;
  };

  return <div style={{ display: "flex" }}>{renderRow()}</div>;
};

function App() {
  const [gameState, setGameState] = React.useState<GameState>({
    snake: [0],
    food: null,
  });

  const [snake, setSnake] = React.useState([0, 1]);
  const [started, setStarted] = React.useState(false);
  const [food, setFood] = React.useState<number | null>(null);

  let direction = Direction.Down;

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        if (direction != Direction.Down) direction = Direction.Up;
        break;
      case "a":
        if (direction != Direction.Right) direction = Direction.Left;
        break;
      case "s":
        if (direction != Direction.Up) direction = Direction.Down;
        break;
      case "d":
        if (direction != Direction.Left) direction = Direction.Right;
        break;
    }
  });

  const getRandomFoodPosition = (state: number[]): number => {
    const randomPosition = Math.floor(Math.random() * 400);

    return state.includes(randomPosition)
      ? getRandomFoodPosition(state)
      : randomPosition;
  };

  const collidingWithWall = (state: number[]): boolean => {
    const head = state[state.length - 1];

    let isColliding = false;

    switch (direction) {
      case Direction.Right:
        if ((head + direction) % 20 === 0) {
          isColliding = true;
        }
        break;
      case Direction.Left:
        if (head % 20 === 0) {
          isColliding = true;
        }
        break;
      case Direction.Up:
        if (head + direction < 0) {
          isColliding = true;
        }
        break;
      case Direction.Down:
        if (head + direction >= 399) {
          isColliding = true;
        }
        break;
      default:
        return false;
    }

    return isColliding;
  };

  const collidingWithItself = (state: number[]): boolean => {
    const head = state[state.length - 1] + direction;

    let isColliding = false;

    if (state.includes(head)) {
      return true;
    }

    return isColliding;
  };

  React.useEffect(() => {
    if (!started) return;

    const loop = setInterval(() => {
      setGameState((state) => {
        let newSnake;
        newSnake = [...state.snake];

        if (!state.food) {
          return {
            snake: [newSnake[0] + direction],
            food: getRandomFoodPosition([newSnake[0] + direction]),
          };
        }

        if (state.snake[state.snake.length - 1] + direction === state.food) {
          if (state.snake.length < 2) {
            return {
              snake: [state.snake[0], state.snake[0] + direction],
              food: getRandomFoodPosition([
                state.snake[0],
                state.snake[0] + direction,
              ]),
            };
          } else {
            newSnake.push(newSnake[newSnake.length - 1] + direction);
            return { snake: newSnake, food: getRandomFoodPosition(newSnake) };
          }
        } else if (
          collidingWithWall(newSnake) ||
          collidingWithItself(newSnake)
        ) {
          alert("test");
        }

        if (state.snake.length < 2) {
          return { snake: [state.snake[0] + direction], food: state.food };
        } else {
          newSnake.shift();
          newSnake.push(newSnake[newSnake.length - 1] + direction);

          return { snake: newSnake, food: state.food };
        }
      });
    }, 80);

    return () => clearInterval(loop);
  }, [started]);

  const renderBlocks = () => {
    const blocks = [];

    for (let x = 0; x < 20; x++) {
      blocks.push(
        <Row
          food={gameState.food}
          width={20}
          rowNumber={x * 20}
          snake={gameState.snake}
        />
      );
    }

    return blocks;
  };

  return (
    <div className="App">
      {renderBlocks()}
      <button onClick={() => setStarted(true)}>Start</button>
    </div>
  );
}

export default App;
