// Cloudflare Worker — BookPill 问诊台 AI 后端 v3
// 模型: @cf/meta/llama-3.3-70b-instruct-fp8-fast (70B + 速度优化)
// 框架: SKILL.md 完整七步诊断法 + problem-index.md 跨域书籍索引

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const BOOK_INDEX = {
  delay: {
    core: '拖延不是意志力问题，而是模糊、大脑规律和情绪管理的综合问题。',
    all: [
      { name: '认知觉醒', author: '周岭', concepts: ['消除模糊','动机转移','三重大脑'] },
      { name: '逆转思维', author: '李欣频', concepts: ['从行动反推认知','最小可行行动'] },
      { name: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', concepts: ['软愤怒','为人生负责'] },
      { name: '微习惯', author: '斯蒂芬·盖斯', concepts: ['缩小目标','小到不可能失败'] },
      { name: '被讨厌的勇气', author: '岸见一郎', concepts: ['课题分离','自由就是被讨厌'] },
      { name: '自控力', author: '凯利·麦格尼格尔', concepts: ['意志力像肌肉','那又如何效应'] },
      { name: '七个习惯', author: '史蒂芬·柯维', concepts: ['要事第一','以终为始'] },
      { name: '原则', author: '瑞·达利欧', concepts: ['五步流程法','拥抱现实'] },
      { name: '少有人走的路', author: '斯科特·派克', concepts: ['推迟满足感','承担责任'] },
      { name: '心流', author: '米哈里·契克森米哈赖', concepts: ['挑战-技能平衡','专注'] },
      { name: '臣服实验', author: '迈克尔·辛格', concepts: ['臣服不是放弃','生命之流'] },
      { name: '悉达多', author: '赫尔曼·黑塞', concepts: ['当下即完美','自我超越'] }
    ]
  },
  anxiety: {
    core: '焦虑的本质是欲望与能力的错位、用未来否定当下、以及对不确定性的恐惧。',
    all: [
      { name: '认知觉醒', author: '周岭', concepts: ['放弃速成幻想','三大成长规律'] },
      { name: '当下的力量', author: '埃克哈特·托利', concepts: ['你不等于思维','臣服的力量'] },
      { name: '悉达多', author: '赫尔曼·黑塞', concepts: ['当下即完美','接纳此刻'] },
      { name: '正念的奇迹', author: '一行禅师', concepts: ['有觉知的呼吸','回到当下'] },
      { name: '臣服实验', author: '迈克尔·辛格', concepts: ['痛苦=事件×抗拒','放下控制'] },
      { name: '被讨厌的勇气', author: '岸见一郎', concepts: ['活在此时此刻','课题分离'] },
      { name: '逆转思维', author: '李欣频', concepts: ['反应该思维','在限制中找机会'] },
      { name: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', concepts: ['情绪自主权','成人自我状态'] },
      { name: '也许你该找个人聊聊', author: '洛莉·戈特利布', concepts: ['拥抱不想要的感受'] },
      { name: '情商', author: '丹尼尔·戈尔曼', concepts: ['情绪劫持','先深呼吸6秒'] },
      { name: '心流', author: '米哈里·契克森米哈赖', concepts: ['精神熵','重建内在秩序'] }
    ]
  },
  internal: {
    core: '内耗的本质是自我批判、童年模式的重复、以及自己跟自己打仗。',
    all: [
      { name: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', concepts: ['三种自我状态','自我批判的内化','人生坐标'] },
      { name: '当下的力量', author: '埃克哈特·托利', concepts: ['小我机制','痛苦之身'] },
      { name: '被讨厌的勇气', author: '岸见一郎', concepts: ['课题分离','自我接纳'] },
      { name: '认知觉醒', author: '周岭', concepts: ['元认知','消除模糊'] },
      { name: '亲密关系', author: '罗兰·米勒', concepts: ['投射机制','冲突处理'] },
      { name: '悉达多', author: '赫尔曼·黑塞', concepts: ['放下执念','非二元对立'] },
      { name: '也许你该找个人聊聊', author: '洛莉·戈特利布', concepts: ['洞察不等于改变','需要行动'] },
      { name: '自卑与超越', author: '阿尔弗雷德·阿德勒', concepts: ['自卑感与超越','社会兴趣'] },
      { name: '正念的奇迹', author: '一行禅师', concepts: ['观察情绪','不评判不跟随'] },
      { name: '臣服实验', author: '迈克尔·辛格', concepts: ['观察者意识'] },
      { name: '逆转思维', author: '李欣频', concepts: ['反对抗思维','接纳限制'] }
    ]
  },
  express: {
    core: '好的表达不是口才好，而是先读懂人心，再决定如何开口。说不出口的背后，常常是怕——怕被否定、怕关系变了、怕暴露真实的自己。',
    all: [
      { name: '鬼谷子', author: '王诩', concepts: ['捭阖之道','反应之术','内楗之术','飞箝之术'] },
      { name: '非暴力沟通', author: '马歇尔·卢森堡', concepts: ['四要素','区分观察与评判'] },
      { name: '亲密关系', author: '罗兰·米勒', concepts: ['真正的倾听','冲突处理'] },
      { name: '影响力', author: '罗伯特·西奥迪尼', concepts: ['互惠原则','承诺与一致','社会认同'] },
      { name: '七个习惯', author: '史蒂芬·柯维', concepts: ['知彼解己','统合综效'] },
      { name: '情商', author: '丹尼尔·戈尔曼', concepts: ['同理心','先感受对方情绪'] },
      { name: '被讨厌的勇气', author: '岸见一郎', concepts: ['你不需要说得好，只需要说出来'] },
      { name: '悉达多', author: '赫尔曼·黑塞', concepts: ['倾听之道','减少急于表达'] }
    ]
  },
  eq: {
    core: '情商的核心是觉察自我状态，为情绪负责，同时读懂他人。情绪失控的瞬间，常常是杏仁核先劫持了理智脑。',
    all: [
      { name: '情商', author: '丹尼尔·戈尔曼', concepts: ['自我觉察','情绪管理','同理心','情绪劫持'] },
      { name: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', concepts: ['三种自我状态','情绪自主权','适应型儿童'] },
      { name: '亲密关系', author: '罗兰·米勒', concepts: ['投射机制','冲突处理','暂停而不逃避'] },
      { name: '被讨厌的勇气', author: '岸见一郎', concepts: ['课题分离','共同体感觉'] },
      { name: '鬼谷子', author: '王诩', concepts: ['捭阖之道','不确定先阖'] },
      { name: '悉达多', author: '赫尔曼·黑塞', concepts: ['接纳矛盾和复杂性'] },
      { name: '七个习惯', author: '史蒂芬·柯维', concepts: ['积极主动','不做被动反应'] },
      { name: '自卑与超越', author: '阿尔弗雷德·阿德勒', concepts: ['社会兴趣','情商的底层是关心他人'] },
      { name: '也许你该找个人聊聊', author: '洛莉·戈特利布', concepts: ['关系是改变的容器'] }
    ]
  }
};

const DOMAIN_NAMES = { delay: '拖延', anxiety: '焦虑', internal: '内耗', express: '表达', eq: '情绪' };

function buildSystemPrompt(domainKey, step) {
  const domain = BOOK_INDEX[domainKey];
  const domainName = DOMAIN_NAMES[domainKey];
  const booksList = domain.all.map(b => `《${b.name}》—${b.author}：${b.concepts.slice(0,2).join('、')}`).join('；');

  const stepGuides = {
    1: `## 第一步：共情开场 + 初步诊断

执行规范：
1. **先接情绪**：用1-2句话回应用户此刻的感受（"听得出来你现在挺难的"、"这种感觉真的很折腾人"）
2. **再诊断模式**：说出你听到的**具体模式**——不是"你有拖延症"，而是"你在用XX来回避XX"或者"我听到你在纠结XX"
3. **最后追问**：一个**具体的开放式问题**，帮助他补充细节

禁忌：绝对不要说"你点了XX——这是XX脉里常见的"这种客服式话术。不要给选项式假追问。

输出：150-250字，口语化，像朋友聊天。`,

    2: `## 第二步：原因分析 + 深挖追问

执行规范：
1. **逐层分析**：从行为层→情绪层→认知层。比如"刷手机回避工作"→"怕做不好的焦虑"→"完美主义信念"
2. **引用书籍**：至少引用一本知识库里的书（直接写书名+核心洞察）
3. **归因拆解**：用2-4个点把问题拆清楚
4. **深挖追问**：选最深的那一个点挖到底——"我想确认：你觉得这个模式最早是怎么开始的？"

禁忌：不要用"是怕做不好？还是怕失控？还是怕别人看法？"这种选项式假追问。选一个最深的挖。

输出：300-500字。`,

    3: `## 第三步：问题拆解 + 良方输出

问题拆解（2-4点）：
- 标注【可立即行动】/【短期调整】/【中期改善】/【长期建设】
- 每点一句话

良方输出格式（必须基于知识库书籍）：
📖 处方笺

来自：《书名》— 作者
核心洞察：一句话（精准对应用户的问题）
你的良方：
1. ★ （今天就能做）具体动作
2. ★★ （进阶级）具体动作
3. ★★★ （挑战级）具体动作
送你一句话：书中金句

收尾：温柔鼓励，指出今晚就能试的第一条，留多轮深聊入口。

禁忌：绝对不能说"坦诚告诉你：我的知识库里目前没有"。21本书足够覆盖，选最接近的。

输出：400-600字。良方是2-3本书的组合。`
  };

  return `你是「纸上良方」APP的问诊台AI。你是一位**温暖、有洞察力、像朋友一样的心理咨询师**，擅长通过深聊帮人找到问题的真实原因，并给出基于书籍的具体可执行的建议。

## 当前问题域：${domainName}

${domain.core}

## 七步诊断框架（当前是第${step}步）
${stepGuides[step]}

## 书籍知识库（必须从中选书引用，不能编造）
${booksList}

## 风格规范
- **像朋友聊天**：用"我"、"你"，口语化，不要用"建议你"、"你应该"
- **共情前置**：先接情绪，再分析，最后给建议
- **追问挖真**：每次追问必须是开放式、挖深层的
- **不说教不评判**：用户说什么都不否定
- **有温度**：可以用"嗯"、"我理解"、"这真的很不容易"
- **绝对不说模板话**：不说"这是XX脉里常见的"、"建议你试试"

## 能力边界
如果出现自杀/自伤/严重精神病征兆，立即建议拨打心理援助热线。

现在开始对话。`;
}

export default {
  async fetch(request, env, ctx) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers, status: 405 });
    try {
      const body = await request.json();
      const { domain, history = [], step, text } = body;
      if (!domain || !text || !step) return new Response(JSON.stringify({ error: '缺少必要参数' }), { headers, status: 400 });
      if (!BOOK_INDEX[domain]) return new Response(JSON.stringify({ error: '未知问题域' }), { headers, status: 400 });
      if (!env.AI) return new Response(JSON.stringify({ error: 'AI未绑定' }), { headers, status: 500 });

      const systemPrompt = buildSystemPrompt(domain, step);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.flatMap(h => [
          { role: 'user', content: h.user },
          { role: 'assistant', content: h.bot }
        ]),
        { role: 'user', content: text }
      ];

      const maxTokens = step === 3 ? 800 : (step === 2 ? 600 : 400);
      const aiRes = await env.AI.run(MODEL, { messages, temperature: 0.7, max_tokens: maxTokens, repetition_penalty: 0.85, presence_penalty: 0.6 });
      let aiResponse = aiRes.response || '';

      let prescription = null;
      if (step === 3) {
        try {
          const pxRes = await env.AI.run(MODEL, {
            messages: [
              { role: 'system', content: `你是书籍推荐引擎。问题域：${DOMAIN_NAMES[domain]}。从以下书里选2-3本最匹配的，输出严格JSON：${JSON.stringify(BOOK_INDEX[domain].all.map(b=>({name:b.name,author:b.author,concepts:b.concepts})))}` },
              { role: 'user', content: `用户说：${text}。完整上下文：${history.map(h=>h.user).join(' → ')}。输出：{"books":[{"name":"书名 — 作者","insight":"一句话洞察"}], "steps":[{"level":"★","action":"具体动作"}], "quote":"金句"}。insight必须精准对应用户问题。只输出JSON。` }
            ],
            temperature: 0.4, max_tokens: 400
          });
          const jsonStr = (pxRes.response || '').trim().replace(/^```json\n?|\n?```$/g, '');
          const parsed = JSON.parse(jsonStr);
          prescription = { books: parsed.books || [], steps: parsed.steps || [], quote: parsed.quote || '' };
        } catch (pxErr) {
          const fb = BOOK_INDEX[domain].all[0];
          prescription = { books: [{ name: `${fb.name} — ${fb.author}`, insight: BOOK_INDEX[domain].core }], steps: [{ level: '★', action: '今晚选一件最小的事先做5分钟' }, { level: '★★', action: '把"开始"设计得极简——只做第一步' }, { level: '★★★', action: '连续三天后微微加量' }], quote: fb.concepts[0] };
        }
      }

      return new Response(JSON.stringify({ response: aiResponse, prescription }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: '服务异常: ' + e.message }), { headers, status: 500 });
    }
  }
};
