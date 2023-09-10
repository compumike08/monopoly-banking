package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.PropertyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyClaimRepository extends JpaRepository<PropertyClaim, Long> {
    List<PropertyClaim> findByGame_Id(long gameId);
    List<PropertyClaim> findByOwnedByPlayer_Id(Long playerId);
    List<PropertyClaim> findByGame_IdAndOwnedByPlayerIsNull(long gameId);
    List<PropertyClaim> findByIdIn(List<Long> idList);
}
