# CLI 复兴 一场正在发生的商业地震

Date: 2026-03-29  
Author: SimonAKing  
Categories: 微信公众号  
Tags: 微信公众号  
Source: https://simonaking.com/blog/cli-renaissance/

> 当飞书、钉钉、Google 争先恐后发布 CLI，背后是什么一、发生了什么过去几周，三个重量级平台几乎同时出手了：飞书发布了官方 Lark CLI，钉钉开源了 dingtalk-workspace-c

---
## 一、发生了什么
过去几周，三个重量级平台几乎同时出手了：飞书发布了官方 Lark CLI，钉钉开源了 dingtalk-workspace-cli，Google 发布了带内置 MCP Server 的 Workspace CLI。

与此同时，AI 公司这边：OpenAI 有 Codex CLI，Anthropic 有 Claude Code（CLI 原生，使用量三个月增长 300%），Google 有 Gemini CLI。

两条线正在汇合。AI 需要操作世界的接口，SaaS 需要被 AI 操作的接口。CLI 是两者的交汇点。这不是巧合——这是一场结构性的转变。

## 二、五个维度理解：为什么 CLI 是 Agent 的天然接口
HackerNoon 最近有篇标题就叫 MCP Is Dead. The CLI Is Winning the AI Agent Stack。标题党了点，但方向对了。要真正理解 CLI 为什么会赢，不能只看表面的「文本输入文本输出」——需要从模型底层、训练数据、token 效率、基础设施、错误处理五个维度拆解。

*工具连接三步演进：N\*M 集成 → MCP 标准化 → 复用人类 CLI 生态*

### 2.1 训练数据偏好：LLM 天生会用 CLI
这是最容易被忽视但可能最重要的原因。LLM 是在数十亿行文本上训练出来的——其中包含海量终端交互记录：Stack Overflow 回答、GitHub 仓库、man page 文档、技术教程、CI/CD 配置。

你让 Claude 或 GPT 用 git log --oneline -10，它不需要任何 schema 就知道这条命令返回最近 10 条提交——它在训练时见过这个命令被使用了成千上万次。pytest、docker、kubectl、gh 也一样。

MCP Server 则相反。每个 MCP Server 都是模型在运行时首次见到的自定义 schema。即使描述写得再好，模型也要现场推理一个陌生接口。就像让一个精通英语的人现场读一种新造的人工语言——能猜，但肯定不如母语准确的。

New Stack 的编辑总结得到位：CLI 是你做确定性任务的地方——一个期望结果，一个合理路径。这恰恰是 LLM 在工程层面表现最好的场景。写代码时 LLM 有时候在「创作」，但敲命令行时它就是在做工程——mapping 你的自然语言到一组已有命令。

### 2.2 Token 效率：CLI 省着用，MCP 一上来就铺张
Context window 是 LLM 最稀缺的资源。每个浪费在工具 schema 上的 token，都是不能用于推理的 token。

MCP 有个结构性问题：连接 MCP Server 时，完整工具 schema 会注入 Agent 的 system prompt。一个 GitHub MCP Server 有 93 个 tool，光 schema 就消耗约 55000 token——还没问问题呢。CLI 调用就是一条 bash 命令加它的 stdout，只在实际使用时消耗 token。

实测数据很说明问题：

**CircleCI 基准测试（浏览器自动化）：**CLI 的 token 效率比 MCP 好 33%，任务完成分 77 vs 60。差距在多步调试工作流中最大——MCP 方案 context 中途耗尽，CLI 方案跑完了。

**DOM 查询对比：**MCP 的 snapshot 返回 52000 token 的 accessibility tree，CLI 两次定向查询只消耗 1200 token——43 倍效率差距。

**文件转换任务：**从 MCP Server 切到 CLI 工具，token 消耗降约 40%。Agent 有 95% 的 context window 可用于推理，一个 shot 完成整个 pipeline。

一个开发者删掉了三个 MCP Server 换成 CLI 直调。理由很直接：MCP 有 ambient token cost——工具定义必须常驻 system prompt，还没用就在吃 context。CLI 调用就是一条 bash 命令和它的 stdout，用完即走。

同样的道理解释了 Vercel 为什么把 Agent 工具从 15 个精简到 2 个后准确率从 80% 跳到 100%——更少的工具定义 \= 更多 context 留给推理。CLI 天然就是按需付费的 context 模型。

这也是为什么 Claude 大力推行 search tool 的 tool 的原因，渐进式披露都不够用了。

### 2.3 架构匹配：文本进，文本出
LLM 本质是一个文本到文本的函数。CLI 也是。这种同构意味着零转换开销。

