package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Player findByGame_IdAndUser_Id(long gameId, long userId);
    Player findByCode(String userCode);
}
