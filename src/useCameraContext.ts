import CameraContext from './cameraContext'
import { useContext } from 'react'

const useCameraContext = () => {
    const context = useContext(CameraContext)

    if (context === undefined) {
        throw new Error('useCameraContext must be used within a CameraProvider')
    }

    return context
}

export default useCameraContext
