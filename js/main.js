'use strict'
//해야 할 일

//report , setting, login기능 만들기
//백엔드 필요없는거부터 해서 
//setting 먼저



const RED = "var(--background1)";
const GRAY = "var(--background4)";
const HOUR = 60;
// time
const time = document.querySelector("#time");
const timerStartBtn = document.querySelector('#btn-timer-start');

// !!! task 등록할때 스탑워치를 빠른 설정하고 등록했다면 스탑워치카운트는 다시 0이 되야하니까
// 두 기능은 하나의 파일에 넣자
// task
const btnAddTask = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const taskListContainer = document.querySelector('.task-container > ul');
const currentTaskName = document.querySelector('#current-task-name');
// stopwatch icon setting
const stopwatchIcon = document.querySelectorAll('.task-container > .flex-container > .fa-stopwatch');
// stopwatch mini setting
const stopwatchMiniSetting = document.querySelector('.stopwatch-mini-setting');
const stopwatchMiniSettingOpenBtn = document.querySelector('.stopwatch-mini-setting-open-btn');
const stopwatchCount = document.querySelector('.stopwatch-mini-setting > .count');
const stopwatchCountPlusBtn = document.querySelector('.stopwatch-count-plus');
const stopwatchCountMinusBtn = document.querySelector('.stopwatch-count-minus');
// statistics (통계)
const statistics = document.querySelector('.statistics-container');
const estimatedTime = statistics.querySelector('div:nth-child(1)>h1'); //예정시간
const taskToComplete = statistics.querySelector('div:nth-child(2)>h1'); //완료할 작업 
const completedTime = statistics.querySelector('div:nth-child(3)>h1'); //완료한 시간
const completedTask = statistics.querySelector('div:nth-child(4)>h1'); //완료한 작업

let run = false;
let originalMin = 1;
let min = originalMin;
let sec = "00";
let timeInterval;
let pomoState = false;

let total = {
    estimatedTime : 0,
    taskToComplete : 0,
    completedTime : 0,
    completedTask : 0
}

let count = {
    task : 0,
    stopwatch : 0
}

let runTimes = [
    {current : 0, max : 1}
];


function init(){
    setStopwatchCount(0);
}

function timer(){
    return setInterval(function(){
        if(sec==="00"){ // 초가 "00"이면 1초뒤에는 min이 1감소하고 sec는 59가 되야지
            sec = 2; // 59
            min--;
            if(String(min).length===1){
                min = "0"+min;
            }
        } else if (sec == "01"){ //초가 "01"이면 1초뒤에는 00 ,만약 min이 "00"이었다면 타이머 종료
            sec = "00";
            if(min == "00"){
                
                complete(currentTaskName.innerText);
                min = 1;
                // 완료한 task 찾아서
                // 통계에서 완료한시간,완료한 작업 증가시켜주고요
                // task에서 0->1로 늘려주세요 
            }
        } else {
            sec--;
            if(String(sec).length===1){
                sec = "0"+sec;
            }
        }
        time.innerText=`${min} : ${sec}`;
    },1000)
}
function complete(taskName){
    
    let taskList = taskListContainer.querySelectorAll('li');
    let taskListArr = [...taskList];
    let index=0;
    let foundTask = taskListArr.find((task,i)=>{
        let findTaskName = task.querySelector('.task-name');
        index = i;
        return taskName === findTaskName.innerText;
    });
    let foundTaskRunTimes = foundTask.querySelector('.run-times');

    runTimes[index].current++;

    //통계에서 완료한 시간, 완료한 작업은 더해주고
    // 예정시간, 완료할 작업은 더한만큼 빼준다.
    total.completedTime+=((total.completedTime+originalMin)/HOUR).toFixed(1);
    total.completedTask++;
    total.estimatedTime -= Number(total.completedTime).toFixed(1);
    total.taskToComplete--;
    
    completedTime.innerText = Number(total.completedTime).toFixed(1);
    completedTask.innerText = total.completedTask;
    estimatedTime.innerText = Number(total.estimatedTime).toFixed(1);
    taskToComplete = total.taskToComplete;
    

    foundTaskRunTimes.innerText = `${runTimes[index].current}/${runTimes[index].max}`

    run=false;
    clearInterval(timeInterval);
    timerStartBtn.innerText="START";
}

function setStopwatchCount(param){
    if(param ==="plus"){ 
        count.stopwatch++;
        if(count.stopwatch<=5){
            for(let i=0;i<count.stopwatch;i++){
                stopwatchIcon[i].style.color = RED;
            }
        }
        stopwatchCount.innerText = count.stopwatch;
    } else if(param ==="minus"){
        if(count.stopwatch !== 0){
            count.stopwatch--;
            if(count.stopwatch<=4){
                stopwatchIcon[count.stopwatch].style.color=GRAY;
            }
            stopwatchCount.innerText = count.stopwatch;
        }
    } else if(param ==="reset"){
        stopwatchIcon.forEach(btn => btn.style.color=GRAY);
        count.stopwatch = 0;
        stopwatchCount.innerText = count.stopwatch;
    } 
    else {
        count.stopwatch = param;
        stopwatchCount.innerText = count.stopwatch;
    }
}



// @@@@이벤트 리스너 목록
// 타이머 시작, 종료에 관함 이벤트들
timerStartBtn.addEventListener('click',e=>{
    if(!run){
        run = true;
        timeInterval = timer();
    } 
    else {
        run = false;
        clearInterval(timeInterval);
    }
});

