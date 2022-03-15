'use strict'
//해야 할 일

//report , setting, login기능 만들기
//알람음 => 여러 알람음 입력하고 세팅가능하게, 타이머 완료시 알람음
//백엔드 필요없는거부터 해서 
//setting 먼저
//초기 시간 (이니셜 타임)을 가지고 처음에 보여지는 타이머 시간 표현해줘

//initialTime과 이걸 세팅하는 함수가 필요한지 다 만들고나서 체크해보기
// 해야할 것 : INITIAL_TIME은 나중에 lastTime으로 바꿔서 마지막 optionTime세팅한거를 제일 처음에 보여주도록 하자
// footer 만들기

//로그인 - 아이디, 비번중 아이디만 맞았을때 비밀번호를 확인하세요, 아이디도 틀리면 계정을 확인하세요.
//회원가입 - 아이디(이메일) , 비밀번호, 비밀번호 재확인, 닉네임


const RED = "var(--pomodoro-background)";
const GRAY = "var(--black1A)";
const BLUE = "var(--break-time-background)";
const CONTAINER_BACKGROUND_COLOR = "var(--container-background)";
const HOUR = 60;
// 해야할 것 : INITIAL_TIME은 나중에 lastTime으로 바꿔서 마지막 optionTime세팅한거를 제일 처음에 보여주도록 하자
const INITIAL_TIME = 1;
const INITIAL_BREAK_TIME = 1;
// time
const time = document.querySelector("#time");
const timerStartBtn = document.querySelector('#btn-timer-start');

// !!! task 등록할때 스탑워치를 빠른 설정하고 등록했다면 스탑워치카운트는 다시 0이 되야하니까
// 두 기능은 하나의 파일에 넣자
// task
const addTaskBtn = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const taskListBox = document.querySelector('.task-list-box');
const taskListContainer = document.querySelector('.task-container > div > ul');
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
const loginBtn = document.querySelector('#login');
const reportBtn = document.querySelector('#report');
const userBtn = document.querySelector('#user');
//completed task
const showCompletedTaskBtn = document.querySelector('.show-completed-task-btn');
const completedTaskListContainer = document.querySelector('.completed-task-container > ul');
//modal
const modalBackground = document.querySelector('.modal-background');
//modal - setting
const settingContainer = document.querySelector('.setting-container');
const settingContainerCloseBtn = settingContainer.querySelector('.close>i');
//modal - setting - select box 
const selectContainer = document.querySelectorAll('.select-container');
const select = document.querySelectorAll('.select');
const selected = document.querySelectorAll('.selected');
const optionList = document.querySelectorAll('.option-list');
//modal - login
const loginContainer = document.querySelector('.login-container');
const loginContainerCloseBtn = loginContainer.querySelector('.close>i')
const id = loginContainer.querySelector('#input-id');
const pwd = loginContainer.querySelector('#input-pwd');
const login = loginContainer.querySelector('#login-button');


let audio = new Audio('/audio/삐삐삐삐-삐삐삐삐 - 탁상시계알람.mp3');
let run = false;
let running = false;
let min = INITIAL_TIME;
let sec = "00";
let timeInterval;
let optionTime = {
    pomodoro: INITIAL_TIME,
    breakTime: INITIAL_BREAK_TIME
}
let breakTimeState = false;
//12개 배열 0 = 5분, 1 = 10분 ... 11 = 60분
let taskPer5Mins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let completedTimePer5Mins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 통계 관련 객체
let stats = {
    estimatedTime: 0,
    taskToComplete: 0,
    completedTime: 0,
    completedTask: 0
};

let count = {
    stopwatch: 0
}

let loginState;
let user; // 로그인중인 사용자의 정보가 업데이트 될때마다 매번 저장하는 변수

let completedTasks = [];

let tasks = [];

let key = localStorage.getItem('key');
if (key === null) {
    key = 0;
    localStorage.setItem('key', key);
}
let keySelectedTask; // 선택한 작업의 key

init();

