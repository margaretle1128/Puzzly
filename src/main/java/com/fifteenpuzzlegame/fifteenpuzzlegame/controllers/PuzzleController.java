package com.fifteenpuzzlegame.fifteenpuzzlegame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fifteenpuzzlegame.fifteenpuzzlegame.services.PuzzleService;

import java.util.*;

@RestController
@RequestMapping("api/v1/puzzle")
@CrossOrigin(origins ="http://localhost:3000")
public class PuzzleController {
    
    @Autowired
    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/new")
    public ResponseEntity<int[][]> generatePuzzle(@RequestParam int size, @RequestParam String difficulty) {
        if (size < 3 || size > 6) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            int[][] board = puzzleService.generatePuzzleByDifficulty(size, difficulty);
            return ResponseEntity.ok(board);
        } catch (IllegalArgumentException e) {
            // Handle the case where an invalid difficulty is provided
            return ResponseEntity.badRequest().body(null);
        }
    }
     
    @PostMapping("/solve")
    public ResponseEntity<List<String>> solvePuzzle(@RequestBody int[][] board) {
        List<String> solution = puzzleService.solvePuzzle(board);
        return ResponseEntity.ok(solution);
    }

    @PostMapping("/hint")
    public ResponseEntity<List<String>> getHints(@RequestBody Map<String, Object> payload) {
        // Extract and convert the board and difficulty from the payload
        ArrayList<ArrayList<Integer>> boardList = (ArrayList<ArrayList<Integer>>) payload.get("board");
        String difficulty = (String) payload.get("difficulty");
        int hintCount = difficulty.equals("easy") ? 1 : (difficulty.equals("medium") ? 2 : 3);
    
        // Convert the ArrayList of ArrayLists to a 2D array
        int[][] board = new int[boardList.size()][boardList.get(0).size()];
        for (int i = 0; i < boardList.size(); i++) {
            for (int j = 0; j < boardList.get(i).size(); j++) {
                board[i][j] = boardList.get(i).get(j);
            }
        }
    
        List<String> hints = puzzleService.getHints(board, hintCount);
        return ResponseEntity.ok(hints);
    }
    
}