GUI 操作需要什么？截屏 → 像素识别 → 坐标定位 → 模拟点击 → 等页面渲染 → 再截屏确认。每一步都引入延迟和错误。而且 GUI 经常改版——按钮换位置，弹窗换样式，整个自动化就崩了。

CLI 呢？输入一行文本，返回一段文本。Agent 不需要「看」任何东西。而且 CLI 的文件系统状态是二元的——文件要么写入了磁盘，要么没有；测试要么通过，要么失败。这种二元性减少了幻觉——Agent 不用猜一个变更是否生效，cat 或 ls 直接验证。

IDE 集成的 AI 工具还有个隐性开销：需要维护编辑器状态（打开了哪些文件、光标在哪、选中了什么），Cursor 每次交互都发送这些信息。CLI Agent 不追踪任何这些——读需要的文件，做需要的事，仅此而已。整个 context window 用于实际任务。

### 2.4 基础设施优势：可组合、可脚本化、可并行
Unix 哲学——小工具做一件事，管道组合——和 Agent 工作方式天然吻合。这不是比喻，是直接可用的基础设施。

**第一点：可组合。** pytest --tb=short 2>&1 | head -50 截断冗长输出。这种管道组合 LLM 在训练数据里已经学会了。MCP 响应需要 Agent 在 context 内部解析过滤——把 shell 的工作搬进了 token 里。

预测：80% 的 workflow 最终都会演变成 agentic engineering。

  

**第二点：可脚本化。** CLI Agent 可以跑在 CI/CD 管道里——bash 脚本让 Agent 每个 PR 自动审查代码、跑测试、修 lint 错误。试试用 IDE 插件做这个。CLI 让 Agent 变成工具链里的又一个 binary。

"可脚本化"这个优势背后其实藏着一个更深的东西——和大模型的算法执行策略直接相关。展开讲：

**LLM 的输出本质上就是"写代码然后执行"**

你看现在所有主流 Agent 框架在做的事：模型输出一段结构化指令（tool call），harness 解析并执行，把 stdout/stderr 喂回 context，模型再决定下一步。这就是一个 **ReAct loop**（Reason → Act → Observe → Reason）。

CLI 完美契合这个循环——模型 reason 出一条 bash 命令，shell 执行返回文本结果，模型 observe 结果再 reason 下一步。整个 loop 全是文本，零模态转换。

**更深一层：Code-as-Action 范式**

现在前沿的 Agent 设计已经从"选 tool"转向了"写代码"作为 action space。原因很简单：

传统 tool calling：模型从预定义的 tool 列表里选一个，填参数。问题是 tool 越多 context 越大、选错 tool 的概率越高（Vercel 15→2 的教训）。

Code-as-Action：模型直接输出一段可执行代码（bash/python），由 sandbox 执行。好处是 action space 理论上无限大——任何可以用代码表达的操作都能做，但不需要预先定义所有 tool。Anthropic 的 MCP 工具优化就是走这个方向——把 150000 token 的 tool schema 替换成让 Agent 直接浏览文件系统发现 API，token 从 15 万降到 2000，降了 98.7%。

CLI 天然就是 Code-as-Action 的执行层。`git log --oneline -10 | grep "fix"` 这一行就是"代码"——它表达了一个意图，由 shell 执行，返回结构化结果。模型不需要从 93 个 GitHub tool 里选一个，直接写一行命令就完事了。

  

**第三点：可并行。** 每个 Agent 独立进程，独立 context window、token 预算、工具权限。git worktree 让多个 Agent 安全并行工作在同一项目不同分支。

### 2.5 错误输出：Agent 能不能自己修，全看报错写得好不好
好的 CLI 返回的错误信息是结构化的、可解析的、可操作的——Agent 看了就知道下一步该干嘛，不需要人来手把手教。

GUI 弹个对话框说「操作失败」——Agent 不知道发生了什么。CLI 返回 ERROR: parameter --workspace-id is required. Run lark-cli workspace list to find available IDs——Agent 立刻知道下一步。

飞书 Lark CLI 在这方面做了专门优化。钉钉的 \--dry-run 更进一步——Agent 先预演一个操作看结果，再决定是否真正执行。这些不是给人类用的便利功能——它们是给 Agent 用的基础设施。

## 三、飞书、钉钉、Google：一周内的三响枪
### 3.1 飞书 Lark CLI（2026.3.28）
*飞书 Lark CLI GitHub 页面——built for humans and AI Agents，200+ commands，19 AI Agent Skills*

