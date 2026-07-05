# 聊聊 Rerank：从 BERT 到大模型的技术旅程

Date: 2024-12-09  
Author: SimonAKing  
Categories: LLM  
Tags: LLM, Rerank  
Source: https://simonaking.com/blog/rerank/

> 在 NLP 场景中，Rerank 作为一个关键环节，承担着对多路召回、多数据来源、多模态、多结构等不同类型数据的归一化和精筛作用。它能有效地整合和优化各类召回结果，对提升检索系统的整体性能至关重要。

---
从搜索引擎到大语言模型，Rerank 技术一直在默默发挥着"最后一公里"的关键作用。

## 前言

在 NLP 场景中，Rerank 作为一个关键环节，承担着对多路召回、多数据来源、多模态、多结构等不同类型数据的归一化和精筛作用。它能有效地整合和优化各类召回结果，对提升检索系统的整体性能至关重要。

本文将介绍 rerank 相关的技术概念、业界进展，以及对业务 产生价值的可能性。
![聊聊 Rerank：从 BERT 到大模型的技术旅程 · 前言](./聊聊 Rerank-从BERT到大模型的技术旅程/overall.png)

## 正文

### 什么是 Rerank

Rerank 并不是新兴的技术，其发展历史可追溯到搜索引擎，其历程可浓缩为 3 个主要阶段：
![什么是 Rerank](./聊聊 Rerank-从BERT到大模型的技术旅程/timeline.png)

一句话介绍：Rerank 是一种对初步检索结果进行重排序的优化技术，以提高问答结果的准确性。

在 RAG 应用中，如果没有 rerank 会给到模型 粗召后的文档，会出现文档与 query 深层语义相关性不足（仅表面相似）问题，导致生成质量下降。

一个 bad case：
![什么是 Rerank](./聊聊 Rerank-从BERT到大模型的技术旅程/badcase.png)
![什么是 Rerank](./聊聊 Rerank-从BERT到大模型的技术旅程/Influence.png)

*不相关段落对于 RAG 效果的影响 https://arxiv.org/pdf/2410.05983*

具体而言，rerank 的加持会带来：

1. 排除无关信息：Rerank 会进一步深度理解语义，从向量的相似度、关键词的词频权重到理解复杂语义（如 cross-encoder 架构）；

2. 有更多排序可能性：能够增加多维度的特征进行加权计算（如 文档完整性、时效性、权威性..) ;

3. 能基于文档上下文、query 意图排序：排序后的文档 不仅是语义关联，还能提升准确反映 query 真实意图的文档权重。

  举个例子：query 是某个 topic 相关的问答，如：苹果公司最新的产品发布会有哪些亮点？

再精排后，可以再进一步过滤 低相关的 documents 或者 基于模型窗口限制、注意力缺陷（如 lost in the middle），根据 相关分数 重排 documents ，能够有效提升 RAG 应用的问答效果。

### 业界实践

因为涉及到了精排，所以会产生额外的延迟；且 rerank 模型也需要一定的参数量，对于长尾场景可能也会有偏差。近年来的研究已经提出了多种创新方法来应对这些挑战。以下将介绍一些具有代表性的论文。

#### [Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
> 📄 Paper: https://arxiv.org/abs/1901.04085

该工作开创性地提出了一种基于 BERT 的 rerank 模型，证明了 预训练模型在 rerank 任务的效果，也影响了后续相关的研究工作。
![Passage Re-ranking with BERT](./聊聊 Rerank-从BERT到大模型的技术旅程/p1.png)

核心思路是将 rerank 视为 二分类任务，假设输入是 query-document pairs，会采取 point-wise 思路（二分类）将 query-document 拼接成单个序列：[CLS] query [SEP] document [SEP]，[SEP] 分割后的 token 会增加 token_type_ids 作为 llm embedding 的一部分（辅助信息 用于区分 query 与 document）。

经过 多层 self-attention，[CLS] token 能表示 query 与 document 的匹配度，最后通过一个分类层预测 [CLS] token 表示的相关性得分。

训练时，相关的数据作为正样本，不相关的数据作为负样本，使用交叉熵损失进行优化。

