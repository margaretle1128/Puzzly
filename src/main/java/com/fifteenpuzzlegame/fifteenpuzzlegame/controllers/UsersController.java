package com.fifteenpuzzlegame.fifteenpuzzlegame.controllers;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
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
    public String addUser(@RequestParam Map<String, String> newuser, HttpServletResponse response) {
        String newName = newuser.get("name");
        int newSize = Integer.parseInt(newuser.get("size"));
        int newTime = Integer.parseInt(newuser.get("time"));
        int newMove = Integer.parseInt(newuser.get("move"));
        userRepo.save(new User(newName, newMove, newTime, newSize));
        response.setStatus(201);
        return "user/addedUser";
    }
    
    List<User> users = Arrays.asList(
        new User("Alice", 10, 120, 4),
        new User("Bob", 15, 180, 5),
        new User("Charlie", 20, 200, 6)
    );


    @GetMapping("/users/samples")
    public ResponseEntity<List<User>> getSampleUsers() {
        return ResponseEntity.ok(users);
    }
}