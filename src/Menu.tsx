import { FC, useState } from 'react'

type ViewProps = {
    setIsAudioInitialised(isAudioInitialised: boolean): void
}

const Menu: FC<ViewProps> = ({ setIsAudioInitialised }) => {
    const [isActive, setIsActive] = useState(true)

    function closeMenu() {
        setIsActive(false)
        setIsAudioInitialised(true)
    }

    function openMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation()
        setIsActive(true)
    }

    return (
        <div role="button" tabIndex={0} className="Menu" onClick={closeMenu} onKeyDown={closeMenu}>
            <div className={`Overlay ${isActive ? '' : 'FadeOut'}`}>
                <div className={`Backdrop ${isActive ? '' : 'IgnoreClick'}`} />
                {isActive && <p className="StartText">Click to start</p>}
            </div>
            {!isActive && (
                <div
                    role="button"
                    tabIndex={0}
                    className="Controls"
                    onClick={openMenu}
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
