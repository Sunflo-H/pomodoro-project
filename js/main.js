'use strict'
//해야 할 일

//report , setting, login기능 만들기
//백엔드 필요없는거부터 해서 
//setting 먼저
//초기 시간 (이니셜 타임)을 가지고 처음에 보여지는 타이머 시간 표현해줘

//initialTime과 이걸 세팅하는 함수가 필요한지 다 만들고나서 체크해보기


const RED = "var(--background1)";
const GRAY = "var(--background4)";
const HOUR = 60;
// 해야할 것 : INITIAL_TIME은 나중에 lastTime으로 바꿔서 마지막 optionTime세팅한거를 제일 처음에 보여주도록 하자
const INITIAL_TIME = 5; 
const INITIAL_BREAK_TIME = 5;
// time
const time = document.querySelector("#time");
const timerStartBtn = document.querySelector('#btn-timer-start');

// !!! task 등록할때 스탑워치를 빠른 설정하고 등록했다면 스탑워치카운트는 다시 0이 되야하니까
// 두 기능은 하나의 파일에 넣자
// task
const addTaskBtn = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const taskListContainer = document.querySelector('.task-container > ul');
const currentTaskName = document.querySelector('#current-task-name');
// stopwatch icon setting
const stopwatchIcon = document.querySelectorAll('.task-container > .flex-container > .fa-stopwatch');
// stopwatch fast setting
const stopwatchFastSetting = document.querySelector('.stopwatch-fast-setting');
const stopwatchFastSettingOpenBtn = document.querySelector('.stopwatch-fast-setting-open-btn');
const stopwatchCount = document.querySelector('.stopwatch-fast-setting > .count');
const stopwatchCountPlusBtn = document.querySelector('.stopwatch-count-plus');
const stopwatchCountMinusBtn = document.querySelector('.stopwatch-count-minus');
// statistics (통계)
const statistics = document.querySelector('.statistics-container');
const estimatedTime = statistics.querySelector('div:nth-child(1)>h1'); //예정시간
const taskToComplete = statistics.querySelector('div:nth-child(2)>h1'); //완료할 작업 
const completedTime = statistics.querySelector('div:nth-child(3)>h1'); //완료한 시간
const completedTask = statistics.querySelector('div:nth-child(4)>h1'); //완료한 작업
//header div
const settingBtn = document.querySelector('#setting');
//modal
const modalBackground = document.querySelector('.modal-background');
const settingContainer = document.querySelector('.setting-container');
const closeBtn = document.querySelectorAll('.close>i');
//modal - select box 
const selectContainer = document.querySelectorAll('.select-container');
const select = document.querySelectorAll('.select');
const selected = document.querySelectorAll('.selected');
const optionList = document.querySelectorAll('.option-list');
const optionItem = document.querySelectorAll('.option-item');

let audio = new Audio('/audio/삐삐삐삐-삐삐삐삐 - 탁상시계알람.mp3');
let run = false;
let min = INITIAL_TIME;
let sec = "00";
let timeInterval;
let optionTime;
let optionTime_temp;
let breakMin = INITIAL_BREAK_TIME;
let breakTimeState = false;
//12개 배열 0 = 5분, 1 = 10분
let taskPer5Mins = [0,0,0,0,0,0,0,0,0,0,0,0];
let completedTimePer5Mins = [0,0,0,0,0,0,0,0,0,0,0,0];
let index = [];
let total = {//토탈 -> 통계로 바꾸는게 맞을려나
    estimatedTime : 0,
    taskToComplete : 0,
    completedTime : 0,
    completedTask : 0
};

//count.task는 showOptionList랑 연계되는건데 boolean으로 바꿔도 될듯
//count.task는 total.taskToComplete와 동일하니까 바꿔주자
// let taskListState = false;
let count = {
    // task : 0,
    stopwatch : 0
}

let runTimes = [];


function init(){
    updateStopwatchCount(0);
    time.innerText = `${min} : 00`;
    makeOptionItem();
    optionTime = INITIAL_TIME;
    // setEstimatedTime(); //지금 선언하는게 지금은 의미 없는데, 백엔드 하고나면 의미 있을듯?
}

