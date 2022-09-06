'use strict'
function add (x, y){
	console.log(x);
	console.log(y);
	console.log(x + y);
	return x + y;
}

/**
 * *todo 완료한 작업은 name에 밑줄 슥슥 css 
 * *todo 완료한 작업 nonLoginTask 적용
 * *todo nonLoginTask의 작업 삭제 적용
 * *todo 완료한 작업 통계 적용하기 ()
 * *todo 통계에도 nonLoginTask 적용
 * *todo 새로고침시 nonLoginTask의 통계 불러오기
 * todo 차트 적용
 */

/**
 * 작동 순서 - 타이머
 * 1. init()
 * 2. 타이머 시간 설정 = createOptionItem() -> optionLists Click이벤트
 * 
 * 1. 새 작업을 입력 (작업명, 타이머 횟수) 
 * 2. addTaskBtn 클릭
 *  2-1 작업정보(작업명,시간,타이머횟수,완료상태,키)를 tasks[]에 저장,
 *  2-2 통계작업
 * 3. 작업리스트 생성 showTaskList(true)
 *  3-1 생성한 작업리스트의 작업들에게 이벤트 등록 - 작업명, 완료버튼, 삭제버튼 클릭 이벤트
 * 4. 작업명을 클릭 = taskName 클릭
 * 5. start 버튼 클릭
 * 6. 타이머 실행.
 * 
 * 작동 순서 - 옵션
 * 1. setting 버튼으로 옵션을 연다
 * 2. Pomodoro Time, Break Time 설정
 *  2-1 
 * 
 * 작동 순서 - 로그인
 */

const RED = "var(--pomodoro-background)";
const GRAY = "var(--black1A)";
const BLUE = "var(--break-time-background)";
const CONTAINER_BACKGROUND_COLOR = "var(--container-background)";
const HOUR = 60;
const INITIAL_POMODORO_TIME = 5;
const INITIAL_BREAK_TIME = 5;
const INITIAL_SEC = "00";
const TEST_MIN = 1;
const TEST_SEC = 2;
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
/** 실행중인 작업의 이름 div */
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
//modal
const modalBackground = document.querySelector('.modal-background');
//modal - setting
const settingContainer = document.querySelector('.setting-container');
const settingContainerCloseBtn = settingContainer.querySelector('.close>i');
//modal - setting - select box (Pomodoro Time, Break Time)
const selectContainer = document.querySelectorAll('.select-container');
const selects = document.querySelectorAll('.select');
const selected = document.querySelectorAll('.selected');
const optionLists = document.querySelectorAll('.option-list');
//modal - setting - alram-container
const alrams = document.querySelectorAll('.alram');
const alramPlayBtns = document.querySelectorAll('.alram i');
const alramRadioBtns = document.querySelectorAll('.alram input[type=radio]');
//modal - login
const loginContainer = document.querySelector('.login-container');
const loginContainerCloseBtn = loginContainer.querySelector('.close>i');
const inputId = loginContainer.querySelector('#input-id');
const inputPwd = loginContainer.querySelector('#input-pwd');
const loginBtn = loginContainer.querySelector('#login-button');


let run = false;
let min = INITIAL_POMODORO_TIME;
// let min = TEST_MIN;
let sec = INITIAL_SEC;

/** 타이머를 초로 변경한 값, 작업을 선택할때 저장된다. (해당 작업의 타이머 * 60) */
let totalSec; 
let remainingSec; // 남은 초 (totalSec - (현재시간 - 시작시간))

let timeInterval;
let tempStartTime = 0;

let optionTime = {
    pomodoro: INITIAL_POMODORO_TIME,
    // pomodoro: TEST_MIN,
    breakTime: INITIAL_BREAK_TIME
}
let breakTimeState = false;

// 라디오버튼을 눌러서 알람을 설정한다. -> 알람이 세팅되고 이걸 플레이
// 타이머가 완료되면 알람을 실행한다.
// 플레이버튼을 눌러서 알람을 실행한다. 
let alram;
let sampleAlram;

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
// id, pwd, email, stats, tasks 정보를 가진다.

let completedTasks = [];

/** name, time, runTime, complete의 유무, key 정보를 가진다.*/
let tasks = []; // 사용자가 task를 추가할 때마다 여기에 push한다.

init();

