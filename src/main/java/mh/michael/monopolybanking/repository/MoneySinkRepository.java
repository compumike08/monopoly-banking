package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.MoneySink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoneySinkRepository extends JpaRepository<MoneySink, Long> {
    List<MoneySink> findAllByGameId(long gameId);
    MoneySink findByGame_IdAndIsBankIsTrue(long gameId);
}
