package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUserUuid(UUID userUuid);
    Optional<User> findByEmail(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
