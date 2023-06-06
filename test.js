var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function a(constructor) {
    constructor.prototype.name = 'a';
    constructor.prototype.age = 4;
}
var test = /** @class */ (function () {
    function test() {
    }
    test.prototype.setName = function (name) {
        this.name = name;
    };
    test.prototype.getName = function () {
        return this.name;
    };
    test.prototype.setAge = function (age) {
        this.age = age;
    };
    test.prototype.getAge = function () {
        return this.age;
    };
    test = __decorate([
        a
    ], test);
    return test;
}());
var obj = new test();
console.log(obj.getName(), obj.getAge());
obj.setName('test2');
obj.setAge(20);
console.log(obj.getName(), obj.getAge());
