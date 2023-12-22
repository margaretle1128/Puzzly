package com.fifteenpuzzlegame.fifteenpuzzlegame.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import com.fifteenpuzzlegame.fifteenpuzzlegame.models.User;
import com.fifteenpuzzlegame.fifteenpuzzlegame.models.UserRepository;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1") 
@CrossOrigin(origins ="http://localhost:3000")
public class UsersController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/users/add")
    public ResponseEntity<User> addUser(@RequestBody User newUser) {
        userRepo.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
    
    List<User> users = Arrays.asList(
        new User("Alice", 10, 120, 4),
        new User("Bob", 15, 180, 5),
        new User("Charlie", 20, 200, 6)
    );

    @GetMapping("/users/leaderboard")
    public ResponseEntity<List<User>> getLeaderboardBySize(@RequestParam int size) {
        List<User> leaderboard = userRepo.findBySizeOrderByTimeAscMoveAsc(size);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/users/samples")
    public ResponseEntity<List<User>> getSampleUsers() {
        return ResponseEntity.ok(users);
    }
}