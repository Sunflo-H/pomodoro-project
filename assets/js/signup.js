// 아이디 이메일 형식, 아이디 중복 체크
// 비밀번호 체크
// 닉네임 중복 체크


const signUpBtn = document.querySelector('button');
const id = document.querySelector('#input-id');
const pwd = document.querySelector('#input-password');
const pwdReconfirm = document.querySelector('#input-password-reconfirm');
const nickname = document.querySelector('#input-nickname');
const email = document.querySelector('#input-email');

/*
회원이 없을때 -> 회원에 아무값이나 넣고 일단 로컬저장소에 회원 저장소 생성
회원가입 페이지 열면 회원저장소가 있든 없든 일단 불러와야해 JSON.parse로 변환해서 가져와야지

*/
// 회원이 0명, 즉 로컬저장소에 아직 회원저장공간이 없는경우에는 아무값이나 넣어서 만든다.
function createEmptyUsers() {
    if(localStorage.getItem('users') === null) {
        let arr = [];
        localStorage.setItem('users',JSON.stringify(arr));
    }
}
if(localStorage.getItem('users') === null) {
    let arr = [];
    localStorage.setItem('users',JSON.stringify(arr));
}
let users = JSON.parse(localStorage.getItem('users'));
console.log(users === []);


let check = {
    id: false,
    pwd: false,
    pwdReconfirm: false,
    nickname: false,
    email: false
};

class User {
    constructor(id, pwd, nickname, email) {
        this.id = id;
        this.pwd = pwd;
        this.nickname = nickname;
        this.email = email;
        this.stats = {
            estimatedTime: 0,
            taskToComplete: 0,
            completedTime: 0,
            completedTask: 0
        };
        this.total
        this.alarm = {
            pomodoro: "",
            break: ""
        };
        this.sumAllTimes = ""
        this.tasks = [
            {
                name: "",
                time: "",
                runTime: { current: "", max: "" },
                key: "",
                complete: "",
            }
        ];
        this.breakTime = "";
    }
}

// 공백일때 "입력해주세요" // 공백아니면 -> 중복일때 경고, 중복아닐때 통과
function passCheck(item) {
    let text;
    switch (item) {
        case id: text = "아이디"; break;
        case nickname: text = "닉네임"; break;
        case email: text = "이메일"; break;
    }
    if (item.value === "") {
        item.nextElementSibling.classList.remove('hidden');
        if (text === id) {
            item.nextElementSibling.innerText = `${text}를 입력해주세요`
        } else {
            item.nextElementSibling.innerText = `${text}을 입력해주세요`
        }
        pass = false;
    } else {
        let overlap;
        console.log(users);
        console.log(users === []);
        if (users === []) overlap = false;
        else {
            users.forEach(user => {
                switch (item) {
                    case id:    if (user.id === item.value) overlap = true; break;
                    case nickname:  if (user.nickname === item.value) overlap = true; break;
                    case email: if (user.email === item.value) overlap = true; break;
                }
            });
        }

        if (overlap) {
            item.nextElementSibling.classList.remove('hidden');
            item.nextElementSibling.innerText = `중복된 ${text}입니다.`
            switch (item) {
                case id: check.id = false; break;
                case nickname: check.nickname = false; break;
                case email: check.email = false; break;
            }
            console.log(check);
        } else {
            item.nextElementSibling.classList.add('hidden');
            switch (item) {
                case id: check.id = true; break;
                case nickname: check.nickname = true; break;
                case email: check.email = true; break;
            }
        }
    }
}

signUpBtn.addEventListener('click', e => {
    if (check.id && check.pwd && check.pwdReconfirm && check.nickname && check.email) {
        let user = new User(id.value, pwd.value, nickname.value, email.value);
        // if (users === undefined) {
        //     localStorage.setItem('users', JSON.stringify([]));
        //     users = localStorage.getItem('users');
        // }
        console.log(users);
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert("가입했습니다.");
        location.href = "/index.html";
    } else {
        console.log(check);
        alert("항목을 입력해 주세요");
    }
});


id.addEventListener('blur', e => passCheck(id));

nickname.addEventListener('blur', e => passCheck(nickname));

email.addEventListener('blur', e => passCheck(email));

pwd.addEventListener('blur', e => {
    if (pwd.value === "") {
        pwd.nextElementSibling.classList.remove('hidden');
        check.pwd = false;
    } else {
        pwd.nextElementSibling.classList.add('hidden');
        check.pwd = true;
    }
});

pwdReconfirm.addEventListener('blur', e => {
    if (pwd.value !== pwdReconfirm.value) {
        pwdReconfirm.nextElementSibling.classList.remove('hidden');
        check.pwdReconfirm = false;
    } else {
        pwdReconfirm.nextElementSibling.classList.add('hidden');
        check.pwdReconfirm = true;
    }
});


