document.addEventListener("DOMContentLoaded", function () {
	const isTagsPage = document.querySelector(".tags-header");
	if (!isTagsPage) return;
	function initPhysics() {
		try {
			// Wait a bit to ensure the DOM is fully rendered
			setTimeout(() => {
				// Extract Matter modules
				const Engine = Matter.Engine,
					Render = Matter.Render,
					Runner = Matter.Runner,
					Bodies = Matter.Bodies,
					Mouse = Matter.Mouse,
					MouseConstraint = Matter.MouseConstraint,
					World = Matter.World,
					Query = Matter.Query;

				const physicsContainer = document.querySelector(".physics-container");

				// Create engine and renderer
				const engine = Engine.create({
					gravity: { x: 0, y: 1 },
				});

				const render = Render.create({
					element: physicsContainer,
					engine: engine,
					options: {
						width: physicsContainer.offsetWidth,
						height: physicsContainer.offsetHeight,
						wireframes: false,
						background: "transparent",
						pixelRatio: window.devicePixelRatio || 1,
					},
				});

				// Create mouse constraint for dragging
				const mouse = Mouse.create(render.canvas);
				// Modify mouse sensitivity for better mobile experience
				mouse.pixelRatio = window.devicePixelRatio || 1;

				const mouseConstraint = MouseConstraint.create(engine, {
					mouse: mouse,
					constraint: {
						stiffness: 0.3,
						render: { visible: false },
					},
				});

				// Create walls
				const walls = [
					// Bottom wall
					Bodies.rectangle(
						physicsContainer.offsetWidth / 2,
						physicsContainer.offsetHeight + 50,
						physicsContainer.offsetWidth,
						100,
						{ isStatic: true, render: { fillStyle: "transparent" } }
					),
					// Left wall
					Bodies.rectangle(
						-50,
						physicsContainer.offsetHeight / 2,
						100,
						physicsContainer.offsetHeight,
						{ isStatic: true, render: { fillStyle: "transparent" } }
					),
					// Right wall
					Bodies.rectangle(
						physicsContainer.offsetWidth + 50,
						physicsContainer.offsetHeight / 2,
						100,
						physicsContainer.offsetHeight,
						{ isStatic: true, render: { fillStyle: "transparent" } }
					),
				];

				// Add walls to world
				World.add(engine.world, walls);
				World.add(engine.world, mouseConstraint);

				// Get all tag links
				const tagLinks = Array.from(
					physicsContainer.querySelectorAll(".tag-link")
				);
				if (tagLinks.length === 0) {
					console.error("No tag links found");
					return;
				}

				const tagBodies = [];

				// Process each tag
				tagLinks.forEach((tagLink, index) => {
					try {
						tagLink.style.position = "absolute";
						tagLink.style.margin = "0";
						tagLink.style.transform = "none";
						tagLink.style.pointerEvents = "none";
						tagLink.style.zIndex = "10";

						// Remove animation styles
						const cardCard = tagLink.querySelector(".card-card");
						if (cardCard) {
							cardCard.style.animation = "none";
							cardCard.style.margin = "0";
							cardCard.style.display = "block";

							// 添加直接点击处理，作为备选方案
							cardCard.addEventListener("click", (e) => {
								e.stopPropagation();
								const href = tagLink.getAttribute("data-href");
								if (href) {
									console.log("Direct navigation to:", href);
									window.location.href = href;
									return false;
								}
							});

							// 移动端触摸处理
							cardCard.addEventListener("touchend", (e) => {
								e.stopPropagation();
								const href = tagLink.getAttribute("data-href");
								if (href) {
									console.log("Direct touch navigation to:", href);
									window.location.href = href;
									return false;
								}
							});
						}

						// Get dimensions after it's added to the DOM
						const width = tagLink.offsetWidth || 180;
						const height = tagLink.offsetHeight || 40;

						// Create the physics body with random positions
						const x =
							Math.random() * (physicsContainer.offsetWidth - width) +
							width / 2;
						const y = Math.random() * 100 - 200 - index * 30; // Stagger the initial heights

						const body = Bodies.rectangle(x, y, width, height, {
							restitution: 0.2,
							friction: 0.3,
							frictionAir: 0.02,
							chamfer: { radius: 15 },
							mass: 2,
							render: {
								fillStyle: "transparent",
								strokeStyle: "transparent",
								lineWidth: 0,
							},
						});

						// Store the body and element for later updates
						tagBodies.push({ body, element: tagLink });

						// Add the body to the world
						World.add(engine.world, body);
					} catch (e) {
						console.error("Error creating tag body", e);
					}
				});

				// Setup mouse/touch interaction
				let isInteracting = false;
				let startTime = 0;
				let startPosition = { x: 0, y: 0 };
				let isMoving = false;

				physicsContainer.style.cursor = "default";

				// Mouse events
				render.canvas.addEventListener("mousedown", (event) => {
					// 获取相对于canvas的鼠标位置
					const rect = render.canvas.getBoundingClientRect();
					mouse.position.x = event.clientX - rect.left;
					mouse.position.y = event.clientY - rect.top;

					// Set flag to track interaction state
					isInteracting = true;
					startTime = Date.now();
					startPosition = { x: mouse.position.x, y: mouse.position.y };

					const touching =
						Query.point(engine.world.bodies, mouse.position).length > 0;
					physicsContainer.style.cursor = touching ? "grabbing" : "default";

					event.preventDefault();
				});

				render.canvas.addEventListener("mousemove", (event) => {
					// 获取相对于canvas的鼠标位置
					const rect = render.canvas.getBoundingClientRect();
					mouse.position.x = event.clientX - rect.left;
					mouse.position.y = event.clientY - rect.top;

					if (isInteracting) {
						// Check if mouse has moved enough to be considered dragging
						const distance = Math.sqrt(
							Math.pow(mouse.position.x - startPosition.x, 2) +
							Math.pow(mouse.position.y - startPosition.y, 2)
						);

						if (distance > 5) {
							isMoving = true;
						}

						// Prevent clicking on other elements during drag
						event.preventDefault();
					}

					const touching =
						Query.point(engine.world.bodies, mouse.position).length > 0;
					if (!isInteracting) {
						physicsContainer.style.cursor = touching ? "grab" : "default";
					}
				});

				render.canvas.addEventListener("mouseup", (event) => {
					// 获取相对于canvas的鼠标位置
					const rect = render.canvas.getBoundingClientRect();
					mouse.position.x = event.clientX - rect.left;
					mouse.position.y = event.clientY - rect.top;

					// Calculate total movement distance
					const endPosition = { x: mouse.position.x, y: mouse.position.y };
					const distance = Math.sqrt(
						Math.pow(endPosition.x - startPosition.x, 2) +
						Math.pow(endPosition.y - startPosition.y, 2)
					);

					const interactionDuration = Date.now() - startTime;

					// Only consider it a click if movement was minimal and duration was short
					const wasClick = !isMoving && distance < 5 && interactionDuration < 300;

					if (wasClick) {
						const bodies = Query.point(engine.world.bodies, mouse.position);
						if (bodies.length > 0) {
							// Find tag bodies (exclude walls)
							const clickedBodies = bodies.filter((body) => !body.isStatic);
							if (clickedBodies.length > 0) {
								// Find the tag element associated with this body
								const clickedTag = tagBodies.find(
									(tag) => tag.body === clickedBodies[0]
								);
								if (clickedTag) {
									// Get data-href attribute
									const href = clickedTag.element.getAttribute("data-href");
									if (href) {
										console.log("Navigation to:", href);
										window.location.href = href;
									}
								}
							}
						}
					}

					// Reset state
					isInteracting = false;
					isMoving = false;

					const touching =
						Query.point(engine.world.bodies, mouse.position).length > 0;
					physicsContainer.style.cursor = touching ? "grab" : "default";
				});

				// Touch events for mobile devices
				render.canvas.addEventListener("touchstart", (event) => {
					if (event.touches.length > 0) {
						const touch = event.touches[0];
						// 获取相对于canvas的触摸位置
						const rect = render.canvas.getBoundingClientRect();
						mouse.position.x = touch.clientX - rect.left;
						mouse.position.y = touch.clientY - rect.top;

						isInteracting = true;
						startTime = Date.now();
						startPosition = { x: mouse.position.x, y: mouse.position.y };
					}

					// Prevent default to avoid scrolling while dragging
					event.preventDefault();
				}, { passive: false });

				render.canvas.addEventListener("touchmove", (event) => {
					if (event.touches.length > 0) {
						const touch = event.touches[0];
						// 获取相对于canvas的触摸位置
						const rect = render.canvas.getBoundingClientRect();
						mouse.position.x = touch.clientX - rect.left;
						mouse.position.y = touch.clientY - rect.top;

						if (isInteracting) {
							// Check if touch has moved enough to be considered dragging
							const distance = Math.sqrt(
								Math.pow(mouse.position.x - startPosition.x, 2) +
								Math.pow(mouse.position.y - startPosition.y, 2)
							);

							if (distance > 10) { // Higher threshold for touch
								isMoving = true;
							}
						}
					}

					// Prevent default to avoid scrolling while dragging
					event.preventDefault();
				}, { passive: false });

				render.canvas.addEventListener("touchend", (event) => {
					// Calculate total movement distance
					const endPosition = { x: mouse.position.x, y: mouse.position.y };
					const distance = Math.sqrt(
						Math.pow(endPosition.x - startPosition.x, 2) +
						Math.pow(endPosition.y - startPosition.y, 2)
					);

					const interactionDuration = Date.now() - startTime;

					// Only consider it a tap if movement was minimal and duration was short
					// Higher threshold for touch compared to mouse
					const wasTap = !isMoving && distance < 15 && interactionDuration < 300;

					if (wasTap) {
						const bodies = Query.point(engine.world.bodies, mouse.position);
						if (bodies.length > 0) {
							// Find tag bodies (exclude walls)
							const clickedBodies = bodies.filter((body) => !body.isStatic);
							if (clickedBodies.length > 0) {
								// Find the tag element associated with this body
								const clickedTag = tagBodies.find(
									(tag) => tag.body === clickedBodies[0]
								);
								if (clickedTag) {
									// Get data-href attribute
									const href = clickedTag.element.getAttribute("data-href");
									if (href) {
										console.log("Navigation to:", href);
										window.location.href = href;
									}
								}
							}
						}
					}

					// Reset state
					isInteracting = false;
					isMoving = false;

					// Prevent default
					if (wasTap) {
						event.preventDefault();
					}
				}, { passive: false });

				// No need to prevent default click events now since we're using divs
				// instead of anchor tags

				// Update function to sync HTML elements with physics bodies
				function updateElements() {
					tagBodies.forEach(({ body, element }) => {
						try {
							const { x, y } = body.position;
							const angle = body.angle * (180 / Math.PI);

							element.style.transform = `translate(${
								x - element.offsetWidth / 2
							}px, ${y - element.offsetHeight / 2}px) rotate(${angle}deg)`;
						} catch (e) {
							console.error("Error updating element position", e);
						}
					});

					requestAnimationFrame(updateElements);
				}

				// Run the engine, renderer, and start updating
				Runner.run(engine);
				Render.run(render);
				updateElements();

				// Handle window resize
				window.addEventListener(
					"resize",
					debounce(() => {
						try {
							// Update canvas dimensions
							render.options.width = physicsContainer.offsetWidth;
							render.options.height = physicsContainer.offsetHeight;
							render.canvas.width = physicsContainer.offsetWidth;
							render.canvas.height = physicsContainer.offsetHeight;

							// Update wall positions
							walls[0].position.x = physicsContainer.offsetWidth / 2;
							walls[2].position.x = physicsContainer.offsetWidth + 50;

							// Reset renderer pixel ratio
							Render.setPixelRatio(render, window.devicePixelRatio || 1);
							mouse.pixelRatio = window.devicePixelRatio || 1;
						} catch (e) {
							console.error("Error during resize", e);
						}
					}, 250)
				);
			}, 100); // Small delay to ensure DOM is ready
		} catch (e) {
			console.error("Error initializing physics", e);
		}
	}

	// Simple debounce function
	function debounce(func, wait) {
		let timeout;
		return function () {
			const context = this;
			const args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(context, args), wait);
		};
	}

	initPhysics()
});