关键代码介绍：
```python
class SimpleBertReranker(nn.Module):
    def __init__(self, bert_model_name='bert-base-uncased'):
        super().__init__()
        self.bert = BertModel.from_pretrained(bert_model_name)
        self.classifier = nn.Linear(self.bert.config.hidden_size, 1)  # 分类层

    def forward(self, input_ids, attention_mask, token_type_ids):
        # 获取 BERT 的输出
        outputs = self.bert(input_ids=input_ids,
                            attention_mask=attention_mask,
                            token_type_ids=token_type_ids)
        # 使用 [CLS] token 的表示
        cls_output = outputs.pooler_output
        # 通过分类层得到相关性得分
        score = self.classifier(cls_output)
        return score

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
query = "What is the capital of France?"
document = "Paris is the capital of France."

# 编码输入
inputs = tokenizer(query, document, return_tensors='pt', padding=True, truncation=True)

# 初始化模型
model = SimpleBertReranker()

# 计算相关性得分
with torch.no_grad():
    score = model(**inputs)
    print("Relevance score:", score.item())
```
#### [Document Ranking with a Pretrained Sequence-to-Sequence Model](https://arxiv.org/abs/2003.06713)
> 📄 Paper: https://arxiv.org/abs/2003.06713

该工作提出了一种不同于 BERT 模型 分类任务的方式，基于 T5 模型 将 rerank 视为生成任务。
![Document Ranking with a Pretrained Sequence-to-Sequence Model](./聊聊 Rerank-从BERT到大模型的技术旅程/p2.png)
![Document Ranking with a Pretrained Sequence-to-Sequence Model](./聊聊 Rerank-从BERT到大模型的技术旅程/p3.png)

输入序列的格式是Query: q Document: d Relevant: 格式，输出是 true、false 这两种 token。

在训练时，模型被微调为根据正负样本输出 "true" 或 "false" 作为目标 token；在推理阶段 通过对目标 token 进行 softmax 计算概率来进行重排。

关键代码介绍：
```python
class T5Reranker:
    def __init__(self):
        # 加载预训练的T5模型
        self.model = load_pretrained_t5()

    def prepare_input(self, query, document):
        # 构造输入序列格式
        return f"Query: {query} Document: {document} Relevant:"

    def fine_tune(self, train_data):
        """训练过程
        train_data: [(query, document, is_relevant), ...]
        """
        for query, document, is_relevant in train_data:
            input_text = self.prepare_input(query, document)
            target = "true" if is_relevant else "false"
            self.model.train(input_text, target)

    def rerank(self, query, candidate_documents):
        """重排序过程"""
        results = []

        for doc in candidate_documents:
            # 构造输入序列
            input_text = self.prepare_input(query, doc)

            # 获取模型输出的logits
            logits = self.model.get_logits(input_text)

            # 只对"true"和"false" token计算softmax
            true_false_logits = logits[["true_token_id", "false_token_id"]]
            probs = softmax(true_false_logits)

            # 使用"true" token的概率作为相关性分数
            relevance_score = probs["true_token_id"]
            results.append((doc, relevance_score))

        # 根据相关性分数排序
        ranked_docs = sorted(results, key=lambda x: x[1], reverse=True)
        return ranked_docs
```
#### [Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Agents](https://arxiv.org/abs/2304.09542)
> 📄 Paper: https://arxiv.org/abs/2304.09542

该工作调研了 GPT 模型（GPT-4） 在 rerank 任务上的表现，基于当时的 sota 模型（GPT4）再结合合适的方法（滑动窗口+ listwise），可使得 GPT 模型达到 SOTA 结果。
![Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Age](./聊聊 Rerank-从BERT到大模型的技术旅程/p4.png)
![Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Age](./聊聊 Rerank-从BERT到大模型的技术旅程/p5.png)

通过图 c 的 prompt 要求 LLMs 生成相关性的段落 ID，如果超出模型窗口时 会使用 滑动窗口策略：

首先对（M-w）到 M 的段落进行排名，然后滑动窗口，对（M-w-s）到（M-s）的段落重新排名，重复此过程直到所有段落都被重新排名。
![Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Age](./聊聊 Rerank-从BERT到大模型的技术旅程/p6.png)

#### [Large Language Models are Effective Text Rankers](https://arxiv.org/abs/2306.17563)
> 📄 Paper: https://arxiv.org/abs/2306.17563

