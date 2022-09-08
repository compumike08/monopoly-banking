import { createSelector } from '@reduxjs/toolkit';

const selectActiveGameUsers = state => state.gamesData.activeGame.users;
const selectLoggedInUserId = state => state.gamesData.activeGame.loggedInUserId;

export const selectActiveGameUsersYouOnTop = createSelector([selectActiveGameUsers, selectLoggedInUserId], (users, loggedInUserId) => {
    const rawUsers = Object.assign([], users);
    const mappedUsers = rawUsers.map(user => {
        return {
            ...user,
            isSink: false
        };
    });
    const usersWithoutYou = mappedUsers.filter(user => user.id !== loggedInUserId);
    const youUser = mappedUsers.find(user => user.id === loggedInUserId);
    const sortedUsers = usersWithoutYou;
    sortedUsers.unshift(youUser);
    return sortedUsers;
});

export const selectLoggedInUser = createSelector([selectActiveGameUsers, selectLoggedInUserId], (users, loggedInUserId) => {
    return users.find(user => user.id === loggedInUserId);
});
