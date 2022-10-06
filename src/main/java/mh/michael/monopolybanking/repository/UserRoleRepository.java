package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.constants.EUserRole;
import mh.michael.monopolybanking.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByName(EUserRole name);
}