上篇工作证明了使用 LLMs 在 rerank 场景的效果，不过由于其黑盒，并且对初始段落顺序的敏感（使用 BM25 召回的顺序会优于随机顺序），仅能依靠商业大模型（开源模型失败率高），研究价值不高。

不同于基于 sota 模型做 listwise，该工作提出了 PRP（Pairwise Ranking Prompting） 一种新策略（下图 1），核心思路是 拆解问题，每个任务的难度降低，对 LLMs 的能力要求也会降低。

通过合适的评分机制 再结合高效的排序方式，能做到在 小模型上达到不错效果。
![Large Language Models are Effective Text Rankers](./聊聊 Rerank-从BERT到大模型的技术旅程/p7.png)
![Large Language Models are Effective Text Rankers](./聊聊 Rerank-从BERT到大模型的技术旅程/p8.png)

#### [Leveraging Passage Embeddings for Efficient Listwise Reranking with Large Language Models](https://arxiv.org/abs/2406.14848)
> 📄 Paper: https://arxiv.org/abs/2406.14848

上面两篇工作都是基于 LLMs 进行 rerank 任务，但 LLMs 会有幻觉以及 latency 居高不下的问题，本篇工作提出了一种 PE Rank 的技术。

仍然采用 listwise 的方式，有两种 document 的处理方式，其中一种是不会将召回的 document 给到 LLMs，而是会将 document 替换成 特殊标记，类似于 soft prompt，prompt 如下：
```txt
I will provide you with {{n}} passages, each with a special token representing the passage
enclosed in [].
Rank the passages based on their relevance to the search query: {{query}}.
Passage 1: [{{embedding}}]
...
Passage {{n}}: [{{embedding}}]
Search Query: {{query}}
Rank the {{n}} passages above based on their relevance to the search query in descending order.
Only output the {{n}} unique special token in the ranking.
```
![Leveraging Passage Embeddings for Efficient Listwise Reranking with Large Langua](./聊聊 Rerank-从BERT到大模型的技术旅程/p9.png)

核心有两点：
1. 在输入时通过一个训练好的 mlp 层将 token embedding 映射成 llm embedding，能够压缩文档上下文（类似于 xRag），给到模型的输入见图 3。
2. 输出时约束了 decode ，解码空间 仅能包含文档 ID，能根治 LLMs 的幻觉问题，因为 词表空间变小了，所以也加快了生成速度。

相应的在训练时，分两阶段 输入的映射层训练，以及 decoding 时的排序学习训练。

#### 业界进展

近一年，多家组织/公司 推出了各自的 rerank 模型，一些亮点：

| 模型 | 发布时间 | 亮点 |
| --- | --- | --- |
| Cohere Rerank-3.5 | 2024/12/3 | - 相比前代模型提升了 10% 的准确率 |
| Jina Reranker v2 | 2024/06/25 | - 支持跨语言重排（cross-lingual reranking） |
| BGE Re-Ranker v2.0 | 2024/03/18 | - 在 MTEB 重排任务上达到 SOTA 水平 |
这些进展表明，rerank 未来会向着更高的准确率和更低的 latency 发展，使用场景也不会局限于 文档排序。
***
## 结束语

通过对 rerank 技术的深入探讨，我们可以看到：

1. 技术演进趋势
  - 从简单的 BERT 二分类，到 T5 生成式方法，再到利用大模型能力，rerank 技术在不断创新
  - 业界正在探索如何平衡效果与效率，比如通过 embedding 压缩、约束解码等方式优化性能
  - 开源社区和商业产品都在积极推进，为不同场景提供了丰富的选择

2. 对业务的价值
  - 提升搜索质量：通过深度语义理解，能更准确地识别用户意图，减少无关结果
  - 优化 RAG 应用：通过精准的文档筛选和重排，显著提升大模型问答的准确性
  - 支持多样化场景：
    - 产品分析：更准确地发现用户反馈，包括应用商店评论、社交媒体讨论等
    - 信息转化：提高相关信息的发现效率，降低噪音
    - 对话应用：提供更精准的知识库匹配
    - ...

回顾 rerank 的发展历程，从 BERT 二分类到基于 LLM 策略的工作，技术在不断突破；从单一的搜索场景到如今的 RAG 应用，价值在持续提升。随着 AI 应用的普及，rerank 作为连接召回和生成的关键环节，在提升问答质量方面发挥着重要的作用。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
