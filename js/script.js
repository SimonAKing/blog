/* eslint-disable */

/* global Waves:true */
function getQL() {
	const ql = `
	query getRepoInfo($owner: String = "SimonAKing", $weibo: String = "weibo", $gallery: String = "gallery") {
		repository(owner: $owner, name: $weibo) {
			issues(filterBy: {createdBy: $owner, states: OPEN}) {
				totalCount
			}
		}
		repositoryOwner(login: $owner) {
			repository(name: $gallery) {
				description
			}
		}
	}
	`;
	return {
		operationName: "getRepoInfo",
		query: ql,
	};
}

function getGithubCount(successHandle, errorHandle) {
	const token = ["9c48ed2297d7d9bf9447", "6de723dbf1a6e4adeacd"];
	$.ajax({
		url: "https://api.github.com/graphql",
		type: "post",
		data: JSON.stringify(getQL()),
		headers: {
			Accept: "application/json",
			Authorization: `bearer ${token.join("")}`,
		},
		success: successHandle,
		error: errorHandle,
	});
}

function initCount() {
	let weiboCount = sessionStorage.getItem("WEIBO-COUNT");
	let photoCount = sessionStorage.getItem("PHOTO-COUNT");
	if (
		!weiboCount ||
		!photoCount ||
		weiboCount === "null" ||
		photoCount === "null"
	) {
		return getGithubCount((data) => {
			photoCount =
				data.data.repositoryOwner.repository.description.match(/\d+/)[0];
			weiboCount = data.data.repository.issues.totalCount;
			if (!photoCount || !weiboCount) {
				return;
			}
			document.getElementById("weibo-count").innerText = weiboCount;
			document.getElementById("photo-count").innerText = photoCount;
			sessionStorage.setItem("WEIBO-COUNT", weiboCount);
			sessionStorage.setItem("PHOTO-COUNT", photoCount);
		}, console.error);
	}
	document.getElementById("weibo-count").innerText = weiboCount;
	document.getElementById("photo-count").innerText = photoCount;
}

initCount();
if (window.isPost && !window.isWeibo) {
	const header = document.getElementById("header");
	const headroom = new Headroom(header, {
		classes: {
			initial: "headroom",
			pinned: "headroom--pinned",
			unpinned: "headroom--unpinned",
			top: "headroom--top",
			notTop: "headroom--not-top",
			bottom: "headroom--bottom",
			notBottom: "headroom--not-bottom",
			frozen: "headroom--frozen",
		},
		offset: 150,
		tolerance: 5,
		onUnpin: function () {
			this.elem.classList.add("headroom--pinned");
			this.elem.classList.remove("headroom--unpinned");
		},
	});
	headroom.init();

	// Check if we're already scrolled past the offset at page load
	document.addEventListener("DOMContentLoaded", () => {
		if (window.scrollY > 150) {
			header.classList.add("headroom--not-top");
			header.classList.add("headroom--pinned");
			header.classList.remove("headroom--top");
		}
	});
}

const maskEl = document.querySelector(".mask");
const setNightMode = () => {
	maskEl.classList.add("night");
	sessionStorage.setItem("night", "1");
};
const banNightMode = () => {
	maskEl.classList.remove("night");
	sessionStorage.setItem("night", "0");
};

sessionStorage.getItem("night") === "1" && setNightMode();

function switchNightMode() {
	const isNightMode = sessionStorage.getItem("night") === "1";
	isNightMode ? banNightMode() : setNightMode();
}

