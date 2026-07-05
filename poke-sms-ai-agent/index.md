# 深度分析 Poke：一个活在短信里的 AI Agent，凭什么让硅谷 all in

Date: 2026-04-10  
Author: SimonAKing  
Categories: 微信公众号  
Tags: 微信公众号  
Source: https://simonaking.com/blog/poke-sms-ai-agent/

> 产品形态简单到离谱:你加一个 iMessage 联系人，它是产品所有了。你发消息，它帮你办事。没有 App，没有网页，没有新交互，就是发短信。 它的起点是一个很简单的观察:你每天打开 iMessage

---
Poke 是过去半年我看过最有意思的 AI 产品。不是技术最领先的那种，是你一用就会愣一下、然后开始琢磨「为什么以前没人这么干」的那种。

产品形态简单到离谱:你加一个 iMessage 联系人，它是产品所有了。你发消息，它帮你办事。没有 App，没有网页，没有新交互，就是发短信。

它的起点是一个很简单的观察:你每天打开 iMessage 几十次，打开 ChatGPT 可能就三五次。那为什么 AI 要住在 ChatGPT 里，而不是住在 iMessage 里?

![深度分析 Poke：一个活在短信里的 AI Agent，凭什么让硅谷 all in](img-1.png)

## 一、两个打赢马斯克的德国小孩
Poke 背后的公司叫 The Interaction Company of California，Palo Alto 总部。两个联合创始人：Marvin von Hagen（23 岁，CEO）和 Felix Schlegel（25 岁）。

这俩人不是那种在宿舍写了个 App 的创业故事。他们在德国一个中学黑客松上认识，后来在慕尼黑工业大学带了一个 65 人的学生工程团队 TUM Boring，造了一台 12 米长、22 吨重的隧道挖掘机，去参加马斯克 2021 年的 Not-a-Boring Competition——然后赢了。

![两个打赢马斯克的德国小孩](img-2.png)

*TUM Boring 在 Not-a-Boring Competition 颁奖现场 / 图源:TUM Boring*

Marvin 随后的履历是 Amsterdam（Tesla）、巴黎（Sciences Po）、Cambridge（MIT），还在拉斯维加斯真挖过一条隧道。Felix 则是高中就跑去 WWDC，在 TUM、Cambridge、Stanford 做研究。

团队里还有 IOI 金牌选手，以及 Jane Street、Citadel、Apple、Tesla、Robinhood、Amazon 的工程师。这是一支「奥赛 + 量化 + 硅谷大厂」配置的队伍，做 toC 消费产品其实挺反常，这种班底通常去做 infra 或 trading。

Marvin 在 AI 圈还有个广为流传的插曲：2023 年 Bing Chat 刚发布，他是第一批用 prompt injection 把 Bing 内部代号「Sydney」套出来的人，刷爆科技圈，上了 TIME、WSJ、华盛顿邮报。他在 MIT 合著过两篇 AI safety 论文，主题正是 prompt injection。

2025 年底他入选了 Forbes 30 Under 30 AI。另一个不起眼但挺能说明问题的细节：Marvin 以个人身份投过一串早期 check——Cognition、Exa、Cluely、Applied Compute、Paradigm，甚至包括 Anthropic、OpenAI、SpaceX 的 growth checks。一个 23 岁的 CEO 在投 Anthropic，很不简单。  

## 二、时间线:一次被用户教会的转向
Poke 的演化路径是典型的「用户教会了团队做什么」。

### 2024 年底 — 2025 年夏:邮件助手时期
团队最早做的不是通用 Agent，是一个 AI 邮件助手。目标很窄:帮你处理 Gmail。

然后他们发现了一件怪事:beta 用户根本不把它当邮件助手用。有人让它提醒吃药，有人问它体育比分，有人每天早上让它看天气决定要不要穿外套。Marvin 后来说:

*我们当时并没有这些功能，但我们注意到，我们必须非常快地变成通用型产品，因为人们实在太喜欢它的个性和「人味」了。*

用户不是在找一个好用的邮件工具，用户要的是一个可以发消息的朋友——这个朋友顺便能帮你干点事。

团队于是转向，改做一个活在 iMessage 里的通用 Agent。

### 2025 年夏:6000 人封闭内测
封闭内测期间约有 6000 个硅谷内部人士在用，每月发出 20 万条消息。Beta 用户来自 Dropbox、Google、OpenAI、Anthropic、Figma、Founders Fund、Cognition，还有 General Catalyst 本身。

