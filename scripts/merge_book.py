#!/usr/bin/env python3
"""
解析 GitHub Issue 投稿内容，自动将书籍数据写入 data.js
由 GitHub Action 在 Issue 被标记 "approved" 时触发
"""
import re
import json
import os

def parse_issue_body(body):
    """从 Issue 正文解析结构化数据"""
    def extract_section(label, text, multiline=False):
        """提取 ### 标题 下方的内容"""
        if multiline:
            pattern = r'###\s+' + re.escape(label) + r'\s*\n(.*?)(?=###|\Z)'
        else:
            pattern = r'###\s+' + re.escape(label) + r'\s*\n(.*?)(?=###|\Z)'
        m = re.search(pattern, text, re.DOTALL)
        if m:
            return m.group(1).strip()
        return ''

    # 兼容两种格式：Issue 模板（### 标题）和 submit.html 生成的文本
    # 从 Issue 模板提取字段
    fields = {}
    
    # 书名
    m = re.search(r'书名.*?\n(.+)', body)
    fields['title'] = m.group(1).strip().replace('《','').replace('》','') if m else ''
    
    # 作者
    m = re.search(r'作者.*?\n(.+)', body)
    fields['author'] = m.group(1).strip() if m else ''
    
    # 问题域
    m = re.search(r'问题域.*?\n(.+)', body)
    domain_str = m.group(1).strip() if m else ''
    # 提取问题域关键词
    domains = []
    for d in ['拖延','焦虑','内耗','表达','情商']:
        if d in domain_str:
            domains.append(d)
    if not domains:
        domains = ['内耗']  # 默认
    fields['domain'] = domains
    
    # 推荐场景
    m = re.search(r'推荐场景.*?\n(.+)', body)
    fields['scene'] = m.group(1).strip() if m else ''
    
    # 核心观点
    m = re.search(r'核心观点.*?\n(.*?)(?=###|良方|金句|适用|补充|---|\Z)', body, re.DOTALL)
    fields['coreView'] = m.group(1).strip() if m else ''
    
    # 良方/建议步骤
    m = re.search(r'良方.*?\n(.*?)(?=###|金句|适用|补充|---|\Z)', body, re.DOTALL)
    fields['steps'] = m.group(1).strip() if m else ''
    
    # 金句
    m = re.search(r'金句.*?\n(.*?)(?=###|适用|补充|---|\Z)', body, re.DOTALL)
    fields['quotes'] = m.group(1).strip() if m else ''
    
    # 适用人群
    m = re.search(r'适用人群.*?\n(.+)', body)
    fields['audience'] = m.group(1).strip() if m else ''
    
    return fields

def build_js_entry(fields, issue_number, contributor):
    """生成 data.js 条目"""
    title = fields.get('title','').replace('"','\\"')
    author = fields.get('author','').replace('"','\\"')
    domains = json.dumps(fields.get('domain', ['内耗']), ensure_ascii=False)
    scene = fields.get('scene','').replace('"','\\"').replace('\n',' ')
    core_view = fields.get('coreView','').replace('"','\\"').replace('\n',' ')
    steps = fields.get('steps','').replace('"','\\"').replace('\n',' ')
    quotes = fields.get('quotes','').replace('"','\\"').replace('\n',' ')
    audience = fields.get('audience','').replace('"','\\"').replace('\n',' ')
    
    entry = """  {
    title:'%s',author:'%s',domain:%s,
    scene:'%s',
    coreView:'%s',
    steps:'%s',
    quotes:'%s',
    audience:'%s',
    source:'community#%d',contributor:'%s'
  }""" % (title, author, domains, scene, core_view, steps, quotes, audience, issue_number, contributor)
    
    return entry

def insert_into_datajs(entry):
    """将新条目插入 data.js 的 LOCAL_BOOK_CATALOG 数组末尾"""
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到 LOCAL_BOOK_CATALOG 数组的最后一个 ] 的位置
    # 策略：找到 "var LOCAL_BOOK_CATALOG = [" 之后第一个单独的 ]
    catalog_start = content.find('var LOCAL_BOOK_CATALOG = [')
    if catalog_start == -1:
        catalog_start = content.find('var LOCAL_BOOK_CATALOG=[')
    
    if catalog_start == -1:
        raise Exception("找不到 LOCAL_BOOK_CATALOG 定义")
    
    # 从数组开始处向后搜索，找到数组结束的 ]
    # 需要找到匹配的括号位置
    bracket_count = 0
    i = catalog_start + content[catalog_start:].find('[')
    array_end = -1
    in_string = False
    string_char = None
    
    while i < len(content):
        c = content[i]
        # 处理字符串
        if in_string:
            if c == string_char and content[i-1] != '\\':
                in_string = False
        else:
            if c in '"\'':
                in_string = True
                string_char = c
            elif c == '[':
                bracket_count += 1
            elif c == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    array_end = i
                    break
        i += 1
    
    if array_end == -1:
        raise Exception("找不到 LOCAL_BOOK_CATALOG 数组结束位置")
    
    # 在 ] 之前插入新条目
    # 找到最后一个 } 的位置，在它后面加逗号和条目
    before_end = content[:array_end].rstrip()
    if before_end.endswith('}'):
        # 在最后一个 } 后添加逗号和新条目
        new_content = before_end + ',\n' + entry + '\n' + content[array_end:]
    else:
        # 数组可能为空或已有逗号
        new_content = before_end + '\n' + entry + '\n' + content[array_end:]
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    issue_title = os.environ.get('ISSUE_TITLE', '')
    issue_body = os.environ.get('ISSUE_BODY', '')
    issue_number = int(os.environ.get('ISSUE_NUMBER', '0'))
    issue_author = os.environ.get('ISSUE_AUTHOR', 'unknown')
    
    print(f"解析 Issue #{issue_number}: {issue_title}")
    print(f"投稿人: {issue_author}")
    
    # 解析数据
    fields = parse_issue_body(issue_body)
    print(f"书名: {fields.get('title','')}")
    print(f"作者: {fields.get('author','')}")
    print(f"问题域: {fields.get('domain','')}")
    
    if not fields.get('title'):
        print("⚠️ 无法解析书名，退出")
        return
    
    # 生成 JS 条目
    entry = build_js_entry(fields, issue_number, issue_author)
    print(f"\n生成的条目:\n{entry}")
    
    # 插入 data.js
    insert_into_datajs(entry)
    print("\n✅ data.js 已更新")
    
    # 同时写入 community 目录的 md 文件（供 Skill 使用）
    md_filename = f"skills/bookpill/references/community/{fields['title']}.md"
    os.makedirs(os.path.dirname(md_filename), exist_ok=True)
    md_content = f"""# {fields.get('title','')}

- **作者**: {fields.get('author','')}
- **问题域**: {', '.join(fields.get('domain',[]))}
- **推荐场景**: {fields.get('scene','')}
- **投稿人**: {issue_author}
- **Issue**: #{issue_number}

## 核心观点
{fields.get('coreView','')}

## 良方
{fields.get('steps','')}

## 金句
{fields.get('quotes','')}

## 适用人群
{fields.get('audience','')}
"""
    with open(md_filename, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"✅ 已生成 {md_filename}")

if __name__ == '__main__':
    main()
