// function printNumbers_setInterval(from, to) {
//     let timeId = setInterval(() => {
//         console.log(from);
//         ++from;
//         if(from >= to) clearInterval(timeId);
//     }, 1000);
// }

// printNumbers_setInterval(1, 100);

// function ps(from, to) {
//     let timeId = setInterval(() => {
//         console.log(from);
//         console.log(Date());
//         ++from;
//         if(from >= to) clearInterval(timeId);
//     },1000);
// }
// ps(1, 10000);

// function printNumbers_setTimeout(from, to) {
//     setTimeout(
//         function run(from, to, text) {
//             console.log(from, text);
//             if(from<to){
//                 setTimeout(run, 1000, ++from, to, "텍스트");
//             }
//         }
//     , 1000, 0, 5);
// }

// printNumbers_setTimeout(0, 5);

// setInterval(() => {
//     log(1);
//   }, 100);

// browser.alarms.create(
//     myAlarm,
//     alarmInfo
// )