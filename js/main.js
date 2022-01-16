'use strict'

const time = document.querySelector("#time");
const btnStart = document.querySelector('#btn-start');
const btnAddTask = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const taskListContainer = document.querySelector('.task-container > ul');
const btnStopwatch = document.querySelectorAll('.task-container > .container > .fa-stopwatch')

console.log(btnStopwatch);

let btnComplete;
let task;

let startState = false;
let min = 25;
let sec = '00';
let timeInterval;
let pomoState = false;

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

btnStopwatch.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let current = e.target;

        // 이전 엘리멘트의 index가 없다면 undefined
        if(current.previousElementSibling.dataset.index===undefined){
            current.style.color = "var(--background1)";
        }else{//이전 엘리멘트의 index가 있다면 undefined가 될때까지 반복
            while(current.previousElementSibling.dataset.index !== undefined){
                current.style.color = "var(--background1)";
                current = current.previousElementSibling;
                //while 할 때 index가 0인 엘리멘트는 조건을 만족하지 않아 종료되어 버린다.
                //반복되지 않으므로 while이 종료되기 전에 if로 직접 수정
                if(current.dataset.index==="0"){
                    current.style.color = "var(--background1)";
                }
            }
        }
    });
})