package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByGameId(long gameId);
}
