function timer() {
    // 초가 "00"이면 1초뒤에는 min이 1감소하고 sec는 59가 된다.
    if (sec === "00") {
        sec = 59 // 59
        min--;
        if (String(min).length === 1) {
            min = addChar_0(min); //01분...09분을 표현하기 위함
        }
    }
    // 초가 "01초"면 1초뒤에는 "00"초, 이때 "00 : 00 "이면 타이머 종료
    else if (sec == "01") {
        sec = "00";
        if (min == "00") {
            if (breakTimeState === false) {
                //포모도로 타이머 종료시 휴식시간으로 변경
                completePomodoro(localStorage.getItem('currentKey'));
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
            sec = addChar_0(sec); //"01"초... "09"초를 표현
        }
    }
    showTimer(min, sec);
}