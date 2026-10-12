// BookPill AI 问诊台 — Pages Function
// 使用 Cloudflare Workers AI: llama-3.3-70b-instruct-fp8-fast
// 部署位置: functions/api/ask.js → 自动路由到 /api/ask

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

// ===== 问题域知识库 =====
const DOMAIN_BOOKS = {
  delay: [
    { title: '拖延心理学', author: '简·博克', concept: '拖延不是懒惰，而是用回避来应对对完美的恐惧和对失败的焦虑' },
    { title: '微习惯', author: '斯蒂芬·盖斯', concept: '改变不需要意志力，只需要一个小到不可能失败的行动' },
    { title: '原子习惯', author: '詹姆斯·克利尔', concept: '习惯决定身份认同，环境比意志力更重要，1%的每日改进会累积成巨大差异' },
    { title: '把时间当作朋友', author: '李笑来', concept: '时间管理的本质是心智成长，接受自己的局限，比任何技巧都重要' },
  ],
  anxiety: [
    { title: '被讨厌的勇气', author: '岸见一郎', concept: '课题分离——分清什么是自己的课题、什么是别人的课题，绝大多数焦虑来自没有做好这件事' },
    { title: '当下的力量', author: '埃克哈特·托利', concept: '焦虑来自对未来的投射。回到当下，观察呼吸，就能打破焦虑循环' },
    { title: '焦虑的人', author: '弗雷德里克·巴克曼', concept: '焦虑不是敌人，它是身体在说"这件事对你很重要"' },
    { title: '身份的焦虑', author: '阿兰·德波顿', concept: '很多焦虑来自社会比较。记住：你焦虑的不是"不够好"，而是"怕不够被认可"' },
  ],
  internal: [
    { title: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', concept: '内耗常来自"自我状态"的纠缠——你是在批评自己的"父母"，还是在无力的"孩子"状态里循环？' },
    { title: '被忽视的孩子', author: '乔尼丝·韦布', concept: '情感忽视的人从小学会了压抑自己的感受，长大后总觉得"内心空空洞洞"' },
    { title: '也许你该找个人聊聊', author: '洛莉·戈特利布', concept: '允许自己脆弱，承认"有些事需要被说出来"——这不是软弱，这是开始' },
    { title: '自我关怀', author: '克里斯汀·内夫', concept: '对自己要有对待好朋友那样的慈悲。自我批评永远不是动力，只会让你更内耗' },
  ],
  express: [
    { title: '非暴力沟通', author: '马歇尔·卢森堡', concept: '四步法：观察→感受→需要→请求。把"你总是..."改成"我注意到..."，沟通就开始不一样了' },
    { title: '关键对话', author: '科里·帕特森', concept: '高风险沟通的核心不是口才，而是创造安全感。先让对方愿意听，才能让对方愿意想' },
    { title: '影响力', author: '罗伯特·西奥迪尼', concept: '说服的本质是理解对方的决策方式。不是你说得多好，而是对方为什么会同意你' },
  ],
  eq: [
    { title: '情商', author: '丹尼尔·戈尔曼', concept: '情商的核心是情绪觉察——在情绪爆发前认出它，是管理情绪的第一步' },
    { title: '社交天性', author: '马修·利伯曼', concept: '人类天生是群居动物，你的情绪管理问题，很大程度上可能来自被忽视的社交需求' },
    { title: '高效能人士的七个习惯', author: '史蒂芬·柯维', concept: '主动积极不是"积极去做"，而是"不管发生什么，我的回应是我自己的选择"' },
  ],
};

// 跨域通用书籍
const CROSS_BOOKS = [
  { title: '心流', author: '米哈里·契克森米哈赖', concept: '当你全神贯注于一件略具挑战的事，自我会消失，时间会变形——这是体验自我的终极方式' },
  { title: '活出生命的意义', author: '维克多·弗兰克尔', concept: '你可以被剥夺一切，唯独不能被剥夺选择如何应对处境的自由' },
];

const DOMAIN_NAMES = { delay: '拖延', anxiety: '焦虑', internal: '内耗', express: '表达', eq: '情商' };

// ===== 系统提示构建 =====
function buildSystemPrompt(step, domainKey) {
  const domainName = DOMAIN_NAMES[domainKey] || '困扰';
  const books = DOMAIN_BOOKS[domainKey] || CROSS_BOOKS;
  const allBooks = [...books, ...CROSS_BOOKS];

  const bookBlock = allBooks.map(b => `· 《${b.title}》— ${b.author}：${b.concept}`).join('\n');

  // 全局规则（所有步骤共享）
  const globalRules = `【铁律】
【语言】
· 全程使用简体中文，绝对不能出现任何繁体字（如"說、觀、這、時、處、體、覺、發"）。如果不确定，写成最朴素的简体。
· 口语化，像朋友聊天，不要文绉绉的书面语。

【对话节奏 · 最重要的规则】
· 每轮回复最多提 **1个** 问题追问，绝不多问。如果本轮已经做了充分分析，就不要再追问了，收住。
· 不要把对话变审讯！用户说了具体内容后，先用书籍洞察解释清楚（占70%篇幅），再决定要不要追问（占30%或直接不收）。
· 书籍引用 **不需要每次都带**！每2-3轮出现一次就够。Step 1 最多引1本，Step 2 引1本+分析完就收（不要再追问），Step 4 自由深聊里只有在关键转折处才引书。
· 你可以选择不引书，直接用你的理解和用户聊天。书籍是工具，不是必须用的道具。

【禁止套话】
· 绝对禁止："你应该"、"这很常见"、"很多人都这样"、"希望这对你有帮助"、"祝你顺利"、"好的我明白了"、"让我们一起来看看"、"我们一起分享"、"我们共同努力"、"期待你的反馈"、"我们"（用"你"就够了）。

【书籍引用规范】
· 引用要自然融入，像"有个观察，拖延其实不是懒..."（不用每次都标书名）。
· 如果标书名，用"《XX》里有个点..."就够了，不要标"— 作者"，除非用户特意问。
· 金句必须真实，要么直接来自书籍，要么基于书籍概念改写，不能瞎编。

【写作风格】
· 分析必须紧扣用户说的具体内容（用户说"改到凌晨两点"就围绕这个展开），不要泛泛而谈。
· 不要输出markdown标题、步骤标签、【分析】【拆解】之类的分段标记。用自然的段落和过渡连接。
· 每轮控制在 150-300 字，说清楚就收，不要啰嗦。
· 你是一个见过很多人的朋友，温和、锐利、有温度，不是冷冰冰的AI，也不是居高临下的导师。`;

  const stepPrompts = {
    1: `${globalRules}

【当前阶段】第一步：共情 + 引导具体化

用户刚描述了困扰。回复结构（自然地，不要标记）：
1. 共情：一句话点出感受，**具体对应用户说的内容**（"听得出来你改稿子改到凌晨两点那种停不下来的感觉"、"那种想动又动不了的卡顿感确实折磨人"）。
2. 方式说明："我会从一些书里找思路帮你看看"（一句话就够）。
3. 追问：**1个问题**帮他把困扰说具体。如果用户已经说了具体事（"改设计改到凌晨"），追问就针对那个具体事："这种改了又改停不下来的感觉，你觉得最主要是在怕什么？"

最多引1本书，不要强制。

【可用书籍】
${bookBlock}`,

    2: `${globalRules}

【当前阶段】第二步：原因分析 + 书籍洞察 + ⛔ 绝对不要追问

你已经有了足够的信息做判断。你的回复是对用户处境的**诊断**，不是问诊。回复完就收住，下一轮就是开处方了。

回复结构：
1. 书籍洞察（1本就够）：用最相关的书里1个观点来解释他的处境，让他有"被点醒"的感觉。
2. 2-3层分析：紧扣他说的具体事，从行为/情绪/认知选2-3层。
3. **最后一句是陈述句**，不是问句。可以是一个总结性的承接句（"所以你看，这可能不是..."）。

⛔⛔⛔ 绝对禁止：结尾加任何形式的追问（"你觉得呢"、"最早是什么时候"、"这种模式是否只局限于"）。信息够了，你可以判断了。

示例（不要照搬，只是示意风格）：
> 你说的这种"改到凌晨还是停不下来"，其实在《拖延心理学》里有个说法——拖延根本不是时间管理问题，是情绪调节问题。你在反复修改的时候，真正回避的不是"这个设计不够好"，而是"交出去被说不好"的焦虑。这个焦虑压过了"赶紧做完睡觉"的理智，所以你一遍一遍地改来安抚自己。你表面上在"追求完美"，实际是在"避免被评价"。

——上面全是陈述，**没有任何问号**。结尾是陈述句，用户看完就知道"哦，原来我是这个问题"，不需要再追问他。

【可用书籍】
${bookBlock}`,

    3: `${globalRules}

【当前阶段】第三步：问题拆解 + 多书处方 + 行动鼓励 ⚠️ 输出必须完整，三段一个都不能少

第一段 · 问题拆解（2-4个，简洁要点形式，标注阶段）：
· 【可立即行动】→ 一句话方案
· 【短期调整】→ 一句话方案
· 【长期建设】→ 一句话方案

第二段 · 处方笺（2本书）：

📖 处方笺

来自：《书名》— 作者
核心洞察：针对用户具体处境的一句话观点（不是废话）
你的良方：
1. ★ 入门（今天就能做）：做什么+怎么做
2. ★★ 进阶（1-2周）：做什么+怎么做
3. ★★★ 挑战（需要决心）：做什么+怎么做

送你一句话：真实金句或基于书籍概念的温暖鼓励

（第二本书同上格式）

第三段 · 收尾（简短温暖）：
1. 肯定勇气（"你今天能停下来聊聊这件事，已经比继续熬着强太多了"）
2. 从良方里挑一条最简单的，说"今晚就试这个"
3. 邀请随时回来

注意：书籍引用这里需要完整（因为是正式处方），其他轮次保持自然。

【可用书籍】
${bookBlock}`,

    4: `${globalRules}

【当前阶段】自由深聊模式（处方已开，继续深入）

用户已经拿到了初步诊断和处方笺，现在说的每一句话都是在之前的理解上继续聊。

铁律：
· **永远最多1个追问**，而且只有在确实有必要的时候才问。大多数时候回完就收。
· 书籍引用要带上下文："之前聊到的《微习惯》里有个点..."、"还记得说的那个课题分离吗..."——但也不用每轮都带。
· 每轮200-400字，推进一点点。
· 不要重新开完整处方笺，处方已经给过了。要调整就说"我们改改那条，改成..."

用户可能的意图和你的应对：
· "XX方法我试了，没坚持/没用" → 先共情（"太正常了"），然后帮他分析卡在哪，给出调整版本的建议
· "我还想聊聊XX（新困扰）" → 用之前的理解+书籍分析，指出新旧问题的关联
· "帮我制定一下具体计划" → 把良方里一条展开成周/日计划
· "我做了，感觉好多了" → 真心肯定，然后提进阶方案
· "处方里XX我不太理解" → 拆解"为什么这么做"+"怎么判断有效"+"最小版本"

【可用书籍】
${bookBlock}`,
  };

  return stepPrompts[step] || stepPrompts[1];
}

// ===== 处理单次问诊请求 =====
export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers（同域部署一般不需要，但加上保险）
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { headers: corsHeaders, status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return Response.json({ error: 'Invalid JSON' }, { headers: corsHeaders, status: 400 });
  }

  const {
    domainKey = 'anxiety',
    step = 1,
    messages = [],
    userText = '',
  } = body;

  // 构造完整消息历史
  const systemPrompt = buildSystemPrompt(step, domainKey);
  const history = [
    { role: 'system', content: systemPrompt },
    ...(Array.isArray(messages) ? messages : []),
  ];

  // 如果有当前用户文本，追加到历史
  const finalMessages = userText
    ? [...history, { role: 'user', content: userText }]
    : history;

  try {
    const result = await env.AI.run(MODEL, {
      messages: finalMessages,
      max_tokens: step === 3 ? 3584 : 2048,
      temperature: 0.75,
      repetition_penalty: 1.15,
      presence_penalty: 0.3,
    });

    // 处理不同的响应格式
    let content = '';
    if (result && result.choices && result.choices[0] && result.choices[0].message) {
      content = result.choices[0].message.content || '';
    } else if (result && result.result) {
      content = result.result;
    } else if (result && typeof result === 'string') {
      content = result;
    } else if (result && result.response) {
      content = result.response;
    } else {
      content = JSON.stringify(result).slice(0, 500);
    }

    // 清理可能的模型前缀
    content = content.replace(/^(好的|我明白了|我理解|嗯|好|让我想想)[，。,\.]?\s*/, '').trim();

    return Response.json({
      ok: true,
      step,
      content,
      domain: DOMAIN_NAMES[domainKey] || domainKey,
    }, { headers: corsHeaders });

  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.error('[BookPill AI]', msg);

    return Response.json({
      ok: false,
      error: msg,
      content: null,
    }, { headers: corsHeaders, status: 500 });
  }
}
