const timeZones = {
    cn: 8,  // 中国
    us: -5, // 美国（东部标准时间）
    uk: 0,  // 英国（GMT）
    au: 11, // 澳洲（悉尼时间）
    fr: 1,  // 法国（CET）
    ca: -5  // 加拿大（东部标准时间）
};

// 全屏模式
document.getElementById("fullscreen-btn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// 判断是否处于夏令时（DST）
function isDST(country) {
    let now = new Date();
    let year = now.getFullYear();
    
    if (country === 'us' || country === 'ca') {
        // 美国 & 加拿大（东部时间）夏令时：3月第二个星期日2AM - 11月第一个星期日2AM
        let start = new Date(year, 2, 8, 2); // 3月8日是最早可能的第二个星期日
        let end = new Date(year, 10, 1, 2);  // 11月1日是最早可能的第一个星期日

        start.setDate(8 - start.getDay()); // 找到3月的第二个星期日
        end.setDate(1 + (7 - end.getDay()) % 7); // 找到11月的第一个星期日

        return now >= start && now < end;
    }

    if (country === 'uk') {
        // 英国夏令时（BST）：3月最后一个星期日1AM - 10月最后一个星期日2AM
        let start = new Date(year, 2, 31, 1); // 3月31日是最晚可能的最后一个星期日
        let end = new Date(year, 9, 31, 2);  // 10月31日是最晚可能的最后一个星期日

        start.setDate(31 - start.getDay()); // 找到3月的最后一个星期日
        end.setDate(31 - end.getDay()); // 找到10月的最后一个星期日

        return now >= start && now < end;
    }

    return false;
}

function createClock(countryId) {
    let clock = document.getElementById(countryId);
    let hourHand = document.createElement('div');
    let minuteHand = document.createElement('div');
    let secondHand = document.createElement('div');
    let centerDot = document.createElement('div');

    hourHand.className = 'hand h';
    minuteHand.className = 'hand m';
    secondHand.className = 'hand s';
    centerDot.className = 'center';

    clock.appendChild(hourHand);
    clock.appendChild(minuteHand);
    clock.appendChild(secondHand);
    clock.appendChild(centerDot);

    for (let i = 0; i < 12; i++) {
        let scale = document.createElement('div');
        scale.className = 'scale';
        if (i % 3 === 0) {
            scale.classList.add('big');
        }
        scale.style.transform = `rotate(${i * 30}deg)`;
        clock.appendChild(scale);
    }

    let num12 = document.createElement('div');
    let num3 = document.createElement('div');
    let num6 = document.createElement('div');
    let num9 = document.createElement('div');

    num12.className = 'number num-12';
    num3.className = 'number num-3';
    num6.className = 'number num-6';
    num9.className = 'number num-9';

    num12.innerText = '12';
    num3.innerText = '3';
    num6.innerText = '6';
    num9.innerText = '9';

    clock.appendChild(num12);
    clock.appendChild(num3);
    clock.appendChild(num6);
    clock.appendChild(num9);

    function updateClock() {
        let now = new Date();
        let utc = now.getTime() + now.getTimezoneOffset() * 60000;
        let offset = timeZones[countryId];

        // 如果国家适用夏令时并且当前是夏令时，则增加1小时
        if (isDST(countryId)) {
            offset += 1;
        }

        let localTime = new Date(utc + 3600000 * offset);
        let h = localTime.getHours() % 12;
        let m = localTime.getMinutes();
        let s = localTime.getSeconds();

        hourHand.style.transform = `translateX(-50%) rotate(${h * 30 + m / 2}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${m * 6}deg)`;
        secondHand.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;

        // 打印当前时分秒
        console.log(`[${countryId.toUpperCase()}] 时间: ${localTime.getHours().toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }

    setInterval(updateClock, 1000);
    updateClock();
}

// 创建时钟
Object.keys(timeZones).forEach(createClock);
