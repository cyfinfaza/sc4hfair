// import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import * as style from './tabs.module.scss'

const Tabs = ({ tabs }) => {
	const [selectedTab, setSelectedTab] = useState(0)
	return (
		<>
			<div className={style.container}>
				{tabs.map(({ name: tab }, i) => (
					<button
						className={`${style.tab} ${selectedTab === i ? style.tabSelected : null}`}
						onClick={_ => setSelectedTab(i)}
					>
						{tab}
					</button>
				))}
			</div>
			{tabs[selectedTab].content}
		</>
	)
}

export default Tabs