飞书今天正式开源 Lark CLI（@larksuite/cli），MIT 协议，Go 语言写的。把飞书 11 个业务域的能力压成 200+ 条命令：消息、文档、日历、邮箱、表格、多维表格、任务、知识库、视频会议、云空间、电子表格。

README 里的 Why lark-cli? 部分直接说明了设计哲学：

**Agent-Native Design：**19 个结构化 Skill 开箱即用，兼容 Claude Code、Cursor、Windsurf，零额外配置。

**AI-Friendly & Optimized：**每条命令都用真实 Agent 测试过，参数简洁、默认值智能、输出结构化——最大化 Agent 调用成功率。

**Three-Layer Architecture：**Shortcuts（人和 AI 都友好）→ API Commands（平台同步）→ Raw API（完整覆盖），选择合适的粒度。

**Up and Running in 3 Minutes：**一键创建应用、扫码登录、三步内完成第一次 API 调用。

53AI 创始人装好后第一件事：用 Claude Code 给 25 个员工每人发了一条个性化消息，1 分钟搞定。然后让 Agent 读多维表格生成可视化网页，再检查项目管理表格的漏填字段自动发提醒。

Wake Word 功能很有想象力——设触发词「龙虾龙虾」，开会时说「龙虾龙虾，帮我把方案整理成文档发给老板」，会后 Agent 从妙记逐字稿里识别指令自动执行。

*飞书这一步迈得很狠——传统产品看 DAU、看停留时长，都要打开 GUI 才算。CLI 开源后 Agent 通过命令行直接调用，有些时候不需要打开飞书了。传统口径日活可能会掉，但对用户的真实价值反而上升。 —— 53AI*

### 3.2 钉钉 dingtalk-workspace-cli（2026.3）
*钉钉 DWS CLI GitHub 页面——designed for both human users and AI agent scenarios，841 stars*

阿里钉钉开源 dingtalk-workspace-cli（DWS），Apache-2.0 协议，Go 语言。同样是「为人类和 AI Agent 双重设计」，覆盖日历、待办、通讯录、考勤等钉钉产品线。

**「发现驱动管道」架构：**CLI 不硬编码任何产品命令，从 MCP 注册表（mcp.dingtalk.com）动态发现服务并生成 Cobra 命令树。后端新增产品，CLI 不需要改代码——只要 MCP 注册表加了服务描述，dws 自动生成对应命令。这个设计特别优雅。

**意图决策树 + Agent Skill：**skills/ 目录下 12 个 Python 脚本，不是 API 文档，是操作指南——用决策树引导 Agent 理解用户到底想干什么。安装时自动部署到 ~/.agents/skills/dws，大多数 AI Agent 可以自动发现。

**安全 + 预览：**危险操作人类确认，批量限 30 条，\--dry-run 预览请求不执行，\-f json 全结构化输出。

钉钉 MCP 广场（mcp.dingtalk.com）是另一个值得关注的动作——把自己的 AI 表格等产品发布为 MCP Server，第三方 Agent 在 OpenClaw 里直接连接就能操作钉钉数据。

### 3.3 Google Workspace CLI（2026.3）
Google 发布开源 Workspace CLI（Apache-2.0），内置 gws mcp 命令——直接启动 MCP Server，通过 stdio 让 Claude Desktop、Gemini CLI、VS Code 等任何 MCP 客户端访问 Drive、Gmail、Calendar、Docs、Sheets。

## 四、这场 CLI 竞赛背后的商业逻辑
### 4.1 SaaS 的界面革命
过去十年，SaaS 竞争力在 UI/UX。接下来十年，可能变成 API/CLI 对 AI 的友好度。

Built In 报道 AI 已从 SaaS 股票中抹去 1 万亿美元市值。Gartner 预测到 2030 年至少 40% 的企业 SaaS 支出将转向使用量/Agent/成果定价——当 Agent 代替人操作软件，「座位数」这个定价基础就塌了。Databricks 2026 调查 multi-agent 系统四个月飙升 327%。Nvidia GTC 2026 核心论点：Agent 时代将大于 Model 时代。

*企业级 SaaS 产品正在从「给人用的 App」变成「给人和 AI 同时用的平台」。CLI 不是退回命令行时代——它是为 AI 时代重新定义了「接口」。*

### 4.2 「为 Agent 而建」成为新的产品哲学
Karpathy 2026.2 的建议：文档导出 markdown、写产品 Skill 文件、确保 CLI 对 Agent 可用。飞书做到了全部三个。

