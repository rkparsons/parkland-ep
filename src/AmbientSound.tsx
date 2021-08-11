import { FC, useEffect } from 'react'

import { Sound } from '@babylonjs/core'
import { useScene } from 'react-babylonjs'

const AmbientSound: FC = () => {
    const scene = useScene()

    useEffect(() => {
        if (!scene) {
            return
        }

        const music = new Sound('Music', 'ambience.mp3', scene, null, {
            loop: true,
            autoplay: true
        })

        music.play()
    }, [scene])

    return <></>
}

export default AmbientSound
