package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    Game findByCode(String code);
    List<Game> findGamesByIdIn(List<Long> idList);
}
