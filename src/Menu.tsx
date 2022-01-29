import { Engine, Sound } from '@babylonjs/core'
import { FC, MutableRefObject, useEffect, useState } from 'react'

type ViewProps = {
    audioLoops: MutableRefObject<Sound[]>
}

const Menu: FC<ViewProps> = ({ audioLoops }) => {
    const [isInitialised, setIsInitialised] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [volume, setVolume] = useState(75)

    function closeMenu() {
        setIsActive(false)

        if (!isInitialised) {
            setIsInitialised(true)
            Engine.audioEngine.unlock()
            audioLoops.current.forEach((audioLoop) => audioLoop.play(0))
        }

        Engine.audioEngine.setGlobalVolume(volume / 100)
    }

    function openMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.stopPropagation()
        setIsActive(true)
        Engine.audioEngine.setGlobalVolume(0)
    }

    useEffect(() => {
        Engine.audioEngine.setGlobalVolume(volume / 100)
    }, [volume])

    return (
        <div role="button" tabIndex={0} className="Menu" onClick={closeMenu} onKeyDown={closeMenu}>
            <div className={`Overlay ${isActive ? '' : 'FadeOut'}`}>
                <div className={`Backdrop ${isActive ? '' : 'IgnoreClick'}`} />
            </div>
            <div className="Footer">
                <b>&copy; 2022 SINE LANGUAGE RECORDS</b>
            </div>
            {isActive && (
                <>
                    <p className="StartText">Click to start</p>
                    <div className="SoundWarning">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            enableBackground="new 0 0 24 24"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                        >
                            <g>
                                <rect fill="none" height="24" width="24" />
                            </g>
                            <g>
                                <path d="M12,3c-4.97,0-9,4.03-9,9v7c0,1.1,0.9,2,2,2h4v-8H5v-1c0-3.87,3.13-7,7-7s7,3.13,7,7v1h-4v8h4c1.1,0,2-0.9,2-2v-7 C21,7.03,16.97,3,12,3z" />
                            </g>
                        </svg>
                        <span className="SoundWarningText">
                            <b>SOUND ON</b>
                        </span>
                    </div>
                </>
            )}
            {!isActive && (
                <>
                    <div className="SliderContainer">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(event) => setVolume(parseInt(event.currentTarget.value))}
                            className="Slider"
                        />
                    </div>
                    <div
                        role="button"
                        tabIndex={0}
                        className="Controls"
                        onClick={openMenu}
                        onKeyDown={() => ({})}
                    >
                        <span className="BackLink">EXIT</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default Menu
