import { getPlatform } from '../logic/getPlatform'

export default function InstallInstructions() {
	const platform = getPlatform()
	return (
		<>
			{platform === 'android' && (
				<>
					<ol>
						<li>
							Look for and follow the prompt asking you to install or add this app to your home
							screen (usually at the bottom)
						</li>
						<li>
							If you don't see it, tap <i className="material-icons">more_vert</i> (menu), then tap
							"Add to Home Screen" or "Install".
						</li>
					</ol>
				</>
			)}
			{platform === 'ios-other' && (
				<p>
					First open this site (
					{typeof window !== undefined && (
						<a href={window.location.origin}>{window.location.origin}</a>
					)}
					) in Safari. (You can only install web apps from Safari on iOS)
				</p>
			)}
			{platform === 'ios' && (
				<>
					<ol>
						<li>
							Tap <span className="material-icons">ios_share</span> (share button)
						</li>
						<li>Choose "Add to Home Screen"</li>
						<li>Tap "Add" in the upper right corner</li>
					</ol>
				</>
			)}
			{platform === 'other' && (
				<p>
					Look for a prompt asking you to install or add this app to your home screen. If you don't
					see it, you might have to open a menu and find the option, or your browser might not
					support this feature.
				</p>
			)}
		</>
	)
}
