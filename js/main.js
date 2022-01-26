'use strict'
const RED = "var(--background1)";
const GRAY = "var(--background4)";
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
const stopwatchCountPlus = document.querySelector('.stopwatch-count-plus');
const stopwatchCountMinus = document.querySelector('.stopwatch-count-minus');

let startState = false;
let min = 1;
let sec = '00';
let timeInterval;
let pomoState = false;


let stopwatchCountNumber ;

init();

function init(){
    setStopwatchCount(0);
}

function timer(){
    return setInterval(function(){
        if(sec==="00"){
            sec = 59;
            min--;
        } else if (sec === 1){
            sec = "00";
        } else {
            sec--;
        }
        time.innerText=`${min} : ${sec}`;
    },1000)
}

function setStopwatchCount(count){
    if(count ==="plus"){ 
        stopwatchCountNumber++;
        if(stopwatchCountNumber<=5){
            for(let i=0;i<stopwatchCountNumber;i++){
                stopwatchIcon[i].style.color = RED;
            }
        }
        stopwatchCount.innerText = stopwatchCountNumber;
    } else if(count==="minus"){
        if(stopwatchCountNumber !== 0){
            stopwatchCountNumber--;
            if(stopwatchCountNumber<=4){
                stopwatchIcon[stopwatchCountNumber].style.color=GRAY;
            }
            stopwatchCount.innerText = stopwatchCountNumber;
        }
    } else if(count ==="reset"){
        stopwatchIcon.forEach(btn => btn.style.color=GRAY);
        stopwatchCountNumber = 0;
        stopwatchCount.innerText = stopwatchCountNumber;
    } 
    else {
        stopwatchCountNumber = count;
        stopwatchCount.innerText = stopwatchCountNumber;
    }
}

// 이벤트 리스너 목록

timerStartBtn.addEventListener('click',e=>{
    if(!startState){
        startState = true;
        timeInterval = timer();
    } 
    else {
        startState = false;
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
    if(!startState){
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
                        <span>0/${stopwatchCountNumber}</span>
                        <button><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </li>`

    taskListContainer.insertAdjacentHTML('beforeend',html);
    inputTask.value = "";
    setStopwatchCount("reset");

    let completeBtn = taskListContainer.querySelectorAll('.fa-check-circle');
    let task = taskListContainer.querySelectorAll('.task');
    
    
    
    /* 
     * @@해야할 것!@@
     * 설정버튼에도 이벤트 줘야해
     * task 누르면 해당 task명으로 stopwatch 세팅
     */

    task.forEach(task=>{
        task.addEventListener('click',e=>{
            console.log(task.innerText);
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
            } else if(current.style.color === RED&&(next.style.color===GRAY||next.style.color==="")){
                current.style.color = GRAY;
                setStopwatchCount(0);
            } else if(current.style.color ===RED
                    &&next.style.color === RED)
            { 
                stopwatchCountNumber=Number(current.dataset.index)+1;
                stopwatchCount.innerText = stopwatchCountNumber;
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
                 // 5까지 눌려있는 상태에서 3번째꺼를 누르면 4,5 비활성화되는 반복문
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
stopwatchCountPlus.addEventListener('click',e=>{setStopwatchCount("plus");});
stopwatchCountMinus.addEventListener('click',e=>{setStopwatchCount("minus");});