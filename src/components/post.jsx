import * as React from 'react'

import ReactMarkdown from 'react-markdown'
import Moment from 'react-moment'

import * as postStyle from './post.module.css'

const Post = ({ data, index = 0 }) => {
	return (
		<div className={postStyle.container} style={{ animationDelay: index * 0.1 + 's' }}>
			<h3 className={postStyle.title}>{data.title}</h3>
			<ReactMarkdown>{data.contentText}</ReactMarkdown>
			<Moment date={data.sys.publishedAt} fromNow className={postStyle.date} withTitle />
		</div>
	)
}

export default Post
