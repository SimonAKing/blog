(function () {
	document.addEventListener("DOMContentLoaded", function () {
		const selectors = [
			".article-card .post-title a",
			".article-card .post-meta .post-meta-category .article-category-list-link",
			".article-card .post-footer .article-tag-list-link",
			".post-content .post-more",
			".post-list .post-title a",
		];

		selectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);

			elements.forEach((element) => {
				element.addEventListener("mouseleave", function () {
					element.classList.add("hover-out");

					setTimeout(() => {
						element.classList.remove("hover-out");
					}, 500); // 与动画持续时间匹配
				});
			});
		});
	});
})();
