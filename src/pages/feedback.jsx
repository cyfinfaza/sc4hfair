import * as React from 'react'
import Layout from '../components/layout'
import * as pageStyle from './feedback.module.css'
import { useState, useRef } from 'react'
import LinkButton from '../components/linkbutton'

export default function Feedback() {
	const [fields, setFields] = useState({
		name: '',
		email: '',
		comment: '',
	})
	const refs = {
		name: useRef(),
		email: useRef(),
		comment: useRef(),
	}
	const EditField = ({ name }) => (
		<p className={pageStyle.edit} id={name} contentEditable ref={refs[name]}>
			{/* {fields[name]} */}
		</p>
	)
	const [formSubmitted, setFormSubmitted] = useState(false)
	const [errorText, setErrorText] = useState('')
	function submit() {
		const [name, email, comment] = [
			refs.name,
			refs.email,
			refs.comment,
		].map(elem => elem.current.innerText.trim())
		if (!comment) {
			setErrorText('You must input a comment.')
			return
		}
		console.log([name, email, comment])
		let formData = new FormData()
		formData.append('entry.1901667750', name)
		formData.append('entry.614631811', email)
		formData.append('entry.1550740052', comment)

		fetch(
			'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeCrjrBodgfkJ1vFL5-fJl3k1RBx01jiF5w5V49Chc6uO_S5w/formResponse',
			{
				body: formData,
				method: 'post',
				mode: 'no-cors',
			}
		).then(response => {
			// console.log(response)
			refs.name.current.innerText = ''
			refs.email.current.innerText = ''
			refs.comment.current.innerText = ''
			setFormSubmitted(true)
		})
	}
	return (
		<Layout title="Feedback">
			<div className={pageStyle.container}>
				<div>
					<h1>Send Feedback</h1>
					{formSubmitted ? (
						<>
							<p>Form submitted.</p>
						</>
					) : (
						<>
							<h2>Name</h2>
							<EditField name="name" />
							<h2>Email</h2>
							<EditField name="email" />
							<h2>Comment</h2>
							<EditField name="comment" />
							<p style={{ color: 'red' }}>{errorText}</p>
							<LinkButton
								label="Submit"
								icon="send"
								onClick={submit}
								inline
								opaque
							/>
						</>
					)}
				</div>
			</div>
			<style>
				{`#name:empty::before {
					content: "Type your name here"
				}
				#email:empty::before {
					content: "Type your email here"
				}
				#comment:empty::before {
					content: "Type your comment here"
				}`}
			</style>
		</Layout>
	)
}
