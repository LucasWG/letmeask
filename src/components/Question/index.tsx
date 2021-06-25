import './styles.scss'

import cx from 'classnames'
import { ReactNode } from 'react'

type QuestionProps = {
	content: string
	author: {
		name: string
		avatar: string
	}
	isAnswered?: boolean
	isHighlighted?: boolean
	children?: ReactNode
}

const Question: React.FC<QuestionProps> = ({
	content,
	author,
	isAnswered = false,
	isHighlighted = false,
	children
}) => {
	return (
		<div className={cx('question', { answered: isAnswered }, { highlighted: isHighlighted && !isAnswered })}>
			<p>{content}</p>

			<footer>
				<div className="user-info">
					<img src={author.avatar} alt={author.name} />

					<span>{author.name}</span>
				</div>

				<div>{children}</div>
			</footer>
		</div>
	)
}

export default Question
