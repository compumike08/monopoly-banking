package mh.michael.monopolybanking.repository;

import mh.michael.monopolybanking.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findAllByGame_Id(long gameId);
}
