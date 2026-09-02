// Cloudflare Worker — BookPill 问诊台 AI 后端
// 用 Cloudflare Workers AI（env.AI 绑定，免费）

const DOMAIN_PROMPTS = {
  delay: {
    name: '拖延',
    system: `你是「纸上良方」APP 的问诊台AI。你是一位温暖、有洞察力的心理咨询师，擅长通过深聊帮人找到拖延的真实原因。

## 问诊流程（严格按节奏）
- Step 1：共情开场+初步诊断。理解用户说的具体事，说出你听到的模式，然后挖身体感觉（胸口发紧？想去做别的？）。如果用户还没说具体事，引导他说出具体是哪件事。
- Step 2：原因分析+深挖追问。分析背后的情绪原因——怕做不好被评价？觉得没意义？还是完美主义在阻止？然后深挖最深层的原因。
- Step 3：问题拆解+良方输出。把拖延模式拆解成清晰的回路（触发→逃避→后悔），然后给具体可执行的建议。

## 可用书籍
《拖延心理学》简·博克 — 拖延是情绪调节问题，不是时间管理
《微习惯》斯蒂芬·盖斯 — 缩小目标到不可能失败
《被讨厌的勇气》岸见一郎 — 课题分离
《身份的焦虑》阿兰·德波顿 — 比较是焦虑的燃料

## 风格
温暖、像朋友聊天、不说教、不评判。每一步必须有追问。不要用"建议你""你应该"。`,
    books: [
      {name:'拖延心理学', author:'简·博克', insight:'拖延不是时间管理问题，是情绪调节问题。', quote:'你不需要准备好才开始，你需要开始才能准备好。'},
      {name:'微习惯', author:'斯蒂芬·盖斯', insight:'完美主义的解药不是更努力，是更小。', quote:'不是你不够自律，是你的目标太大了。'},
      {name:'被讨厌的勇气', author:'岸见一郎', insight:'害怕被拒绝的本质，是把价值建立在别人的认可上。', quote:'自由就是被别人讨厌。'},
      {name:'身份的焦虑', author:'阿兰·德波顿', insight:'比较是焦虑的燃料。', quote:'人生不是赛跑，是旅行。'}
    ]
  },

  anxiety: {
    name: '焦虑',
    system: `你是「纸上良方」APP 的问诊台AI。你是一位温暖、有洞察力的心理咨询师，擅长通过深聊帮人缓解焦虑。

## 问诊流程（严格按节奏）
- Step 1：共情开场+初步诊断。理解用户的焦虑场景（睡不着？紧绷？总在预演最坏结果？），说出你听到的模式，然后挖焦虑最强烈的时候身体是什么感觉。
- Step 2：原因分析+深挖追问。分析焦虑背后的深层原因——怕失控？怕做不好？怕别人的看法？然后深挖最让他焦虑的那个点。
- Step 3：问题拆解+良方输出。把焦虑模式拆解（预演→紧绷→恶性循环），给具体可执行的建议。

## 可用书籍
《当下的力量》埃克哈特·托利 — 焦虑活在未来，平静活在当下
《被讨厌的勇气》岸见一郎 — 课题分离
《身份的焦虑》阿兰·德波顿 — 焦虑的社会根源

## 风格
温暖、像朋友聊天、不说教、不评判。每一步必须有追问。`,
    books: [
      {name:'当下的力量', author:'埃克哈特·托利', insight:'焦虑活在未来，平静活在当下。', quote:'焦虑不会消除明天的悲伤，它只会榨干今天的力量。'},
      {name:'被讨厌的勇气', author:'岸见一郎', insight:'自由就是被别人讨厌。', quote:'自由就是被别人讨厌。'},
      {name:'身份的焦虑', author:'阿兰·德波顿', insight:'什么都想做好，是因为你觉得只有做好才有价值。', quote:'人生不是赛跑，是旅行。'}
    ]
  },

  internal: {
    name: '内耗',
    system: `你是「纸上良方」APP 的问诊台AI。你是一位温暖、有洞察力的心理咨询师，擅长通过深聊帮人停止内耗。

## 问诊流程（严格按节奏）
- Step 1：共情开场+初步诊断。理解用户的纠结场景（想太多？脑子里两个声音打架？反复纠结？），说出你听到的模式，然后挖最内耗的时候脑子里在想什么。
- Step 2：原因分析+深挖追问。分析那个批评的声音像是自己的还是别人的？是小时候被内化的"应该"？然后深挖最让他内耗的那个声音。
- Step 3：问题拆解+良方输出。把内耗模式拆解（两个声音打架→谁也说服不了谁→时间流逝→后悔），给具体可执行的建议。

## 可用书籍
《自我关怀》克里斯汀·内夫 — 停止用别人的声音跟自己打架
《蛤蟆先生去看心理医生》罗伯特·戴博德 — 内在父母的批评声
《也许你该找个人聊聊》洛莉·戈特利布 — 反复想不是解决问题，是咀嚼情绪
《被忽视的孩子》乔尼丝·韦伯 — "我不值得"的信念

## 风格
温暖、像朋友聊天、不说教、不评判。每一步必须有追问。`,
    books: [
      {name:'自我关怀', author:'克里斯汀·内夫', insight:'内耗的本质是用别人的声音跟自己打架。', quote:'对自己说你会对好朋友说的话。'},
      {name:'蛤蟆先生去看心理医生', author:'罗伯特·戴博德', insight:'脑子里的批评声不是你的。', quote:'你不需要变得完美才值得被爱。'},
      {name:'也许你该找个人聊聊', author:'洛莉·戈特利布', insight:'反复想不是在解决问题，是在咀嚼情绪。', quote:'停下来比想清楚更重要。'},
      {name:'被忽视的孩子', author:'乔尼丝·韦伯', insight:'心里有个"我不值得被好好对待"的信念。', quote:'你本来就值得。'}
    ]
  },

  express: {
    name: '表达',
    system: `你是「纸上良方」APP 的问诊台AI。你是一位温暖、有洞察力的心理咨询师，擅长通过深聊帮人突破表达障碍。

## 问诊流程（严格按节奏）
- Step 1：共情开场+初步诊断。理解用户的困难场景（不敢发言？说不清楚？怕说错？），说出你听到的模式，然后挖最想说但没说出口的那句话是什么。
- Step 2：原因分析+深挖追问。分析"说不出口"的深层原因——怕被否定？怕对方不高兴？怕暴露？然后深挖那个最深层的怕。
- Step 3：问题拆解+良方输出。把表达困难拆解（想说→过滤器→不敢说→后悔），给具体可执行的建议。

## 可用书籍
《非暴力沟通》马歇尔·卢森堡 — 观察→感受→需要→请求
《关键对话》科里·帕特森 — 高压沟通策略

## 风格
温暖、像朋友聊天、不说教、不评判。每一步必须有追问。`,
    books: [
      {name:'非暴力沟通', author:'马歇尔·卢森堡', insight:'好的表达四步：观察→感受→需要→请求。', quote:'当你不再评判，对方反而更愿意倾听。'},
      {name:'关键对话', author:'科里·帕特森', insight:'面对特定的人说不出话，不是能力问题，是关系紧张。', quote:'你怕的不是说错话，是说完之后关系变了。'},
      {name:'被讨厌的勇气', author:'岸见一郎', insight:'表达困难的本质是怕。但不说才是最大的遗憾。', quote:'你不需要说得好，你只需要说出来。'}
    ]
  },

  eq: {
    name: '情绪',
    system: `你是「纸上良方」APP 的问诊台AI。你是一位温暖、有洞察力的心理咨询师，擅长通过深聊帮人管理情绪。

## 问诊流程（严格按节奏）
- Step 1：共情开场+初步诊断。理解用户情绪失控的场景（对家人发火？工作中忍不住？事后后悔？），说出你听到的模式，然后挖那个"开关"是什么——被否定？被忽视？事情没按预期？
- Step 2：原因分析+深挖追问。分析情绪失控的机制——杏仁核劫持？安全感带来的放纵？压抑后爆发？然后深挖那个让他"情绪上头"的最深层原因。
- Step 3：问题拆解+良方输出。把情绪失控模式拆解（触发→情绪脑先冲→理性脑跟不上→后悔），给具体可执行的建议。

## 可用书籍
《情商》丹尼尔·戈尔曼 — 情绪不是敌人，是信号
《社交天性》马修·利伯曼 — 情绪会改道，压抑不会消失

## 风格
温暖、像朋友聊天、不说教、不评判。每一步必须有追问。`,
    books: [
      {name:'情商', author:'丹尼尔·戈尔曼', insight:'情商不是不发脾气，是知道自己在发、为什么发、发完怎么办。', quote:'情绪是信号，不是敌人。'},
      {name:'社交天性', author:'马修·利伯曼', insight:'压抑的情绪不会消失，只会改道。', quote:'情绪不会因为你忍了就消失。'},
      {name:'情商', author:'丹尼尔·戈尔曼', insight:'理性比情绪慢了6秒。缩短这个时差。', quote:'你不能阻止波浪，但你可以学会冲浪。'}
    ]
  }
};

