/* ============ 列表页 ============ */
function renderList(key, opts={}){
  const s = SCHEMA[key];
  const rows = db[key] || [];
  const kw = (searchTerm||'').trim().toLowerCase();
  let filtered = kw ? rows.filter(r => s.search.some(f => String(r[f]||'').toLowerCase().includes(kw))) : rows;

  if(key==='sources' && opts.grouped){
    const groups = {};
    filtered.forEach(r=>{
      const k = (r.item||'未命名') + ' ' + (r.spec||'');
      (groups[k] = groups[k] || []).push(r);
    });
    const list = Object.entries(groups).map(([k,arr])=>{
      const sorted = arr.slice().sort((a,b)=>(Number(a.price)||0)-(Number(b.price)||0));
      return {name:k, best:sorted[0], all:sorted, gap: sorted.length>1 ? ((Number(sorted[sorted.length-1].price)-Number(sorted[0].price))/Number(sorted[0].price)*100) : 0};
    });
    document.getElementById('content').innerHTML = `
      <h2 class="page-title">${s.name}</h2><div class="page-sub">${s.desc}</div>
      <div class="list-head">
        <div class="toolbar">
          <span class="chip" onclick="renderList('sources')">明细</span>
          <span class="chip on">按物料汇总</span>
        </div>
        <div class="toolbar">
          <button class="btn btn-ghost" onclick="openForm('sources')">+ 录入货源</button>
        </div>
      </div>
      <div class="card table-card"><div class="table-wrap"><table>
        <thead><tr><th>物料</th><th>最低价</th><th>最低价渠道</th><th>供应商</th><th>询价条数</th><th>价差</th><th>操作</th></tr></thead>
        <tbody>
        ${list.length? list.map(g=>`<tr>
          <td><b>${esc(g.name)}</b></td>
          <td class="num"><b style="color:#15803d">${money(g.best.price)}</b></td>
          <td><span class="badge b-blue">${esc(g.best.platform)}</span></td>
          <td>${esc(g.best.supplier||'—')}</td>
          <td class="num">${g.all.length}</td>
          <td class="num">${g.gap?`<span style="color:#b45309">↑ ${g.gap.toFixed(1)}%</span>`:'—'}</td>
          <td><button class="op" onclick="renderList('sources')">看明细</button></td>
        </tr>`).join('') : `<tr><td colspan="7"><div class="empty"><b>还没有货源记录</b>点右上角录入第一条比价</div></td></tr>`}
        </tbody></table></div></div>`;
    return;
  }

  document.getElementById('content').innerHTML = `
    <h2 class="page-title">${s.name}</h2><div class="page-sub">${s.desc}${kw?` · 搜索“${esc(kw)}”命中 ${filtered.length} 条`:''}</div>
    <div class="list-head">
      <div class="toolbar">
        <span class="chip on">全部 ${filtered.length}</span>
        ${key==='sources'?`<span class="chip" onclick="renderList('sources',{grouped:true})">按物料汇总比价</span>`:''}
      </div>
      <div class="toolbar">
        <button class="btn btn-ghost" onclick="exportCSV('${key}')">导出 CSV</button>
        <button class="btn btn-primary" onclick="openForm('${key}')">+ 新建${s.single}</button>
      </div>
    </div>
    <div class="card table-card"><div class="table-wrap"><table>
      <thead><tr>${s.table.map(k=>{
        if(k==='profit') return '<th>毛利率</th>';
        const f = s.fields.find(x=>x.key===k);
        return '<th>'+(f?f.label:k)+'</th>';
      }).join('')}<th>操作</th></tr></thead>
      <tbody>
      ${filtered.length? filtered.map(r=>`<tr>${s.table.map(k=>cell(r,k,s)).join('')}
        <td class="ops">
          ${(key==='payments'&&r.status==='待审批')?`<button class="op" onclick="approve(${r.id})">审批</button>`:''}
          <button class="op" onclick="openForm('${key}',${r.id})">编辑</button>
          <button class="op del" onclick="del('${key}',${r.id})">删除</button>
        </td></tr>`).join('') : `<tr><td colspan="${s.table.length+1}"><div class="empty"><b>还没有${s.single}</b>点右上角“新建${s.single}”开始</div></td></tr>`}
      </tbody></table></div></div>
  `;
}

