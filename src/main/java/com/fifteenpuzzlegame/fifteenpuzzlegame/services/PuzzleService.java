package com.fifteenpuzzlegame.fifteenpuzzlegame.services;

import com.fifteenpuzzlegame.fifteenpuzzlegame.models.Vertex;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PuzzleService {

    public int[][] generatePuzzleByDifficulty(int size, String difficulty) {
        int movesRequired = getMovesForDifficulty(difficulty, size);
        return shufflePuzzle(size, movesRequired);
    }

    private int getMovesForDifficulty(String difficulty, int size) {
        int baseEasy = 10;
        int baseMedium = 25;
        int baseHard = 40;
        int scale = (size - 3);
        int easyMoves = baseEasy + scale * 5;
        int mediumMoves = baseMedium + scale * 10;
        int hardMoves = baseHard + scale * 15;

        switch (difficulty.toLowerCase()) {
            case "easy":
                return easyMoves;
            case "medium":
                return mediumMoves;
            case "hard":
                return hardMoves;
            default:
                throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }

    private int[][] shufflePuzzle(int size, int moves) {
        int[][] puzzle = generateSolvedPuzzle(size);
        int blankRow = size - 1;
        int blankCol = size - 1;
        while (moves > 0) {
            int[] direction = getRandomDirection();
            int newRow = blankRow + direction[0];
            int newCol = blankCol + direction[1];

            if (isValidPosition(newRow, newCol, size)) {
                // Perform swap
                puzzle[blankRow][blankCol] = puzzle[newRow][newCol];
                puzzle[newRow][newCol] = 0;
                blankRow = newRow;
                blankCol = newCol;
                moves--;
            }
        }
        return puzzle;
    }

    private boolean isValidPosition(int row, int col, int size) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    private int[][] generateSolvedPuzzle(int size) {
        int[][] puzzle = new int[size][size];
        int num = 1;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                puzzle[i][j] = num++;
            }
        }
        puzzle[size - 1][size - 1] = 0; // Set the last cell as empty
        return puzzle;
    }

    private int[] getRandomDirection() {
        // Directions: up, right, down, left
        int[][] directions = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
        Random random = new Random();
        return directions[random.nextInt(directions.length)];
    }

    public boolean isSolvable(int[][] puzzle) {
        int inversions = 0;
        int gridSize = puzzle.length;
        int[] puzzleArray = new int[gridSize * gridSize];
        int row = 0; // the row with the blank tile
        int blankRow = -1; // the row of the blank tile from the bottom of the grid
    
        // Flatten the puzzle array and count the blank tile row
        for (int i = 0; i < puzzle.length; i++) {
            for (int j = 0; j < puzzle[i].length; j++) {
                puzzleArray[(i * gridSize) + j] = puzzle[i][j];
                if (puzzle[i][j] == 0) {
                    row = i;
                }
            }
        }
    
        // Count inversions
        for (int i = 0; i < puzzleArray.length - 1; i++) {
            for (int j = i + 1; j < puzzleArray.length; j++) {
                if (puzzleArray[i] > puzzleArray[j] && puzzleArray[i] != 0 && puzzleArray[j] != 0) {
                    inversions++;
                }
            }
        }
    
        blankRow = gridSize - row;
    
        if (gridSize % 2 == 1) { // Grid width is odd
            return inversions % 2 == 0;
        } else { // Grid width is even
            if (blankRow % 2 == 0) { // Blank tile on even row counting from the bottom
                return inversions % 2 == 1;
            } else { // Blank tile on odd row counting from the bottom
                return inversions % 2 == 0;
            }
        }
    }

    public boolean isSolved(int[][] puzzle) {
        int count = 1;
        for (int i = 0; i < puzzle.length; i++) {
            for (int j = 0; j < puzzle[i].length; j++) {
                if (puzzle[i][j] != count && !(i == puzzle.length - 1 && j == puzzle[i].length - 1)) {
                    return false;
                }
                if (count == puzzle.length * puzzle[i].length - 1) return true; // Last cell is the empty space
                count++;
            }
        }
        return true; 
    }    

        public List<String> solvePuzzle(int[][] start) {
        // Initialize the goal board based on the size of the start board
        int SIZE = start.length;
        int[][] goal = generateGoalBoard(SIZE);

        PriorityQueue<Vertex> openSet = new PriorityQueue<>();
        Map<Integer, Vertex> closedSet = new HashMap<>();

        Vertex startState = new Vertex(start);
        openSet.add(startState);

        while (!openSet.isEmpty()) {
            Vertex current = openSet.poll();

            // If the goal is found, return the list of moves
            if (current.equals(new Vertex(goal))) {
                return constructPath(current);
            }
            closedSet.put(current.getHashCode(), current);

            for (Vertex neighbor : current.generateChild()) {
                if (closedSet.containsKey(neighbor.getHashCode())) {
                    continue;
                }
                // If the neighbor is better than one we've already seen, update it
                Vertex existing = closedSet.get(neighbor.getHashCode());
                if (existing == null || neighbor.getDistanceFromStart() < existing.getDistanceFromStart()) {
                    neighbor.setParent(current);
                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    private List<String> constructPath(Vertex vertex) {
        LinkedList<String> path = new LinkedList<>();
        while (vertex != null) {
            path.addFirst(vertex.getMove());
            vertex = vertex.getParent();
        }
        path.removeFirst(); // Remove the initial state 
        return path;
    }

    private int[][] generateGoalBoard(int size) {
        int[][] board = new int[size][size];
        int index = 1;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (i == size - 1 && j == size - 1) {
                    board[i][j] = 0;
                    break;
                }
                board[i][j] = index;
                index++;
            }
        }
        return board;
    }

    public List<String> getHints(int[][] board, int hintCount) {
        List<String> solution = solvePuzzle(board);
        return solution.subList(0, Math.min(hintCount, solution.size()));
    }    
}