/*search*/
(function () {
	const G = window || this,
		even = G.BLOG.even,
		$ = G.BLOG.$,
		searchIco = $("#search"),
		searchWrap = $("#search-wrap"),
		keyInput = $("#key"),
		back = $("#back"),
		searchPanel = $("#search-panel"),
		searchResult = $("#search-result"),
		searchTpl = $("#search-tpl").innerHTML,
		JSON_DATA = "https://simonaking.com/blog/content.json";
	let searchData;
	function loadData(success) {
		if (!searchData) {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", JSON_DATA, true);
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					const res = JSON.parse(this.response);
					searchData = res instanceof Array ? res : res.posts;
					success(searchData);
				} else {
					console.error(this.statusText);
				}
			};
			xhr.onerror = function () {
				console.error(this.statusText);
			};
			xhr.send();
		} else {
			success(searchData);
		}
	}
	function tpl(html, data) {
		return html.replace(/\{\w+\}/g, function (str) {
			const prop = str.replace(/\{|\}/g, "");
			return data[prop] || "";
		});
	}
	const Control = {
		show: function () {
			searchPanel.classList.add("in");
		},
		hide: function () {
			searchPanel.classList.remove("in");
		},
	};
	function render(data) {
		let html = "";
		if (data.length) {
			html = data
				.map(function (post) {
					return tpl(searchTpl, {
						title: post.title,
						path: `/blog${post.path}`,
						date: new Date(post.date).toLocaleDateString(),
						tags: post.tags
							.map(function (tag) {
								return `<span>#${tag.name}</span>`;
							})
							.join(""),
					});
				})
				.join("");
		}
		searchResult.innerHTML = html;
	}
	function regtest(raw, regExp) {
		regExp.lastIndex = 0;
		return regExp.test(raw);
	}
	function matcher(post, regExp) {
		return (
			regtest(post.title, regExp) ||
			post.tags.some(function (tag) {
				return regtest(tag.name, regExp);
			}) ||
			regtest(post.text, regExp)
		);
	}
	function search(e) {
		const key = this.value.trim();
		if (!key) {
			return;
		}
		const regExp = new RegExp(key.replace(/[ ]/g, "|"), "gmi");
		loadData(function (data) {
			const result = data.filter(function (post) {
				return matcher(post, regExp);
			});
			render(result);
			Control.show();
		});
		e.preventDefault();
	}
	searchIco.addEventListener(even, function () {
		searchWrap.classList.toggle("in");
		keyInput.value = "";
		if (searchWrap.classList.contains("in")) {
			keyInput.focus();
		} else {
			keyInput.blur();
		}
	});
	back.addEventListener(even, function () {
		searchWrap.classList.remove("in");
		Control.hide();
	});
	document.addEventListener(even, function (e) {
		const isSearchItem =
			e.target.closest(".item") || e.target.closest("#search-result");
		const isSearchInput = e.target.id === "key";

		if (!isSearchItem && !isSearchInput && !e.target.closest("#search-panel")) {
			Control.hide();
		}
	});
	if ("ontouchstart" in window) {
		searchPanel.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		});

		searchResult.addEventListener("click", function (e) {
			const item = e.target.closest(".item");
			if (item) {
				e.stopPropagation();
				e.preventDefault();
				const path = item.getAttribute("data-path");
				if (path) {
					window.location.href = path;
				}
			}
		});
	}
	keyInput.addEventListener("input", search);
	keyInput.addEventListener(even, search);
}).call(this);

/* 文字跳动 */
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
	def: "easeOutQuad",
	easeOutCubic: function (x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
		}
		return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
	},
});
(function ($) {
	$.fn.bumpyText = function (options) {
		const defaults = {
			bounceHeight: "1.3em",
			bounceUpDuration: 500,
			bounceDownDuration: 700,
		};
		options = $.extend(defaults, options);
		return this.each(function () {
			const obj = $(this);
			if (obj.text() !== obj.html()) {
				return;
			}
			const text = obj.text();
			let newMarkup = "";
			for (let i = 0; i <= text.length; i++) {
				const character = text.slice(i, i + 1);
				newMarkup += $.trim(character)
					? `<span class="bumpy-char">${character}</span>`
					: character;
			}
			obj.html(newMarkup);
			obj.find("span.bumpy-char").each(function () {
				$(this).mouseover(function () {
					$(this).animate(
						{ bottom: options.bounceHeight },
						{
							queue: false,
							duration: options.bounceUpDuration,
							easing: "easeOutCubic",
							complete: function () {
								$(this).animate(
									{ bottom: 0 },
									{
										queue: false,
										duration: options.bounceDownDuration,
										easing: "easeOutBounce",
									}
								);
							},
						}
					);
				});
			});
		});
	};
})(jQuery);
$("#name").bumpyText();

/* Wave */
(function () {
	Waves.init();
	Waves.attach(".page-share li", ["waves-block"]);
	Waves.attach(".article-tag-list-link, #page-nav a, #page-nav span", [
		"waves-button",
	]);
})();