function test() {
    console.log(optionTime);
    console.log(breakTimeState);
    console.log(taskPer5Mins);
    console.log(completedTimePer5Mins);
}

function init() {
    updateStopwatchCount(0);
    showTimer(min);
    makeOptionItem();
    getLoginState();
    if (loginState) {
        showUserBtn();
        user = JSON.parse(localStorage.getItem('user'));
        getUserTask();
        getUserStats();
        showTaskList(true);
        showStats();
    }

    // setEstimatedTime(); //지금 선언하는게 지금은 의미 없는데, 백엔드 하고나면 의미 있을듯?
}

function getNewKey() {
    key++;
    localStorage.setItem('key', key);
    return localStorage.getItem('key');
}

function getUserStats() {
    stats = user.stats;
    console.log(stats);
}

function getUserTask() {
    user.tasks.forEach(userTask => {
        if (userTask.name === "") return;
        if (tasks.findIndex(task => task.key === userTask.key) === -1) {
            tasks.push({
                name: userTask.name,
                time: userTask.time,
                runTime: {
                    current: userTask.runTime.current,
                    max: userTask.runTime.max
                },
                complete: userTask.complete,
                key: userTask.key
            })
        }
    })
}
// function updateUser(taskKey, taskName, taskTime, maxRunTime, currentRunTime = 0) {
//     let _task = {
//         key: taskKey,
//         name: taskName,
//         time: taskTime,
//         runTime: {
//             current: currentRunTime,
//             max: maxRunTime
//         }
//     }
//     switch (arguments.length) {
//         case 1: user.task[taskKey].runTime.current++;
//                 break;
//         case 4:
//         case 5: if (user.task[taskKey] === undefined){
//                     user.task.push(_task);
//                 } else {
//                     user.task[taskKey].key = taskKey;
//                     user.task[taskKey].name = taskName;
//                     user.task[taskKey].time = taskTime;
//                     user.task[taskKey].runTime.max = maxRunTime;
//                     user.task[taskKey].runTime.current = currentRunTime;
//                 }
//                 break;
//     }

//     user.stats.estimatedTime = stats.estimatedTime;
//     user.stats.taskToComplete = stats.taskToComplete;
//     user.stats.completedTime = stats.completedTime;
//     user.stats.completedTask = stats.completedTask;

//     localStorage.setItem('user', JSON.stringify(user));
//     let users = JSON.parse(localStorage.getItem('users'));
//     console.log(users);
//     let i = users.findIndex(users => users.id === user.id);
//     console.log(i);
//     users[i] = user;
//     localStorage.setItem('users', JSON.stringify(users));
// }

