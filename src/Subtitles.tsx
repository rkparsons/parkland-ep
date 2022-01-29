import { FC } from 'react'

type ViewProps = {
    subtitles: string
}

const Subtitles: FC<ViewProps> = ({ subtitles }) => {
    return (
        <div className="SubtitlesContainer">
            <span className="SubtitlesText">{subtitles}</span>
        </div>
    )
}

export default Subtitles