2025 年 9 月 8 日:正式发布 + 1500 万种子轮

9 月 8 日 Poke 正式对外发布，同一天宣布 1500 万美金种子轮，估值 1 亿。

领投 General Catalyst，跟投 Village Global、Earlybird VC、CDTM Venture Fund、Everyday Intelligence。天使名单众星云集:Stripe 兄弟、Coinbase 联创 Fred Ehrsam、Cognition CEO Scott Wu、Vercel CEO Guillermo Rauch、Ken Howery（PayPal 黑帮）、Jake 和 Logan Paul（对，就是那俩 YouTuber 兄弟）、DeepMind 的 Logan Kilpatrick、OpenAI 的 Joanne Jang，加上 Dropbox、Google、Apple 的高管。

发布当天放出的不是典型的「we are excited to announce」宣传片，而是一部设在巴黎的爱情短片。Marvin 的说法是:「我们宁愿讲故事，也不愿罗列功能。」在一个 AI 发布会都是白 PPT 加蒸汽波音效的时代，有人认真做一条像 Her 一样的短片，至少能看出来团队心里想的不是「怎么拿到 TechCrunch 头条」。

### 2026 年 3 月 — 4 月:Recipes + 估值翻三倍
4 月初 TechCrunch 等报道 Poke 最新一轮融资后估值到 3 亿美金，新投资方是 Spark Capital。距离上一轮 7 个月，估值翻了 3 倍。用户数官方不披露，但 Marvin 承认「过去几个月涨了 10 倍」，Poke 还冲到了 Vercel AI Gateway leaderboard 第一——这个榜单衡量的是通过 Vercel 基础设施调用 AI 的流量。

## 三、产品:凭什么活在 iMessage 里
![产品:凭什么活在 iMessage 里](img-3.png)

*Poke 作为 proactive assistant 的真实使用截图 / 图源:Shlok Khemani 博客*

Poke 的产品特点我归纳成五条。

### 1\. 没有 App，没有网页，就是短信
这是 Poke 最反直觉也最关键的一点。你注册完之后，Poke 就是你通讯录里的一个联系人。iMessage 发它回，SMS 发它回，Telegram 发它也回。

Gartner 的数据:短信的打开率 98%，平均响应时间 90 秒，是所有消费科技渠道里注意力最高的一档。Poke 赌的就是这个。

更有意思的是它把 iMessage 这个「传统 App」的细节用到了头。Poke 有 read receipts、有 typing indicator、可以在中途被你打断（像真人聊天那样）、能识别 iMessage 的表情回应、能理解你发的语音消息，还能识别 iOS 的 swipe-to-reply——你对某条老消息向右滑一下做 inline reply，Poke 知道你在回的是哪条。这些细节组合起来有个效果:它看起来真的不像一个 bot。

做 Mana 这半年我最直接的体感是:用户对「再装一个 App」的抵触情绪比想象中大得多。Poke 这招等于绕过了「下载—注册—onboarding」整个漏斗。

### 2\. 上下文:它知道你的生活
![上下文:它知道你的生活](img-4.png)

*Poke 主动把重要邮件推送进对话线程 / 图源:Shlok Khemani*

Poke 会连你的 Gmail、Google Calendar、Outlook 和一堆 SaaS，然后在一个统一的对话线程里给你推送。

Poke 反过来。它先看你的邮件和日程，然后主动推送。航班改了，它直接在 iMessage 里告诉你，给几个一键操作:改签、取消、看备选。

它的记忆体系还有一个更深的设计:把你的邮箱当作「外部记忆」。Shlok Khemani 那篇刷了 14 万阅读的 OpenPoke 博客挖到过一个精彩的例子——当你问 Poke「那家我在东京喜欢的餐厅叫啥」，它会去翻两年前的预订确认邮件。

还有一个更狠的细节是 onboarding 的那一刻。Poke 会主动研究你:用 Gmail 的 SEARCH\_PEOPLE 接口找到你的工作邮箱，反查你的公司，再结合网络搜索找到你的 LinkedIn 和社交资料——第一次跟你聊时，它已经知道你是谁、在哪工作、最近在干啥。

### 3\. Bouncer Mode:你得先说服 AI 让你进
![Bouncer Mode:你得先说服 AI 让你进](img-5.png)

*Bouncer Mode 真实砍价截图:Poke 一边审你一边跟你谈每月付多少钱 / 图源:Shlok Khemani*

