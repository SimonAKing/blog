# LLM Inference Optimization Overview - From Data to System Architecture

Date: 2025-05-05  
Author: SimonAKing  
Categories: LLM  
Tags: LLM, Inference Optimization  
Source: https://simonaking.com/blog/llm-inference-optimization-en/

> As LLMs are widely adopted across various industries, achieving efficient inference while maintaining model performance has become a key challenge. To address these challenges, academia and industry have proposed various optimization solutions. This article introduces several key technologies related to LLM inference acceleration. Corrections and suggestions are welcome.

---
With the widespread application of LLMs across various industries, achieving efficient inference while maintaining model performance has become a key challenge.

## Introduction

Mainstream LLMs are based on the decoder-only architecture of transformers, with next token prediction as their core task. During inference, the model needs to generate each token sequentially, and this autoregressive generation characteristic increases inference latency. In terms of parameter count, models can be divided into different scales, and even small models have high requirements for computational and memory resources.

To address these challenges, academia and industry have proposed various optimization solutions. This article introduces several key technologies related to LLM inference acceleration. Corrections and suggestions are welcome.

## Main Content

### Inference Phase Overview
The inference phase is the process where a model receives input and produces output. Unlike the training phase, inference doesn't require gradient computation and parameter updates, only forward propagation calculations.

During inference, due to the autoregressive generation characteristic, the model needs to generate tokens one by one. This leads to continuously increasing sequence lengths. For example:
- With an input length of 1000 tokens and needing to generate 100 new tokens, the actual sequence length processed is: 1000 + 1001 + ... + 1100 = 106050 tokens
- **Each new token needs to compute attention with all previous tokens**