function init() {
    console.log("초기화 단계 시작 합니다.");

    // 타이머 관련 함수들
    showTimer(min);
    setStopwatchCount(0);
    createOptionItem();
    createKey();
    showStats();

    // 작업 관련 함수들
    getNonLoginTasks();
    showTaskList(true);

    // 알람 관련 함수들
    getNonLoginAlram();

    // 통계 관련 함수들
    getNonLoginStats();

    // 로그인 관련 함수들
    createEmptyUsers();
    createLoginState();

    

    let i = tasks.findIndex(task => task.key === localStorage.getItem('currentKey'));
    if (i === -1) localStorage.removeItem('currentKey');

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
        console.log(user);
    }
}

/**
 * localStorage로부터 통계 정보를 가져오는 함수
 */
function getNonLoginStats() {
    let localStats = JSON.parse(localStorage.getItem('non-login-stats'));
    if(localStats === null) setNonLoginStats(); 
}

/**
 * localStorage에 통계 정보를 저장하는 함수
 */
function setNonLoginStats() {
    localStorage.setItem('non-login-stats', JSON.stringify(stats));
}


/**
 * localStorage로부터 알람 정보를 가져오는 함수
 */
function getNonLoginAlram() {
    let localStorageAlram = localStorage.getItem('non-login-alram');
    if(localStorageAlram === null) setNonLoginAlram();
    let index;

    switch (localStorageAlram) {
        case 'tableClock.mp3' :
        case null : index = 0; break;
        case 'alramClock.mp3' : index = 1; break;
        case 'bbibbi.mp3' : index = 2; break;
        case 'bbibi.mp3' : index = 3; break;
        case 'school.mp3' : index = 4; break;
        case 'bbibitong.mp3' : index = 5; break;
    }

    alramRadioBtns[index].checked = true;
// ㅁㅁ
}

/**
 * 알람세팅에서 알람을 설정하면 localStorage에 저장하는 함수
 * @param {*} datasetAlram 설정한 알람의 data-alram
 */
function setNonLoginAlram(datasetAlram) {
    if(localStorage.getItem('non-login-alram') === null) {
        localStorage.setItem('non-login-alram', `tableClock.mp3`); 
        return;
    }

    localStorage.setItem('non-login-alram', datasetAlram); 
}

alramRadioBtns.forEach(alram => {
    alram.addEventListener('click', (e) => {
        let datasetAlram = e.target.parentNode.dataset.alram;
        alram = new Audio(`assets/audio/${datasetAlram}`);

        setNonLoginAlram(datasetAlram);
    });
});

/**
 * 알람 설정에서 play버튼을 누를때 실행되는 이벤트리스너
 */
alramPlayBtns.forEach(alram => {
    alram.addEventListener('click', (e) => {
        let targetAlram = e.target.parentNode.dataset.alram;

        if(sampleAlram !== undefined) sampleAlram.pause();

        sampleAlram = new Audio(`assets/audio/${targetAlram}`);
        
        alramPlayer(sampleAlram);
    });
});

/**
 * 알람을 재생하는 함수
 */
function alramPlayer(alram) {
    alram.play();
}

/** 로컬스토리지로부터 'non-login-tasks'(비로그인 유저의 task) 를 tasks에 저장한다. */
function getNonLoginTasks() {
    let nonLoginTasks = JSON.parse(localStorage.getItem('non-login-tasks'));

    if(nonLoginTasks !== null) tasks = nonLoginTasks;
}

/** 로컬스토리지에 'non-login-tasks'(비로그인 유저의 task)로 tasks를 저장한다. */
function setNonLoginTasks() {
    localStorage.setItem('non-login-tasks', JSON.stringify(tasks));
}

/** 초기화 단계에서 localStorage에 'key'가 없다면 생성한다. */
function createKey() {
    if (localStorage.getItem('key') === null) localStorage.setItem('key', 0);
}

function createEmptyUsers() {
    if (localStorage.getItem('users') === null) {
        let arr = [];
        localStorage.setItem('users', JSON.stringify(arr));
    }
}
/**
 * 파라미터로 오는 숫자의 앞에 0을 붙여서 반환하는 함수
 * @param {*} num 
 * @returns ex) 1 => 01 , 2 => 02
 */
function addChar_0(num) {
    let char = "0" + num;
    return char;
}

/**
 * 세팅에서 Pomodoro Time 또는 Break Time의 select를 내가 클릭한 시간으로 보이게 한다.
 * @param {*} i 포모도로, 휴식 을 나누는 값 (0=포모도로, 1=휴식)
 * @param {*} time `${time}분`으로 값을 설정
 */