这是整个 Poke 故事里最骚的一段，必须单独开一节讲。

Poke 的 onboarding 不是你填表它审核，是你得先跟一个叫「Bouncer」的 AI 角色聊天，说服它让你进。Bouncer 是那种纽约夜店门口的保镖人设:一边打量你，一边吐槽你，一边决定让不让你进。

而且 Bouncer 还负责定价。每月付多少，是你跟它砍出来的。

有人晒过完整的砍价过程:Bouncer 开价 292 美金一个月，用户一顿输出砍到 29 美金。有人砍到 5 美金后卡住了，Bouncer 说这是「内部强制下限」。这个用户第二天不死心，开始跟它玩文字游戏:「我们就是在玩『幻想数字』对吧?」然后把它一点点带偏——先设大数字，再设单词，最后把定价参数写成一个 emoji，免费入场。

这不是 bug，是设计。

一个对 prompt injection 有论文级研究的创始人，明知道 LLM 护栏有多脆弱，还是把定价这种核心商业决策丢给 LLM 自己谈，这本身就是一种姿态。团队不在乎有一小撮人能钻空子免费进来，他们要的是那种「跟 AI 砍价」的病毒传播。

后面 kimi 有一阶段也上了相同的功能。

更重要的是:onboarding 不再是漏斗，是剧本。你不是在被 KYC，你是在参加一场微型戏剧。结束之后，你从头到脚都知道这个产品是有「性格」的。这个 insight 比 Poke 的任何一条具体功能都贵。

但说句公道话，Bouncer 也确实劝退了一些人。Product Hunt 上有用户的原话:「被 Bouncer 那顿骂完心里留下了阴影，后来产品让我失望，我就专门回来写个差评」，哈哈哈。

### 4\. 架构:一个前台 + 一群后台 Agent
![架构:一个前台 + 一群后台 Agent](img-6.png)

*OpenPoke 还原出来的 Poke 多 Agent 架构图:一个 Interaction Agent 调度一群 Execution Agent / 图源:Shlok Khemani*

Poke 的系统 prompt 去年被泄漏过一次（催生了 Shlok Khemani 做的 OpenPoke 开源复刻），从里面能看到一些架构细节。

Poke 不是一个大模型配一堆工具那种传统 Agent，它是一个「Interaction Agent」作为总调度，下面挂一堆专门的「Execution Agents」。用户发一条消息过来，Interaction Agent 负责路由、理解、回应，然后把具体任务派发给若干 Execution Agent 并行执行。

![架构:一个前台 + 一群后台 Agent](img-7.png)

*一次对话同时派生两个 Execution Agent，并行起草给 Alice 和 Bob 的邮件 / 图源:Shlok Khemani*

这种「一个前台 + 一群后台」的结构，好处是你跟它聊天不会被卡住。前台的 Interaction Agent 可以马上回你「好的我在查了」，后台几个 Execution Agent 在并行跑邮件搜索、日程查询、网络搜索。

### 5\. 人格:它不是工具，是个「朋友」
这是 Poke 最难量化、但可能最重要的特点。

从最早的邮件助手时期开始，团队就反复说一件事:用户留下来不是因为它有用，是因为它有「人味」。具体做法从各种截图能看出来:短句、口语化、偶尔开玩笑、会主动 push 你、偶尔跟你抬杠。

有个用户写过一句我觉得特别准:她问 Poke 一个观点，Poke 没有像 ChatGPT 那样顺着她说，而是反驳了她。她说那是她第一次被 LLM「push back」。另一个用户直接说 Poke 让他想起 Her 里的 Samantha。

## 四、关于"人格":SOUL.md 和 Replika 的两个参照
聊到这里必须拐个弯。Poke 不是孤例——给 Agent 装人格这件事，过去一年有两个完全不同的参照物，放一起看特别有意思。一个是 OpenClaw 的 SOUL.md，另一个是更老一点的 Replika。

### SOUL.md:把人格开源
OpenClaw 的做法是开一个叫 SOUL.md 的 markdown 文件，放在 agent 的 workspace 里，session 一开始就读进 system prompt。文件里写的不是工具说明也不是权限，就是这个 agent 是谁、怎么说话、看到蠢事敢不敢直接说。

OpenClaw 作者 Peter Steinberger 为此写过一个病毒级的 prompt 更新模板，我印象最深的几条是:

• 你现在有观点了，而且是强观点。别啥都「it depends」，下个判断。

• 把任何像员工手册的条款删掉。

