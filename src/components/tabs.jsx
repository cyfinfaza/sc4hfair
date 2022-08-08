// import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import * as style from './tabs.module.scss'

const Tabs = ({ tabs }) => {
	const [selectedTab, setSelectedTab] = useState(0)
	console.log(tabs)
	return (
		<>
			{tabs.filter(tab => tab.enabled).length > 0 && (
				<>
					<div className={style.container}>
						{tabs
							.filter(tab => tab.enabled)
							.map(({ name: tab }, i) => (
								<button
									key={i}
									className={`${style.tab} ${selectedTab === i ? style.selected : null}`}
									onClick={_ => setSelectedTab(i)}
								>
									{tab}
								</button>
							))}
					</div>
					{tabs[selectedTab].content}{' '}
				</>
			)}
		</>
	)
}

export default Tabs