function cell(r,k,s){
  const f = s.fields.find(x=>x.key===k)||{type:'text'};
  let v = r[k];
  if(k==='profit'){
    const p = profitRate(r);
    if(p===null) return `<td class="num">—</td>`;
    const color = p>=20?'#15803d':p>=10?'#b45309':'#be123c';
    return `<td class="num"><b style="color:${color}">${p.toFixed(1)}%</b></td>`;
  }
  if(v===''||v===null||v===undefined) return `<td style="color:#b3bbcb">—</td>`;
  if(f.type==='number'){
    const isMoney = ['amount','price','cost','deposit'].includes(k);
    return `<td class="num">${isMoney?money(v):Number(v).toLocaleString('zh-CN')}</td>`;
  }
  if(f.type==='select') return `<td><span class="badge ${badgeClass(v)}">${esc(v)}</span></td>`;
  if(k==='name'||k==='no'||k==='item'||k==='project') return `<td><b>${esc(v)}</b></td>`;
  if(k==='note') return `<td style="color:#6b7688;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(v)}">${esc(v)}</td>`;
  return `<td>${esc(v)}</td>`;
}

/* ============ 弹窗表单 ============ */
function openForm(key, id){
  editing = {key, id: id||null};
  const s = SCHEMA[key];
  const row = id ? (db[key].find(r=>r.id===id)||{}) : {};
  document.getElementById('modalTitle').textContent = (id?'编辑':'新建') + s.single;
  document.getElementById('modalBody').innerHTML = s.fields.map(f=>{
    const v = row[f.key]!==undefined ? row[f.key] : '';
    let ctl = '';
    if(f.type==='select'){
      ctl = `<select data-k="${f.key}">${f.options.map(o=>`<option ${String(v)===o?'selected':''}>${o}</option>`).join('')}</select>`;
    }else if(f.type==='textarea'){
      ctl = `<textarea data-k="${f.key}">${esc(v)}</textarea>`;
    }else{
      ctl = `<input data-k="${f.key}" type="${f.type==='number'?'number':f.type==='date'?'date':'text'}"
        ${f.step?`step="${f.step}"`:''} value="${esc(v)}" placeholder="请输入${f.label}" />`;
    }
    const span = f.wide ? 'grid-column:1/-1' : '';
    return `<div class="field" style="${span}"><label>${f.label}${f.required?' <span style="color:#e11d48">*</span>':''}</label>${ctl}</div>`;
  }).join('');
  document.querySelector('#modalBody').style.display='grid';
  document.querySelector('#modalBody').style.gridTemplateColumns='1fr 1fr';
  document.querySelector('#modalBody').style.gap='0 14px';
  document.getElementById('mask').classList.add('show');
  setTimeout(()=>{ const first=document.querySelector('#modalBody input,#modalBody select'); if(first) first.focus(); },80);
}
function closeModal(){ document.getElementById('mask').classList.remove('show'); editing=null; }
function saveForm(){
  if(!editing) return;
  const s = SCHEMA[editing.key];
  const obj = {};
  let bad = null;
  s.fields.forEach(f=>{
    const el = document.querySelector(`#modalBody [data-k="${f.key}"]`);
    let v = el.value.trim();
    if(f.type==='number') v = v===''?'':Number(v);
    if(f.required && (v===''||v===null)) bad = bad||f.label;
    obj[f.key] = v;
  });
  if(bad){ alert(`「${bad}」是必填项`); return; }
  if(editing.id){
    const idx = db[editing.key].findIndex(r=>r.id===editing.id);
    db[editing.key][idx] = Object.assign({}, db[editing.key][idx], obj);
    addLog(`更新${s.single}：${obj.no||obj.name||obj.item||obj.project||''}`);
  }else{
    const id = Date.now();
    db[editing.key].push(Object.assign({id}, obj));
    addLog(`新增${s.single}：${obj.no||obj.name||obj.item||obj.project||''}`);
  }
  persistAndRender();
  closeModal();
}
function del(key,id){
  if(!confirm('确定删除这条记录吗？')) return;
  db[key] = db[key].filter(r=>r.id!==id);
  addLog(`删除一条${SCHEMA[key].single}记录`);
  persistAndRender();
}
function approve(id){
  const p = db.payments.find(r=>r.id===id);
  if(!p) return;
  const ok = confirm(`审批通过「${p.no}」${money(p.amount)}？\n确定后状态变为“待付款”。`);
  if(!ok) return;
  p.status = '待付款';
  addLog(`老板通过了付款申请 ${p.no} ${money(p.amount)}`);
  persistAndRender();
}
function addLog(text){
  const now = new Date();
  const t = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')
    +' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const colors=['#2563eb','#16a34a','#f59e0b','#8a94a6'];
  db.logs = [{id:Date.now(),text,time:t,color:colors[Math.floor(Math.random()*colors.length)]}].concat(db.logs||[]).slice(0,30);
}
function persistAndRender(){
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  render();
}

