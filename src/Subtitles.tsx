import { FC, useEffect, useState } from 'react'

type ViewProps = {
    subtitles: string
}

const Subtitles: FC<ViewProps> = ({ subtitles }) => {
    const [text, setText] = useState('')
    const isVisible = subtitles !== ''

    useEffect(() => {
        if (subtitles) {
            setText(subtitles)
        }
    }, [subtitles])

    return (
        <div className={`SubtitlesContainer ${!isVisible && 'FadeOut'}`}>
            <span className="SubtitlesText">{text}</span>
        </div>
    )
}

export default Subtitles