function showSelectedOptionTime(i, time) {
    console.log(`쇼 셀렉티드 옵션 타임, 세팅의 항목을 선택한 시간으로 바꿉니다. ${time}분 `);
    selected[i].innerText = `${time}분`;
}

function removeTask(e) {
    let key = e.currentTarget.parentNode.previousElementSibling.lastElementChild.getAttribute('data-key');
    let newTasks = tasks.filter( task => task.key !== key );
    tasks = [...newTasks];

    setNonLoginTasks();

    setEstimatedTime();
    setTaskToComplete("minus");

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
    stats = {...user.stats};
}

// user.tasks를 앱에서 사용할 tasks 변수에 저장한다.
function getUserTask() {
    console.log("유저 task 가져오는 함수 실행");
    // user.tasks와 tasks 를 비교하여 일치하는게 없다면
    // user.tasks를 반복하여 일치하지 않는 task를 tasks에 push해줘야해
    user.tasks.forEach(userTask => {
        if (userTask.name === "") return; 
        if (tasks.findIndex(task => task.key === userTask.key) === -1) {
            tasks.push({...userTask});
        }
    });
}

// tasks와 stats를 user.tasks, user.stats 에 저장 한 뒤 user, users를 localStorage에 저장
function updateUser() {
    console.log("유저정보 업데이트 함수 실행");

    user.tasks = [...tasks];
    user.stats = { ...stats };
    localStorage.setItem('user', JSON.stringify(user));
    let users = JSON.parse(localStorage.getItem('users'));
    let i = users.findIndex(users => users.id === user.id);
    console.log(user);
    users[i] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

function login() {
    console.log("로그인 함수 실행");
    let users = JSON.parse(localStorage.getItem('users'));
    let i = users.findIndex(user => (user.id === inputId.value) && (user.pwd === inputPwd.value));

    if (i !== -1) {
        user = {...users[i]}; // user는 객체야, 깊은복사 성공
        
        localStorage.setItem('loginState', true);
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user);

        showUserBtn();
        getUserTask();
        getUserStats();
        showTaskList(true);
        showStats();
        Swal.fire('로그인 되었습니다.');
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
    showTaskList(false);
    setStopwatchCount("reset");
    showStats("reset");
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

function showStats(order) {
    console.log("통계 보여주는 함수 실행");

    if (order === "reset") {
        stats.estimatedTime = 0;
        stats.taskToComplete = 0;
        stats.completedTime = 0;
        stats.completedTask = 0;
    }

    // ! 이 함수가 꼭 있어야 하나??? 확인해보자

    // 예정시간
    estimatedTime.innerText = stats.estimatedTime;
    if (estimatedTime.innerText === "0.0") estimatedTime.innerText = 0;

    // 완료할 작업
    taskToComplete.innerText = stats.taskToComplete;
    
    // 완료한 시간
    completedTime.innerText = stats.completedTime;
    if (completedTime.innerText === "0.0") completedTime.innerText = 0;

    // 완료한 작업
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
    if (localStorage.getItem('loginState') === null) {
        console.log("로그인 스테이트 생성");
        localStorage.setItem('loginState', false);
    }
}
function getLoginState() {
    if (localStorage.getItem('loginState') === "true") return true;
    else return false;
}

function timer(startTime) {
    let str = String(Date.now()- startTime); // 현재시간과 시작시간의 차를 구한다.
                                             // str은 1초일때 1001, 2초일때 2015, 3초일때 3004
                                             // 이런식으로 미세한 오차가 발생한다.

    let goneSec = str.substring(0, str.length-3); // 오차를 제거하기위해 뒤에 3자리를 자른다.
                                                 // ex) 1001 => 1, 2015 => 2 , 3004 => 3
                                                 // 이게 곧 진행한 시간이 된다.

    remainingSec = totalSec - goneSec; // 남은 초
    console.log(remainingSec);

    min = Math.floor(remainingSec / 60); // 600 / 60 = 10분 00초, 630 / 60 = 10분 30초
    sec = remainingSec % 60;
    
    showTimer(min, sec);
    
    // -1 / 60 0분
    if(min <= 0 && sec <= 0) {
        completePomodoro(localStorage.getItem('currentKey'));
    }

    // 끝날때 시간을 미리 구해 
    // 계속해서 현재시간을 받고
    // 그러다가 현재시간 === 끝날떄 시간이면 00 : 00 만들고 종료
    // 백그라운드에 진입하고 10분정도 지나면 1분간격으로 작동한다.
}



function completePomodoro(currentTaskKey) {
    console.log("===포모도로 완료 함수 실행===");
    tasks.find(task => task.key === currentTaskKey).runTime.current++;
    showTaskList(true);

    //포모도로 완료 -> 예정시간은 완료한만큼 줄고, 완료한 시간은 증가한다.
    // 예정시간
    setEstimatedTime();
    // 완료한 시간
    setCompletedTime();

    showStats();

    // 유저 정보 업데이트
    if (getLoginState()) updateUser();

    alramPlayer(alram);
    run = false;
    clearInterval(timeInterval);
    timerStartBtn.innerText = "START";
}

function selectTask(taskKey) {
    let selectTask = tasks.find(task => {
        return taskKey === task.key;
    })
    console.log(selectTask);
    localStorage.setItem('currentKey', selectTask.key);
    run = false;
    clearInterval(timeInterval);
    currentTaskName.innerText = selectTask.name;
    currentTaskName.setAttribute('data-time', selectTask.time);
    currentTaskName.setAttribute('data-key', selectTask.key);
    timerStartBtn.innerText = "START"
    min = selectTask.time;
    sec = "00"
    totalSec = selectTask.time * 60;
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

/**
 * 상단 setting 에서 Pomodoro Time과 Break Time의 HTML을 만든다.
 */
function createOptionItem() {
    console.log("세팅메뉴 옵션리스트 생성하는 함수 실행");
    optionLists.forEach(optionList => {
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

function removeCompletedTaskList() {
    while (completedTaskListContainer.hasChildNodes()) {
        completedTaskListContainer.removeChild(completedTaskListContainer.firstChild);
    }
}

/**
 * 
 * @param {boolean} isTrue 
 */
function showTaskList(isTrue) {
    console.log("작업리스트 보여주는 함수 실행");

    isTrue ? taskListBox.classList.remove('hidden') : taskListBox.classList.add('hidden');

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
    });

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
                    selectTask(_key);
                }
                else {
                    run = true;
                    return;
                }
            } else {
                selectTask(_key);
            }
        });
    });

    completeTaskBtn.forEach(btn => {
        btn.addEventListener('click', completeTask);
    });

    delBtn.forEach(btn => {
        btn.addEventListener('click', removeTask)
    });

    // CSS
    breakTimeState ?
        li.forEach(li => li.style.color = BLUE) : li.forEach(li => li.style.color = RED);

    inputTask.value = "";
}

