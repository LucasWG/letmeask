import '../styles/room-code.scss'

import copyImg from '../assets/images/copy.svg'

type RoomCodeProps = {
	code: string
}

const RoomCode: React.FC<RoomCodeProps> = props => {
	const copyRoomCodeToClipboard = () => {
		navigator.clipboard.writeText(props.code)
	}

	return (
		<button className="room-code" onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImg} alt="Copy room code" />
			</div>

			<span>{props.code}</span>
		</button>
	)
}

export default RoomCode
