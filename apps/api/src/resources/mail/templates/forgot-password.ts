export function forgotPasswordTemplate(url: string) {
  return `
		<div>
			<h1>Password recovery</h1>

			<p>
				Click the link below to reset your password:
			</p>

			<a href="${url}">
				Reset password
			</a>
		</div>
	`;
}
