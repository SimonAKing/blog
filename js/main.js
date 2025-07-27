/* global isPhone isPost isMenuOpen Gitalk:true */
/* eslint-disable */
window.isMenuOpen = false
window.BLOG = {}
window.windowHeight = $(window).height()

const hiddenProperty =
	'hidden' in document
		? 'hidden'
		: 'webkitHidden' in document
			? 'webkitHidden'
			: 'mozHidden' in document
				? 'mozHidden'
				: null

const visibilityChangeEvent = hiddenProperty.replace(
	/hidden/i,
	'visibilitychange'
)

const throttle = function (func, wait, options) {
	let context, args, result
	let timeout = null
	let previous = 0
	if (!options) {
		options = {}
	}
	let later = function () {
		previous = options.leading === false ? 0 : new Date().getTime()
		timeout = null
		result = func.apply(context, args)
		if (!timeout) {
			context = args = null
		}
	}
	return function () {
		let now = new Date().getTime()
		if (!previous && options.leading === false) {
			previous = now
		}
		let remaining = wait - (now - previous)
		context = this
		args = arguments
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			previous = now
			result = func.apply(context, args)
			if (!timeout) {
				context = args = null
			}
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining)
		}
		return result
	}
}

Object.defineProperty(window, '_scrollTop', {
	get: function () {
		return (
			document.documentElement.scrollTop ||
			window.pageYOffset ||
			document.body.scrollTop
		)
	},
	set: function (scrollValue) {
		document.documentElement.scrollTop = scrollValue
		window.pageYOffset = scrollValue
		document.body.scrollTop = scrollValue
	}
})
	; (function (w, d) {
		const $ = d.querySelector.bind(d),
			$$ = d.querySelectorAll.bind(d),
			root = $('html'),
			gotop = $('#gotop'),
			menu = $('#menu'),
			main = $('#main'),
			header = $('#header'),
			mask = $('#mask'),
			menuToggle = $('#menu-toggle'),
			title = $('.header-title'),
			forEach = Array.prototype.forEach,
			isWX = /micromessenger/i.test(navigator.userAgent),
			noop = function () { },
			offset = function _fn(el) {
				let x = el.offsetLeft,
					y = el.offsetTop
				if (el.offsetParent) {
					const pOfs = _fn(el.offsetParent)
					x += pOfs.x
					y += pOfs.y
				}
				return { x, y }
			}
		w.even = 'ontouchstart' in w && isPhone ? 'touchstart' : 'click'

		const Blog = {
			toggleGotop: function (top) {
				if (top > w.innerHeight / 2) {
					gotop.classList.add('in')
				} else {
					gotop.classList.remove('in')
				}
			},
			toggleMenu: function (flag) {
				if (flag) {
					isMenuOpen = true
					menu.classList.remove('hide')
					if (isPhone) {
						mask.classList.add('in')
						menu.classList.add('show')
					}
					// if (isWX) {
					// 	main.classList.add('lock')
					// 	main.scrollTop = _scrollTop
					// } else {
					// 	// root.classList.add('lock')
					// }
				} else {
					mask.classList.remove('in')
					menu.classList.remove('show')

					// if (isWX) {
					// 	main.classList.remove('lock')
					// 	_scrollTop = main.scrollTop
					// } else {
					// root.classList.remove('lock')
					// }
				}
			},
			fixedHeader: function (top) {
				if (top > header.clientHeight) {
					header.classList.add('fixed')
				} else {
					header.classList.remove('fixed')
				}
			},
			toc: (function () {
				if (!isPost) {
					if (isPhone) {
						title.classList.add('toc')
					}
					return
				}
				const toc = $('#post-toc'),
					bannerH = $('.post-header').clientHeight,
					headerH = header.clientHeight,
					titles = $('#post-content').querySelectorAll('h1, h2, h3, h4, h5, h6')

				toc
					.querySelector(`a[href="#${titles[0].id}"]`)
					.parentNode.classList.add('active')
				main.classList.add('show')
				title.classList.add('toc')

				return {
					fixed: function (top) {
						if (top >= bannerH - headerH) {
							toc.classList.add('fixed')
						} else {
							toc.classList.remove('fixed')
						}
					},
					actived: function (top) {
						for (let i = 0, len = titles.length; i < len; i++) {
							if (top > offset(titles[i]).y - headerH - 5) {
								toc.querySelector('li.active').classList.remove('active')
								const active = toc.querySelector(`a[href="#${titles[i].id}"]`)
									.parentNode
								active.classList.add('active')
							}
						}
						if (top < offset(titles[0]).y) {
							toc.querySelector('li.active').classList.remove('active')
							toc
								.querySelector(`a[href="#${titles[0].id}"]`)
								.parentNode.classList.add('active')
						}
					}
				}
			})(),
			hideOnMask: [],
			modal: function (target) {
				this.$modal = $(target)
				this.$off = this.$modal.querySelector('.close')
				const that = this
				this.show = function () {
					mask.classList.add('in')
					if (!isPhone) {
						main.classList.add('Mask')
						menu.classList.add('Mask')
					}
					that.$modal.classList.add('ready')
					setTimeout(() => {
						that.$modal.classList.add('in')
					}, 10)
				}
				this.onHide = noop
				this.hide = function () {
					that.onHide()
					const isRewardModal = !!$('div.page-modal.reward-lay.ready.in')
					if (!isPhone || isRewardModal) {
						mask.classList.remove('in')
					}
					if (!isPhone) {
						main.classList.remove('Mask')
						menu.classList.remove('Mask')
					}

					that.$modal.classList.remove('in')
					setTimeout(function () {
						that.$modal.classList.remove('ready')
					}, 300)
				}
				this.toggle = function () {
					return that.$modal.classList.contains('in') ? that.hide() : that.show()
				}
				Blog.hideOnMask.push(this.hide)
				if (this.$off) {
					this.$off.addEventListener(even, this.hide)
				}
			},
			share: function () {
				const pageShare = $('#pageShare'),
					fab = $('#shareFab')
				if (fab) {
					fab.addEventListener(
						even,
						function () {
							pageShare.classList.toggle('in')
						},
						false
					)
					d.addEventListener(
						even,
						function (e) {
							if (!fab.contains(e.target)) {
								pageShare.classList.remove('in')
							}
						},
						false
					)
				}
			},
			// weixin: function () {
			// 	const modal = new this.modal('#wechat')
			// 	const wechatImg = $('#wechat_img')
			// 	$('#wechat_icon').addEventListener(even, function () {
			// 		wechatImg.src = wechatImg.dataset.img
			// 		modal.toggle()
			// 	})
			// },
			colorpicker: function () {
				var colorPicker = new iro.ColorPicker('#color-picker-container', {
					width: 200,
					color: '#7af',
					borderWidth: 6,
					borderColor: '#ccc'
				})
				colorPicker.on('color:change', function (color) {
					selectedColor = color.hexString
					changeColor(selectedColor)
					// 触发主题颜色变化事件
					if (window.BLOG && typeof window.BLOG.onThemeColorChange === 'function') {
						window.BLOG.onThemeColorChange(selectedColor)
					}
					if (window.BLOG && typeof window.BLOG.onThemeColorChange2 === 'function') {
						window.BLOG.onThemeColorChange2(selectedColor)
					}
				})
				const modal = new this.modal('#color-picker')
				$('#color-picker-icon').addEventListener(even, function () {
					modal.toggle()
				})
			},
			wechat: function () {
				const modal = new this.modal('#wechat')
				$('#link-wechat').addEventListener(even, function () {
					modal.toggle()
				})
			},
			post: function () {
				Blog.share()
			},
			scroll: function () {
				// Blog.fixedHeader(_scrollTop)
				if (isPost && !isPhone) {
					gotop && Blog.toggleGotop(_scrollTop)
					Blog.toc.fixed(_scrollTop)
					Blog.toc.actived(_scrollTop)
					isMenuOpen && (menu.classList.add('hide'), (isMenuOpen = false))
				}
			},
			page: (function () {
				const $elements = $$('.fade, .fade-scale')
				let visible = false
				return {
					loaded: function () {
						if (!document[hiddenProperty] && !Blog.page.visible) {
							Blog.scroll()

							forEach.call($elements, function (el) {
								el.classList.add('in')
							})
							Blog.page.visible = true
						}
					},
					unload: function () {
						// forEach.call($elements, function (el) {
						// 	el.classList.remove('in')
						// })
						// visible = false
					},
					visible: visible
				}
			})()
		}
		w.addEventListener('DOMContentLoaded', function () {
			Blog.page.loaded()
		})
		w.addEventListener('load', function () {
			Blog.wechat()
			Blog.colorpicker()
			isPost && setTimeout(Blog.post, 0)
			// Initialize spotlight effect
			window.spotlight && window.spotlight.init()
		})

		w.addEventListener('beforeunload', Blog.page.unload)

		w.addEventListener(visibilityChangeEvent, Blog.page.loaded)

		w.addEventListener(
			'resize',
			throttle(function () {
				window.isPhone = /Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent) || (window.innerWidth < 1300)
				even = 'ontouchstart' in w ? 'touchstart' : 'click'
				w.BLOG.even = even
				Blog.toggleMenu()
			}, 150)
		)

		gotop &&
			gotop.addEventListener(
				even,
				function () {
					window.scrollTo(0, 0)
				},
				false
			)

		menuToggle.addEventListener(
			even,
			function (e) {
				Blog.toggleMenu(true)
			},
			false
		)

		mask.addEventListener(
			even,
			function (e) {
				Blog.toggleMenu()
				Blog.hideOnMask.forEach(function (hide) {
					hide()
				})
			},
			false
		)
		w.addEventListener('scroll', throttle(Blog.scroll, 150), false)

		Blog.noop = noop
		Blog.even = even
		Blog.$ = $
		Blog.$$ = $$
		Object.keys(Blog).reduce(function (g, e) {
			g[e] = Blog[e]
			return g
		}, w.BLOG)
	})(window, document)
