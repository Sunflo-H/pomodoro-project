'use strict'

const RED = "var(--pomodoro-background)";
const GRAY = "var(--black1A)";
const BLUE = "var(--break-time-background)";
const CONTAINER_BACKGROUND_COLOR = "var(--container-background)";
const HOUR = 60;
const INITIAL_POMODORO_TIME = 5;
const INITIAL_BREAK_TIME = 5;
const INITIAL_SEC = "00";
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
const login_div = document.querySelector('#login');
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
const inputId = loginContainer.querySelector('#input-id');
const inputPwd = loginContainer.querySelector('#input-pwd');
const loginBtn = loginContainer.querySelector('#login-button');


let audio = new Audio('assets/audio/alarm1.mp3');
let run = false;
let running = false;
let min = INITIAL_POMODORO_TIME;
let sec = INITIAL_SEC;
let timeInterval;
let optionTime = {
    pomodoro: INITIAL_POMODORO_TIME,
    breakTime: INITIAL_BREAK_TIME
}
let breakTimeState = false;

let sumTaskTimes = 0;
let sumCompletedTaskTimes = 0;

let stats = {
    estimatedTime: 0,
    taskToComplete: 0,
    completedTime: 0,
    completedTask: 0
};

let count = {
    stopwatch: 0
}

let user; // 로그인중인 사용자의 정보가 업데이트 될때마다 매번 저장하는 변수

let completedTasks = [];

let tasks = [];

let keySelectedTask; // 선택한 작업의 key

init();

function init() {
    console.log("초기화 단계 시작 합니다.");

    
    // 타이머 관련 함수들
    showTimer(min);
    setStopwatchCount(0);
    makeOptionItem();
    createKey();

    // 로그인 관련 함수들
    createEmptyUsers();
    createLoginState();

    // 현재 tasks와 currentKey를 비교해서 일치하는게 없다면 currentKey를 삭제
    // currentTaskName 대신 currentKey를 사용하려는 과정임
    let i = tasks.findIndex(task => task.key === localStorage.getItem('currentKey'));
    if(i === -1) localStorage.removeItem('currentKey');

    if (getLoginState()) {
        showUserBtn();
        user = JSON.parse(localStorage.getItem('user'));
        console.log("초기화 단계에서 유저 task 가져옵니다.");
        getUserTask();
        console.log("초기화 단계에서 유저 stats 가져옵니다.");
        getUserStats();
        console.log("초기화 단계에서 작업리스트, 통계 html로 보여줍니다.");
        showTaskList(true);
        showStats();
    }
}

function createKey() {
    if (localStorage.getItem('key') === null) {
        localStorage.setItem('key', 0);
    }
}

function createEmptyUsers() {
    if(localStorage.getItem('users') === null) {
        let arr = [];
        localStorage.setItem('users',JSON.stringify(arr));
    }
}

function addChar_0(num) {
    let char = "0" + num;
    return char;
}

function showSelectedOptionTime(i, time) {
    console.log("쇼 셀렉티드 옵션 타임");
    selected[i].innerText = `${time}분`;
}

function delBtnHandler(e) {
        let _key = e.currentTarget.parentNode.previousElementSibling.lastElementChild.getAttribute('data-key');
        let newTasks = tasks.filter(task => task.key !== _key);
        tasks = [...newTasks];

        updateEstimatedTime("delete", _key);
        stats.taskToComplete--;

        showStats();
        showTaskList(true);
}

function getNewKey(key) {
    key++;
    localStorage.setItem('key', key);
    return localStorage.getItem('key');
}

function getUserStats() {
    console.log("유저 stats 가져오는 함수 실행");
    stats = user.stats;
}

