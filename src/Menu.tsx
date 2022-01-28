import { FC, useState } from 'react'

const Menu: FC = () => {
    const [isActive, setIsActive] = useState(true)

    return (
        <div
            role="button"
            tabIndex={0}
            className="Menu"
            onClick={() => setIsActive(false)}
            onKeyDown={() => setIsActive(false)}
        >
            <div className={`Overlay ${isActive ? '' : 'FadeOut'}`}>
                <div className={`Backdrop ${isActive ? '' : 'IgnoreClick'}`} />
                {isActive && <p className="StartText">Click to start</p>}
            </div>
            {!isActive && (
                <div
                    role="button"
                    tabIndex={0}
                    className="Controls"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsActive(true)
                    }}
                    onKeyDown={() => ({})}
                >
                    <span className="BackLink">Exit</span>
                </div>
            )}
            <div className="Footer">&copy; SINE LANGUAGE RECORDS</div>
            {isActive && (
                <div className="SoundWarning">
                    <span role="img" aria-label="headphones">
                        &#127911;
                    </span>{' '}
                    SOUND ON
                </div>
            )}
        </div>
    )
}

export default Menu