function timer(){
    return setInterval(function(){
        // 초가 "00"이면 1초뒤에는 min이 1감소하고 sec는 59가 되야지
        if(sec==="00"){ 
            sec = 2; // 59
            min--;
            if(String(min).length===1){
                min = "0"+min; //01분...09분을 표현하기 위함
            }
        } 
        // 초가 "01초"면 1초뒤에는 "00"초 
        // 이때 "00 : 00 "이면 타이머 종료
        else if (sec == "01"){ 
            sec = "00";

            if(min == "00"){
                if(breakTimeState === false){
                    breakTimeState = true;
                    console.log(breakMin);
                    min = breakMin;
                    console.log("쉬는시간입니다.");
                    run=false;
                    clearInterval(timeInterval);
                    timerStartBtn.innerText="START";
                }
                else {
                    breakTimeState = false;
                    min = optionTime;//옵션타임 -> 현재 task 의 attribute('data-time')
                    completePomodoro(currentTaskName.innerText);
                }
                // 타이머를 일단 휴식시간일때랑 포모도로일때로 나눠야해
            }
        } 
        // 위 조건 외에는 초가 --로 정상적으로 흘러간다.
        else {
            sec--;
            if(String(sec).length===1){
                sec = "0"+sec; //"01"초... "09"초를 표현
            }
        }
        time.innerText=`${min} : ${sec}`;
    },1000)
}

function completePomodoro(taskName){
    // 완료한 포모도로의 taskName을 받아
    // taskList에서 taskName과 이름이 같은 task를 찾아
    // 진행해야할 pomodoro 카운트를 1 증가
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
    foundTaskRunTimes.innerText = `${runTimes[index].current}/${runTimes[index].max}`

    //포모도로 완료 -> 예정시간은 완료한만큼 줄고, 완료한 시간은 증가한다.
    // 예정시간
    updateEstimatedTime("minus");
    // 완료한 시간
    updateCompletedTime();
    // audio.play();
    run=false;
    clearInterval(timeInterval);
    timerStartBtn.innerText="START";
}

function breakTime(){

}

function updateStopwatchCount(param){
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
        stopwatchIcon.forEach(icon => icon.style.color=GRAY);
        count.stopwatch = 0;
        stopwatchCount.innerText = count.stopwatch;
    } 
    else {
        count.stopwatch = param;
        stopwatchCount.innerText = count.stopwatch;
    }
}

function makeOptionItem(){
    //optionList[0] = pomodoro time, [1] = break time
    optionList.forEach((optionList,i)=>{
        let optionTime=5;
        while(optionTime<=60){
            console.log(optionList,i);
            let optionItem = `<li class="option-item">
                                ${optionTime}분
                              </li>`
            optionList.insertAdjacentHTML('beforeend',optionItem);
            optionTime+=5;
        }
    })
}

function showTaskList(boolean){
    if(boolean){
        taskListContainer.classList.remove('hidden');
    } else {
        taskListContainer.classList.add('hidden');
    }
}

