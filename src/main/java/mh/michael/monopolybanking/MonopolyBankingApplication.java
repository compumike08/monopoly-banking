package mh.michael.monopolybanking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class MonopolyBankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonopolyBankingApplication.class, args);
	}

}