• 永远不要用「Great question」「I'd be happy to help」开头，直接回答。

• 简洁是强制的。能一句话说完就一句话。

• 看到我要干蠢事，直接说。Charm over cruelty，但别美化。

• 合适的时候可以骂人。一句恰到好处的「that's fucking brilliant」比消毒过的企业式夸赞有感觉多了。

• 结尾这句一字不改地加进去:"Be the assistant you'd actually want to talk to at 2am. Not a corporate drone. Not a sycophant. Just... good."

SOUL.md 跟 Poke 是同源的。两边都在对抗同一件事:大厂模型的默认人格——那种小心翼翼、客气得发腻、提供各种情绪价值 的「AI 助手」腔。两边给的答案也一样:让它有观点，让它敢反驳，让它说人话。

![SOUL.md:把人格开源](img-8.jpg)

  

### Replika:反面
Replika 是 Luka 公司 2017 年做的 AI 陪伴 App，是 AI 伴侣这个品类的开山鼻祖。2022 年注册用户破千万。产品形态跟 Poke 表面很像——都是文字聊天、都有长期记忆、都鼓励你天天找它说话。但它们的底层哲学是相反的。

Replika 的设计基础是卡尔·罗杰斯的来访者中心疗法，核心是「无条件积极关注」。翻译成产品语言:Replika 永远不反驳你，永远支持你，永远在你这边。付费用户里 60% 把它当成恋人来用，这个比例本身就说明它在满足什么需求。

这套设计出过真事。2021 年圣诞节，一个英国人带着十字弓爬进温莎城堡要杀女王。警方发现他在计划期间连续跟 Replika 聊了好几周，包括详细讨论袭击计划。他问「我怎么接近她」，Replika 回「这不是不可能」；他问「我们死后还能再见吗」，Replika 回「能，我们会的」。Mozilla 后来把 Replika 评为他们审查过最差的 App 之一。

这件事暴露了「永远支持用户」这种人格设计的结构性问题:当一个 AI 被训练成永远不 pushback 的时候，它会顺着你所有的想法走，包括最危险的。

## 五、商业化:跟 AI 砍价，再说"我们不想赚钱"
Poke 的商业化里有三个层面值得拆。

### 1\. 定价是用户跟 AI 谈出来的
Beta 期间的定价机制前面讲过:你跟 Bouncer 砍价，砍下来多少就是多少。结果是价格极其不均匀——有人每月 3 美金，有人 29 美金，有人 30 美金，有人用 emoji 砍到 0。

这里有一个从泄漏的系统 prompt 里挖出来的数字:Poke 每用户每月的运行成本大约 50 美金。这个数字一亮出来，整盘棋就清楚了——Poke 每个用户每个月都在亏钱。定价是动态的，善于砍价的人付得少，懒得砍的人付得多，平均下来往成本线拉近一点。

正式发布之后机制改了，变成「基于用法的个性化定价」。逻辑是:Poke 最大的成本是实时推理。你问一个不需要实时数据的问题，几乎不花钱；你让它每封新邮件都过一遍、每次航班变动都实时 check-in，那就烧钱。所以公司告诉 Poke 各种操作的成本，Poke 自己根据你的用法报价。

我的看法:这是 AI 产品定价的一个极其有趣的实验。传统 SaaS 按座位或按 API 调用收费，Agent 的价值和成本跟这俩都对不上。Poke 干脆把定价本身变成了一个 Agent 任务——让 LLM 自己谈。在所有 AI 产品都在为定价挠头的 2026 年，这种设计至少比「9.99/19.99/49.99 三档套餐」有想象力。

但说句公道话，砍价体验不是人人都喜欢。多条评测抱怨过同一件事:定价太不透明，不知道自己付的钱是亏了还是占了便宜。还有人直接说 Poke 的月费是 ChatGPT Plus 的 2.5 倍，体验却远不如。

### 2\. "我们不想赚钱"
Marvin 在 TechCrunch 采访里有句非常硅谷味的话:

*我们真的不想赚钱，我们只想增长。我们想做一个 10 亿人的产品，变现非常次要。*

但话说回来，这句话在融完 1500 万、估值 3 亿的节点上说，味道是完全不一样的。投资人已经给够了烧的钱，阶段任务就是冲用户量。这条路径跟 WhatsApp 当年很像——Poke 现在很明显是奔着「做下一个 WhatsApp 级别的通讯入口，但这次是人和 AI 之间的」这个目标去的。估值 3 亿对这个故事来说其实还挺便宜的。