// 통계 업데이트 함수
function updateEstimatedTime(order){
    let taskPer5Mins_index = min/5 -1;
    let time = 0;
    let temp = [0,0,0,0,0,0,0,0,0,0,0,0]; //원래 배열을 복구하기 위함
    let roofState = 1;
    // 추가된 task의 pomodoro가 몇분짜리인지 찾아, 횟수만큼 taskPer5Mins에 추가
    if(order==="plus")
    for(let i=0; i<count.stopwatch;i++){
        taskPer5Mins[taskPer5Mins_index]++;
    }
    // 삭제할 task의 pomodoro가 몇분짜리인지 찾아, 한번 감소
    if(order==="minus") taskPer5Mins[taskPer5Mins_index]--;
    // 예정시간도 구하고, taskPer5Mins를 보존하기위한 temp를 구한다.
    while(roofState !== -1  ){
        let i = taskPer5Mins.findIndex(item=>{
            return item !== 0;
        });
        roofState = i;
        if(i !== -1){ // 아직 다 찾지 않았다면 계산해라
            taskPer5Mins[i]--;
            temp[i]++; 
            time += (i+1)*5;
        }
    }
    total.estimatedTime = Number((time /HOUR).toFixed(1)); //소수점 한자리 반올림
    estimatedTime.innerText = (total.estimatedTime).toFixed(1); //부동소수점때문에 한번더 반올림
    taskPer5Mins = [...temp]; 
}
function updateCompletedTime(){
    let taskPer5Mins_index = min/5 -1;
    let time = 0;
    let roofState = 1;
    let temp = [0,0,0,0,0,0,0,0,0,0,0,0];

    completedTimePer5Mins[taskPer5Mins_index]++;
    while(roofState !== -1  ){
        let i = completedTimePer5Mins.findIndex(item=>{
            return item !== 0;
        })
        roofState = i;
        if(i !== -1){ // 아직 다 찾지 않았다면 계산해라
            completedTimePer5Mins[i]--;
            temp[i]++;
            time += (i+1)*5;
        }
    }
    total.completedTime = (time/HOUR).toFixed(1);
    completedTime.innerText = Number(total.completedTime).toFixed(1);
    completedTimePer5Mins = [...temp];
}
function updateCompleteTask(){
    // 완료할 작업
    total.taskToComplete--;
    taskToComplete.innerText = total.taskToComplete;
    // 완료한 작업
    total.completedTask++;
    completedTask.innerText = total.completedTask;
}
function taskNameHandler(e){
    currentTaskName.innerText=task.innerText;

}
function completeTaskBtnHandler(e){
// 누르면 완료
            // 현재 목록에서 사라지고
            // 완료 목록에서 볼수 있다.
            // 완료 목록에서는 다시 완료를 취소할수 있다.
            // 취소하면 다시 현재목록으로 복귀
            e.target.parentNode.parentNode.style.display="none";

            // 예정 시간 줄어들어

            // 완료할 작업 줄어들어

            // 완료한 시간 올라가

            // 완료한 작업 올라가
            total.taskToComplete--;
            taskToComplete.innerText = total.taskToComplete;
            // 누르면 모든 btn이 다 눌려..
            if(total.taskToComplete===0) {
                showTaskList(false);
            }
}

