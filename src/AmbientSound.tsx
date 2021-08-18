import { FC, useEffect } from 'react'

import { Sound } from '@babylonjs/core'
import { useScene } from 'react-babylonjs'

const AmbientSound: FC = () => {
    const scene = useScene()

    useEffect(() => {
        if (!scene) {
            return
        }

        const music = new Sound('ambient', 'ambience.mp3', scene, null, {
            loop: true,
            autoplay: true
        })

        const birdFx = new Sound('birdFx', 'birdFx.mp3', scene, null, {
            loop: true,
            autoplay: true
        })

        music.play()
        birdFx.play()
    }, [scene])

    return <></>
}

export default AmbientSound
