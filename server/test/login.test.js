
//var userService = require('../service/userService.js');
const login = require('../query/userLogin.js');
var expect = require('chai').expect;

describe('userService测试', function() {
  it('登录测试', function(done) {
    var f = function(){
      expect(login('0001', '123456')).to.be.equal(true);
      done();
    };
      setTimeout(f, 4000);
    });
});

