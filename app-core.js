/* ============ 工具函数 ============ */
const money = n => (n===undefined||n===null||n==='') ? '—' :
  '¥' + Number(n).toLocaleString('zh-CN',{minimumFractionDigits:0,maximumFractionDigits:2});
const todayStr = () => new Date().toISOString().slice(0,10);
function daysBetween(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
function monthKey(d){ return (d||'').slice(0,7); }
function profitRate(q){
  const p = Number(q.price)||0, c = Number(q.cost)||0;
  if(!p) return null;
  return ((p-c)/p)*100;
}
function badgeClass(v){
  if(['合作中','已中标','履约中','已付款','A'].includes(v)) return 'b-green';
  if(['待开发','报名中','已投标','已发出','待审批','待付款','B'].includes(v)) return 'b-orange';
  if(['暂停合作','已丢单','已终止','已驳回','未中标','C'].includes(v)) return 'b-red';
  if(['草稿','已完成'].includes(v)) return 'b-gray';
  return 'b-blue';
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* ============ 侧边栏 ============ */
function renderNav(){
  document.getElementById('nav').innerHTML = NAV.map((n,i)=>{
    const label = (i===0) ? '<div class="nav-label">'+n.label+'</div>' : '';
    return label + '<div class="nav-item '+(current===n.key?'active':'')+'" data-go="'+n.key+'">'+
      '<span class="ic">'+n.icon+'</span>'+n.name+'</div>';
  }).join('');
  document.querySelectorAll('.nav-item').forEach(el=>{
    el.onclick = ()=>{ current = el.dataset.go; searchTerm=''; document.getElementById('globalSearch').value=''; render(); };
  });
}

/* ============ 工作台 ============ */
function renderDashboard(){
  const m = monthKey(todayStr());
  const monthQuotes = db.quotes.filter(q=>monthKey(q.date)===m);
  const won = monthQuotes.filter(q=>q.status==='已中标');
  const amount = won.reduce((s,q)=>s+(Number(q.price)||0),0);
  const toPay = db.payments.filter(p=>p.status==='待付款').reduce((s,p)=>s+(Number(p.amount)||0),0);
  const pendingPay = db.payments.filter(p=>p.status==='待审批');

  const expiring = db.contracts.filter(c=>c.status==='履约中'&&c.expire&&daysBetween(todayStr(),c.expire)>=0&&daysBetween(todayStr(),c.expire)<=45);
  const staleQuotes = db.quotes.filter(q=>q.status==='已发出'&&q.date&&daysBetween(q.date,todayStr())>=3);

  const todos = [];
  pendingPay.forEach(p=>todos.push({tag:'pay',ic:'付',t1:'待审批付款 · '+p.supplier,t2:money(p.amount)+' · '+p.purpose,time:p.date}));
  expiring.forEach(c=>todos.push({tag:'con',ic:'合',t1:'合同即将到期 · '+c.no,t2:c.customer+' · '+daysBetween(todayStr(),c.expire)+' 天后到期',time:c.expire}));
  staleQuotes.forEach(q=>todos.push({tag:'quo',ic:'报',t1:'待跟进报价 · '+q.customer,t2:q.no+' 已发出 '+daysBetween(q.date,todayStr())+' 天未回复',time:q.date}));

  const counts = {};
  db.quotes.forEach(q=>counts[q.status]=(counts[q.status]||0)+1);
  const maxC = Math.max(1,...Object.values(counts));

  document.getElementById('content').innerHTML =
    '<h2 class="page-title">工作台</h2>'+
    '<div class="page-sub">今天 '+todayStr()+'，共 '+db.customers.length+' 家客户、'+db.quotes.length+' 张报价单</div>'+

    '<div class="stats">'+
      '<div class="card stat"><div class="k">本月报价单</div><div class="v">'+monthQuotes.length+'</div><div class="d">本月新增 '+monthQuotes.length+' 张</div></div>'+
      '<div class="card stat"><div class="k">本月中标</div><div class="v">'+won.length+'</div><div class="d">中标率 '+(monthQuotes.length?((won.length/monthQuotes.length*100).toFixed(0)+'%'):'—')+'</div></div>'+
      '<div class="card stat"><div class="k">本月成交额</div><div class="v" style="font-size:22px">'+money(amount)+'</div><div class="d">来自 '+won.length+' 张中标报价</div></div>'+
      '<div class="card stat"><div class="k">待付款总额</div><div class="v" style="font-size:22px">'+money(toPay)+'</div><div class="d warn">'+pendingPay.length+' 笔待审批</div></div>'+
    '</div>'+

    '<div class="grid-2">'+
      '<div>'+
        '<div class="card panel" style="margin-bottom:16px">'+
          '<div class="panel-head"><h3>我的待办</h3><span style="font-size:12px;color:#8a94a6">'+todos.length+' 项</span></div>'+
          (todos.length? todos.slice(0,6).map(t=>
            '<div class="todo" onclick="go(\''+(t.tag==='pay'?'payments':t.tag==='con'?'contracts':'quotes')+'\')">'+
              '<div class="tag '+t.tag+'">'+t.ic+'</div>'+
              '<div class="txt"><div class="t1">'+esc(t.t1)+'</div><div class="t2">'+esc(t.t2)+'</div></div>'+
              '<div class="time">'+esc(t.time)+'</div></div>').join('') : '<div class="empty" style="padding:32px"><b>暂无待办</b>报价、合同、付款都在轨</div>')+
        '</div>'+

        '<div class="card panel">'+
          '<div class="panel-head"><h3>报价状态分布</h3></div>'+
          (Object.keys(counts).length? Object.entries(counts).map(([k,v])=>
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">'+
              '<span style="width:64px;font-size:12.5px;color:#5b6b8c">'+k+'</span>'+
              '<div style="flex:1;height:10px;background:#f1f4fa;border-radius:6px;overflow:hidden">'+
                '<div style="height:100%;width:'+Math.round(v/maxC*100)+'%;background:linear-gradient(90deg,#60a5fa,#2563eb);border-radius:6px"></div>'+
              '</div>'+
              '<span style="width:26px;text-align:right;font-size:12.5px;color:#44506b">'+v+'</span>'+
            '</div>').join('') : '<div class="empty">还没有报价单</div>')+
        '</div>'+
      '</div>'+

      '<div>'+
        '<div class="card panel" style="margin-bottom:16px">'+
          '<div class="panel-head"><h3>快捷入口</h3></div>'+
          '<div class="quick">'+
            '<div class="q-item" onclick="openForm(\'quotes\')"><div class="qi" style="background:#eaf1ff;color:#1d4ed8">报</div><span>新建报价</span></div>'+
            '<div class="q-item" onclick="openForm(\'payments\')"><div class="qi" style="background:#fff5e6;color:#b45309">付</div><span>付款申请</span></div>'+
            '<div class="q-item" onclick="openForm(\'sources\')"><div class="qi" style="background:#e9f9ef;color:#15803d">比</div><span>录入比价</span></div>'+
            '<div class="q-item" onclick="openForm(\'contracts\')"><div class="qi" style="background:#f3e8ff;color:#7e22ce">合</div><span>新建合同</span></div>'+
          '</div>'+
        '</div>'+

        '<div class="card panel">'+
          '<div class="panel-head"><h3>最近动态</h3></div>'+
          '<ul class="feed">'+
            (db.logs||[]).slice(0,5).map(l=>
              '<li><span class="dot" style="background:'+(l.color||'#8a94a6')+'"></span>'+
                '<div><div class="ft">'+esc(l.text)+'</div><div class="fs">'+esc(l.time)+'</div></div></li>').join('')+
          '</ul>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<footer class="small">数据保存在本机浏览器中 · 可随时导出备份</footer>';
}
function go(k){ current = k; render(); }
