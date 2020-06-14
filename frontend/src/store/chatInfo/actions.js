/**
* @param { function } commit
* @param { string } data
*/
export function deleteChatInfos({ commit },id) {
    commit('deleteChatInfo', id );
}
