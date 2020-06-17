/**
 * @param { function } commit
 * @param { string } data
 */
export function deleteFriendInfos({ commit },id) {
    commit('deleteFriendInfo', id );
}
