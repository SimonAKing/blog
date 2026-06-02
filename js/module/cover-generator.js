class CoverGenerator {
    constructor() {
        this.patterns = [
            this.generateGradient,
            this.generateGeometric,
            this.generateGrid,
            this.generateDots,
            this.generateWaves,
            this.generateHoneycomb,
            this.generateConcentric,
            this.generateCrossLines,
            this.generateBubbles,
            this.generateMosaic,
            this.generateStreamline,
            this.generateGeoGradient
        ];

        // 扩展预定义颜色组合
        this.colorPalettes = {
            cool: [
                ['#A5D8DD', '#88B8BE'],
                ['#B8D8D8', '#7A9E9F'],
                ['#B5C7E3', '#8896AC'],
                ['#89CFF0', '#5F9EA0'],  // 天空蓝系
                ['#97C1A9', '#698B69'],  // 青绿系
                ['#CCCCFF', '#9999CC']   // 薰衣草蓝
            ],
            warm: [
                ['#FFB6B9', '#FAE3D9'],
                ['#FFAAA5', '#FFD3B6'],
                ['#DCEDC1', '#FFD3B6'],
                ['#FFA07A', '#FA8072'],  // 珊瑚橙
                ['#FFB347', '#FFA07A'],  // 橙黄系
                ['#FFB6C1', '#FFA07A']   // 粉橙系
            ],
            earth: [
                ['#DDB892', '#B08968'],
                ['#A7B5A6', '#8A9B8E'],
                ['#D4C7B0', '#B6A48B'],
                ['#BC8F8F', '#996666'],  // 红褐色
                ['#DAA520', '#B8860B'],  // 金褐色
                ['#BDB76B', '#8B8B00']   // 暗金色
            ],
            pastel: [
                ['#E6B8B8', '#C8A2A2'],
                ['#B8E6CF', '#97C1A9'],
                ['#B8CCE6', '#95A8C7'],
                ['#FFE4E1', '#DEB887'],  // 柔粉系
                ['#E6E6FA', '#B0C4DE'],  // 柔紫系
                ['#F0FFF0', '#98FB98']   // 柔绿系
            ],
            vibrant: [
                ['#61C0BF', '#3B8C8C'],
                ['#FFB6B6', '#FF7676'],
                ['#B6FFB6', '#76FF76'],
                ['#FF69B4', '#FF1493'],  // 亮粉色
                ['#00FF7F', '#00FA9A'],  // 亮绿色
                ['#40E0D0', '#00CED1']   // 青绿色
            ],
            muted: [
                ['#C5D5CB', '#9FB5AA'],
                ['#E6BEAE', '#C99B89'],
                ['#DBE2EF', '#B4BFD5'],
                ['#D8BFD8', '#B57EDC'],  // 淡紫色
                ['#DEB887', '#D2B48C'],  // 淡褐色
                ['#B0E0E6', '#87CEEB']   // 粉蓝色
            ],
            sunset: [
                ['#FF9A8B', '#FF6B6B'],  // 日落红
                ['#FFC3A0', '#FFAFBD'],  // 晚霞粉
                ['#FF8C69', '#FF7F50'],  // 珊瑚橙
                ['#FFB347', '#FF8C00'],  // 橙黄
                ['#FFA07A', '#FF6347'],  // 橙红
                ['#FF8066', '#FF4D4D']   // 深红
            ],
            ocean: [
                ['#48D1CC', '#20B2AA'],  // 青绿
                ['#5F9EA0', '#4682B4'],  // 深蓝
                ['#87CEEB', '#4169E1'],  // 天蓝
                ['#00CED1', '#008B8B'],  // 深青
                ['#B0E0E6', '#87CEEB'],  // 粉蓝
                ['#40E0D0', '#00CED1']   // 绿松石
            ],
            forest: [
                ['#98FB98', '#3CB371'],  // 嫩绿
                ['#90EE90', '#32CD32'],  // 青绿
                ['#8FBC8F', '#2E8B57'],  // 深绿
                ['#9ACD32', '#6B8E23'],  // 橄榄绿
                ['#7CCD7C', '#2E8B57'],  // 森林绿
                ['#C1FFC1', '#54FF9F']   // 浅绿
            ],
            neon: [
                ['#FF1493', '#FF69B4'],  // 霓虹粉
                ['#00FF7F', '#7FFF00'],  // 霓虹绿
                ['#FF00FF', '#FF69B4'],  // 霓虹紫
                ['#00FFFF', '#00CED1'],  // 霓虹蓝
                ['#FF4500', '#FF6347'],  // 霓虹橙
                ['#7FFF00', '#00FF00']   // 霓虹黄绿
            ]
        };
    }

    // 创建多重渐变
    createMultiGradient(ctx, width, height, colors, type = 'linear') {
        if (type === 'linear') {
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color);
            });
            return gradient;
        } else if (type === 'radial') {
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) / 2
            );
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color);
            });
            return gradient;
        }
    }

    // 获取随机颜色组合（支持多色渐变）
    getRandomColors(type = null, count = 2) {
        const palette = type ?
            this.colorPalettes[type] :
            this.colorPalettes[Object.keys(this.colorPalettes)[
                Math.floor(Math.random() * Object.keys(this.colorPalettes).length)
            ]];

        if (count === 2) {
            return palette[Math.floor(Math.random() * palette.length)];
        } else {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const pair = palette[Math.floor(Math.random() * palette.length)];
                colors.push(pair[Math.floor(Math.random() * 2)]);
            }
            return colors;
        }
    }

    // 更新现有的 getRandomColorPair 方法
    getRandomColorPair(type = null) {
        return this.getRandomColors(type, 2);
    }

    // 创建渐变色
    createGradient(ctx, width, height, color1, color2, type = 'linear') {
        let gradient;
        if (type === 'linear') {
            // 随机选择渐变方向
            const directions = [
                [0, 0, width, height],    // 对角线
                [0, 0, width, 0],         // 水平
                [0, 0, 0, height],        // 垂直
                [width, 0, 0, height]     // 反对角线
            ];
            const [x1, y1, x2, y2] = directions[Math.floor(Math.random() * directions.length)];
            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        } else {
            // 径向渐变
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height) / 2;
            gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        }
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    // 生成封面图
    generate(container) {
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // 获取容器的实际大小
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * 2;  // 2倍分辨率以确保清晰度
        canvas.height = rect.height * 2;

        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2); // 提高清晰度

        // 随机选择一个图案生成器
        const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
        pattern.call(this, ctx, rect.width, rect.height);

        // 将 canvas 添加到容器中
        container.appendChild(canvas);
    }

    // 生成渐变图案
    generateGradient(ctx, width, height) {
        const types = ['cool', 'warm', 'sunset', 'ocean', 'forest', 'neon'];
        const type = types[Math.floor(Math.random() * types.length)];
        const colors = this.getRandomColors(type, 3); // 使用3色渐变

        ctx.fillStyle = this.createMultiGradient(ctx, width, height, colors);
        ctx.fillRect(0, 0, width, height);

        // 添加更多装饰效果
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * (Math.min(width, height) / 4) + Math.min(width, height) / 8;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const decorColor = this.getRandomColors(type, 1)[0];
            gradient.addColorStop(0, decorColor + '40');
            gradient.addColorStop(1, decorColor + '00');
            ctx.fillStyle = gradient;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 生成几何图案
    generateGeometric(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('warm');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const shapeColors = ['#A5D8DD', '#E8C3B9', '#C8D6B9', '#B5C7E3', '#DDB892'];

        for (let i = 0; i < 25; i++) {
            ctx.beginPath();
            const x1 = Math.random() * width;
            const y1 = Math.random() * height;
            const x2 = x1 + (Math.random() * width/4 - width/8);
            const y2 = y1 + (Math.random() * height/4 - height/8);
            const x3 = x1 + (Math.random() * width/4 - width/8);
            const y3 = y1 + (Math.random() * height/4 - height/8);

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();

            ctx.fillStyle = shapeColors[i % shapeColors.length] + 'B0';
            ctx.fill();
        }
    }

    // 生成网格图案
    generateGrid(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('earth');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const patternColors = [
            '#A5D8DD', '#E8C3B9', '#C8D6B9',
            '#B5C7E3', '#DDB892', '#B7B5E4',
            '#97C1A9', '#DACFDB', '#88B8BE'
        ];
        const bgColor = patternColors[Math.floor(Math.random() * patternColors.length)];

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const gridSize = Math.min(width, height) / 15;
        const offset = gridSize / 6;

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                if (Math.random() > 0.3) {
                    ctx.fillStyle = patternColors[Math.floor(Math.random() * patternColors.length)] + '60';
                    ctx.fillRect(
                        x + offset,
                        y + offset,
                        gridSize - offset * 2,
                        gridSize - offset * 2
                    );
                }
            }
        }
    }

    // 生成点阵图案
    generateDots(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('pastel');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const dotColors = ['#ffffff', '#f8f9fa', '#e9ecef'].map(color => color + '80');

        for (let i = 0; i < 300; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * (Math.min(width, height) / 75) + Math.min(width, height) / 150;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = dotColors[Math.floor(Math.random() * dotColors.length)];
            ctx.fill();
        }
    }

    // 生成波浪图案
    generateWaves(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('cool');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const waves = 3;
        const amplitude = height / 8;

        for (let w = 0; w < waves; w++) {
            ctx.beginPath();
            ctx.moveTo(0, height);

            // 绘制波浪路径
            for (let x = 0; x <= width; x += 10) {
                const y = height - (height / 4) +
                    Math.sin(x / (width / 4) + w) * amplitude +
                    w * (height / 8);
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();

            // 设置波浪颜色和透明度
            ctx.fillStyle = color1 + 'B0';
            ctx.fill();
        }

        // 添加一些装饰性圆点
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 4 + 2;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.2})`;
            ctx.fill();
        }
    }

    // 生成六边形蜂窝图案
    generateHoneycomb(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('muted');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2, 'radial');
        ctx.fillRect(0, 0, width, height);

        const size = Math.min(width, height) / 12;
        const h = size * Math.sqrt(3);

        for (let y = -h; y < height + h; y += h) {
            for (let x = -size; x < width + size * 2; x += size * 3) {
                this.drawHexagon(ctx, x + (y / h % 2) * size * 1.5, y, size);
                this.drawHexagon(ctx, x + size * 1.5 + (y / h % 2) * size * 1.5, y, size);
            }
        }
    }

    drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
    }

    // 生成同心圆图案
    generateConcentric(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('vibrant');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height) / 2;

        for (let r = maxRadius; r > 0; r -= maxRadius / 15) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (maxRadius - r) / maxRadius * 0.2})`;
            ctx.stroke();
        }
    }

    // 生成交叉线条图案
    generateCrossLines(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('earth');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const gap = Math.min(width, height) / 20;

        // 绘制交叉线
        for (let i = 0; i < width + height; i += gap) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(i, 0);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i, height);
            ctx.lineTo(width, i);
            ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.stroke();
        }
    }

    // 生成气泡图案
    generateBubbles(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('pastel');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2, 'radial');
        ctx.fillRect(0, 0, width, height);

        // 生成不同大小的气泡
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * (Math.min(width, height) / 15) + 5;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                x - radius/3, y - radius/3, radius/4,
                x, y, radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // 生成马赛克图案
    generateMosaic(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('vibrant');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const tileSize = Math.min(width, height) / 20;
        for (let x = 0; x < width; x += tileSize) {
            for (let y = 0; y < height; y += tileSize) {
                if (Math.random() > 0.5) {
                    const colors = Object.values(this.colorPalettes)
                        .flat()
                        .map(pair => pair[0]);
                    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + '80';
                    ctx.fillRect(x, y, tileSize - 1, tileSize - 1);
                }
            }
        }
    }

    // 生成流线型图案
    generateStreamline(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('cool');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2);
        ctx.fillRect(0, 0, width, height);

        const curves = 5;
        const points = 100;

        for (let c = 0; c < curves; c++) {
            ctx.beginPath();
            const startY = (height / curves) * c;
            ctx.moveTo(0, startY);

            for (let i = 0; i <= points; i++) {
                const x = (width / points) * i;
                const y = startY + Math.sin(i * 0.1 + c) * 30;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + c * 0.05})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // 生成几何渐变图案
    generateGeoGradient(ctx, width, height) {
        const [color1, color2] = this.getRandomColorPair('pastel');
        ctx.fillStyle = this.createGradient(ctx, width, height, color1, color2, 'radial');
        ctx.fillRect(0, 0, width, height);

        const shapes = 7;
        const angleStep = (Math.PI * 2) / shapes;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.4;

        for (let i = 0; i < shapes; i++) {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * maxRadius * 0.5;
            const y = centerY + Math.sin(angle) * maxRadius * 0.5;

            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, maxRadius * 0.8
            );

            const [c1, c2] = this.getRandomColorPair('muted');
            gradient.addColorStop(0, c1 + '40');
            gradient.addColorStop(1, c2 + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, maxRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 初始化封面生成器
window.coverGenerator = new CoverGenerator();

// 等待 DOM 完全加载后再初始化
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.canvas-cover');
    canvases.forEach(item => {
        window.coverGenerator.generate(item);
    });
});
