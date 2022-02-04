import { FC, useEffect } from 'react'

import { Sound } from '@babylonjs/core'
import useAudioContext from './useAudioContext'
import { useScene } from 'react-babylonjs'

const useAmbientSound = (name: string, url: string) => {
    const scene = useScene()
    const { audioLoops } = useAudioContext()

    useEffect(() => {
        if (!scene) {
            return
        }

        const desertAmbience = new Sound(name, url, scene, null, {
            loop: true,
            autoplay: false,
            volume: 0.3
        })

        audioLoops.current.push(desertAmbience)
    }, [scene])
}

export default useAmbientSound
