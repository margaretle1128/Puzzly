# Fifteen Puzzle Game

A modern take on the classic sliding puzzle game, the Fifteen Puzzle Game challenges players to arrange tiles in numerical order by making strategic moves using the empty space.

## Features

- Multiple board sizes and difficulty levels for a customized challenge.
- A timer and move counter to track and improve performance.
- Hints to assist players when they get stuck.
- A leaderboard to foster competition and track high scores.
- Elegant animations and responsive design for an engaging experience.

## Preview

Get a glimpse of what the Fifteen Puzzle Game has to offer.

### Main Menu

Start your journey here by selecting 'New Game' or checking the 'Leaderboard'. You can also find instructions in the 'How to Play' section.

![image](https://github.com/margaretle1128/Puzzly/assets/93006609/e6ee02a4-3082-4394-b831-442cc5a5f0ec)

### Game Setup

Easily choose your game's difficulty and board size to start playing. Customize your puzzle experience to match your skill level.

![image](https://github.com/margaretle1128/Puzzly/assets/93006609/fa43cbaa-0faf-463e-8347-e86050c2b2b9)

### Game Board

This is where the action happens. Arrange the tiles in order and challenge yourself to improve your time and move count with each game.

![image](https://github.com/margaretle1128/Puzzly/assets/93006609/c2b9223f-6f05-491e-bc74-ebbe838c4f52)

### Leaderboard

See how you stack up against other players. Aim for the top with the quickest time and least number of moves!

![image](https://github.com/margaretle1128/Puzzly/assets/93006609/b5eba711-2a53-488a-9773-feefbea90408)

### How to Play Instructions

New to the game? No worries. The 'How to Play' section will guide you through the gameplay mechanics and strategies to win.

![image](https://github.com/margaretle1128/Puzzly/assets/93006609/938ea859-1a1a-41cf-b0d4-2a771923b76f)

## Installation

To run the Fifteen Puzzle Game locally, you'll need to have Node.js and npm installed for the frontend and Java JDK along with Maven for the backend.

### Backend Setup

1. Clone the repository.
2. Navigate to the backend directory.
3. Run the Spring Boot application.

```bash
mvn spring-boot:run
```

### Frontend Setup

1. Navigate to the frontend directory.
2. Install the dependencies.

```bash
npm install
```

3. Start the React application.

```bash
npm start
```

The app will launch in your default web browser at `http://localhost:3000`.

## Building for Production

To prepare the frontend for production deployment, run:

```bash
npm run build
```

This creates a `build` directory with a production build of the app. Move the contents of this directory to the `static` folder in the Spring Boot project to serve the frontend.

## Usage

### Starting a New Game

- Click on 'New Game' to select the board size and difficulty level.
- The game board with scrambled tiles will appear.

### Playing the Game

- Click on a tile adjacent to the empty space to slide it into the empty space.
- Continue moving tiles until they are in numerical order.

### Saving Your Score

- Once you solve the puzzle, enter your name and save your score to the leaderboard.

## API Reference

The backend provides the following endpoints:

- `POST /api/v1/users/add`: Save a new user score.
- `GET /api/v1/users/leaderboard`: Get the leaderboard for a specific board size and difficulty.
- `GET /api/v1/puzzle/new`: Get a new puzzle board.
- `POST /api/v1/puzzle/solve`: Solve the current puzzle.
- `POST /api/v1/puzzle/hint`: Get a hint for the current puzzle.