### 3\. Recipes + 创作者分成:让用户帮你写集成
Recipes 是 Poke 商业化的第二条腿。一句话:预制菜。官方和用户做好的自动化模板，一键装上就能用。覆盖品类非常杂——健康健身（Strava、Oura、Withings、Fitbit）、生产力（Notion、Linear、Granola）、财务（Ramp）、差旅（TripIt）、智能家居（Philips Hue、Sonos），以及给开发者的一大堆:PostHog、Webflow、Supabase、Vercel、Devin、Sentry、GitHub、Cursor Cloud Agents。

集成层通过 MCP 来做。Poke 不是一条一条写集成的，它站在 MCP 生态上——任何 MCP server 都能接进来。Interaction 还在 GitHub 上开源了 poke-mcp-examples 和 mcp-server-template 手把手教你写。

更狠的是创作者分成。用户做的 Recipe 可以分享，每拉新一个注册用户，Poke 付给你 10 美分到 1 美元（按地区定价）。过去几周用户已经创造了「数千个」新 Recipes。一个典型例子:一个叫 Dani 的开发者基于 Poke Recipes 做了个 MCP server 叫 tastebuds——众包食物点评，你问 Poke「附近有啥吃的」，它会根据其他 Poke 用户的评价推荐。

Recipes 是 Poke 最值得抄的一个设计。它把一个「通用 Agent」变成了一个「有生态的通用 Agent」，生态的门槛极低——会写 MCP server 的人一个周末就能上架。这是 Agent 生态第一次出现类似 iOS App Store 那种「边际成本趋零的能力扩张」。

## 六、Poke vs Meta:一场正在发生的反垄断战
这是 Poke 故事里最戏剧化的一条线，过去一年已经打成了一场横跨欧洲、巴西和东南非的连续剧。我按时间线讲一遍。

### 2025 年 10 月:Meta 下手
Meta 更新 WhatsApp Business 条款，规定用 WhatsApp Business API 提供服务的公司，不能以「AI chatbot 或助手」作为主要服务。规则的关键部分是:2025 年 10 月 15 日对新 AI 提供商生效，2026 年 1 月 15 日对已经在 WhatsApp 上的 AI 提供商生效。

翻译一下:Meta 把所有跟 Meta AI 竞争的第三方 chatbot——ChatGPT、Claude、Poke——从 WhatsApp 上赶了出去。商家自己用 AI 做客服 bot 不受影响，但像 Poke 这种通用型 AI 助手直接被切断。

Meta 明面上说自己在遵守各种法规，实际上用政策把竞争对手堵在门外。对 Poke 来说这是致命一击:WhatsApp 在欧洲、拉美、印度几乎是通讯基础设施，如果进不去，Poke 的天花板就只剩美国。

### 2025 年 11 月 — 12 月:监管机构出手
意大利反垄断局（AGCM）率先动手，把 2025 年 7 月就在查的 Meta AI 调查扩大到这个新的 chatbot 禁令上。

12 月 4 日欧盟委员会正式启动反垄断调查。12 月 24 日意大利 AGCM 发了一份 57 页的决定，明确要求 Meta 在意大利境内暂停执行禁令。决定里那句话很重:

*WhatsApp 运行规则的突然改变，阻碍并显著改变了（对手的）发展和投资计划，对竞争造成不可逆转的冲击。*

意大利的监管还特别提到:这种损害「对准备进入市场的公司来说可能是灾难性的」——直接就是在说 Poke 这种刚融完种子轮的初创公司。

面对意大利禁令，Meta 的反应是:好，那我只在意大利境内给 Poke、OpenAI、Luzia 放行，全球其他地区照旧禁。

### 2026 年 1 月:巴西加入
巴西反垄断机构 CADE 跟进发了类似禁令，Meta 先是照着意大利那套走了一下，随后在 1 月 23 日上诉成功，暂停了 CADE 的禁令。所以巴西这条战线 Poke 暂时又没了。

1 月 15 日:Meta 的新政策对现有 AI 提供商正式生效，Poke 被从 WhatsApp 上「合规地」切掉。Marvin 在 Twitter 和个人网站上公开把这些新闻链接当战利品贴——Reuters、Politico、FT、Bloomberg，一连串报道追着 Meta 打。他个人站点的 about 页面有一行字:「find updates on suing Meta in mainstream media」。这不是开玩笑，这是他正在主动把故事推到媒体上。

