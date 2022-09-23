package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findAllByGameId(long gameId);
    Player findByGame_IdAndCode(long gameId, String userCode);
    Player findByCode(String userCode);
}