function getUserTask() {
    console.log("유저 task 가져오는 함수 실행");
    console.log(user);
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

function updateUser() {
    console.log("유저정보 업데이트 함수 실행");

    user.tasks = [...tasks];
    user.stats = {...stats};
    localStorage.setItem('user', JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem('users'));
    let i = users.findIndex(users => users.id === user.id);
    users[i] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

function login() {
    console.log("로그인 함수 실행");
    let users = JSON.parse(localStorage.getItem('users'));    
    let i = users.findIndex(user => (user.id === inputId.value) && (user.pwd === inputPwd.value));

    if (i !== -1) {
        user = users[i];
        localStorage.setItem('loginState', true);
        localStorage.setItem('user', JSON.stringify(user));

        showUserBtn();
        getUserTask();
        showTaskList(true);
        console.log(localStorage.getItem('users'));
        alert("로그인 되었습니다.");
        modalBackground.classList.add("hidden");
        loginContainer.classList.add('hidden');
    } else {
        alert("입력하신 정보가 올바르지 않습니다.");
    }
}

function logout() {
    console.log("로그아웃 함수 실행");
    while (taskListContainer.hasChildNodes()) {
        taskListContainer.removeChild(taskListContainer.firstChild);
    }
    setStopwatchCount("reset");
    showTaskList(false);
    showStats(0);
    removeCompletedTaskList();
    localStorage.setItem('loginState', false);
    localStorage.removeItem('user');
    // 로그아웃할때 user에 저장할건 없나??
    showLoginBtn();
    showSelectedOptionTime(0, INITIAL_POMODORO_TIME);
    showSelectedOptionTime(1, INITIAL_BREAK_TIME);
    tasks = [];
    alert("로그아웃 되었습니다.");
}

function showStats(num) {
    console.log("통계 보여주는 함수 실행");
    if (num !== undefined) {
        stats.estimatedTime = num;
        stats.taskToComplete = num;
        stats.completedTime = num;
        stats.completedTask = num;
    }
    estimatedTime.innerText = (stats.estimatedTime).toFixed(1); //소수점 문제때문에 한번더 반올림
    if (estimatedTime.innerText === "0.0") estimatedTime.innerText = 0;

    taskToComplete.innerText = stats.taskToComplete;
    
    completedTime.innerText = Number(stats.completedTime).toFixed(1);
    
    if (completedTime.innerText === "0.0") completedTime.innerText = 0;
    
    completedTask.innerText = stats.completedTask;
}

function showUserBtn() {
    let user = JSON.parse(localStorage.getItem('user'));
    login_div.classList.add('hidden');
    userBtn.classList.remove('hidden');
    userBtn.innerHTML = user.nickname;
}

function showLoginBtn() {
    login_div.classList.remove('hidden');
    userBtn.classList.add('hidden');
    userBtn.innerHTML = "";
}
function createLoginState() {
    console.log(localStorage.getItem('loginState'));
    if(localStorage.getItem('loginState') === null) {
        console.log("로그인 스테이트 생성");
        localStorage.setItem('loginState', false);
    }
}
function getLoginState() {
    if(localStorage.getItem('loginState') === "true") return true;
    else return false;
}

function timer() {
    return setInterval(function () {
        // 초가 "00"이면 1초뒤에는 min이 1감소하고 sec는 59가 되야지
        if (sec === "00") {
            sec = 59; // 59
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
                    showTimer(optionTime.breakTime);
                    return;
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
    console.log("포모도로 완료 함수 실행");
    tasks.find(task => task.key === keySelectedTask).runTime.current++;
    showTaskList(true);

    //포모도로 완료 -> 예정시간은 완료한만큼 줄고, 완료한 시간은 증가한다.
    // 예정시간
    updateEstimatedTime("minus", keySelectedTask);
    // 완료한 시간
    updateCompletedTime(keySelectedTask);

    showStats();

    // 유저 정보 업데이트
    if (getLoginState()) updateUser();

    audio.play();
    run = false;
    clearInterval(timeInterval);
    timerStartBtn.innerText = "START";
}

function changeTask(taskKey) {
    let selectedTask = tasks.find(task => {
        return taskKey === task.key;
    })
    keySelectedTask = selectedTask.key;
    run = false;
    clearInterval(timeInterval);
    currentTaskName.innerText = selectedTask.name;
    currentTaskName.setAttribute('data-time', selectedTask.time);
    currentTaskName.setAttribute('data-key', selectedTask.key);
    timerStartBtn.innerText = "START"
    min = selectedTask.time;
    showTimer(min);
}

function changeToPomodoro() {
    console.log("쉬는 시간에서 포모도로로 바뀌는 함수 실행");
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
    console.log("포모도로에서 쉬는 시간으로 바뀌는 함수 실행");
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


// "plus", "minus", "reset", 숫자를 파라미터로 받아 stopwatch 카운트를 세팅합니다.
function setStopwatchCount(param) {
    console.log(`스톱워치 카운트 ${param} 으로 바꾸는 함수 실행`);
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
    console.log("세팅메뉴 옵션리스트 생성하는 함수 실행");
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

function showTaskList(show) {
    console.log("작업리스트 보여주는 함수 실행");
    show ? taskListBox.classList.remove('hidden') : taskListBox.classList.add('hidden');

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
    const delBtn = taskListContainer.querySelectorAll('button');

    taskNames.forEach(taskName => {
        taskName.addEventListener('click', e => {
            let _key = taskName.getAttribute('data-key');
            localStorage.setItem('currentKey', _key);
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

    delBtn.forEach(btn => {
        btn.addEventListener('click', delBtnHandler)
    });
    // CSS
    breakTimeState ?
        li.forEach(li => li.style.color = BLUE) : li.forEach(li => li.style.color = RED);

    // 이걸 여기다 해야할까???
    if (getLoginState()) {
        updateUser();
    }
    inputTask.value = "";
}

// 통계 업데이트 함수
function updateEstimatedTime(order, key) {
    
    console.log(`예정시간 ${order} 하는 함수 실행`);

    if (order === "plus" || order === "delete") { 
        sumTaskTimes = 0;
        tasks.forEach(task => {
            if(task.complete === false) sumTaskTimes += (task.time * task.runTime.max);
        });
    } else if (order === "minus") {
        let _task = tasks.find(task => task.key === key);
        sumTaskTimes -= _task.time;
    } else if (order === "complete") {
        let _task = tasks.find(task => task.key === key);
        sumTaskTimes -= (_task.runTime.max - _task.runTime.current) * _task.time;
    } 
    
    stats.estimatedTime = Number((sumTaskTimes/HOUR).toFixed(1)); //소수점 한자리 반올림

}

function updateCompletedTime(key) {
    console.log("완료한 시간 업데이트 함수 실행");
    let _task = tasks.find(task => task.key === key);
    sumCompletedTaskTimes += _task.time;
    
    stats.completedTime = Number((sumCompletedTaskTimes / HOUR).toFixed(1));
}

function completeTaskBtnHandler(e) {
    console.log("작업 완료 버튼 눌렀을때 처리하는 함수 실행");
    let _key = e.target.nextElementSibling.getAttribute('data-key');
    tasks.find(task => task.key === _key).complete = true;

    showTaskList(true);

    // 예정 시간 = 현재 작업이 모든 runtime을 하지 않았다면 미완료runtime만큼 감소
    updateEstimatedTime("complete" , _key);
    // 완료할 작업 줄어들어 
    stats.taskToComplete--;
    // 완료한 작업 올라가
    stats.completedTask++;

    console.log("완료시");
    showStats();
    let completeAll = tasks.findIndex(task => task.complete === false);
    if (completeAll === -1) {
        showTaskList(false);
    }
}

function showTimer(min, sec = "00") {
    console.log("타이머 html로 보여주는 함수 실행");
    //length를 얻기위한 문자열 변환
    if(min.toString().length === 1) min = addChar_0(min);
    time.innerText = `${min} : ${sec}`;
}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   이벤트 리스너 목록   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//새로고침, 뒤로가기 경고
window.addEventListener('beforeunload', e => {
    e.preventDefault();
    e.returnValue = '';    
})

// 시작 버튼 클릭시 'innerText = start->stop' & css 변화
timerStartBtn.addEventListener('mousedown', e => {
    timerStartBtn.style.boxShadow = "none";
    timerStartBtn.style.top = "6px";
});

timerStartBtn.addEventListener('click', e => {
    timerStartBtn.style.boxShadow = "rgb(214, 214, 214) 0px 6px 0px";
    timerStartBtn.style.top = "0px";
    if (!run && currentTaskName.getAttribute('data-time') !== null) {
        timerStartBtn.innerText = "STOP"
    }
    else {
        timerStartBtn.innerText = "START"
    }
});

timerStartBtn.addEventListener('mouseleave', () => {
    timerStartBtn.style.boxShadow = "rgb(214, 214, 214) 0px 6px 0px";
    timerStartBtn.style.top = "0px";
})

// 타이머 시작, 종료
timerStartBtn.addEventListener('click', e => {
    console.log("타이머 시작버튼 클릭 이벤트");
    // 현재 task가 선택된 상태라면
    if (localStorage.getItem('currentKey') !== null) {
        if (!run) {
            run = true;
            timeInterval = timer();
        }
        else {
            run = false;
            clearInterval(timeInterval);
        }
    } else {
        alert("작업을 선택해 주세요");
    }
});

// task 등록
addTaskBtn.addEventListener('click', e => {
    console.log("새 작업 등록하는 이벤트");
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
        key: getNewKey(localStorage.getItem('key'))
    })

    // 예정시간 증가
    console.log("예정시간 증가합니다");
    updateEstimatedTime("plus");

    // 완료할 작업 증가
    console.log("완료할 작업 증가합니다 ++로 걍함");
    stats.taskToComplete++;

    console.log("작업리스트와 통계를 html로 보여주기");
    showStats();
    showTaskList(true);

    console.log("스톱워치 카운트 reset 시키기");
    setStopwatchCount("reset");
});

// 인풋의 stopwatch 아이콘을 누르면 색이 변하고 count.stopwatch가 증감한다.
stopwatchIcon.forEach(btn => {
    btn.addEventListener('click', e => {
        console.log("스탑워치 아이콘 눌렸습니다.");
        let color;
        breakTimeState ? color = BLUE : color = RED;
        let current = e.target;
        let next = current.nextElementSibling;
        if (current.dataset.index === "0") {
            if (current.style.color === "" || current.style.color === GRAY) {
                current.style.color = color;
                setStopwatchCount(Number(current.dataset.index) + 1);
            } else if (current.style.color === color && (next.style.color === GRAY || next.style.color === "")) {
                current.style.color = GRAY;
                setStopwatchCount(0);
            } else if (current.style.color === color && next.style.color === RED) {
                setStopwatchCount(Number(current.dataset.index) + 1);
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
                    setStopwatchCount(Number(current.dataset.index));
                } else {
                    current.style.color = color;
                    setStopwatchCount(Number(current.dataset.index) + 1);
                }
            }
            if (next.style.color === color) {
                // 5까지 눌려있는 상태에서 3을 누르면 4,5 비활성화되는 반복문
                current = e.target;
                setStopwatchCount(Number(current.dataset.index) + 1);
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
stopwatchCountPlusBtn.addEventListener('click', e => { setStopwatchCount("plus"); });
stopwatchCountMinusBtn.addEventListener('click', e => { setStopwatchCount("minus"); });

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
            
            optionTime.pomodoro = number;
            showSelectedOptionTime(i, number);
    
            if (!run) {
                min = number;
                if (currentTaskName.getAttribute('data-key') !== null) {
                    currentTaskName.removeAttribute('data-key');
                    currentTaskName.removeAttribute('data-time');
                    currentTaskName.innerText = "새 작업을 입력해 주세요"
                }
                showTimer(min);
                // 현재 작업이 선택되어 있으면 작업빼버리고 옵션타임을 보여줘
                // 선택 안되어 있으면 바로 옵션타임 보여줘
            }
        } else {
            optionTime.breakTime = number;
            selected[i].innerText = `${number}분`;
        }
    });
});


// login 모달 열기
login_div.addEventListener('click', e => {
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
// login.addEventListener('click', e => loginAndLogout(true));
loginBtn.addEventListener('click', e => login());

// user 클릭
// userBtn.addEventListener('click', e => loginAndLogout(false));
userBtn.addEventListener('click', e => logout());

// 완료한 작업 보기 클릭
showCompletedTaskBtn.addEventListener('click', e => {
    showCompletedTaskList();
});
