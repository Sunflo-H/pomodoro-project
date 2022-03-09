// 아이디 이메일 형식, 아이디 중복 체크
// 비밀번호 체크
// 닉네임 중복 체크


const signUpBtn = document.querySelector('button');
const id = document.querySelector('#input-id');
const pwd = document.querySelector('#input-password');
const pwdReconfirm = document.querySelector('#input-password-reconfirm');
const nickname = document.querySelector('#input-nickname');
const email = document.querySelector('#input-email');


let localStorageUser = JSON.parse(localStorage.getItem('users'));
let users;
if (localStorageUser !== null) {
    users = [...localStorageUser];
}

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
    }
}

// 공백일때 "입력해주세요" // 공백아니면 -> 중복일때 경고, 중복아닐때 통과
function passCheck(item) {
    let text;
    let pass;
    switch (item) {
        case id: text = "아이디"; pass = check.id; break;
        case nickname: text = "닉네임"; pass = check.nickname; break;
        case email: text = "이메일"; pass = check.email; break;
    }
    console.log(pass);
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
        if (users === undefined) overlap = false;
        else {
            users.forEach(user => {
                if (user.item === item.value) {
                    overlap = true;
                }
            });
        }

        if (overlap) {
            console.log("오버랩 트루");
            item.nextElementSibling.classList.remove('hidden');
            item.nextElementSibling.innerText = `중복된 ${text}입니다.`
            pass = false;
        } else {
            console.log("오버랩 거짓");
            item.nextElementSibling.classList.add('hidden');
            pass = true;
            console.log(pass);
            console.log(check);
        }
    }
}

signUpBtn.addEventListener('click', e => {
    if (check.id && check.pwd && check.pwdReconfirm && check.nickname && check.email) {
        let user = new User(id.value, pwd.value, nickname.value, email.value);
        if (users === undefined) {
            localStorage.setItem('users', JSON.stringify([]));
            users = localStorage.getItem('users');
        }
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


