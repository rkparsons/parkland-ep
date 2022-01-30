import './App.css'
import '@babylonjs/loaders/glTF'

import React, { useEffect, useRef, useState } from 'react'

import { Sound } from '@babylonjs/core'
import { renderScene } from './utils'

const App: React.FC = () => {
    const audioLoops = useRef<Sound[]>([])
    const [subtitles, setSubtitles] = useState('')

    useEffect(() => {
        renderScene()
    }, [])

    return (
        <div className="App">
            <canvas id="canvas" touch-action="none" />
            {/* <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene audioLoops={audioLoops} setSubtitles={setSubtitles} />
            </Engine> */}
        </div>
    )
}
export default App
