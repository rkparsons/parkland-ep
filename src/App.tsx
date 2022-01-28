import './App.css'
import '@babylonjs/loaders/glTF'

import React, { useEffect, useState } from 'react'

import DeerScene from './DeerScene'
import { Engine } from 'react-babylonjs'
import Menu from './Menu'

const App: React.FC = () => {
    const [isAudioInitialised, setIsAudioInitialised] = useState(false)

    useEffect(() => {
        console.log('isAudioInitialised', isAudioInitialised)
    }, [isAudioInitialised])

    return (
        <div className="App">
            <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene isAudioInitialised={isAudioInitialised} />
            </Engine>
            <Menu setIsAudioInitialised={setIsAudioInitialised} />
        </div>
    )
}
export default App
