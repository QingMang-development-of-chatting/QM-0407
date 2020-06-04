export default{
    getApplyUser:function(state){
        return function (id) {
            return state.data.find(function (item) {
                return item.id  === id;
            })
        }
    },
    getUntreatedNum:function (state) {
        let num = 0;
        for(let i = 0; i< state.data.length;i++)
            if(state.data[i].dispose === 0)
                num++;
            return num;
    }
};