function changeTask(taskName){
    run = false;
    clearInterval(timeInterval);
    currentTaskName.innerText=taskName.innerText;
    timerStartBtn.innerText = "START"
    min = Number(taskName.getAttribute('data-time'));
    sec = "00";
    time.innerText = `${min} : 00`;
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   이벤트 리스너 목록   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// <★pomodoro setting에 관한 이벤트들>
settingBtn.addEventListener('click',e=>{
    modalBackground.classList.remove("hidden");
    settingContainer.classList.remove("hidden");
});
modalBackground.addEventListener('click',e=>{
    modalBackground.classList.add("hidden");
    //조건문 : 모달중 hidden이 없는거만 hidden 주기??
    settingContainer.classList.add("hidden");
});
closeBtn.forEach(btn=>{
    btn.addEventListener('click',e=>{
        modalBackground.classList.add("hidden");
        e.target.parentNode.parentNode.parentNode.classList.add("hidden");
    })
});
select.forEach(select=>{
    console.log("셀렉트에 이벤트준다.");
    select.addEventListener('click',e=>{
        let optionList = select.nextElementSibling;
        if(optionList.classList.contains("hidden")){
            optionList.style.height="150px";
            optionList.classList.remove('hidden');
        } else {
            optionList.style.height="0px";
            optionList.classList.add('hidden');
        }
    });
})
// 세팅컨테이너 클릭 -> 옵션리스트 닫아


optionList.forEach((optionList,index)=>{
    optionList.addEventListener('click',e=>{
        // 포모도로 시간인지, 휴식 시간인지 조건 나눠야함
        // index가 0이면 포모도로, 1이면 휴식 시간
        switch(e.target.innerText.length){
            case 1: optionTime = (e.target.innerText).substring(0,0);
                    break;
            case 2: optionTime = (e.target.innerText).substring(0,1);
                    break;
            case 3: optionTime = (e.target.innerText).substring(0,2);
                    break;
            case 4: optionTime = (e.target.innerText).substring(0,3);
                    break;
        }
        if(index===0){
            min = optionTime;
            optionTime_temp = optionTime;
            time.innerText=`${min} : 00`;
            selected[index].innerText= `${min}분`
        }
        else { // 휴식시간
            breakMin = optionTime;
            selected[index].innerText= `${breakMin}분`
        }
        // console.log(temp);
        optionTime=optionTime_temp;
        console.log(optionTime);
    });
})



// <★타이머 시작, 종료에 관함 이벤트들>
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

// <★task 등록에 관한 이벤트들>
addTaskBtn.addEventListener('click', e=>{
    if(inputTask.value ===""){
        return ;
    }

    let html = `<li>
                    <div class="flex-container">
                        <i class="fas fa-check-circle"></i>
                        <span class="task-name" data-time=${optionTime}>${inputTask.value}</span>
                    </div>
                    <div>
                        <span class="run-times">0/${count.stopwatch}</span>
                        <button><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                </li>`

    taskListContainer.insertAdjacentHTML('beforeend',html);
    inputTask.value = "";

    let completeTaskBtn = taskListContainer.querySelectorAll('.fa-check-circle');
    let taskName = taskListContainer.querySelectorAll('.task-name');
    // 예정시간 
    updateEstimatedTime("plus");
    // 완료할 작업
    total.taskToComplete++;
    taskToComplete.innerText = total.taskToComplete;

    showTaskList(true)


    runTimes.push({current : 0, max : count.stopwatch});
    updateStopwatchCount("reset");
    
    /* 
     * @@해야할 것!@@
     * 설정버튼에도 이벤트 줘야해
     * task 누르면 해당 task명으로 stopwatch 세팅
     */

    // 새로 생긴 html에 이벤트를 등록해주기
    taskName.forEach(taskName=>{
        taskName.addEventListener('click',e=>{
            if(run){
                let question = confirm("포모도로가 실행중 입니다. 작업을 바꾸면 시간은 초기화됩니다. 정말 바꾸시겠습니까?");
                if(question){
                    changeTask(taskName);
                }
                else {
                    console.log("취소");
                    run = true;
                    return ;
                }
            }else{
                changeTask(taskName);
            }
        })
    });

    completeTaskBtn.forEach((btn,i)=>{
        btn.addEventListener('click',completeTaskBtnHandler);
    });
});


// <★인풋의 stopwatch 아이콘을 누르면 발생하는 이벤트>
stopwatchIcon.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let current = e.target;
        let next = current.nextElementSibling;
        if(current.dataset.index==="0"){
            if(current.style.color===""||current.style.color===GRAY){
                current.style.color = RED;
                updateStopwatchCount(Number(current.dataset.index)+1);
            } else if(current.style.color === RED && (next.style.color===GRAY||next.style.color==="")){
                current.style.color = GRAY;
                updateStopwatchCount(0);
            } else if(current.style.color === RED && next.style.color === RED)
            { 
                updateStopwatchCount(Number(current.dataset.index)+1);
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
                    updateStopwatchCount(Number(current.dataset.index));
                }else{
                    current.style.color=RED;
                    updateStopwatchCount(Number(current.dataset.index)+1);
                }
            }
            if(next.style.color===RED){
                 // 5까지 눌려있는 상태에서 3을 누르면 4,5 비활성화되는 반복문
                current=e.target;
                updateStopwatchCount(Number(current.dataset.index)+1);
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

// <★stopwatch 버튼이 5개 위로 필요할때 stopwatch-fast-setting에 관한 이벤트들>
stopwatchFastSettingOpenBtn.addEventListener('click',e=>{
    stopwatchFastSetting.classList.toggle('opacity-hide');
});
stopwatchCountPlusBtn.addEventListener('click',e=>{updateStopwatchCount("plus");});
stopwatchCountMinusBtn.addEventListener('click',e=>{updateStopwatchCount("minus");});



init();