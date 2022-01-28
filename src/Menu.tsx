import { Engine, Sound } from '@babylonjs/core'
import { FC, MutableRefObject, useState } from 'react'

type ViewProps = {
    audioLoops: MutableRefObject<Sound[]>
}

const Menu: FC<ViewProps> = ({ audioLoops }) => {
    const [isActive, setIsActive] = useState(true)

    function closeMenu() {
        setIsActive(false)
        audioLoops.current.forEach((audioLoop) => audioLoop.play())
        Engine.audioEngine.unlock()
    }

    function openMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation()
        setIsActive(true)
        audioLoops.current.forEach((audioLoop) => audioLoop.pause())
    }

    return (
        <div role="button" tabIndex={0} className="Menu" onClick={closeMenu} onKeyDown={closeMenu}>
            <div className={`Overlay ${isActive ? '' : 'FadeOut'}`}>
                <div className={`Backdrop ${isActive ? '' : 'IgnoreClick'}`} />
                {isActive && <p className="StartText">Click to start</p>}
            </div>
            <div className="Footer">&copy; SINE LANGUAGE RECORDS</div>
            {isActive && (
                <div className="SoundWarning">
                    <svg
                        className="SoundWarningIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 24 24"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#000000"
                    >
                        <g>
                            <rect fill="none" height="24" width="24" />
                        </g>
                        <g>
                            <path d="M12,3c-4.97,0-9,4.03-9,9v7c0,1.1,0.9,2,2,2h4v-8H5v-1c0-3.87,3.13-7,7-7s7,3.13,7,7v1h-4v8h4c1.1,0,2-0.9,2-2v-7 C21,7.03,16.97,3,12,3z M7,15v4H5v-4H7z M19,19h-2v-4h2V19z" />
                        </g>
                    </svg>
                    <span className="SoundWarningText">SOUND ON</span>
                </div>
            )}
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
        </div>
    )
}

export default Menu
