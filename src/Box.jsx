import React, { useEffect, useState } from 'react'

const formatTime = (seconds) => {
    // seconds / 3600 -> 시간
    // (seconds % 3600) / 60 -> 분
    const timeString = `${String(Math.floor(seconds / 3600)).padStart(2, "0")} : 
    ${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")} : 
    ${String(seconds % 60).padStart(2, "0")}`

    return timeString;
}

const Box = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOn, setIsOn] = useState(false);
    const [stopWatch, setStopWatch] = useState(0);
    const today = new Date();

    const year = today.getFullYear();       // 년도
    const month = today.getMonth() + 1;     // 월 (0부터 시작하므로 +1 필요)
    const day = today.getDate();            // 일

    console.log(`${year}-${month}-${day}`); // 예: 2024-10-28

    useEffect(() => {
        // 1초마다 현재 시간을 업데이트하는 타이머 설정
        const timer = setInterval(() => { // 1초마다 반복
            setCurrentTime(new Date());
        }, 1000);

        // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearInterval(timer);
    }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행

    useEffect(() => {
        if (isOn) {
            // 1초마다 시간 증가
            const timer = setInterval(() => {
                setStopWatch(prev => prev + 1)
            }, 1000)

            return () => clearInterval(timer);
        }
    }, [isOn])

    return (
        <div className='box'>
            <div className='stopWatch-text'>Stopwatch</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div>{`${year}/${month}/${day}`}</div>
                <div className='currentTime'>{currentTime.toLocaleTimeString()}</div>
            </div>
            <img src='src\images\pudding.jpg' />
            <div className='stopWatch'>
                {formatTime(stopWatch)}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsOn(!isOn)}>{isOn ? "정지" : "시작"}</button>
                    <button onClick={() => {
                        setIsOn(false);
                        setStopWatch(0);
                    }}>리셋</button>
                </div>
            </div>
        </div>
    )
}

export default Box