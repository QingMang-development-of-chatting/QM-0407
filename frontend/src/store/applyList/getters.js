export default{
    getApplyUser:function(state){
        return function (id) {
            return state.data.find(function (item) {
                return item.id  === id;
            })
        }
    }
};