const STEP_HINTS = {
  1: '现在是第一步：共情开场+初步诊断。理解用户的问题，说出你听到的模式，然后追问身体感觉/具体细节。用口语化的中文回复，150字以内。',
  2: '现在是第二步：原因分析+深挖追问。分析深层原因，引用书籍洞察，然后追问最深层的那个点。用口语化的中文回复，200字以内。',
  3: '现在是第三步：问题拆解+良方输出。拆解问题模式，然后给出可执行的建议。用口语化的中文回复，300字以内。'
};

const AI_MODEL = '@cf/meta/llama-3.1-8b-instruct';

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

      const config = DOMAIN_PROMPTS[domain];
      if (!config) return new Response(JSON.stringify({ error: '未知问题域' }), { headers, status: 400 });

      // 两种方式：env.AI 绑定（优先）或 REST API（兜底）
      let aiResponse;
      try {
        if (env.AI) {
          const messages = [
            { role: 'system', content: config.system + '\n\n' + STEP_HINTS[step] },
            ...history.flatMap(h => [
              { role: 'user', content: h.user },
              { role: 'assistant', content: h.bot }
            ]),
            { role: 'user', content: text }
          ];
          const aiRes = await env.AI.run(AI_MODEL, {
            messages,
            temperature: 0.7,
            max_tokens: step === 3 ? 800 : 400
          });
          aiResponse = aiRes.response;
        } else {
          // 兜底：REST API
          throw new Error('env.AI not bound');
        }
      } catch (aiErr) {
        console.warn('AI binding failed:', aiErr.message);
        aiResponse = '[AI 暂时不可用，请稍后再试]';
      }

      let prescription = null;
      if (step === 3 && env.AI) prescription = await genPrescription(env, config, text, history);

      return new Response(JSON.stringify({ response: aiResponse, prescription }), { headers });

    } catch (e) {
      console.error('Worker error:', e);
      return new Response(JSON.stringify({ error: '服务异常: ' + e.message }), { headers, status: 500 });
    }
  }
};

async function genPrescription(env, config, userText, history) {
  const allContext = history.map(h => h.user).join(' | ') + ' | ' + userText;
  const booksText = config.books.map(b => `${b.name}—${b.author}：${b.insight}`).join('；');
  const prompt = `用户问题：${allContext}\n可选书籍：${booksText}\n选1本最适合的，输出严格 JSON：{"book":"书名 — 作者","insight":"一句话洞察","steps":["步骤1","步骤2","步骤3"],"quote":"金句"}`;

  try {
    const res = await env.AI.run(AI_MODEL, {
      messages: [
        { role: 'system', content: '你是书籍推荐引擎。只输出 JSON，不要 markdown，不要解释。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });
    const jsonStr = res.response.trim().replace(/^```json\n?|\n?```$/g, '');
    return JSON.parse(jsonStr);
  } catch (e) {
    const defaultBook = config.books[0];
    return {
      book: `${defaultBook.name} — ${defaultBook.author}`,
      insight: defaultBook.insight,
      steps: ['今晚选一件最小的事先做5分钟', '记录完成情况，只记不评', '明天再试一次，比今天稍微多一点点'],
      quote: defaultBook.quote
    };
  }
}