function updateUser2() {
    console.log(taskPer5Mins);
    user.tasks = tasks;
    user.stats = stats;
    localStorage.setItem('user', JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem('users'));
    let i = users.findIndex(users => users.key === user.key);
    users[i] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

// 로그아웃 -> 로그인상태는 false, localStorage의 user 삭제
function loginAndLogout(boolean) {
    loginState = boolean;

    if (loginState) { // 로그인
        let users = JSON.parse(localStorage.getItem('users'));
        if (users === null) {
            alert("입력하신 정보가 올바르지 않습니다.");
            return;
        }
        let i = users.findIndex(user => {
            return (user.id === id.value) && (user.pwd === pwd.value);
        })
        if (i !== -1) {
            user = users[i];
            localStorage.setItem('loginState', loginState);
            localStorage.setItem('user', JSON.stringify(user));
            showUserBtn();
            getUserTask();
            showTaskList(true);
            alert("로그인 되었습니다.");
            modalBackground.classList.add("hidden");
            loginContainer.classList.add('hidden');
        } else {
            alert("입력하신 정보가 올바르지 않습니다.");
        }
    }
    else { // 로그아웃
        while (taskListContainer.hasChildNodes()) {
            taskListContainer.removeChild(taskListContainer.firstChild);
        }
        showTaskList(false);
        showStats(0);
        removeCompletedTaskList();
        localStorage.setItem('loginState', loginState);
        localStorage.removeItem('user');
        // 로그아웃할때 user에 저장할건 없나??
        showLoginBtn();
        tasks = [];
        alert("로그아웃 되었습니다.");

    }
}

function showStats(num) {
    if (num !== undefined) {
        stats.estimatedTime = num;
        stats.taskToComplete = num;
        stats.completedTime = num;
        stats.completedTask = num;
    }
    estimatedTime.innerText = (stats.estimatedTime).toFixed(1); //소수점 문제때문에 한번더 반올림
    if (estimatedTime.innerText === "0.0") estimatedTime.innerText = 0;
    completedTime.innerText = (stats.completedTime).toFixed(1);
    if (completedTime.innerText === "0.0") completedTime.innerText = 0;
    taskToComplete.innerText = stats.taskToComplete;
    completedTask.innerText = stats.completedTask;
}

function showUserBtn() {
    let user = JSON.parse(localStorage.getItem('user'));
    loginBtn.classList.add('hidden');
    userBtn.classList.remove('hidden');
    userBtn.innerHTML = user.nickname;
}

function showLoginBtn() {
    loginBtn.classList.remove('hidden');
    userBtn.classList.add('hidden');
    userBtn.innerHTML = "";
}

function getLoginState() {
    let state = localStorage.getItem('loginState');
    switch (state) {
        case "null":
        case "false": loginState = false; break;
        case "true": loginState = true; break;
    }
}

function timer() {
    return setInterval(function () {
        // 초가 "00"이면 1초뒤에는 min이 1감소하고 sec는 59가 되야지
        if (sec === "00") {
            sec = 2; // 59
            min--;
            if (String(min).length === 1) {
                min = "0" + min; //01분...09분을 표현하기 위함
            }
        }
        // 초가 "01초"면 1초뒤에는 "00"초, 이때 "00 : 00 "이면 타이머 종료
        else if (sec == "01") {
            sec = "00";
            if (min == "00") {
                if (breakTimeState === false) {
                    //포모도로 타이머 종료시 휴식시간으로 변경
                    completePomodoro(keySelectedTask);
                    changeToBreak();
                }
                else {
                    //휴식시간 종료시 포모도로로 변경
                    changeToPomodoro();
                    // completeBreak();
                }
            }
        }
        // 위 조건 외에는 초가 --로 정상적으로 흘러간다.
        else {
            sec--;
            if (String(sec).length === 1) {
                sec = "0" + sec; //"01"초... "09"초를 표현
            }
        }
        showTimer(min, sec);
    }, 1000)
}



function completePomodoro(keySelectedTask) {
    tasks.find(task => task.key === keySelectedTask).runTime.current++;
    showTaskList(true);

    //포모도로 완료 -> 예정시간은 완료한만큼 줄고, 완료한 시간은 증가한다.
    // 예정시간
    updateEstimatedTime("minus");
    // 완료한 시간
    updateCompletedTime();

    showStats();

    // 유저 정보 업데이트
    // if(loginState) updateUser(index);
    if (loginState) updateUser2(index);

    // audio.play();
    run = false;
    clearInterval(timeInterval);
    timerStartBtn.innerText = "START";
}

function changeTask(taskKey) {
    let selectedTask = tasks.find(task => {
        return taskKey === task.key;
    })
    console.log(selectedTask);
    keySelectedTask = selectedTask.key;
    run = false;
    clearInterval(timeInterval);
    currentTaskName.innerText = selectedTask.name;
    currentTaskName.setAttribute('data-time', selectedTask.time);
    timerStartBtn.innerText = "START"
    min = selectedTask.time;
    showTimer(min);
}

function changeToPomodoro() {
    const body = document.querySelector('body');
    const main = document.querySelector('main');
    const li = main.querySelectorAll('li');
    // CSS
    body.style.background = RED;
    timerStartBtn.style.color = RED;
    addTaskBtn.style.color = RED;
    li.forEach(li => li.style.color = RED);
    currentTaskName.classList.remove('opacity-hide');

    // JS
    breakTimeState = false;
    min = currentTaskName.getAttribute('data-time');
    run = false;
    clearInterval(timeInterval);
    timerStartBtn.innerText = "START";
}

function changeToBreak() {
    const body = document.querySelector('body');
    const main = document.querySelector('main');
    const li = main.querySelectorAll('li');
    // CSS
    body.style.background = BLUE;
    timerStartBtn.style.color = BLUE;
    addTaskBtn.style.color = BLUE;
    li.forEach(li => li.style.color = BLUE);
    currentTaskName.classList.add('opacity-hide');

    // JS
    breakTimeState = true;
    min = optionTime.breakTime
    run = false;
    clearInterval(timeInterval);
    timerStartBtn.innerText = "START";
}


function updateStopwatchCount(param) {
    if (param === "plus") {
        count.stopwatch++;
        if (count.stopwatch <= 5) {
            for (let i = 0; i < count.stopwatch; i++) {
                if (breakTimeState) stopwatchIcon[i].style.color = BLUE;
                else stopwatchIcon[i].style.color = RED;
            }
        }
        stopwatchCount.innerText = count.stopwatch;
    } else if (param === "minus") {
        if (count.stopwatch !== 0) {
            count.stopwatch--;
            if (count.stopwatch <= 4) {
                stopwatchIcon[count.stopwatch].style.color = GRAY;
            }
            stopwatchCount.innerText = count.stopwatch;
        }
    } else if (param === "reset") {
        stopwatchIcon.forEach(icon => icon.style.color = GRAY);
        count.stopwatch = 0;
        stopwatchCount.innerText = count.stopwatch;
    }
    else {
        count.stopwatch = param;
        stopwatchCount.innerText = count.stopwatch;
    }
}

function makeOptionItem() {
    optionList.forEach(optionList => {
        let optionItemTime = 5;
        while (optionItemTime <= 60) {
            let optionItem = `<li class="option-item">
                                ${optionItemTime}분
                              </li>`
            optionList.insertAdjacentHTML('beforeend', optionItem);
            optionItemTime += 5;
        }
    })
}

function showCompletedTaskList() {
    if (!completedTaskListContainer.hasChildNodes) return;
    removeCompletedTaskList();
    completedTaskListContainer.classList.toggle('hidden');
    tasks.forEach(task => {
        if (!task.complete) return;
        let html = `<li>
                        <div class="flex-container">
                            <i class="fas fa-check-circle"></i>
                            <span class="task-name" data-time=${task.time} data-key=${task.key}>${task.name}</span>
                        </div>
                        <div>
                            <span class="run-times">${task.runTime.current}/${task.runTime.max}</span>
                            <button><i class="fa fa-trash"></i></button>
                        </div>
                    </li>`

        completedTaskListContainer.insertAdjacentHTML('beforeend', html);
    })
}

function removeCompletedTaskList() {
    while (completedTaskListContainer.hasChildNodes()) {
        completedTaskListContainer.removeChild(completedTaskListContainer.firstChild);
    }
}

function showTaskList(boolean) {
    boolean ?
        taskListBox.classList.remove('hidden') : taskListBox.classList.add('hidden');

    if (tasks.findIndex(task => task.complete === false) === -1) {
        taskListBox.classList.add('hidden');
    }
    // 이전에 있던 taskList들을 삭제
    while (taskListContainer.hasChildNodes()) {
        taskListContainer.removeChild(taskListContainer.firstChild);
    }
    // html파일에 새 taskList 생성
    tasks.forEach(task => {
        if (task.complete) return;
        let html = `<li>
                        <div class="flex-container">
                            <i class="fas fa-check-circle"></i>
                            <span class="task-name" data-time=${task.time} data-key=${task.key}>${task.name}</span>
                        </div>
                        <div>
                            <span class="run-times">${task.runTime.current}/${task.runTime.max}</span>
                            <button><i class="fa fa-trash"></i></button>
                        </div>
                    </li>`

        taskListContainer.insertAdjacentHTML('beforeend', html);
    })

    // 새로 생긴 html에 이벤트를 등록해주기
    const completeTaskBtn = taskListContainer.querySelectorAll('.fa-check-circle');
    const taskNames = taskListContainer.querySelectorAll('.task-name');
    const li = taskListContainer.querySelectorAll('li');

    taskNames.forEach(taskName => {
        taskName.addEventListener('click', e => {
            let _key = taskName.getAttribute('data-key');
            if (run) {
                let question = confirm("포모도로가 실행중 입니다. 작업을 바꾸면 시간은 초기화됩니다. 정말 바꾸시겠습니까?");
                if (question) {
                    changeTask(_key);
                }
                else {
                    run = true;
                    return;
                }
            } else {
                changeTask(_key);
            }
        })
    });

    completeTaskBtn.forEach(btn => {
        btn.addEventListener('click', completeTaskBtnHandler);
    });

    // CSS
    breakTimeState ?
        li.forEach(li => li.style.color = BLUE) : li.forEach(li => li.style.color = RED);

    if (loginState) {
        // updateUser(i, tasks[i].name, tasks[i].time, tasks[i].runTime.max);
        updateUser2();
    }
    inputTask.value = "";
}

// 통계 업데이트 함수
function updateEstimatedTime(order) {
    let taskPer5Mins_index = tasks[tasks.length - 1].time / 5 - 1;
    let time = 0;
    let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //원래 배열을 복구하기 위한 배열
    let roofState = 1;
    // 추가된 task의 time이 몇분짜리인지 찾아, 총횟수만큼 taskPer5Mins에 추가
    if (order === "plus")
        for (let i = 0; i < tasks[tasks.length - 1].runTime.max; i++) {
            taskPer5Mins[taskPer5Mins_index]++;
        }
    // 완료한 task의 time이 몇분짜리인지 찾아, 한번 감소
    else if (order === "minus") taskPer5Mins[taskPer5Mins_index]--;
    else { // order가 없으면 모든 포모도로를 완료 안했는데 작업 완료한거임
        //order === complete로 해야겠다.
        let _task = tasks.find(task => task.key === order);
        let count = _task.runTime.max - _task.runTime.current;
        console.log(taskPer5Mins);
        taskPer5Mins[taskPer5Mins_index] -= count;
        console.log(taskPer5Mins);

    }

    // 예정시간도 구하고, taskPer5Mins를 보존하기위한 temp를 구한다.
    while (roofState !== -1) {
        let i = taskPer5Mins.findIndex(item => {
            return item !== 0;
        });
        roofState = i;
        if (i !== -1) { // 아직 다 찾지 않았다면 계산해라
            taskPer5Mins[i]--;
            temp[i]++;
            time += (i + 1) * 5;
        }
    }
    stats.estimatedTime = Number((time / HOUR).toFixed(1)); //소수점 한자리 반올림
    taskPer5Mins = [...temp];
}

function updateCompletedTime() {
    let taskPer5Mins_index = min / 5 - 1;
    let time = 0;
    let roofState = 1;
    let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    completedTimePer5Mins[taskPer5Mins_index]++;
    while (roofState !== -1) {
        let i = completedTimePer5Mins.findIndex(item => {
            return item !== 0;
        })
        roofState = i;
        if (i !== -1) { // 아직 다 찾지 않았다면 계산해라
            completedTimePer5Mins[i]--;
            temp[i]++;
            time += (i + 1) * 5;
        }
    }
    stats.completedTime = (time / HOUR).toFixed(1);
    completedTimePer5Mins = [...temp];
}

function taskNameHandler(e) {
    currentTaskName.innerText = task.innerText;
}

function completeTaskBtnHandler(e) {
    let _key = e.target.nextElementSibling.getAttribute('data-key');
    tasks.find(task => task.key === _key).complete = true;

    showTaskList(true);

    // 예정 시간 줄어들어
    updateEstimatedTime(_key);
    // 완료한 시간 올라가
    updateCompletedTime();
    // 완료할 작업 줄어들어 
    stats.taskToComplete--;
    // 완료한 작업 올라가
    stats.completedTask++;

    showStats();
    let completeAll = tasks.findIndex(task => task.complete === false);
    if (completeAll === -1) {
        showTaskList(false);
    }
}

function showTimer(min, sec = "00") {
    time.innerText = `${min} : ${sec}`;
}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   이벤트 리스너 목록   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 타이머 시작, 종료
timerStartBtn.addEventListener('click', e => {
    if (currentTaskName.getAttribute('data-time') !== null) {
        if (!run) {
            run = true;
            timeInterval = timer();
        }
        else {
            run = false;
            clearInterval(timeInterval);
        }
    } else {
        alert("작업을 입력해 주세요");
    }

});

// 시작 버튼 클릭시 'innerText = start->stop' & css 변화
timerStartBtn.addEventListener('mousedown', e => {
    timerStartBtn.style.boxShadow = "none";
    timerStartBtn.style.top = "6px";
});

timerStartBtn.addEventListener('mouseup', e => {
    timerStartBtn.style.boxShadow = "rgb(214, 214, 214) 0px 6px 0px";
    timerStartBtn.style.top = "0px";
    if (!run && currentTaskName.getAttribute('data-time') !== null) {
        timerStartBtn.innerText = "STOP"
    }
    else {
        timerStartBtn.innerText = "START"
    }
});

// task 등록
addTaskBtn.addEventListener('click', e => {
    if (inputTask.value === "") {
        alert('작업명을 설정해주세요')
        return;
    } else if (count.stopwatch === 0) {
        alert('포모도로 횟수를 설정해주세요')
        return;
    }
    tasks.push({
        name: inputTask.value,
        time: optionTime.pomodoro,
        runTime: {
            current: 0,
            max: count.stopwatch
        },
        complete: false,
        key: getNewKey()
    })

    // 예정시간 증가
    updateEstimatedTime("plus");

    // 완료할 작업 증가
    stats.taskToComplete++;

    showStats();
    showTaskList(true);
    updateStopwatchCount("reset");
});

// 인풋의 stopwatch 아이콘을 누르면 색이 변하고 count.stopwatch가 증감한다.
stopwatchIcon.forEach(btn => {
    btn.addEventListener('click', e => {
        let color;
        breakTimeState ? color = BLUE : color = RED;
        let current = e.target;
        let next = current.nextElementSibling;
        if (current.dataset.index === "0") {
            if (current.style.color === "" || current.style.color === GRAY) {
                current.style.color = color;
                updateStopwatchCount(Number(current.dataset.index) + 1);
            } else if (current.style.color === color && (next.style.color === GRAY || next.style.color === "")) {
                current.style.color = GRAY;
                updateStopwatchCount(0);
            } else if (current.style.color === color && next.style.color === RED) {
                updateStopwatchCount(Number(current.dataset.index) + 1);
                stopwatchCount.innerText = count.stopwatch;
                // 5번째까지 눌려있는 상태에서 1번째꺼를 누르면 2,3,4,5 비활성화되는 반복문
                while (next.dataset.index !== undefined) {
                    current = next;
                    current.style.color = GRAY;
                    next = current.nextElementSibling;
                }
            }
        } else {
            // 5를 누르면 앞에 1~4까지 활성화가 되는 반복문 (current는 제외)
            while (current.previousElementSibling.dataset.index !== undefined) {
                current = current.previousElementSibling;
                current.style.color = color;

                //while 할 때 index가 0인 엘리멘트는 조건을 만족하지 않아 종료되어 버린다.
                //반복되지 않으므로 while이 종료되기 전에 if로 직접 수정
                if (current.dataset.index === "0") {
                    current.style.color = color;
                }
            }
            // current를 활성화시켜주는 조건문
            // 다음꺼가 회색이면 current가 마지막 활성화라는 의미니까 눌렀을때 활성화/비활성화 해줘
            // 다음꺼가 빨간색이면 current는 빨간색 유지
            current = e.target;
            next = current.nextElementSibling;
            if (next.style.color === GRAY || next.style.color === "") {
                if (current.style.color == color) {
                    current.style.color = GRAY;
                    updateStopwatchCount(Number(current.dataset.index));
                } else {
                    current.style.color = color;
                    updateStopwatchCount(Number(current.dataset.index) + 1);
                }
            }
            if (next.style.color === color) {
                // 5까지 눌려있는 상태에서 3을 누르면 4,5 비활성화되는 반복문
                current = e.target;
                updateStopwatchCount(Number(current.dataset.index) + 1);
                // current.
                while (next.dataset.index !== undefined) {
                    current = next;
                    current.style.color = GRAY;
                    next = current.nextElementSibling;
                }
            }
        }
    });
});

// stopwatch 버튼이 6개 이상 필요할때 stopwatch-fast-setting에 관한 이벤트들
stopwatchFastSettingOpenBtn.addEventListener('click', e => {
    stopwatchFastSetting.classList.toggle('opacity-hide');
});
// stopwacth count 증감 버튼 클릭
stopwatchCountPlusBtn.addEventListener('click', e => { updateStopwatchCount("plus"); });
stopwatchCountMinusBtn.addEventListener('click', e => { updateStopwatchCount("minus"); });

// pomodoro setting 열기
settingBtn.addEventListener('click', e => {
    modalBackground.classList.remove("hidden");
    settingContainer.classList.remove("hidden");
});

// pomodoro setting 닫기 - 모달 외의 화면을 클릭
modalBackground.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    settingContainer.classList.add("hidden");
});

