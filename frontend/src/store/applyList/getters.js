export default{
    //根据id查找申请者
    getApplyUser:function(state){
        return function (id) {
            return state.data.find(function (item) {
                return item.id  === id;
            })
        }
    },
    //获取未处理申请数目
    getUntreatedNum:function (state) {
        let num = 0;
        for(let i = 0; i< state.data.length;i++)
            if(state.data[i].dispose === 0)
                num++;
            return num;
    },
};