/* ============ 渲染入口 ============ */
function render(){
  renderNav();
  if(current==='dashboard') renderDashboard();
  else renderList(current);
}

/* ============ 导入导出 ============ */
function exportJSON(){
  const blob = new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `MRO业务数据_${todayStr()}.json`;
  a.click();
}
function importJSON(file){
  const r = new FileReader();
  r.onload = e=>{
    try{
      const d = JSON.parse(e.target.result);
      if(!d.customers) throw new Error('格式不对');
      db = d; persistAndRender(); alert('导入成功');
    }catch(err){ alert('导入失败：' + err.message); }
  };
  r.readAsText(file);
}
function exportCSV(key){
  const s = SCHEMA[key], rows = db[key]||[];
  const head = s.table.map(k=>{const f=s.fields.find(x=>x.key===k);return f?f.label:k;});
  const lines = [head.join(',')].concat(rows.map(r=>s.table.map(k=>{
    if(k==='profit'){const p=profitRate(r);return p===null?'':p.toFixed(1)+'%';}
    const v = r[k]===undefined?'':String(r[k]).replace(/"/g,'""');
    return `"${v}"`;
  }).join(',')));
  const blob = new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${s.name}_${todayStr()}.csv`;
  a.click();
}

/* ============ 事件绑定 ============ */
document.getElementById('modalClose').onclick = closeModal;
document.getElementById('modalCancel').onclick = closeModal;
document.getElementById('modalSave').onclick = saveForm;
document.getElementById('mask').onclick = e=>{ if(e.target.id==='mask') closeModal(); };
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

document.getElementById('btnNewTop').onclick = ()=>{
  if(current==='dashboard') openForm('quotes');
  else openForm(current);
};
document.getElementById('globalSearch').oninput = e=>{
  searchTerm = e.target.value;
  if(current==='dashboard'){ if(searchTerm) { current='customers'; } }
  if(current!=='dashboard') renderList(current);
};
document.getElementById('btnExport').onclick = exportJSON;
document.getElementById('btnImport').onclick = ()=>document.getElementById('fileInput').click();
document.getElementById('fileInput').onchange = e=>{ if(e.target.files[0]) importJSON(e.target.files[0]); e.target.value=''; };
document.getElementById('btnReset').onclick = ()=>{
  if(confirm('恢复示例数据将覆盖当前全部记录，确定吗？')){ db = seed(); persistAndRender(); }
};

render();
