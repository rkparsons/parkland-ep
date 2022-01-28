import './App.css'
import '@babylonjs/loaders/glTF'

import React, { useEffect, useRef, useState } from 'react'

import DeerScene from './DeerScene'
import { Engine } from 'react-babylonjs'
import Menu from './Menu'
import { Sound } from '@babylonjs/core'

const App: React.FC = () => {
    const audioLoops = useRef<Sound[]>([])

    return (
        <div className="App">
            <Engine antialias adaptToDeviceRatio canvasId="canvas">
                <DeerScene audioLoops={audioLoops} />
            </Engine>
            <Menu audioLoops={audioLoops} />
        </div>
    )
}
export default App
