import './App.css'
import '@babylonjs/loaders/glTF'
import '@babylonjs/inspector'

import React, { useRef, useState } from 'react'

import DeerScene from './DeerScene'
import { Engine } from 'react-babylonjs'
import Menu from './Menu'
import { Sound } from '@babylonjs/core'
import Subtitles from './Subtitles'

const App: React.FC = () => {
    const audioLoops = useRef<Sound[]>([])
    const [subtitles, setSubtitles] = useState('')

    return (
        <div className="App">
            <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene audioLoops={audioLoops} setSubtitles={setSubtitles} />
            </Engine>
            <Menu audioLoops={audioLoops} />
            <Subtitles subtitles={subtitles} />
        </div>
    )
}
export default App