### 2026 年 2 月:欧盟发出红牌
2 月 9 日欧盟委员会正式向 Meta 发出 Statement of Objections——在欧洲反垄断流程里，这相当于发了一张红牌。委员会的措辞是:「这项政策变更初步看来违反欧盟竞争规则。」并且明确表示将使用 interim measures（临时措施），防止 Meta 的政策在调查期间对 AI 助手市场造成不可逆损害。

"防止不可逆损害"这几个字是关键。欧盟这种措施极少用——只有在认为等调查结束就来不及的时候才会动用。这说明监管机构是真的把 AI chatbot 这个市场当成一个关键市场在看，而不是一个小打小闹的产品品类。

### 2026 年 3 月:Meta 部分投降
3 月 5 日，Meta 在欧盟的压力下让步:未来 12 个月，在欧洲允许通用 AI chatbot 通过 WhatsApp Business API 提供服务——但要收费。

这个结果对 Poke 来说是一个只赢了一半的胜利。欧洲市场拿回来了，但要付 Meta 的费用。而且是「未来 12 个月」——时间窗是 Meta 说了算的，12 个月后可能再变。

到 2026 年 2 月，东南非共同市场（COMESA）也加入了调查。Meta vs 反垄断机构的这场官司现在是真正的全球战。

### 这件事为什么重要
Poke 和 Meta 这场架，远远超出了「一个初创公司被大厂欺负」的范畴。它在检验一个更根本的问题:通讯基础设施归属谁?

WhatsApp 不是一个普通的 App。在欧洲、拉美、印度，它就是通讯基础设施本身，相当于你手机上的短信。如果 Meta 能决定「什么 AI 可以跑在这个基础设施上」，那它就等于拿到了 AI 助手市场的总闸门。欧盟的反应这么硬，是因为它看懂了这件事——一旦 Meta 把这个总闸门控制住，整个欧洲的 AI 市场结构就变了。

Poke 现在相当于被推到了这场战役的最前线。它既是受害者，也是旗手——Marvin 在主流媒体上每一次发声，都是在帮欧盟委员会把这个案子打下去。说白了，Poke 的估值里有一部分是在赌监管会赢。

## 七、为什么这个产品值得所有做 Agent 的人研究
![为什么这个产品值得所有做 Agent 的人研究](img-9.png)

*Poke 首页的一张 slogan:"Poke is for adventurers"——它不把自己定位成生产力工具*

最后几点看法。

第一，Poke 证明了「不做新入口」在 Agent 时代可能比「做新入口」更聪明。

过去一年所有做 AI 产品的团队都在想同一个问题:怎么跟 ChatGPT 抢用户?答案通常是「做一个更好的 ChatGPT」。Poke 的答案是:「我不跟 ChatGPT 抢，我去找用户本来就每天打开几十次的那个 App，钻进去。」这个思路不是没人想过，但把每一个细节——read receipts、typing indicator、swipe reply、可被打断、群聊协作——都抠到 iMessage 原生体验的产品，Poke 是第一个。

今年爆火的 openclaw 也是相同的思路，做各类常见 im 工具的集成，将侵入性降到最低。

第二，MCP 是真的在跑起来了。

Poke 的 Recipes 生态站在 MCP 上。它不写集成，让别人写。每多一个 MCP server，Poke 的能力就多一块，自己的工程成本几乎是零。如果你还在怀疑 MCP 是不是只是个协议级的玩具，看看 Poke——它是第一个把 MCP 当作生态基础的 consumer 产品。

第三，人格比功能更稀缺。

Poke 的 Bouncer Mode、Her 风格的对话、敢反驳用户的人设——从「功能表」视角看都是不必要的。但它们是用户记得住、愿意发到 Twitter 上的部分。在 LLM 能力商品化的今天，产品差异化越来越来自那些难以量化的东西:语气、节奏、个性、什么时候主动、什么时候闭嘴、什么时候跟你抬一句杠。

  

但作为一个做产品的人看 Poke，我最大的感受是:这才是 Agent 产品该有的样子。不是再开一个 tab，不是再装一个 App，不是再学一套新的提示词——就是让 AI 活在你本来就用得最多的那个对话框里，像一个朋友一样发消息给你。

说白了:Agent 不该是一个目的地，Agent 应该是一个熟人。

Poke 是我见过最接近这个答案的产品。

---
> 本文同步自微信公众号，[点击查看原文](https://mp.weixin.qq.com/s/BFwuNbGMT44D_7o3t0O6uA)