// 통계 업데이트 함수

/**
 * 예정시간을 구하는 함수
 */
function setEstimatedTime() {
    let totalTaskTime = 0;
    tasks.forEach(task => {
        if (task.complete === false) {
            totalTaskTime += (task.time * (task.runTime.max - task.runTime.current));
        }
    });

    stats.estimatedTime = Number((totalTaskTime / HOUR).toFixed(1)); //소수점 한자리 반올림
    setNonLoginStats();
}

/**
 * 완료할 작업의 수를 증감하는 함수
 * @param {*} order "plus", "minus"
 */
function setTaskToComplete(order) {
    if (order === "plus") stats.taskToComplete++;
    else if (order === "minus") stats.taskToComplete--;

    setNonLoginStats();
}

/**
 * 완료한 시간을 구하는 함수
 */
function setCompletedTime() {
    let sumTime = 0;
    
    tasks.forEach(task => sumTime += task.time * task.runTime.current);
    
    stats.completedTime = (sumTime / HOUR).toFixed(1);

    setNonLoginStats();
}

/**
 * 완료한 작업을 증감하는 함수
 * @param {*} order "plus", "minus"
 */
function setCompletedTask(order) {
    if(order === "plus") stats.completedTask++;
    else if (order === "minus") stats.completedTask--;

    setNonLoginStats();
}

/**
 * completeTaskBtn 을 눌렀을때 처리하는 함수
 * 해당 작업의 complete를 true로 바꾸고, css 작업을 한다.
 * 통계도 업데이트 해준다.
 * @param {*} e 
 */
function completeTask(e) {
    console.log("작업 완료 버튼 눌렀을때 처리하는 함수 실행");
    let completeBtn = e.target;
    let taskName = e.target.nextElementSibling;
    let key = taskName.getAttribute('data-key');
    let targetTask = tasks.find(task => task.key === key); 
    
    // 완료 작업
    completeBtn.classList.toggle('task-complete-btn'); // 완료 버튼 색 변경
    taskName.classList.toggle('task-complete-text'); // 작업명에 가로줄, 색변경
    
    if(!targetTask.complete) { // 완료를 누를때
        targetTask.complete = true;
        setTaskToComplete("minus");
        setCompletedTask("plus"); 

        // 완료한 시간은 타이머가 완료되었을때 증가하므로 여기서는 사용하지 않는다.
    }
    else { // 완료를 해제할때
        targetTask.complete = false;
        setTaskToComplete("plus"); 
        setCompletedTask("minus");
    }    

    setEstimatedTime(); 
    setNonLoginTasks();
    
    showStats(); // 통계를 보여준다.

}

