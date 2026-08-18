-- ============================================
-- BookPill 书籍知识库 - Supabase Schema
-- 审核密码：bookpill2026
-- 可重复安全执行，已使用 DO 块处理冲突
-- ============================================

-- 1. 创建数据表
CREATE TABLE IF NOT EXISTS bookpill_books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  domain JSONB DEFAULT '[]'::jsonb,
  scene TEXT DEFAULT '',
  core_view TEXT DEFAULT '',
  steps TEXT DEFAULT '',
  quotes TEXT DEFAULT '',
  audience TEXT DEFAULT '',
  book_desc TEXT DEFAULT '',
  meta_info TEXT DEFAULT '',
  contributor TEXT DEFAULT '',
  note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- 2. 开启 RLS
DO $$
BEGIN
  ALTER TABLE bookpill_books ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 3. RLS 策略（使用 DO 块避免重复创建报错）
DO $$
BEGIN
  CREATE POLICY "public_submit" ON bookpill_books
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "public_read_approved" ON bookpill_books
    FOR SELECT TO anon, authenticated
    USING (status = 'approved');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. 审核用 RPC 函数（密码：bookpill2026）
CREATE OR REPLACE FUNCTION admin_get_pending(p_password TEXT)
RETURNS TABLE (
  id BIGINT, title TEXT, author TEXT, domain JSONB,
  scene TEXT, core_view TEXT, steps TEXT, quotes TEXT,
  audience TEXT, book_desc TEXT, meta_info TEXT,
  contributor TEXT, note TEXT, status TEXT, created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_password = 'bookpill2026' THEN
    RETURN QUERY SELECT * FROM bookpill_books WHERE status = 'pending' ORDER BY created_at DESC;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION admin_get_all(p_password TEXT)
RETURNS TABLE (
  id BIGINT, title TEXT, author TEXT, domain JSONB,
  scene TEXT, core_view TEXT, steps TEXT, quotes TEXT,
  audience TEXT, book_desc TEXT, meta_info TEXT,
  contributor TEXT, note TEXT, status TEXT, created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_password = 'bookpill2026' THEN
    RETURN QUERY SELECT * FROM bookpill_books ORDER BY created_at DESC;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION admin_approve(p_password TEXT, p_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_password = 'bookpill2026' THEN
    UPDATE bookpill_books SET status = 'approved', approved_at = NOW() WHERE id = p_id;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION admin_reject(p_password TEXT, p_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_password = 'bookpill2026' THEN
    UPDATE bookpill_books SET status = 'rejected' WHERE id = p_id;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_bookpill_status ON bookpill_books(status);
CREATE INDEX IF NOT EXISTS idx_bookpill_title ON bookpill_books(title);
