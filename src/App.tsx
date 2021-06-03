import '@babylonjs/core/Physics/physicsEngineComponent'
import './App.css'
import '@babylonjs/loaders/glTF'

import DeerEngine from './DeerEngine'
import React from 'react'

const App: React.FC = () => {
    return (
        <div className="App">
            <DeerEngine />
        </div>
    )
}
export default App
