function a (constructor: Function) {
    constructor.prototype.name = 'a';
    constructor.prototype.age = 4;
}

interface test {
    name: string;
    age: number;
}

@a
class test {
    constructor() {
    } 

    setName(name: string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setAge(age: number) {
        this.age = age;
    }
    getAge() {
        return this.age;
    }
}

const obj = new test();
console.log(obj.getName(), obj.getAge());
obj.setName('test2');
obj.setAge(20);
console.log(obj.getName(), obj.getAge());