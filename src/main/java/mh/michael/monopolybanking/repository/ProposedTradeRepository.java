package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.ProposedTrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposedTradeRepository extends JpaRepository<ProposedTrade, Long> {
    List<ProposedTrade> findByRequestedPlayerId(long requestedPlayerId);
    List<ProposedTrade> findByProposingPlayerId(long proposingPlayerId);
    List<ProposedTrade> findByGame_Id(long gameId);
}