if (!isPhone) {
	/* 菜单栏导航 */
	(function () {
		const slidingBar = $(".sliding-bar");
		$(".nav > .items").hover(function () {
			slidingBar.offset($(this).offset());
		});
	})();

	/* cubes */
	let _slicedToArray = (function () {
		function sliceIterator(arr, i) {
			let _arr = [];
			let _n = true;
			let _d = false;
			let _e;
			try {
				for (
					var _i = arr[Symbol.iterator](), _s;
					!(_n = (_s = _i.next()).done);
					_n = true
				) {
					_arr.push(_s.value);
					if (i && _arr.length === i) {
						break;
					}
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) {
						_i["return"]();
					}
				} finally {
					if (_d) {
						throw _e;
					}
				}
			}
			return _arr;
		}
		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			}
			throw new TypeError(
				"Invalid attempt to destructure non-iterable instance"
			);
		};
	})();
	let Strut = {
		random: function random(e, t) {
			return Math.random() * (t - e) + e;
		},
		arrayRandom: function arrayRandom(e) {
			return e[Math.floor(Math.random() * e.length)];
		},
		interpolate: function interpolate(e, t, n) {
			return e * (1 - n) + t * n;
		},
		rangePosition: function rangePosition(e, t, n) {
			return (n - e) / (t - e);
		},
		clamp: function clamp(e, t, n) {
			return Math.max(Math.min(e, n), t);
		},
		queryArray: function queryArray(e, t) {
			return (
				t || (t = document.body),
				Array.prototype.slice.call(t.querySelectorAll(e))
			);
		},
		ready: function ready(e) {
			document.readyState == "complete"
				? e()
				: document.addEventListener("DOMContentLoaded", e);
		},
	};
	let reduceMotion = matchMedia("(prefers-reduced-motion)").matches;
	{
		let setState = function setState(state, speed) {
			return directions.forEach(function (axis) {
				state[axis] += speed[axis];
				if (Math.abs(state[axis]) < 360) {
					return;
				}
				let max = Math.max(state[axis], 360);
				let min = max == 360 ? Math.abs(state[axis]) : 360;
				state[axis] = max - min;
			});
		};
		let cubeIsHidden = function cubeIsHidden(left) {
			return left > parentWidth + 30;
		};
		let headerIsHidden = false;
		let template = document.getElementById("cube-template");
		let parent = document.getElementById("header-hero");
		let getParentWidth = function getParentWidth() {
			return parent.getBoundingClientRect().width;
		};
		var parentWidth = getParentWidth();
		window.addEventListener("resize", function () {
			return (parentWidth = getParentWidth());
		});
		var directions = ["x", "y"];
		let palette = {
			white: { color: [255, 255, 255], shading: [160, 190, 218] },
			orange: { color: [255, 250, 230], shading: [255, 120, 50] },
			green: { color: [205, 255, 204], shading: [0, 211, 136] },
		};
		let setCubeStyles = function setCubeStyles(_ref) {
			let cube = _ref.cube,
				size = _ref.size,
				left = _ref.left,
				top = _ref.top;
			Object.assign(cube.style, {
				width: `${size}px`,
				height: `${size}px`,
				left: `${left}px`,
				top: `${top}px`,
			});
			Object.assign(cube.querySelector(".shadow").style, {
				filter: `blur(${Math.round(size * 0.6)}px)`,
				opacity: Math.min(size / 120, 0.4),
			});
		};
		let createCube = function createCube(size) {
			let fragment = document.importNode(template.content, true);
			let cube = fragment.querySelector(".cube");
			let state = { x: 0, y: 0 };
			let speed = directions.reduce(function (object, axis) {
				let max = size > sizes.m ? 0.3 : 0.6;
				object[axis] = Strut.random(-max, max);
				return object;
			}, {});
			let sides = Strut.queryArray(".sides div", cube).reduce(function (
				object,
				side
			) {
				object[side.className] = {
					side: side,
					hidden: false,
					rotate: { x: 0, y: 0 },
				};
				return object;
			},
			{});
			sides.top.rotate.x = 90;
			sides.bottom.rotate.x = -90;
			sides.left.rotate.y = -90;
			sides.right.rotate.y = 90;
			sides.back.rotate.y = -180;
			return {
				fragment: fragment,
				cube: cube,
				state: state,
				speed: speed,
				sides: Object.values(sides),
			};
		};
		var sizes = { xs: 15, s: 25, m: 30, l: 100, xl: 120 };
		let cubes = [
			{ tint: palette.green, size: sizes.xs, left: 25, top: 315 },
			{ tint: palette.orange, size: sizes.s, left: 230, top: 535 },
			{ tint: palette.white, size: sizes.m, left: 1600, top: 250 },
		].map(function (object) {
			return Object.assign(createCube(object.size), object);
		});
		cubes.forEach(setCubeStyles);
		let getDistance = function getDistance(state, rotate) {
			return directions.reduce(function (object, axis) {
				object[axis] = Math.abs(state[axis] + rotate[axis]);
				return object;
			}, {});
		};
		let getRotation = function getRotation(state, size, rotate) {
			let axis = rotate.x ? "Z" : "Y";
			let direction = rotate.x > 0 ? -1 : 1;
			return `\n      rotateX(${state.x + rotate.x}deg)\n      rotate${axis}(${
				direction * (state.y + rotate.y)
			}deg)\n      translateZ(${size / 2}px)\n    `;
		};
		let getShading = function getShading(tint, rotate, distance) {
			let darken = directions.reduce(function (object, axis) {
				let delta = distance[axis];
				let ratio = delta / 180;
				object[axis] = delta > 180 ? Math.abs(2 - ratio) : ratio;
				return object;
			}, {});
			if (rotate.x) {
				darken.y = 0;
			} else {
				let x = distance.x;
				if (x > 90 && x < 270) {
					directions.forEach(function (axis) {
						return (darken[axis] = 1 - darken[axis]);
					});
				}
			}
			let alpha = (darken.x + darken.y) / 2;
			let blend = function blend(value, index) {
				return Math.round(Strut.interpolate(value, tint.shading[index], alpha));
			};
			let _tint$color$map = tint.color.map(blend),
				_tint$color$map2 = _slicedToArray(_tint$color$map, 3),
				r = _tint$color$map2[0],
				g = _tint$color$map2[1],
				b = _tint$color$map2[2];
			return `rgb(${r}, ${g}, ${b})`;
		};
		let shouldHide = function shouldHide(rotateX, x, y) {
			if (rotateX) {
				return x > 90 && x < 270;
			}
			if (x < 90) {
				return y > 90 && y < 270;
			}
			if (x < 270) {
				return y < 90;
			}
			return y > 90 && y < 270;
		};
		let updateSides = function updateSides(_ref2) {
			let state = _ref2.state,
				speed = _ref2.speed,
				size = _ref2.size,
				tint = _ref2.tint,
				sides = _ref2.sides,
				left = _ref2.left;
			if (headerIsHidden || cubeIsHidden(left)) {
				return;
			}
			let animate = function animate(object) {
				let side = object.side,
					rotate = object.rotate,
					hidden = object.hidden;
				let distance = getDistance(state, rotate);
				if (shouldHide(rotate.x, distance.x, distance.y)) {
					if (!hidden) {
						side.hidden = true;
						object.hidden = true;
					}
					return;
				}
				if (hidden) {
					side.hidden = false;
					object.hidden = false;
				}
				side.style.transform = getRotation(state, size, rotate);
				side.style.backgroundColor = getShading(tint, rotate, distance);
			};
			setState(state, speed);
			sides.forEach(animate);
		};
		let tick = function tick() {
			cubes.forEach(updateSides);
			if (reduceMotion) {
				return;
			}
			requestAnimationFrame(tick);
		};
		let parallaxLimit =
			document.querySelector(".bgheader").getBoundingClientRect().height + 80;
		window.addEventListener(
			"scroll",
			throttle(function () {
				let scroll = window.scrollY;
				if (scroll < parallaxLimit) {
					headerIsHidden = false;
					cubes.forEach(function (_ref3) {
						let cube = _ref3.cube,
							speed = _ref3.speed;
						return (cube.style.transform = `translateY(${
							Math.abs(speed.x * 0.5) * scroll
						}px)`);
					});
					return;
				}
				headerIsHidden = true;
			}, 150)
		);
		let container = document.createElement("div");
		container.className = "cubes";
		cubes.forEach(function (_ref4) {
			let fragment = _ref4.fragment;
			return container.appendChild(fragment);
		});
		let start = function start() {
			tick();
			parent.appendChild(container);
		};
		"requestIdleCallback" in window ? requestIdleCallback(start) : start();
	}
}