// pomodoro setting 닫기 - 모달의 닫기 버튼을 클릭
settingContainerCloseBtn.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    e.target.parentNode.parentNode.parentNode.classList.add("hidden");
});

// optionList 열기, 닫기
select.forEach(select => {
    select.addEventListener('click', e => {
        let optionList = select.nextElementSibling;
        if (optionList.classList.contains("hidden")) {
            optionList.style.height = "150px";
            optionList.classList.remove('hidden');
        } else {
            optionList.style.height = "0px";
            optionList.classList.add('hidden');
        }
    });
});

// optionList 닫기 - 마우스가 벗어났을때
optionList.forEach(optionList => {
    optionList.addEventListener('mouseleave', e => {
        optionList.style.height = "0px";
        optionList.classList.add('hidden');
    });
});

// optionTime을 선택하여 pomodoro와 breakTime을 설정
optionList.forEach((optionList, i) => {
    optionList.addEventListener('click', e => {
        // e.target.innerText = "5분" , "10분"의 형태를 숫자만 뽑아서 저장한다.
        let number;
        switch (e.target.innerText.length) {
            case 1: number = (e.target.innerText).substring(0, 0);
                break;
            case 2: number = (e.target.innerText).substring(0, 1);
                break;
            case 3: number = (e.target.innerText).substring(0, 2);
                break;
        }
        // i가 0이면 포모도로, 1이면 휴식 시간
        if (i === 0) {
            // 타이머가 실행 중이면 타이머의 시간에는 변화를 주지 않는다.
            if (!run) {
                min = number;
                showTimer(min);
                selected[i].innerText = `${number}분`;
            }
            optionTime.pomodoro = number;
        } else {
            optionTime.breakTime = number;
            selected[i].innerText = `${number}분`;
        }
    });
});


// login 모달 열기
loginBtn.addEventListener('click', e => {
    modalBackground.classList.remove("hidden");
    loginContainer.classList.remove("hidden");
});

// login 모달 닫기 - 모달 외의 화면을 클릭
modalBackground.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    loginContainer.classList.add('hidden');
});

// login 모달 닫기 - 모달의 닫기 버튼을 클릭
loginContainerCloseBtn.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    e.target.parentNode.parentNode.parentNode.classList.add("hidden");
});

// login 모달의 login 버튼 클릭 
login.addEventListener('click', e => loginAndLogout(true));

// user 클릭
userBtn.addEventListener('click', e => {
    loginAndLogout(false);
});

// 완료한 작업 보기 클릭
showCompletedTaskBtn.addEventListener('click', e => {
    showCompletedTaskList();
});