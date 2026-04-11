// if(!isPhone){
/* header */
(function () { const header = document.getElementById('inner-header'), steps = 7; function threedee(e) { const x = Math.round(steps / (window.innerWidth / 2) * (window.innerWidth / 2 - e.clientX)), y = Math.round(steps / (window.innerHeight / 2) * (window.innerHeight / 2 - e.clientY)); let shadow = '', color = 190, i, tx, ty; for (i = 0; i < steps; i++) { tx = Math.round(x / steps * i); ty = Math.round(y / steps * i); if (tx || ty) { color -= 3 * i; shadow += `${tx}px ${ty}px 0 rgb(${color}, ${color}, ${color}), ` } } shadow += `${x}px ${y}px 1px rgba(0,0,0,.2), ${x * 2}px ${y * 2}px 6px rgba(0,0,0,.3)`; header.style.textShadow = shadow; header.style.webkitTransform = `translateZ(99px) rotateX(${y * 1.5}deg) rotateY(${-x * 1.5}deg)`; header.style.MozTransform = `translateZ(99px) rotateX(${y * 1.5}deg) rotateY(${-x * 1.5}deg)` } $('.content-header').on('mousemove', threedee) }());

/* 页面标题文字跳动 */
$('.archivestitle').bumpyText()

if (isHome) {
	/* 文章块滑动 */
	(function () {
		const cards = document.querySelectorAll('.article-card');
		const observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting && !entry.target.classList.contains('animation-show')) {
					entry.target.classList.add('animation-show');
					observer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -100px 0px' });

		cards.forEach(function (card) {
			card.style.visibility = 'hidden';
			observer.observe(card);
		});
	}())
}
// }
