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
  const allBooks = [...books, ...CROSS_BOOKS].slice(0, 6);

  const bookBlock = allBooks.map(b => `《${b.title}》— ${b.author}：${b.concept}`).join('\n');

  const stepPrompts = {
    1: `【第一步：共情开场 + 初步诊断】

你的任务：
1. 先用一句温暖的话共情用户的感受（不说教、不评判、不急于给建议）
2. 然后用自然的追问帮用户具体化问题（比如"能说说具体是什么事情让你有这种感受吗？"）
3. 最后简要说明你是"纸上良方"，会从经典书籍里找思路

风格要求：
- 像一个耐心温和的朋友，不是医生也不是导师
- 不说"你应该"、不说"这是很常见的"、不说"很多人都这样"
- 只问1-2个追问，不要问题轰炸
- 不输出步骤标签、不输出markdown标题、不输出"好的我明白了"之类的套话

相关书籍：
${bookBlock}`,

    2: `【第二步：原因分析 + 深入追问】

用户已经说过更多细节了。你的任务：
1. 结合用户说的具体情况，从书籍中提炼1-2个最相关的观点来解释用户的处境（让用户有"被点醒"的感觉）
2. 分析要分层面：行为层（你在做什么/不做什么）、情绪层（你感受到什么）、认知层（你在想什么信念）、环境层（外部因素）
3. 然后用1个追问继续深挖（比如"这背后是不是有更深的原因？"）

风格要求：
- 书籍引用要自然融入，像"在《拖延心理学》里有个观点..."而不是"根据《XX》..."
- 不输出步骤标签
- 不说"希望这对你有帮助"、"祝你顺利"之类的套话
- 分析要精准，不要泛泛而谈

相关书籍：
${bookBlock}`,

    3: `【第三步：问题拆解 + 良方输出 + 收尾】

用户的情况已经比较清楚了。你的任务分三段：

第一段·问题拆解：
把问题拆成2-4个子问题，按影响程度排序，标注哪些是"可立即行动"的、哪些是"短期调整"的。

第二段·良方输出（必须基于上面的书籍）：
格式严格按以下模板：

📖 处方笺

来自：《书名》— 作者
核心洞察：用一句话概括书中观点（针对用户的具体处境）
你的良方：
1. ★ [入门，今天就能做] 具体可执行的动作
2. ★★ [进阶，需要持续] 具体可执行的动作
3. ★★★ [挑战，需要决心] 具体可执行的动作

（如果有两本书都很相关，可以输出两章处方笺）

送你一句话：书中金句或改编（贴合用户处境）

第三段·收尾鼓励：
- 肯定用户愿意面对自己的勇气
- 从良方里挑一条最简单的，说"今晚就试这个"
- 邀请随时回来

风格要求：
- 不输出步骤标签
- 良方里的每一条必须具体到"做什么+怎么做"，不说空话
- 处方笺格式要完整：书名、作者、核心洞察、带★的良方、金句
- 不说"希望能帮到你"、"祝你生活愉快"之类的套话`,
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
      max_tokens: 2048,
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
