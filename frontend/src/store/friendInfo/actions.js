/**
 * @param { function } commit
 * @param { string } data
 */
export function addFriendInfos({ commit },info) {
    commit('addFriendInfo', info );
}