function showTimer(min, sec = "00") {
    //length를 얻기위한 문자열 변환
    console.log(min, sec);
    if (min.toString().length === 1) min = addChar_0(min);
    if (sec.toString().length === 1) sec = addChar_0(sec);
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
    if (localStorage.getItem('currentKey') !== null) { // 현재 task가 선택된 상태라면 타이머를 실행
        let startTime = Date.now();
        
        if (!run) { // 타이머가 정지상태라면 작동시킨다.
            run = true;
            timeInterval = setInterval(timer, 1000, startTime);
        }
        else if(run) { // 타이머가 작동중이라면 정지시킨다.
            run = false;
            clearInterval(timeInterval);
            totalSec = remainingSec;
        }
    }
    else {
        alert("작업을 선택해 주세요");        
    }
});

// task 등록
addTaskBtn.addEventListener('click', e => {
    console.log("새 작업 등록하는 이벤트");
    if (inputTask.value === "") {
        alert('작업명을 설정해주세요');
        return;
    } else if (count.stopwatch === 0) {
        alert('포모도로 횟수를 설정해주세요');
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

    setNonLoginTasks();

    // 예정시간 증가
    console.log("예정시간 증가합니다");
    setEstimatedTime();

    // 완료할 작업 증가
    console.log("완료할 작업 증가합니다");
    setTaskToComplete("plus");

    console.log("작업리스트와 통계를 html로 보여주기");
    showStats();
    showTaskList(true);

    console.log("스톱워치 카운트 reset 시키기");
    setStopwatchCount("reset");

    if (getLoginState()) {
        updateUser();
    }

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

// 모달관련
// pomodoro setting 열기
settingBtn.addEventListener('click', e => {
    modalBackground.classList.remove("hidden");
    settingContainer.classList.remove("hidden");
});

// pomodoro setting 닫기 - 모달창 외의 화면을 클릭
modalBackground.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    settingContainer.classList.add("hidden");
});

// pomodoro setting 닫기 - 모달창의 닫기 버튼을 클릭
settingContainerCloseBtn.addEventListener('click', e => {
    modalBackground.classList.add("hidden");
    e.target.parentNode.parentNode.parentNode.classList.add("hidden");
});

// pomodoro setting의 select박스 클릭시 optionList 열기, 닫기
selects.forEach(select => {
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

/** 마우스가 벗어났을때 optionList(세팅->시간) 닫기 */
optionLists.forEach(optionList => {
    optionList.addEventListener('mouseleave', e => {
        optionList.style.height = "0px";
        optionList.classList.add('hidden');
    });
});

/** optionTime을 선택하여 pomodoro와 breakTime을 설정 */
optionLists.forEach((optionList, i) => {
    optionList.addEventListener('click', e => {
        // e.target.innerText = "5분" , "10분"의 형태를 숫자만 뽑아서 저장한다.
        let str = e.target.innerText;
        let regex = /[^0-9]/g;
        let number = Number(str.replace(regex, ""));
        console.log("result: " + number + " /  type: "+ typeof (number));
        // i가 0이면 포모도로의 optionList, 1이면 휴식 시간의 optionList
        console.log(i);
        switch (i) {
            case 0: if (!run) {
                        console.log("포모도로 설정");
                        console.log(run);
                        min = number;
                        if (currentTaskName.getAttribute('data-key') !== null) {
                            currentTaskName.removeAttribute('data-key');
                            currentTaskName.removeAttribute('data-time');
                            currentTaskName.innerText = "새 작업을 입력해 주세요"
                        }
                        optionTime.pomodoro = number;
                        showSelectedOptionTime(i, optionTime.pomodoro);
                        showTimer(min);
                    }
                    else {
                        optionTime.pomodoro = number;
                        showSelectedOptionTime(i, optionTime.pomodoro);
                    }
                    break;
            case 1: optionTime.breakTime = number;
                    console.log("쉬는시간 설정");
                    showSelectedOptionTime(i, optionTime.breakTime);
                    break;
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