// 시작 버튼 클릭시 'innerText = start->stop' & css 변화 이벤트
timerStartBtn.addEventListener('mousedown',e=>{
    timerStartBtn.style.boxShadow="none";
    timerStartBtn.style.top="6px";
});
timerStartBtn.addEventListener('mouseup',e=>{
    timerStartBtn.style.boxShadow="rgb(235 235 235) 0px 6px 0px";
    timerStartBtn.style.top="0px";
    if(!run){
        timerStartBtn.innerText="STOP"
    } 
    else {
        timerStartBtn.innerText="START"
    }
});

// task 입력에 관한 이벤트들
// +버튼 클릭시 할 일 목록을 추가하는 이벤트
btnAddTask.addEventListener('click', e=>{
    let html = `<li>
                    <div class="flex-container">
                        <i class="fas fa-check-circle"></i>
                        <span class="task-name">${inputTask.value}</span>
                    </div>
                    <div>
                        <span class="run-times">0/${count.stopwatch}</span>
                        <button><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </li>`

    taskListContainer.insertAdjacentHTML('beforeend',html);
    inputTask.value = "";
    
    let completeBtn = taskListContainer.querySelectorAll('.fa-check-circle');
    let taskName = taskListContainer.querySelectorAll('.task-name');
    
    // 예정시간 
    total.estimatedTime += Number((count.stopwatch * min /HOUR).toFixed(1)); //소수점 한자리 반올림
    estimatedTime.innerText = (total.estimatedTime).toFixed(1); //부동소수점때문에 한번더 반올림
    // 완료할 작업
    count.task++;
    taskToComplete.innerText=count.task;
    //완료한 시간

    //완료한 작업
    
    runTimes.push({current : 0, max : count.stopwatch});
    setStopwatchCount("reset");
    
    /* 
     * @@해야할 것!@@
     * 설정버튼에도 이벤트 줘야해
     * task 누르면 해당 task명으로 stopwatch 세팅
     */

    taskName.forEach(task=>{
        task.addEventListener('click',e=>{
            currentTaskName.innerText=task.innerText;
        })
    })
    completeBtn.forEach((btn,i)=>{
        btn.addEventListener('click',e=>{
            // 누르면 완료
            // 현재 목록에서 사라지고
            // 완료 목록에서 볼수 있다.
            // 완료 목록에서는 다시 완료를 취소할수 있다.
            // 취소하면 다시 현재목록으로 복귀
            e.target.parentNode.parentNode.style.display="none";
        });
    })
});

// 인풋의 stopwatch 아이콘을 누르면 발생하는 이벤트
stopwatchIcon.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let current = e.target;
        let next = current.nextElementSibling;
        if(current.dataset.index==="0"){
            if(current.style.color===""||current.style.color===GRAY){
                current.style.color = RED;
                setStopwatchCount(Number(current.dataset.index)+1);
            } else if(current.style.color === RED && (next.style.color===GRAY||next.style.color==="")){
                current.style.color = GRAY;
                setStopwatchCount(0);
            } else if(current.style.color === RED && next.style.color === RED)
            { 
                setStopwatchCount(Number(current.dataset.index)+1);
                stopwatchCount.innerText = count.stopwatch;
                // 5번째까지 눌려있는 상태에서 1번째꺼를 누르면 2,3,4,5 비활성화되는 반복문
                while(next.dataset.index !==undefined){
                    current = next;
                    current.style.color=GRAY;
                    next = current.nextElementSibling;
                }
            }
        }else{
            // 5를 누르면 앞에 1~4까지 활성화가 되는 반복문 (current는 제외)
            while(current.previousElementSibling.dataset.index !== undefined){
                current = current.previousElementSibling;
                current.style.color = RED;
                
                //while 할 때 index가 0인 엘리멘트는 조건을 만족하지 않아 종료되어 버린다.
                //반복되지 않으므로 while이 종료되기 전에 if로 직접 수정
                if(current.dataset.index==="0"){
                    current.style.color = RED;
                }
            }
            // current를 활성화시켜주는 조건문
            // 다음꺼가 회색이면 current가 마지막 활성화라는 의미니까 눌렀을때 활성화/비활성화 해줘
            // 다음꺼가 빨간색이면 current는 빨간색 유지
            current=e.target;
            next = current.nextElementSibling;
            if(next.style.color===GRAY||next.style.color===""){
                if(current.style.color==RED){
                    current.style.color=GRAY;
                    setStopwatchCount(Number(current.dataset.index));
                }else{
                    current.style.color=RED;
                    setStopwatchCount(Number(current.dataset.index)+1);
                }
            }
            if(next.style.color===RED){
                 // 5까지 눌려있는 상태에서 3을 누르면 4,5 비활성화되는 반복문
                current=e.target;
                setStopwatchCount(Number(current.dataset.index)+1);
                // current.
                while(next.dataset.index !==undefined){
                    current = next;
                    current.style.color=GRAY;
                    next = current.nextElementSibling;
                }
            }            
        }
    });
});

// stopwatch 버튼이 5개 위로 필요할때 stopwatch-mini-setting 하는 이벤트
stopwatchMiniSettingOpenBtn.addEventListener('click',e=>{
    stopwatchMiniSetting.classList.toggle('opa-hide');
});
stopwatchCountPlusBtn.addEventListener('click',e=>{setStopwatchCount("plus");});
stopwatchCountMinusBtn.addEventListener('click',e=>{setStopwatchCount("minus");});







init();