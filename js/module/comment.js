/* eslint-disable */
var disqus_config = function () {
	this.page.url = document.URL
	this.page.identifier = document.location.origin + document.location.pathname + document.location.search
};
function loadDisqus() {
	let d = document, s = d.createElement('script')
	s.src = 'https://tomotoes-com.disqus.com/embed.js'
	s.setAttribute('data-timestamp', +new Date());
	(d.head || d.body).appendChild(s)
}

var comments = document.getElementById('comments')
var hadLoadDisqus = false
function commentsHasInViewport(param) {
	let rect = comments.getBoundingClientRect()
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) * param
	)
}

function processDisqus() {
	if (!hadLoadDisqus && commentsHasInViewport(2.5)) {
		hadLoadDisqus = true
		loadDisqus()
	}
}

processDisqus()
window.addEventListener('scroll', throttle(processDisqus, 300), false)


