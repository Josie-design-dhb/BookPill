/**
 * BookPill Supabase 公共库
 * 提供投稿、查询、审核功能
 * 不依赖 supabase-js SDK，直接用 fetch 调 REST API
 */
(function(){
  var cfg = window.BP_SUPABASE || {};
  var BASE = cfg.url;
  var KEY = cfg.anonKey;
  var TABLE = cfg.table || 'bookpill_books';

  // 简单的 POST/GET/PATCH 封装
  function api(method, path, body){
    var headers = {
      'apikey': KEY,
      'Authorization': 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    var opts = { method: method, headers: headers, mode: 'cors' };
    if(body) opts.body = JSON.stringify(body);
    return fetch(BASE + path, opts).then(function(r){
      if(!r.ok){
        var errText = '';
        try { errText = r.statusText; } catch(e){}
        throw new Error('HTTP ' + r.status + ' ' + errText);
      }
      // 201 Created 或其他 2xx
      if(r.status === 204 || r.status === 205) return {};
      return r.json();
    }).catch(function(e){
      if(e.name === 'TypeError' && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))){
        throw new Error('网络连接失败，请检查网络或开启 VPN 后重试');
      }
      throw e;
    });
  }

  // RPC 函数调用
  function rpc(fn, params){
    var headers = {
      'apikey': KEY,
      'Authorization': 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    // 函数名转为小写
    var fnLower = fn.toLowerCase();
    return fetch(BASE + '/rest/v1/rpc/' + fnLower, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params || {})
    }).then(function(r){
      if(!r.ok){
        var errText = '';
        try { errText = r.statusText; } catch(e){}
        throw new Error('HTTP ' + r.status + ' ' + errText);
      }
      return r.json();
    }).catch(function(e){
      if(e.name === 'TypeError' && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))){
        throw new Error('网络连接失败，请检查网络');
      }
      throw e;
    });
  }

  // ========== 公开 API ==========

  var BP = {};

  /**
   * 投稿新书到 Supabase
   * @param {Object} book - 书籍数据
   * @returns {Promise}
   */
  BP.submitBook = function(book){
    return api('POST', '/rest/v1/' + TABLE, {
      title: book.title || '',
      author: book.author || '',
      domain: JSON.stringify(book.domain || []),
      scene: book.scene || '',
      core_view: book.coreView || '',
      steps: book.steps || '',
      quotes: book.quotes || '',
      audience: book.audience || '',
      book_desc: book.bookDesc || '',
      meta_info: book.metaInfo || '',
      contributor: book.contributor || '',
      note: book.note || '',
      status: 'pending'
    });
  };

  /**
   * 获取所有已审核通过的书籍
   * @returns {Promise<Array>}
   */
  BP.getApprovedBooks = function(){
    return api('GET', '/rest/v1/' + TABLE + '?status=eq.approved&order=approved_at.desc')
      .then(function(data){
        if(!data || !data.length) return [];
        return data.map(function(row){
          return {
            id: row.id,
            title: row.title,
            author: row.author,
            domain: parseJSON(row.domain, []),
            scene: row.scene || '',
            coreView: row.core_view || '',
            steps: row.steps || '',
            quotes: row.quotes || '',
            audience: row.audience || '',
            desc: row.book_desc || '',
            metaInfo: row.meta_info || '',
            contributor: row.contributor || '',
            source: 'community#' + row.id
          };
        });
      })
      .catch(function(){ return []; });
  };

  /**
   * 获取待审核书籍（管理员）
   */
  BP.adminGetPending = function(password){
    return rpc('admin_get_pending', { p_password: password });
  };

  /**
   * 获取所有书籍（管理员）
   */
  BP.adminGetAll = function(password){
    return rpc('admin_get_all', { p_password: password });
  };

  /**
   * 审核通过（管理员）
   */
  BP.adminApprove = function(password, id){
    return rpc('admin_approve', { p_password: password, p_id: id });
  };

  /**
   * 审核拒绝（管理员）
   */
  BP.adminReject = function(password, id){
    return rpc('admin_reject', { p_password: password, p_id: id });
  };

  function parseJSON(str, def){
    try { return typeof str === 'string' ? JSON.parse(str) : str; }
    catch(e){ return def; }
  }


  /**
   * 检查重复投稿（查询已收录书籍）
   * @param {string} title - 书名
   * @returns {Promise<boolean>}
   */
  BP.checkDuplicate = function(title){
    var query = '?title=ilike.' + encodeURIComponent(title.trim()) + '&status=eq.approved&select=id&limit=1';
    return api('GET', '/rest/v1/' + TABLE + query)
      .then(function(data){
        return data && data.length > 0;
      })
      .catch(function(){ return false; });
  };

  window.BookPillSupabase = BP;
})();
