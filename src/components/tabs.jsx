// import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import * as style from './tabs.module.scss'

const Tabs = ({ tabs }) => {
	const [selectedTab, setSelectedTab] = useState(0)
	let actualTabs = tabs.filter(tab => tab.enabled ?? true)
	// useEffect(() => {
	// 	if (actualTabs.length && selectedTab > actualTabs.length) setSelectedTab(0)
	// }, undefined)
	console.log(tabs)
	return (
		<>
			{actualTabs.length > 0 && (
				<>
					<div className={style.container}>
						{tabs.map(({ name: tab }, i) => (
							<button
								key={i}
								className={`${style.tab} ${selectedTab === i ? style.selected : null}`}
								onClick={_ => setSelectedTab(i)}
							>
								{tab}
							</button>
						))}
					</div>
					{tabs[selectedTab]?.content}
				</>
			)}
		</>
	)
}

export default Tabs