看一下飞书和钉钉的 README，两者几乎同时写了同一句话：built for humans and AI Agents / designed for both human users and AI agent scenarios。这不是巧合——这是行业共识的表达。

钉钉的发现驱动管道走得更远——连命令列表都不硬编码，从 MCP 注册表动态生成。产品侧加新功能，Agent 侧自动可用。Google 的 \--sanitize 则在提醒：当产品被 Agent 操作时，安全模型也要跟着变。

### 4.3 新的竞争格局
「谁的产品更容易被 AI 操作」变成了新的竞争维度。能被 Agent 无缝集成的产品会赢。不能被 Agent 操作的产品会在下一代工作流中被绕过。SaaS 行业正在经历一次「中间件化」——从终端用户产品变成 Agent 的后端服务。CLI 是这个转变的技术界面。

预测：Headless（无界面，inside im） 的 App 会越来越多。

## 五、几个暴论
写到这里，说几个不太舒适但可能是对的判断。

### 以后可能不存在 toD 了，只有 toA
toB、toC、toD（to Developer）——过去十年 SaaS 的分类法。但如果 Agent 成为软件的主要操作者，API 设计、SDK 设计、文档设计的受众就不再是人类开发者，而是 Agent。

飞书 Lark CLI 的 19 个 Skill 文件不是写给人看的——是写给 Claude Code 看的。钉钉的意图决策树不是帮人理解 API 的——是帮 Agent 理解用户意图的。Google 的 \--sanitize 不是防人攻击的——是防 Agent 被注入的。

如果这个趋势继续，SDK 的包名可能应该以 \-agent-sdk 结尾。README 里的 Quick Start 不再是教人怎么用，而是教 Agent 怎么调。你的竞争对手不是另一个 SaaS 产品——是另一个 SaaS 产品的 CLI 被 Agent 用得更顺手。

### DAU 这个指标可能要重新定义
如果一个用户通过 Agent 每天调你的 CLI 200 次，但从来不打开你的 App——这个用户算日活吗？如果你的投资人还在用「月活」「DAU」「留存率」这些 GUI 时代的指标评估产品，你们可能在用错误的尺子量一个新世界。

未来的度量可能是：有多少 Agent 在调你的 CLI、每天产生多少次 API 调用、Agent 的任务成功率是多少、你的错误信息有多少被 Agent 自动解决了而不需要人工干预。

### GUI 不会死，但会变成「结果展示层」
人说话，Agent 用 CLI 干活，结果呈现在 GUI 里。飞书的 Wake Word 已经在做这件事——你开会说一句话，Agent 后台通过 CLI 操作飞书，最后你在飞书 App 里看到整理好的文档。你操作的是语音，Agent 操作的是 CLI，GUI 只负责呈现。

三层各归其位：自然语言是人的接口，CLI 是 Agent 的接口，GUI 是结果的接口。

### 不做 CLI 的 SaaS 会被绕过
当 Agent 需要完成跨产品工作流——查日程、发消息、更新表格、写文档——它优先选有 CLI 或 MCP Server 的产品。没有？Agent 要么用 Computer Use 模拟鼠标点击（慢、脆弱、贵），要么绕过你用竞品。

这就是飞书和钉钉争先恐后发 CLI 的真正原因。不是因为开发者需要——是因为 Agent 需要。谁先把接口铺好，谁就在 Agent 的默认工具链里占了位置。这是一场用户入口的争夺战，只不过这次争夺的「用户」是 AI。

*CLI 复兴不是怀旧。电脑最早就是命令行的，后来有了 GUI 让普通人用上了电脑。现在 CLI 回来了——不是给人用的，是给 AI 用的。人机交互的历史走了一个螺旋：命令行 → 图形界面 → 命令行（for AI）→ 下一个是什么？也许就是三层归位：人说话，Agent 用 CLI，GUI 展示结果。那时候回头看，2026 年 3 月飞书、钉钉、Google 同时发 CLI 这件事，可能就是这场转变的起点。*

**最后：**

这两篇文章聊的都是同一件事——AI 正在改变「谁来操作软件」。开发者用 Harness 编排 Agent 写代码，SaaS 用 CLI 让 Agent 操作产品。

但我们想再往前问一步：**普通人呢？**

文章里说未来是「人说话，Agent 用 CLI 干活，GUI 展示结果」—— 而 Mana 在 iPhone 上的实现。你说话，AI 写代码，App 直接跑在你手机上，敬请期待！

---
> 本文同步自微信公众号，[点击查看原文](https://mp.weixin.qq.com/s/JN42v_WP-3w5ihZbW6ywGQ)
