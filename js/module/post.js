if (!isPhone) {
	/* 锚点点击 平滑滚动 */
	$(".post-toc-link").click(function () {
		$("html, body").animate(
			{ scrollTop: `${$($(this).attr("href")).offset().top}px` },
			600
		);
		return false;
	});
}

/* LightBox */
(function () {
	function LightBox(element) {
		this.$img = element.querySelector("img");
		this.margin = window.isPhone ? 10 : 40;
		this.title = this.$img.title || this.$img.alt || "";
		this.isZoom = false;
		let naturalW, naturalH, imgRect, docW, docH;

		// Create and append overlay when needed instead of on initialization
		this.createOverlay = function () {
			this.$overlay = document.createElement("div");
			this.$overlay.className = "lightbox-overlay";
			this.$overlay.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.8);
				z-index: 9998;
				opacity: 0;
				transition: opacity 0.3s ease;
				cursor: zoom-out;
			`;
			document.body.appendChild(this.$overlay);

			// Add click event to close lightbox when overlay is clicked
			const _this = this;
			this.$overlay.addEventListener("click", function () {
				_this.zoomOut();
			});

			setTimeout(() => {
				this.$overlay.style.opacity = "1";
			}, 10);
		};

		this.calcRect = function () {
			docW = window.innerWidth || document.documentElement.clientWidth;
			docH = window.innerHeight || document.documentElement.clientHeight;
			const inH = docH - this.margin * 2;
			const inW = docW - this.margin * 2;
			let w = naturalW;
			let h = naturalH;

			// 通用缩放逻辑 - 适用于所有设备
			// 如果图片比可视区域大，则缩小；否则保持原始大小
			const sw = w > inW ? inW / w : 1;
			const sh = h > inH ? inH / h : 1;
			const s = Math.min(sw, sh);

			w = Math.round(w * s);
			h = Math.round(h * s);

			// 返回计算后的尺寸
			return {
				w: w,
				h: h
			};
		};

		this.setImgRect = function (rect, img) {
			// 使用transform居中，这是最可靠的居中方法
			img.style.cssText = `
				position: fixed;
				width: ${rect.w}px;
				height: ${rect.h}px;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 9999;
				transition: all 0.3s ease;
				cursor: zoom-out;
				object-fit: contain;
				max-width: none;
			`;
		};

		this.addTitle = function () {
			if (!this.title) {
				return;
			}

			this.$caption = document.createElement("div");
			this.$caption.innerHTML = this.title;
			this.$caption.style.cssText = `
				position: fixed;
				bottom: 20px;
				left: 0;
				right: 0;
				text-align: center;
				color: white;
				font-size: 16px;
				z-index: 10000;
			`;
			document.body.appendChild(this.$caption);
		};

		this.removeTitle = function () {
			if (this.$caption && this.$caption.parentNode) {
				this.$caption.parentNode.removeChild(this.$caption);
				this.$caption = null;
			}
		};

		this.zoomIn = function () {
			if (this.isZoom) return;

			naturalW = this.$img.naturalWidth || this.$img.width;
			naturalH = this.$img.naturalHeight || this.$img.height;
			imgRect = this.$img.getBoundingClientRect();

			// Create the overlay
			this.createOverlay();

			// Clone the image for lightbox
			this.$clonedImg = this.$img.cloneNode(true);
			document.body.appendChild(this.$clonedImg);

			// Set initial position (from original image position)
			this.$clonedImg.style.cssText = `
				position: fixed;
				width: ${imgRect.width}px;
				height: ${imgRect.height}px;
				top: ${imgRect.top}px;
				left: ${imgRect.left}px;
				z-index: 9999;
				transition: all 0.3s ease;
			`;

			// Add title if available
			this.addTitle();

			// Set the cloned image to expand to calculated dimensions
			setTimeout(() => {
				const rect = this.calcRect();
				this.setImgRect(rect, this.$clonedImg);
				this.isZoom = true;

				// Add click event to cloned image to close
				this.$clonedImg.addEventListener("click", () => {
					this.zoomOut();
				});
			}, 10);
		};

		this.zoomOut = function () {
			if (!this.isZoom) return;

			this.isZoom = false;

			// If we have a cloned image
			if (this.$clonedImg) {
				// Recalculate the current position of the original image
				const currentImgRect = this.$img.getBoundingClientRect();

				// Animate back to current position
				this.$clonedImg.style.cssText = `
					position: fixed;
					width: ${currentImgRect.width}px;
					height: ${currentImgRect.height}px;
					top: ${currentImgRect.top}px;
					left: ${currentImgRect.left}px;
					z-index: 9999;
					transition: all 0.3s ease;
				`;

				// Fade out overlay
				if (this.$overlay) {
					this.$overlay.style.opacity = "0";
				}

				// Remove the caption
				this.removeTitle();

				// Clean up after animation completes
				setTimeout(() => {
					// Remove cloned image
					if (this.$clonedImg && this.$clonedImg.parentNode) {
						this.$clonedImg.parentNode.removeChild(this.$clonedImg);
						this.$clonedImg = null;
					}

					// Remove overlay
					if (this.$overlay && this.$overlay.parentNode) {
						this.$overlay.parentNode.removeChild(this.$overlay);
						this.$overlay = null;
					}
				}, 300);
			}
		};

		// Click handler for the original image
		const _this = this;
		element.addEventListener("click", function (e) {
			if (e.target.tagName === "IMG" && !_this.isZoom) {
				e.preventDefault();
				_this.zoomIn();
			}
		});

		// Keyboard navigation - close on ESC
		document.addEventListener("keydown", function (e) {
			if (_this.isZoom && e.key === "Escape") {
				_this.zoomOut();
			}
		});

		// Close on scroll
		window.addEventListener(
			"scroll",
			throttle(function () {
				if (_this.isZoom) {
					_this.zoomOut();
				}
			}, 150)
		);

		// Adjust on resize instead of closing
		window.addEventListener("resize", function () {
			if (_this.isZoom && _this.$clonedImg) {
				const rect = _this.calcRect();
				_this.setImgRect(rect, _this.$clonedImg);
			}
		});
	}

	// Initialize for all images with class 'img-lightbox'
	Array.prototype.forEach.call(
		document.querySelectorAll(".img-lightbox"),
		function (el) {
			new LightBox(el);
		}
	);
})();

// /* 粘贴提示 */
// const G = function (a, b, c) {
// 	function d(aa, bb) {
// 		return [
// 			'',
// 			'',
// 			`作者：${bb}`,
// 			`链接：${aa}`,
// 			'著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。'
// 		]
// 	}
// 	function f(bc, cc, m) {
// 		return `<div>${d(bc, cc).join('<br />')}${m}</div>`
// 	}
// 	function g(av) {
// 		if (!window.getSelection) {
// 			return
// 		}
// 		const m = window.getSelection().toString()
// 		if (typeof av.originalEvent.clipboardData === 'object') {
// 			if (m.length > 42) {
// 				av.originalEvent.clipboardData.setData('text/html', f(b, c))
// 				av.originalEvent.clipboardData.setData(
// 					'text/plain',
// 					m + d(b, c).join('\n')
// 				)
// 				av.preventDefault()
// 			}
// 			return
// 		}
// 		const n = $(f(b, c, m))
// 			.css({ position: 'fixed', left: '-9999px' })
// 			.appendTo('body')
// 		window.getSelection().selectAllChildren(n[0])
// 	}
// 	a.on('copy', g)
// }
// G($('.post-content p'), location.href, 'SimonAKing')

/**
 * 弹出式提示框，默认1.5秒自动消失
 * @param message 提示信息
 * @param style 提示样式，有success、danger、warning、info
 * @param time 消失时间
 */
// const tip = function (message, style, time) {
// 	style = style ? `alert-${style}` : 'alert-success'
// 	time = time || 350
// 	$('<div>')
// 		.appendTo('body')
// 		.addClass(`alert ${style}`)
// 		.html(message)
// 		.show()
// 		.delay(time)
// 		.fadeOut()
// }

// if (document.querySelector('.highlight')) {
// 	const El = document.createElement('script')
// 	El.src = 'https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js'
// 	document.body.appendChild(El)
// 	El.onload = function () {
// 		const COPY_SUCCESS = '复制成功！'
// 		const COPY_FAILURE = '复制失败！'
// 		/*页面载入完成后，创建复制按钮*/
// 		!(function (e, t, a) {
// 			/* code */
// 			const initCopyCode = function () {
// 				let copyHtml = ''
// 				copyHtml +=
// 					'<button class="btn-copy waves-block waves-effect" data-clipboard-snippet="">'
// 				copyHtml += '  <span>Copy</span>'
// 				copyHtml += '</button>'
// 				$('.highlight .code pre').before(copyHtml)
// 				const clipboard = new ClipboardJS('.btn-copy', {
// 					target: function (trigger) {
// 						return trigger.nextElementSibling
// 					}
// 				})
// 				clipboard.on('success', function (e) {
// 					tip(COPY_SUCCESS, 'success')
// 					e.clearSelection()
// 					e.preventDefault()
// 				})
// 				clipboard.on('error', function (e) {
// 					tip(COPY_FAILURE, 'danger')
// 				})
// 			}
// 			initCopyCode()
// 		})(window, document)
// 	}
// }

if (isReward) {
	// const modal = new BLOG.modal('#reward')
	// const mask = document.querySelector('#mask')
	// const rewardCode = document.querySelector('#rewardCode')
	// const rewardToggle = document.querySelector('#rewardToggle')
	// let tipFirst = false,
	// 	tipPosition = -1
	// const wechatPay = document.querySelector('.wechatPay')
	// const alipayPay = document.querySelector('.alipayPay')
	// const caret = document.querySelector('.icon-caretup')
	// const wechatImg = rewardCode.dataset.wechat
	// const alipayImg = rewardCode.dataset.alipay
	// document.querySelector('#rewardBtn').addEventListener(even, function () {
	// 	if (tipPosition === 1) {
	// 		rewardCode.src = alipayImg
	// 	} else if (tipPosition === 0) {
	// 		rewardCode.src = wechatImg
	// 	}
	// 	mask.parentNode.appendChild(document.querySelector('#reward'))
	// 	modal.toggle()
	// })
	// wechatPay.addEventListener('click', function () {
	// 	tipFirst = true
	// })
	// if (rewardToggle) {
	// 	rewardToggle.addEventListener('change', function () {
	// 		if (!this.checked) {
	// 			rewardCode.src = alipayImg
	// 			alipayPay.classList.add('show')
	// 			wechatPay.classList.remove('show')
	// 			caret.style = 'margin-left:20%;'
	// 			tipPosition = 1
	// 		} else if (!tipFirst) {
	// 			rewardCode.src = alipayImg
	// 			alipayPay.classList.add('show')
	// 			wechatPay.classList.remove('show')
	// 			caret.style = 'margin-left:20%;'
	// 			this.checked = false
	// 			tipPosition = 1
	// 		} else {
	// 			rewardCode.src = wechatImg
	// 			alipayPay.classList.remove('show')
	// 			wechatPay.classList.add('show')
	// 			caret.style = 'margin-left:-20%;'
	// 			tipPosition = 0
	// 		}
	// 	})
	// }
	// let hadLoadReward = false
	// document
	// 	.querySelector('.page-reward')
	// 	.addEventListener(isPhone ? even : 'mouseenter', function () {
	// 		if (!hadLoadReward) {
	// 			$('head').append(`<link rel="preload" href="${alipayImg}" as="image">`)
	// 			$('head').append(`<link rel="preload" href="${wechatImg}" as="image">`)
	// 			hadLoadReward = true
	// 		}
	// 	})
}

const images = Array.prototype.slice.call(
	document.querySelectorAll("img[data-original]")
);

if (images && images.length) {
	const hadLoadSymbol = Array.from({ length: images.length });

	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		const windowHeight =
			window.innerHeight || document.documentElement.clientHeight;
		const windowWidth =
			window.innerWidth || document.documentElement.clientWidth;

		// http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
		const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
		const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

		const isElementPartiallyInViewport = vertInView && horInView;
		if (isElementPartiallyInViewport) {
			return true;
		}

		return (
			rect.left >= 0 &&
			rect.top >= 0 &&
			rect.left + rect.width <= windowWidth &&
			rect.top + rect.height <= windowHeight
		);
	}
	function loadImage(el, index) {
		const img = new Image();
		const src =
			el.dataset.original ||
			"https://cdn.jsdelivr.net/gh/SimonAKing/images/404.png";
		img.src = src;
		img.onload = function () {
			el.src = src;
			hadLoadSymbol[index] = true;
		};
		img.onerror = function () {
			el.src = "https://cdn.jsdelivr.net/gh/SimonAKing/images/404.png";
			hadLoadSymbol[index] = true;
		};
	}

	function processImages() {
		for (let i = 0; i < images.length; ++i) {
			if (!hadLoadSymbol[i] && isElementInViewport(images[i])) {
				loadImage(images[i], i);
			}
		}
	}

	processImages();

	window.addEventListener("scroll", throttle(processImages, 300), false);
}