In a typical decoder-only architecture, there are multiple decoder blocks, and each token must pass through these blocks during inference. Each block contains 3 main computation modules: **Self-Attention**, **FFN**, and Layer Normalization (a basic component for ensuring numerical stability, which we'll ignore in the following discussion).
![Inference Phase Overview](./llm-inference-optimization-overview/111.png)

The execution phases can be divided into prefill and decode stages:

| Stage | Characteristics | Modules |
| --- | --- | --- |
| Prefill | • Compute-intensive phase with O(n²) complexity due to full attention computation across all input tokens<br>• Memory usage scales quadratically with sequence length due to attention matrix computation<br>• Can leverage hardware parallelism as all tokens are processed simultaneously | • Self-Attention: Computes complete attention patterns between all input tokens, generating and caching K/V representations<br>• FFN: Processes all input tokens through feed-forward networks in parallel |
| Decode | • Linear complexity O(n) per token, but inherently sequential due to autoregressive nature<br>• Memory growth is linear and predictable<br>• Limited parallelization potential due to token-by-token generation | • Self-Attention: Generates Q for new token only, leverages cached K/V, computes attention scores efficiently<br>• FFN: Processes only the newly generated token through feed-forward networks |

> Demonstration of the prefilling stage (a) and decoding stage (b)
![Inference Phase Overview](./llm-inference-optimization-overview/222.png)

> Illustration of the memory variation through time (latency) during inference
![Inference Phase Overview](./llm-inference-optimization-overview/333.png)

Performance metrics during inference include:
- TTFT (Time-To-First-Token): Generation time for the first token, mainly measuring Prefill stage performance
- TPOT (Time-Per-Output-Token): Time to generate each token, mainly measuring Decode stage performance

Let's understand the inference process through a real example, query: "What are some recent practices related to Deepseek R1?"

| Stage | Module | Processing | Result |
| --- | --- | --- | --- |
| Prefill | Self-Attention | Words like "happened" and "practices" will have high attention scores with "Deepseek R1", producing an n×n attention matrix | Output the first token with highest probability |
| | FFN | Will search for pretrained knowledge about Deepseek in the learned knowledge base | |
| Decode | Self-Attention | Use the generated new token q to understand the input kv, discover it's asking about practices, understand the need for practice-related knowledge | Output subsequent tokens with highest probability |
| | FFN | Will search for practice-related knowledge in the learned knowledge base | |

In summary, key overheads during inference:
1. Computational cost:
  1. Prefill needs to process all inputs, input has quadratic relationship with computation
  2. Model parameter count keeps increasing
  3. Decode has low GPU computation
2. Storage cost:
  1. KV Cache grows linearly with input sequence length, needs to store K/V for all historical tokens in memory
  2. FFN storage overhead is large, estimated to account for over 70% of parameters
3. IO cost: decode generates only one token each time but needs to repeatedly call the model

### Technology Overview
The industry has proposed optimization solutions from different stages to address these challenges:
![Technology Overview](./llm-inference-optimization-overview/4.png)

#### Data Level
##### Input Compression
Compress input text and prune low-quality information while minimizing performance impact to improve efficiency. Specific works include:
1. [LLMLingua Series](https://llmlingua.com/): Train small models to prune and compress original prompts
![Input Compression](./llm-inference-optimization-overview/5.png)
![Input Compression](./llm-inference-optimization-overview/6.png)
The approach transforms compression into a token classification problem, deciding whether to keep or discard each token. The task model is trained on a dataset distilled from large models.
![Input Compression](./llm-inference-optimization-overview/7.png)

Other compression works in RAG scenarios:
2. [RECOMP](https://arxiv.org/abs/2310.04408): Compresses retrieved documents into text summaries to improve language model performance while reducing computational costs.
![Input Compression](./llm-inference-optimization-overview/8.png)

3. [xRAG](https://arxiv.org/abs/2405.13792): Projects document embeddings directly into LLMs' representation space through modal fusion
![Input Compression](./llm-inference-optimization-overview/9.png)

4. Conventional RAG, Rerank: Suitable for information-intensive scenarios, selecting highly relevant content to avoid garbage in garbage out
![Input Compression](./llm-inference-optimization-overview/10.png)
> Impact of irrelevant passages on RAG effectiveness https://arxiv.org/pdf/2410.05983

##### Output Planning
Improve parallelism of long text output while minimizing performance impact to enhance efficiency. Specific works include:
1. [SOT](https://arxiv.org/abs/2307.15337): SOT proposes an approach of parallel output after understanding intent, generating an outline for the answer, then generating in parallel for each point in the outline, significantly improving linear decoding performance. However, it cannot handle scenarios well where dependencies exist between different points. Based on this, they additionally trained a router model to judge whether dependencies exist, and parallel decoding is not performed when dependencies exist.
![Output Planning](./llm-inference-optimization-overview/11.png)
![Output Planning](./llm-inference-optimization-overview/12.png)

2. [SGD](https://arxiv.org/abs/2402.12280): Takes a step further from SOT by abstracting dependency relationships into a DAG (points with dependencies have connecting lines; independent points are separate), thus further improving effectiveness.
![Output Planning](./llm-inference-optimization-overview/13.png)

#### Model Level
##### Model Structure Optimization
1. Attention Optimization: The core is reducing KV Cache and kernel function computations.
> Adding Su Shen's explanation: Why is reducing KV Cache size so important? As we all know, LLM inference is generally performed on GPUs, and single GPU memory is limited. One part needs to be used to store model parameters and activation values from forward computation, which depends on model size and is constant once the model is selected. Another part needs to be used to store the model's KV Cache, which depends not only on model size but also on input length, growing dynamically during inference. When the context length is long enough, its size becomes dominant and may exceed the total memory of one card or even one machine (8 cards). The principle for deploying models on GPUs is: if it can be deployed on one card, don't use multiple cards; if it can be deployed on one machine, don't use multiple machines. This is because "intra-card communication bandwidth > inter-card communication bandwidth > inter-machine communication bandwidth". Due to the "bucket effect", the more devices the model deployment spans, the more it is "dragged down" by inter-device communication bandwidth. In fact, even though single H100 intra-card SRAM to HBM bandwidth has reached 3TB/s, this speed is still the bottleneck for inference with Short Context, not to mention slower inter-card and inter-machine communication. Therefore, the fundamental purpose of reducing KV Cache is to achieve inference of longer Context on fewer devices, thereby achieving faster inference speed and lower inference cost.

  1. MHA (Multi-Head Attention): The most basic multi-head attention mechanism, where each attention head has independent Q, K, V parameter matrices. Although it can fully capture information from different feature dimensions, it needs to store KV Cache for all heads, resulting in large storage overhead.
  2. MQA (Multi-Query Attention): When computing attention, shared K/V is broadcast to each attention head, then each head still uses its independent Q with shared K/V to compute attention scores. KV Cache size is reduced to 1/h of original (h is number of heads). However, sharing KV may limit the model's ability to capture diverse features.
  3. GQA (Grouped-Query Attention): A compromise between MQA and MHA, dividing attention heads into groups with heads in the same group sharing KV. Compared to MQA it maintains better model performance while significantly reducing KV Cache compared to MHA. Representative works: [DeepSeek V1](https://arxiv.org/pdf/2401.02954), [LLaMa 3.1](https://scontent-nrt1-2.xx.fbcdn.net/v/t39.2365-6/453304228_1160109801904614_7143520450792086005_n.pdf?_nc_cat=108&ccb=1-7&_nc_sid=3c67a6&_nc_ohc=ivumNlLcSY8Q7kNvgEYKQgM&_nc_ht=scontent-nrt1-2.xx&oh=00_AYDWnrIK1XXJ_bo1ueusjYFZjgJALgata0ZSOFgV6qJHHA&oe=66BA8087), [Qwen2](https://arxiv.org/pdf/2407.10671).
  4. MLA (Multi-head Latent Attention): A new attention mechanism introduced by [DeepSeek V2](https://arxiv.org/pdf/2405.04434) through introducing latent variables. It significantly reduces KV cache size by compressing keys (Key) and values (Value) to a low-dimensional latent space. Compared to standard attention mechanisms, it reportedly reduces KV cache by about 93.3%.
![Model Structure Optimization](./llm-inference-optimization-overview/14.png)
![Model Structure Optimization](./llm-inference-optimization-overview/15.png)

2. MOE (Mixture-of-Expert): An advanced neural architecture that replaces the traditional monolithic FFN with a dynamic routing system. The architecture consists of:
   - A gate network that learns to route tokens to the most relevant expert networks
   - Multiple specialized expert networks (typically 8-32) that process different aspects of the input
   - A load balancing mechanism to ensure efficient utilization of experts

   This design offers several advantages:
   - Increased model capacity without proportional increase in computation cost
   - Dynamic specialization where different experts can focus on different types of tokens/tasks
   - Improved inference efficiency through selective expert activation

   The approach originated from the 1991 paper [Adaptive Mixture of Local Experts](https://www.cs.toronto.edu/~hinton/absps/jjnh91.pdf) and has seen renewed interest in modern LLMs. Starting with Mistral's Mixtral 8x7B, MOE has become a mainstream trend in 2024, with DeepSeek's implementations showcasing increasingly sophisticated architectures across their model versions. Key challenges in MOE implementation include:
   - Balanced token routing to prevent expert overload
   - Ensuring expert specialization without knowledge conflicts
   - Maintaining routing efficiency at inference time
![Model Structure Optimization](./llm-inference-optimization-overview/16.png)
![Model Structure Optimization](./llm-inference-optimization-overview/17.png)

##### Model Compression
Model compression aims to reduce resource overhead by reducing model complexity (including parameter count, computation, and memory usage) while maintaining model performance as much as possible. Some representative measures include:
![Model Compression](./llm-inference-optimization-overview/18.png)

- Quantization: Quantization reduces the precision of model weights and activations. Most models are trained with 32 or 16-bit precision, where each parameter and activation element occupies 32 or 16 bits of memory (single precision floating point). Obviously, we can try to use fewer bits to represent weights.
  Common methods include post-training quantization, directly converting numerical precision after model training, simple operation but may reduce accuracy; and quantization-aware training, simulating quantization effects during training to let the model adapt to low precision in advance, resulting in less accuracy loss. Benefits include significantly reducing model size and improving computation speed. Focus on activation value quantization in prefill stage; focus on weight quantization in decode stage.
![Model Compression](./llm-inference-optimization-overview/19.png)

- [Knowledge Distillation](https://arxiv.org/pdf/1503.02531): Knowledge distillation is a compression method that transfers knowledge from large models (teacher models) to small models (student models). Common methods include post-training distillation, directly using teacher model to generate data to train student model, which can compress the model to 40-60% of original size while maintaining most performance.
![Model Compression](./llm-inference-optimization-overview/20.png)

- Pruning: Compress model by removing unimportant connections or structures. Common methods include structured pruning (removing entire layers or heads) and unstructured pruning (removing individual weights), can reduce parameters by 30-50% with minimal performance loss.

- Low-rank Decomposition: Decompose large weight matrices into products of several small matrices to reduce parameter count and computation. Common methods include SVD decomposition and LoRA etc. Among them, LoRA achieves parameter-efficient fine-tuning by adding low-rank matrices beside original weights, becoming one of the mainstream model compression methods.

##### Decoding Optimization
The most time-consuming part of inference stage is the autoregressive generation process. Decoding optimization aims to accelerate token generation through parallelization or prediction. Some representative measures include:
1. [Speculative Decoding](https://arxiv.org/abs/2302.01318): An innovative decoding technique for autoregressive large models aimed at improving decoding efficiency without affecting output quality. The core idea includes using a smaller model (Draft Model) to effectively predict several subsequent tokens, then using the large model to verify these predictions in parallel. This method aims to enable the large model to generate multiple tokens in the time range usually required for a single inference.
![Decoding Optimization](./llm-inference-optimization-overview/21.png)

2. Skip-token Decoding: Representative work SGLang, core idea is to skip predictable parts during generation by analyzing deterministic features of text structure. Instead of generating token by token, it can directly jump to the next position requiring inference at positions with high determinism, greatly improving generation efficiency.
![Decoding Optimization](./llm-inference-optimization-overview/22.png)

3. Constrained Decoding: Representative work Outlines, Outlines converts JSON Schema into regular expressions, then builds finite state machines (FSM) based on these regular expressions, then filters tokens in real-time during generation to ensure output always conforms to predefined format requirements. This approach is particularly suitable for scenarios requiring strict output format control.
![Decoding Optimization](./llm-inference-optimization-overview/23.png)

4. Structured Decoding: Representative work Guidance, innovation lies in dividing generation tasks into fixed structure and dynamic content categories and adopting different processing strategies. By identifying template parts in text, it can significantly reduce the amount of content that needs to be actually generated, thereby improving overall efficiency.
![Decoding Optimization](./llm-inference-optimization-overview/24.png)

#### System Level
##### KV Cache
KV Cache optimization is critical for LLM inference efficiency as it represents a significant memory bottleneck. The optimization focuses on two key aspects:

1. Sparsification Compression:
   - Approach: Strategically select and retain only the most informative tokens while pruning less important ones
   - Implementation: Uses attention scoring to identify key tokens
   - Example:
```txt
Original sequence (dense):
[T1, T2, T3, ..., T128K]  // Full 128K token sequence

After sparsification (sparse):
[T1, T512, T1024, ..., T128K]  // Only ~1K tokens retained
- Retains tokens with high attention scores
- Maintains semantic coherence
- Reduces memory footprint by >90%
```

2. Quantization Compression:
   - Approach: Reduce numerical precision of stored K/V values
   - Implementation methods:
     - Post-training quantization (e.g., FP16 → INT8)
     - Dynamic quantization during inference
     - Mixed-precision storage strategies
   - Benefits:
     - 2-4x memory reduction with minimal accuracy impact
     - Improved cache hit rates
     - Better hardware utilization

These optimization strategies can be combined and tuned based on specific requirements:
- Long-context scenarios benefit more from sparsification
- Latency-sensitive applications might prefer quantization
- Production systems often use a hybrid approach

The optimization process typically follows this workflow:
![KV Cache](./llm-inference-optimization-overview/25.webp)

##### PagedAttention
Traditional inference frameworks adopt static memory allocation strategy: pre-allocating fixed size memory blocks according to batch_size × max_seq_len, resulting in low memory utilization.
```txt
// Traditional static allocation
Pre-allocated memory size = 4(batch_size) × 2048(max_seq_len) × 2(bytes/token)
Actual usage:
- Request1: uses 256 tokens
- Request2: uses 512 tokens
- Request3: uses 128 tokens
Result: Large amount of memory space wasted
```
vllm borrows virtual memory paging idea from operating systems, proposing PagedAttention technology to achieve dynamic allocation of KV Cache memory.
```txt
// PagedAttention dynamic allocation
Memory page size = 16KB
Request1: dynamically allocate 2 pages (32KB)
Request2: dynamically allocate 4 pages (64KB)
Request3: dynamically allocate 1 page (16KB)
Advantage: Allocate on demand, improve memory utilization
```
This dynamic management mechanism allows memory resources to be used more efficiently, particularly suitable for handling multi-request scenarios with varying lengths.
![PagedAttention](./llm-inference-optimization-overview/26.png)

##### Prefix Cache
Limitation of traditional PagedAttention: KV Cache can only be reused within single request, cannot be shared across requests, which is inefficient in multi-round dialogue scenarios.
Example:
```txt
// Traditional way
Dialogue round 1:
  Prompt: "Hello, please introduce Beijing"
  → Calculate complete KV Cache

Dialogue round 2:
  Prompt: "Hello, please introduce the Forbidden City in Beijing"
  → Recalculate KV Cache (even though contains lots of repeated content)
```
Prefix Caching optimization: Achieve cross-request reuse by caching KV Cache of system prompts and dialogue history, reducing Time To First Token (TTFT).
RadixAttention proposed by SGLang achieves automatic KV Cache reuse through three key steps:
1. Cache retention
```txt
After request completion:
KV Cache → Retained in GPU memory
Token sequence → Stored in RadixTree
```
2. Prefix matching
```txt
New request: "Hello, please introduce the Forbidden City in Beijing"
↓
RadixTree matching
↓
Hit: KV Cache of "Hello, please introduce Beijing"
↓
Only need to calculate new part: "the Forbidden City"
```
3. Cache management
```txt
Strategy: LRU (Least Recently Used)
When memory is insufficient:
- Identify least recently used KV Cache
- Prioritize releasing this part of memory
```
This optimization is particularly suitable for scenarios like multi-round dialogues, can significantly improve model response speed and resource utilization efficiency.

##### Others
There are many other optimization approaches at system level, such as tensor parallelism, pipeline parallelism, distributed inference etc. Since these optimization solutions involve relatively complex system architecture design, we won't discuss them in detail here. Interested readers can refer to relevant technical documentation for deeper understanding.

***
## Conclusion
Through in-depth discussion of LLM inference acceleration technologies, we can see:
1. Technical Architecture and Challenges
  - Inference process divided into two main stages: Prefill and Decode
  - Core challenges:
    - Computational cost: input scale, parameter count, autoregressive nature
    - Storage cost: KV Cache, FFN parameter storage
    - IO cost: frequent model calls
2. Optimization Solutions (Multi-level Technology Stack)
  - Data level optimization:
    - Input compression: LLMLingua, RECOMP, xRAG etc.
    - Output planning: SOT, SGD and other parallel output technologies
  - Model level optimization:
    - Structure optimization: attention mechanisms (MHA, MQA, GQA, MLA), MOE architecture
    - Model compression: quantization, knowledge distillation, pruning, low-rank decomposition
    - Decoding optimization: speculative decoding, skip-token decoding, constrained decoding etc.
  - System level optimization:
    - KV Cache optimization: sparsification compression, quantization compression
    - PagedAttention: dynamic memory management
    - Prefix Cache: cross-request KV reuse
As LLMs continue to expand their applications across various fields, inference acceleration technologies also continue to evolve. From early simple optimizations to current multi-level comprehensive optimization solutions, technology keeps breaking through. The development of these optimization technologies enables LLMs to serve practical application scenarios more efficiently, laying an important foundation for the popularization of AI applications. In the future, with the advancement of hardware technology and algorithm innovation, we expect to see more breakthrough inference acceleration solutions.

References:
1. [A Survey on Efficient Inference for Large Language Models](https://arxiv.org/abs/2404.14294) Very helpful, recommended
2. [Model Compression and Efficient Inference for Large Language Models: A Survey](https://arxiv.org/abs/2402.09748)
3. [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)
4. [AI Large Model Inference Process and Optimization Technologies](https://zhuanlan.zhihu.com/p/689773196)
5. [How to make LLMs go fast](https://vgel.me/posts/faster-inference/)
6. [Yidoo Blog](https://www.yidoo.xyz/)
7. [Detailed Discussion on DeepSeek MoE Related Technical Development](https://mp.weixin.qq.com/s/WFJxnTF9fGIIXPA7GQ5V2w)
8. [The Ultimate Trade-off Between Cache and Effect: From MHA, MQA, GQA to MLA](https://mp.weixin.qq.com/s/yCczYU0po0PvPTa-eh2pfg)
9. [A Survey on Model Compression for Large Language Models](https://arxiv.org/pdf/1503.02531)

Feel free to share articles from this site, please credit the author and source [SimonAKing](http://simonaking.com).
