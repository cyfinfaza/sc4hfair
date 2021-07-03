import { createClient } from '@supabase/supabase-js'

export default class CloudInterestManager {
	constructor(sessionChangeCallback, slugListChangeCallback) {
		this.onSessionChange = sessionChangeCallback
		this.onSlugListChange = slugListChangeCallback
	}
	async init() {
		this.supabase = createClient(
			'https://gahyqgeshbvyajzukktr.supabase.co',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjIzMjcyMywiZXhwIjoxOTM3ODA4NzIzfQ.qeJRUDnHvCdSTo6LQUCbwe6XQFSLsi2l4_3oD9189u8'
		)
		window.supabase = this.supabase
		let sess = await this.supabase.auth.session()
		console.log(sess)
		this.onSessionChange(sess)
		this.refresh()
		this.supabase.auth.onAuthStateChange(async (event, sess) => {
			this.onSessionChange(sess)
			this.refresh()
		})
	}
	async refresh() {
		const sess = await this.supabase.auth.session()
		console.log(sess)
		if (sess) {
			try {
				let intent = localStorage.getItem('cim_intent')
				if (intent) {
					localStorage.removeItem('cim_intent')
					intent = JSON.parse(intent)
					if (intent.action === 'add') await this.addInterest(intent.slug)
					if (intent.action === 'remove') await this.removeInterest(intent.slug)
				}
			} catch (error) {
				console.error(error)
			}
			let { data: results, error } = await this.supabase
				.from('interests')
				.select('*')
			if (error) console.error(error)
			console.log(results)
			this.onSlugListChange(results.map(result => result.interest_slug))
		} else {
			this.onSlugListChange([])
		}
	}
	async login(provider, redirect = '/interests') {
		// const { user, session, error } = await this.supabase.auth.signIn(
		await this.supabase.auth.signIn(
			{
				provider: provider,
			},
			{
				redirectTo: window.location.origin + redirect,
			}
		)
	}
	logout() {
		this.supabase.auth.signOut()
		// window.location.reload()
	}
	async verifySession(action) {
		let sess = await this.supabase.auth.session()
		if (!sess) {
			localStorage.setItem('cim_intent', JSON.stringify(action))
			window.location = '/interests?reqLoginMessage=true'
			return false
		}
	}
	async removeInterest(slug) {
		if (!this.verifySession({ action: 'remove', slug: slug })) return
		let { error } = await this.supabase
			.from('interests')
			.delete()
			.match({ interest_slug: slug })
		if (error) console.error(error)
		this.refresh()
	}
	async addInterest(slug) {
		if (!this.verifySession({ action: 'add', slug: slug })) return
		let { error } = await this.supabase.from('interests').insert({
			interest_slug: slug,
			owner: this.supabase.auth.session().user.id,
		})
		if (error) console.error(error)
		this.refresh()
		// setTimeout(() => {
		// 	this.refresh()
		// }, 500)
	}
}
