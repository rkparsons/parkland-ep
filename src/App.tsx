import './App.css'
import '@babylonjs/loaders/glTF'

import DeerScene from './DeerScene'
import { Engine } from 'react-babylonjs'
import React from 'react'

const App: React.FC = () => {
    return (
        <div className="App">
            <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene />
            </Engine>
        </div>
    )
}
export default App
