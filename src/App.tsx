import './App.css'
import '@babylonjs/loaders/glTF'

import DeerScene from './DeerScene'
import { Engine } from 'react-babylonjs'
import Menu from './Menu'
import React from 'react'

const App: React.FC = () => {
    return (
        <div className="App">
            <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene />
            </Engine>
            <Menu />
        </div>
    )
}
export default App
