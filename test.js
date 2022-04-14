function sayHi(data, data2) {
    alert('Hello');
    console.log(data);
    console.log(data2);
}
function start() {
    let timeInterval = setInterval(sayHi, 1000, "잉?", "이잉ㅇ");
}
