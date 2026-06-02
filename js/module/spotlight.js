// Spotlight hover effect for cards
const spotlight = {
  init: function() {
    this.setupSpotlights();
    // 监听主题色变化
    if (window.BLOG && typeof window.BLOG.onThemeColorChange2 !== 'function') {
      window.BLOG.onThemeColorChange2 = this.updateSpotlightColors.bind(this);
    }
  },

  // 主题色变化时更新聚光灯颜色
  updateSpotlightColors: function(themeColor) {
    if (!themeColor) return;

    const spotlights = document.querySelectorAll('.card-spotlight');
    spotlights.forEach(spotlight => {
      // 从主题色创建渐变
      spotlight.style.background = `radial-gradient(circle at center,
        ${this.hexToRgba(themeColor, 0.15)} 0%,
        ${this.hexToRgba(themeColor, 0.1)} 20%,
        ${this.hexToRgba(themeColor, 0.05)} 40%,
        ${this.hexToRgba(themeColor, 0)} 80%)`;
    });
  },

  // 辅助函数：转换十六进制颜色到rgba
  hexToRgba: function(hex, alpha = 1) {
    let r = 0, g = 0, b = 0;

    // 移除可能的#号
    if (hex.startsWith('#')) {
      hex = hex.substring(1);
    }

    // 处理简写的十六进制（如#7af）
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    }
    // 处理完整的十六进制（如#77aaff）
    else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // 获取当前主题色
  getCurrentThemeColor: function() {
    // 尝试从CSS变量中获取
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();
    if (themeColor) return themeColor;

    // 后备方案：使用默认颜色
    return '#7af';
  },

  setupSpotlights: function() {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Don't apply effect on touch devices

    // 获取当前主题色
    const themeColor = this.getCurrentThemeColor();

    // Select all cards that should have spotlight effect
    const cards = document.querySelectorAll('.article-card, .card-card');

    // Simple spring physics function
    function spring(current, target, vel, mass, stiffness, damping, dt) {
      const force = -stiffness * (current - target);
      const damperForce = -damping * vel;
      const acceleration = (force + damperForce) / mass;
      const newVel = vel + acceleration * dt;
      const newPos = current + newVel * dt;
      return { pos: newPos, vel: newVel };
    }

    cards.forEach(card => {
      // Set parent element styles if not already set
      card.style.position = 'relative';
      card.style.overflow = 'hidden';

      // Add spotlight wrapper for positioning
      const spotlightWrapper = document.createElement('div');
      spotlightWrapper.className = 'spotlight-wrapper';
      spotlightWrapper.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
        border-radius: inherit;
      `;

      // Create spotlight element
      const spotlight = document.createElement('div');
      spotlight.className = 'card-spotlight';
      spotlight.style.cssText = `
        position: absolute;
        opacity: 0;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle at center,
          ${this.hexToRgba(themeColor, 0.15)} 0%,
          ${this.hexToRgba(themeColor, 0.1)} 20%,
          ${this.hexToRgba(themeColor, 0.05)} 40%,
          ${this.hexToRgba(themeColor, 0)} 80%);
        border-radius: 50%;
        filter: blur(10px);
        mix-blend-mode: overlay;
        transition: opacity 0.3s ease;
      `;

      spotlightWrapper.appendChild(spotlight);
      card.appendChild(spotlightWrapper);

      // Spring physics parameters
      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;
      let velX = 0;
      let velY = 0;
      const mass = 1;
      const stiffness = 90;
      const damping = 15;
      const dt = 1 / 60; // for 60fps

      let isHovered = false;
      let animationFrameId = null;

      // Handle mouse events
      card.addEventListener('mouseenter', () => {
        isHovered = true;
        spotlight.style.opacity = '1';

        // Initialize at current mouse position
        const rect = card.getBoundingClientRect();
        const mouseEvent = window.event;
        if (mouseEvent) {
          mouseX = mouseEvent.clientX - rect.left;
          mouseY = mouseEvent.clientY - rect.top;
          currentX = mouseX;
          currentY = mouseY;
        }

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updateSpotlight);
        }
      });

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        spotlight.style.opacity = '0';
      });

      // Smooth animation using requestAnimationFrame with spring physics
      function updateSpotlight() {
        if (isHovered) {
          // Apply spring physics for smooth movement
          const springX = spring(currentX, mouseX, velX, mass, stiffness, damping, dt);
          const springY = spring(currentY, mouseY, velY, mass, stiffness, damping, dt);

          currentX = springX.pos;
          currentY = springY.pos;
          velX = springX.vel;
          velY = springY.vel;

          spotlight.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;

          animationFrameId = requestAnimationFrame(updateSpotlight);
        } else {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }
};

// Add to global scope for initialization
window.spotlight = spotlight;
