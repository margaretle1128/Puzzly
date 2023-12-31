package com.fifteenpuzzlegame.fifteenpuzzlegame.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findBySizeAndDifficultyOrderByTimeAscMoveAsc(int size, String difficulty);
}