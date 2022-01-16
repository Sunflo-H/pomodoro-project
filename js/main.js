'use strict'

// time
const time = document.querySelector("#time");
const btnStart = document.querySelector('#btn-start');

// !!! task 등록할때 스탑워치를 빠른 설정하고 등록했다면 스탑워치카운트는 다시 0이 되야하니까
// 두 기능은 하나의 파일에 넣자
// task
const btnAddTask = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const taskListContainer = document.querySelector('.task-container > ul');
// stopwatch icon setting
const btnStopwatch = document.querySelectorAll('.task-container > .container > .fa-stopwatch');
// stopwatch fast setting
const stopwatchFastSetting = document.querySelector('.stopwatch-fast-setting');
const btnStopwatchFastSetting = document.querySelector('.btn-stopwatch-fast-setting');
const stopwatchCount = document.querySelector('.stopwatch-fast-setting > span');
const btnSwfsPlus = document.querySelector('.btn-swfs-plus');
const btnSwfsMinus = document.querySelector('.btn-swfs-minus');

let btnComplete;
let task;

let startState = false;
let min = 25;
let sec = '00';
let timeInterval;
let pomoState = false;



let stopwatchCountNumber = 0;
stopwatchCount.innerText = stopwatchCountNumber;
let stopwatchFastSettingState = false;

// 시간을 흐르게 하는 timer 함수
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

// 이벤트 리스너 목록
// 시작 버튼 클릭 이벤트
btnStart.addEventListener('click',e=>{
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
btnStart.addEventListener('mousedown',e=>{
    btnStart.style.boxShadow="none";
    btnStart.style.top="6px";
});
btnStart.addEventListener('mouseup',e=>{
    btnStart.style.boxShadow="rgb(235 235 235) 0px 6px 0px";
    btnStart.style.top="0px";
    if(!startState){
        btnStart.innerText="STOP"
    } 
    else {
        btnStart.innerText="START"
    }
});

// task 입력에 관한 이벤트들
// +버튼 클릭시 할 일 목록을 추가하는 이벤트
btnAddTask.addEventListener('click', e=>{
    let html = `<li>
                    <div class="container">
                        <i class="fas fa-check-circle"></i>
                        <span class="task">${inputTask.value}</span>
                    </div>
                    <div>
                        <span>0/1</span>
                        <button><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </li>`

    taskListContainer.insertAdjacentHTML('beforeend',html);

    btnComplete = taskListContainer.querySelectorAll('.fa-check-circle');
    task = taskListContainer.querySelectorAll('.task');
    
    
    
    /* 
     * @@해야할 것!@@
     * 여기에서 완료(체크)버튼에 이벤트 주고 (완료)
     * 설정버튼에도 이벤트 줘야해
     */
    btnComplete.forEach((btn,i)=>{
        item.addEventListener('click',e=>{
            // 누르면 완료
            // 현재 목록에서 사라지고
            // 완료 목록에서 볼수 있다.
            // 완료 목록에서는 다시 완료를 취소할수 있다.
            // 취소하면 다시 현재목록으로 복귀
           console.log(task[i].innerText);
        });
    })
});

// 인풋의 stopwatch 버튼을 누르면 발생하는 이벤트
btnStopwatch.forEach(item => item.style.color="var(--background4)");//기본적으로 styel.color가 없는 상태여서.. 이렇게 직접 주고 시작..
btnStopwatch.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let current = e.target;
        if(current.previousElementSibling.dataset.index===undefined){
            current.style.color = "var(--background1)";
            // 5번째까지 눌려있는 상태에서 1번째꺼를 누르면 2,3,4,5 비활성화되는 반복문
            while(current.nextElementSibling.dataset.index !==undefined){
                current = current.nextElementSibling;
                current.style.color="var(--background4)";
            }
        }else{
            // 5를 누르면 앞에 1~4까지 활성화가 되는 반복문
            while(current.previousElementSibling.dataset.index !== undefined){
                current = current.previousElementSibling;
                current.style.color = "var(--background1)";
                
                //while 할 때 index가 0인 엘리멘트는 조건을 만족하지 않아 종료되어 버린다.
                //반복되지 않으므로 while이 종료되기 전에 if로 직접 수정
                if(current.dataset.index==="0"){
                    current.style.color = "var(--background1)";
                }
            }

            current=e.target;
            if(current.nextElementSibling.style.color==="var(--background4)"||current.nextElementSibling.style.color===""){
                if(current.style.color=="var(--background1)"){
                    console.log("1");
                    current.style.color="var(--background4)";
                }else{
                    console.log("2");
                    current.style.color="var(--background1)";
                }
            }
            if(current.nextElementSibling.style.color==="var(--background1)"){
                 // 5까지 눌려있는 상태에서 3번째꺼를 누르면 2,3,4,5 비활성화되는 반복문
                current=e.target;
                // current.
                while(current.nextElementSibling.dataset.index !==undefined){
                    current = current.nextElementSibling;
                    current.style.color="var(--background4)";
                }
            }
            // 만약 다음께 색이 회색이면 조건문을 돌려
            // 만약 다음께 색이 빨간색이면 아래 반복문을 돌려
           
            
            
        }
    });
});

// stopwatch 버튼이 5개 위로 필요할때 stopwatch-fast-setting 하는 이벤트
btnStopwatchFastSetting.addEventListener('click',e=>{
    stopwatchFastSetting.classList.toggle('opa-hidden');
    if(!stopwatchFastSettingState){
        console.log(stopwatchFastSettingState);
        stopwatchFastSettingState=true;
    } else{
        stopwatchFastSettingState=false;
    }
});
btnSwfsPlus.addEventListener('click',e=>{
    stopwatchCountNumber++;
    stopwatchCount.innerText=stopwatchCountNumber;
});
btnSwfsMinus.addEventListener('click',e=>{
    if(stopwatchCountNumber !== 0){
        stopwatchCountNumber--;
        stopwatchCount.innerText=stopwatchCountNumber;
    }    
});