export function confirmEmailTemplate(url: string) {
  return `
		<div>
			<h1>Confirm your email</h1>

			<p>
				Click the link below to confirm your account:
			</p>

			<a href="${url}">
				Confirm Email
			</a>
		</div>
	`;
}
