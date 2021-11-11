import * as React from "react";
import logo from "./logo.svg";

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

enum Direction {
  Right = 1,
  Left = -1,
  Up = -20,
  Down = 20,
}

type GameState = {
  snake: number[];
  food: number | null;
};

function App() {
  const [gameState, setGameState] = React.useState<GameState>({
    snake: [0],
    food: null,
  });

  const [snake, setSnake] = React.useState<number[]>([0, 1]);
  const [started, setStarted] = React.useState<boolean>(false);
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

  React.useEffect(() => {
    if (!started) return;

    const loop = setInterval(() => {
      console.log(Math.random());
      setGameState((state) => {
        if (!state.food) {
          return {
            snake: [state.snake[0] + direction],
            food: getRandomFoodPosition([state.snake[0] + direction]),
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
            let newSnake;
            newSnake = [...state.snake];
            newSnake.push(newSnake[newSnake.length - 1] + direction);

            return { snake: newSnake, food: getRandomFoodPosition(newSnake) };
          }
        }

        if (state.snake.length < 2) {
          return { snake: [state.snake[0] + direction], food: state.food };
        } else {
          let newSnake;
          newSnake = [...state.snake];
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
