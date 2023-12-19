package com.fifteenpuzzlegame.fifteenpuzzlegame.services;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class PuzzleService {

    public int[][] generateSolvablePuzzle(int size) {
        int[][] puzzle = new int[size][size];
        // Fill the puzzle with numbers 1 to size*size-1
        int num = 1;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                puzzle[i][j] = num++;
            }
        }
        puzzle[size - 1][size - 1] = 0; // Set the last cell as the empty cell
    
        // Shuffle the puzzle until it is solvable
        do {
            puzzle = shufflePuzzle(puzzle, size);
        } while (!isSolvable(puzzle) || isSolved(puzzle));
    
        return puzzle;
    }

    private int[][] shufflePuzzle(int[][] solvedPuzzle, int size) {
        Random random = new Random();
        int emptyX = size - 1;
        int emptyY = size - 1;
        int[] dx = {0, 1, 0, -1};
        int[] dy = {-1, 0, 1, 0}; // directions: up, right, down, left

        for (int i = 0; i < 1000; i++) { // perform a large number of random moves
            int dir = random.nextInt(4);
            int newX = emptyX + dx[dir];
            int newY = emptyY + dy[dir];

            if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
                // Swap empty space with adjacent tile
                solvedPuzzle[emptyX][emptyY] = solvedPuzzle[newX][newY];
                solvedPuzzle[newX][newY] = 0;
                emptyX = newX;
                emptyY = newY;
            }
        }
        return solvedPuzzle;
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
}