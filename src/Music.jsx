import React, { useEffect, useState } from 'react'

const Music = () => {
    const [list, setList] = useState(null);
    const [id, setId] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3002/music")
        .then(res => res.json())
        .then(res => setList(res))
    }, [])

    if (!list) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '7px'}}>
            <img src={list[id].img} />
            <div style={{fontSize: '17px', fontWeight: '900'}}>{list[id].title}</div>
            <div style={{fontSize: '14px'}}>{list[id].singer}</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '5px'}}>
                <img className='musicButton' src='src\images\previous.png' onClick={() => setId(prev => (prev > 0 ? prev - 1 : prev))}/>
                <img className='musicButton' src='src\images\play.png' />
                <img className='musicButton' src='src\images\next.png' onClick={() => setId(prev => (prev < 3 ? prev + 1 : prev))}/>
            </div>
        </div>
    )
}

export default Music