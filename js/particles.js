// 闪烁方块网格背景效果
document.addEventListener('DOMContentLoaded', function() {
  const contentHeader = document.querySelector('.content-header');
  if (!contentHeader) return;

  // 创建canvas元素
  const canvas = document.querySelector('.flickering-grid-canvas');
  // 获取canvas 2D上下文
  const ctx = canvas.getContext('2d');

  // 设置参数
  const squareSize = 3;
  const gridGap = 5;
  const flickerChance = 0.15;
  const maxOpacity = 0.5;

  // 转换颜色为RGB
  const colorToRGB = (color) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const rgbColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const match = rgbColor.match(/\d+/g);
    if (match && match.length >= 3) {
      return `${match[0]}, ${match[1]}, ${match[2]}`;
    }
    return '80, 80, 80'; // 默认灰色
  };

  // 获取当前颜色
  let currentColor = '';
  function updateCurrentColor() {
    const computedStyle = getComputedStyle(document.documentElement);
    const themeColor = computedStyle.getPropertyValue('--theme-color').trim() || '#3273dc';
    currentColor = colorToRGB(themeColor);
    return currentColor;
  }

  // 初始更新颜色
  updateCurrentColor();

  // 监听颜色变化
  function setupColorChangeListener() {
    // 当主题颜色改变时更新方块颜色
    if (window.BLOG && typeof window.BLOG.onThemeColorChange !== 'function') {
      window.BLOG.onThemeColorChange = function(newColor) {
        document.documentElement.style.setProperty('--theme-color', newColor);
        updateCurrentColor();
      };
    }
  }

  // 网格设置
  let cols, rows;
  let squares;
  const dpr = window.devicePixelRatio || 1;

  // 设置canvas尺寸
  function resizeCanvas() {
    canvas.width = contentHeader.offsetWidth * dpr;
    canvas.height = contentHeader.offsetHeight * dpr;
    canvas.style.width = `${contentHeader.offsetWidth}px`;
    canvas.style.height = `${contentHeader.offsetHeight}px`;

    // 重新初始化网格
    init();
  }

  // 初始化
  function init() {
    cols = Math.floor(canvas.width / dpr / (squareSize + gridGap));
    rows = Math.floor(canvas.height / dpr / (squareSize + gridGap));

    squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random() * maxOpacity;
    }
  }

  // 更新方块透明度
  function updateSquares(deltaTime) {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[i] = Math.random() * maxOpacity;
      }
    }
  }

  // 绘制网格
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        ctx.fillStyle = `rgba(${currentColor}, ${opacity})`;
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  }

  // 动画循环
  let lastTime = 0;
  function animate(time) {
    const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016;
    lastTime = time;

    updateSquares(deltaTime);
    drawGrid();

    requestAnimationFrame(animate);
  }

  // 初始调整和窗口大小改变时调整
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 设置颜色变化监听器
  setupColorChangeListener();

  // 开始动画
  requestAnimationFrame(animate);
});
