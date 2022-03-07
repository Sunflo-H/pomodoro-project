// 아이디 이메일 형식, 아이디 중복 체크
// 비밀번호 체크
// 닉네임 중복 체크


const signUpBtn = document.querySelector('button');
const id = document.querySelector('#input-id');
const pwd = document.querySelector('#input-password');
const pwdReconfirm = document.querySelector('#input-password-reconfirm');
const nickname = document.querySelector('#input-nickname');


let localStorageUser = JSON.parse(localStorage.getItem('users'));
let users = [...localStorageUser];

let check = {
    id: false,
    pwd: false,
    pwdReconfirm: false,
    nickname: false
};

class User {
    constructor(id, pwd, nickname) {
        this.id = id;
        this.pwd = pwd;
        this.nickname = nickname;
    }
}

signUpBtn.addEventListener('click', e => {
    if (check.id && check.pwd && check.pwdReconfirm && check.nickname) {
        let user = new User(id.value, pwd.value, nickname.value);
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert("가입했습니다.");
        location.href = "/index.html";
    } else {
        alert("항목을 입력해 주세요");
    }
});

// 공백일때 "입력해주세요" // 공백아니면 -> 중복일때 경고, 중복아닐때 통과
id.addEventListener('blur', e => {
    if (id.value === "") {
        id.nextElementSibling.classList.remove('hidden');
        id.nextElementSibling.innerText = "아이디를 입력해주세요"
        check.id = false;
    } else {
        let overlap = false;
        users.forEach(user => {
            if (user.id === id.value) {
                overlap = true;
            }
        });
        if (overlap) {
            id.nextElementSibling.classList.remove('hidden');
            id.nextElementSibling.innerText = "중복된 아이디입니다."
            check.id = false;
        } else {
            id.nextElementSibling.classList.add('hidden');
            check.id = true;
        }
    }
});

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

nickname.addEventListener('blur', e => {
    if (nickname.value === "") {
        nickname.nextElementSibling.classList.remove('hidden');
        nickname.nextElementSibling.innerText = "닉네임을 입력해주세요"
        check.nickname = false;
    } else {
        let overlap = false;
        users.forEach(user => {
            if (user.nickname === nickname.value) {
                overlap = true;
            }
        });
        if (overlap) {
            nickname.nextElementSibling.classList.remove('hidden');
            nickname.nextElementSibling.innerText = "중복된 닉네임입니다."
            check.nickname = false;
        } else {
            nickname.nextElementSibling.classList.add('hidden');
            check.nickname = true;
        }
    }
});