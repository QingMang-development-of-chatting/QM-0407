
var userService = require('../service/userService.js');

var expect = require('chai').expect;

//大概需要延时2s？使用 mocha -t 2000 来测试
describe('userService测试', function() {

  it('登录测试', async () => {
  var temp = await userService.login("0002","123456");
  expect(temp).to.be.equal(true);
  });

  it('登出测试', async () => {
    var temp = await userService.logout("0002","123456");
    expect(temp).to.be.equal(true);
  });

  it('注册测试', async () => {
    var temp = await userService.register("0010","123456","test");
    expect(temp).to.be.equal(true);
  });

  it('新用户测试', async () => {
    var temp = await userService.login("0010","123456");
    expect(temp).to.be.equal(true);
    });

});


