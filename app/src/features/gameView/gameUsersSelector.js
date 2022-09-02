import { createSelector } from '@reduxjs/toolkit';

const selectActiveGameUsers = state => state.gamesData.activeGame.users;
const selectLoggedInUser = state => state.gamesData.activeGame.loggedInUserId;

export const selectActiveGameUsersYouOnTop = createSelector([selectActiveGameUsers, selectLoggedInUser], (users, loggedInUserId) => {
    const rawUsers = users;
    const usersWithoutYou = rawUsers.filter(user => user.userId !== loggedInUserId);
    const youUser = rawUsers.find(user => user.userId === loggedInUserId);
    const sortedUsers = Object.assign([], usersWithoutYou);
    sortedUsers.unshift(youUser);
    return sortedUsers;
});
