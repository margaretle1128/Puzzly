package com.fifteenpuzzlegame.fifteenpuzzlegame.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fifteenpuzzlegame.fifteenpuzzlegame.services.PuzzleService;

@RestController
@RequestMapping("api/v1/puzzle")
@CrossOrigin(origins ="http://localhost:3000")
public class PuzzleController {
    
    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/new")
    public ResponseEntity<int[][]> generatePuzzle(@RequestParam int size) {
        if (size < 3 || size > 6) {
            return ResponseEntity.badRequest().body(null);
        }
        
        int[][] board = puzzleService.generateSolvablePuzzle(size);
        return ResponseEntity.ok(board);
    } 
}
