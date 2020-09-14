package mh.michael.monopolybanking.model;

import lombok.*;

import javax.persistence.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "game")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String code;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<User> users;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<MoneySink> moneySinks;

    public List<User> getUsers() {
        List<User> sortUsers = users;
        sortUsers.sort(Comparator.comparingLong(User::getId));
        return sortUsers;
    }

    public List<MoneySink> getMoneySinks() {
        List<MoneySink> sortMoneySinks = moneySinks;
        sortMoneySinks.sort(Comparator.comparingLong(MoneySink::getId));
        return sortMoneySinks;
    }

    public void addUser(User user) {
        users.add(user);
    }

    public void updateUser(User updateUser) {
        List<User> usersList = users.stream().filter(user -> user.getId() != updateUser.getId()).collect(Collectors.toList());
        usersList.add(updateUser);
        users = usersList;
    }

    public void removeUser(long userId) {
        users = users.stream().filter(user -> user.getId() != userId).collect(Collectors.toList());
    }

    public void addMoneySink(MoneySink moneySink) {
        moneySinks.add(moneySink);
    }

    public void updateMoneySink(MoneySink updateMoneySink) {
        List<MoneySink> moneySinkList = moneySinks.stream().filter(moneySink -> moneySink.getId() != updateMoneySink.getId()).collect(Collectors.toList());
        moneySinkList.add(updateMoneySink);
        moneySinks = moneySinkList;
    }

    public void removeMoneySink(long sinkId) {
        moneySinks = moneySinks.stream().filter(moneySink -> moneySink.getId() != sinkId).collect(Collectors.toList());
    }
}
