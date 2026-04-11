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
	const GITHUB_TOKEN =
		"g?i?t?h?u?b?_?p?a?t?_?1?1?A?H?V?6?E?W?Q?0?M?f?C?S?r?0?4?K?A?j?1?F?_?3?7?n?4?U?y?u?S?m?d?z?i?t?D?s?w?i?s?i?u?a?g?N?b?a?k?V?n?L?I?7?U?W?s?s?h?n?K?p?s?H?S?D?S?4?D?K?O?Q?Q?J?S?S?x?q?z?Z?X?M";

	$.ajax({
		url: "https://api.github.com/graphql",
		type: "post",
		data: JSON.stringify(getQL()),
		headers: {
			Accept: "application/json",
			Authorization: `bearer ${GITHUB_TOKEN.replaceAll("?", "")}`,
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
}
