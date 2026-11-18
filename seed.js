/* ============ 示例数据 ============ */
function seed(){
  return {
    customers:[
      {id:1,name:'广西建工集团第三建筑工程有限公司',contact:'张伟',phone:'13800000001',city:'南宁',owner:'夏雨乐',status:'合作中',level:'A',note:'市政工程主客户，SKF 轴承年采购约 60 万'},
      {id:2,name:'南宁轨道交通集团有限责任公司',contact:'李强',phone:'13800000002',city:'南宁',owner:'夏雨乐',status:'合作中',level:'A',note:'设备维保类，常用紧固件与法兰'},
      {id:3,name:'广西柳州钢铁集团有限公司',contact:'王芳',phone:'13800000003',city:'柳州',owner:'夏雨乐',status:'待开发',level:'B',note:'待走访，关注水泥克星等耗材'},
      {id:4,name:'北部湾港股份有限公司',contact:'陈明',phone:'13800000004',city:'钦州',owner:'夏雨乐',status:'合作中',level:'B',note:'码头设备配件，需现货响应'},
      {id:5,name:'广西糖业集团',contact:'刘洋',phone:'13800000005',city:'南宁',owner:'夏雨乐',status:'合作中',level:'A',note:'检修季集中采购，账期月结 60 天'},
      {id:6,name:'桂林旅游发展集团有限公司',contact:'赵敏',phone:'13800000006',city:'桂林',owner:'夏雨乐',status:'暂停合作',level:'C',note:'项目暂停，暂不跟进'}
    ],
    suppliers:[
      {id:1,name:'上海卓凯机电设备有限公司',brands:'SKF / NSK',contact:'王建国',phone:'13800000011',term:'月结30天',pay:'对公转账',level:'A',note:'轴承主力供应商，可开 13% 专票'},
      {id:2,name:'广州市创联五金制品有限公司',brands:'紧固件 / 法兰',contact:'陈立',phone:'13800000012',term:'现结',pay:'对公转账',level:'B',note:'标件齐全，小批量次日达'},
      {id:3,name:'深圳恒润传动科技有限公司',brands:'轴承 / 联轴器',contact:'周敏',phone:'13800000013',term:'月结60天',pay:'银行承兑',level:'A',note:'进口替代方案，比原厂低约两成'},
      {id:4,name:'南宁本地机电物资经营部',brands:'通用五金',contact:'黄强',phone:'13800000014',term:'现结',pay:'现金',level:'C',note:'应急采购用，价格偏高但随叫随到'},
      {id:5,name:'江苏泰兴泵阀制造有限公司',brands:'泵阀 / 管道配件',contact:'徐海',phone:'13800000015',term:'预付',pay:'对公转账',level:'B',note:'定制件需预付 30% 定金'}
    ],
    sources:[
      {id:1,item:'SKF 深沟球轴承',brand:'SKF',spec:'6205-2RS',platform:'1688',price:68.5,moq:10,supplier:'上海卓凯机电设备有限公司',url:'',date:'2026-11-15',note:'含税，可开专票'},
      {id:2,item:'SKF 深沟球轴承',brand:'NSK',spec:'6205-2RS',platform:'淘宝',price:72,moq:1,supplier:'深圳恒润传动科技有限公司',url:'',date:'2026-11-15',note:'单件包邮，交期 3 天'},
      {id:3,item:'碳钢法兰',brand:'国产',spec:'DN100 PN16',platform:'1688',price:45,moq:20,supplier:'广州市创联五金制品有限公司',url:'',date:'2026-11-16',note:'锻打件，需提供材质单'},
      {id:4,item:'六角螺栓',brand:'国产 8.8 级',spec:'M16*80',platform:'拼多多',price:3.2,moq:100,supplier:'广州市创联五金制品有限公司',url:'',date:'2026-11-16',note:'热镀锌，箱装'},
      {id:5,item:'离心泵',brand:'泰兴',spec:'ISG80-160',platform:'线下供应商',price:3200,moq:1,supplier:'江苏泰兴泵阀制造有限公司',url:'',date:'2026-11-17',note:'含电机，预付 30%'},
      {id:6,item:'竹跳板',brand:'国产',spec:'2000*250mm',platform:'1688',price:28.5,moq:50,supplier:'广州市创联五金制品有限公司',url:'',date:'2026-11-18',note:'工地脚手架用，需检验报告'},
      {id:7,item:'离心泵',brand:'泰兴',spec:'ISG80-160',platform:'1688',price:2980,moq:1,supplier:'江苏泰兴泵阀制造有限公司',url:'',date:'2026-11-18',note:'同款对比价，不含运费'}
    ],
    bids:[
      {id:1,project:'海螺水泥 2027 年度轴承集采',platform:'海螺',customer:'广西建工集团第三建筑工程有限公司',deadline:'2026-11-25',opendate:'2026-12-05',deposit:20000,status:'报名中',owner:'夏雨乐',note:'需提供 SKF 授权书与质检报告'},
      {id:2,project:'广投集团电厂紧固件框架采购',platform:'广投',customer:'南宁轨道交通集团有限责任公司',deadline:'2026-11-20',opendate:'2026-11-28',deposit:50000,status:'已投标',owner:'夏雨乐',note:'已递交标书，等待开标'},
      {id:3,project:'北港码头输送带配件采购',platform:'北港',customer:'北部湾港股份有限公司',deadline:'2026-11-10',opendate:'2026-11-18',deposit:30000,status:'已中标',owner:'夏雨乐',note:'中标金额 18.6 万，需 30 天内签约'},
      {id:4,project:'柳钢检修耗材年度标',platform:'其他',customer:'广西柳州钢铁集团有限公司',deadline:'2026-10-30',opendate:'2026-11-08',deposit:10000,status:'未中标',owner:'夏雨乐',note:'价格高出中标价 8%，已复盘'},
      {id:5,project:'糖业集团泵阀备件采购',platform:'其他',customer:'广西糖业集团',deadline:'2026-12-10',opendate:'2026-12-18',deposit:15000,status:'报名中',owner:'夏雨乐',note:'待确认泵型号后报名'}
    ],
    quotes:[
      {id:1,no:'BJ20261119-01',customer:'广西建工集团第三建筑工程有限公司',content:'SKF 6205-2RS 轴承 200 套',cost:11000,price:14200,date:'2026-11-19',status:'已发出',owner:'夏雨乐',note:'含 13% 专票与运费'},
      {id:2,no:'BJ20261119-02',customer:'南宁轨道交通集团有限责任公司',content:'碳钢法兰 DN100 PN16 300 片',cost:12000,price:15600,date:'2026-11-19',status:'草稿',owner:'夏雨乐',note:'待确认材质单后发出'},
      {id:3,no:'BJ20261118-01',customer:'北部湾港股份有限公司',content:'输送带托辊 50 件',cost:38000,price:46800,date:'2026-11-18',status:'已中标',owner:'夏雨乐',note:'中标后 30 天内签合同'},
      {id:4,no:'BJ20261117-01',customer:'广西柳州钢铁集团有限公司',content:'8.8 级紧固件年度套装',cost:8000,price:9200,date:'2026-11-17',status:'已丢单',owner:'夏雨乐',note:'竞品报价低 8%，需复盘成本'},
      {id:5,no:'BJ20261116-01',customer:'广西糖业集团',content:'ISG80-160 离心泵 2 台',cost:6100,price:7600,date:'2026-11-16',status:'已发出',owner:'夏雨乐',note:'客户要求 10 天交货'},
      {id:6,no:'BJ20261115-01',customer:'广西建工集团第三建筑工程有限公司',content:'竹跳板 2000*250mm 500 块',cost:13500,price:17200,date:'2026-11-15',status:'已中标',owner:'夏雨乐',note:'工地直送，含卸货费'},
      {id:7,no:'BJ20261114-01',customer:'南宁轨道交通集团有限责任公司',content:'M16*80 六角螺栓 5000 只',cost:15000,price:18500,date:'2026-11-14',status:'已发出',owner:'夏雨乐',note:'热镀锌，分两批交'},
      {id:8,no:'BJ20261113-01',customer:'北部湾港股份有限公司',content:'NSK 6205-2RS 轴承 100 套',cost:7000,price:8400,date:'2026-11-13',status:'已发出',owner:'夏雨乐',note:'现货，3 天内可发'}
    ],
    contracts:[
      {id:1,no:'HT2026-1101',customer:'北部湾港股份有限公司',amount:46800,sign:'2026-11-18',expire:'2027-05-18',status:'履约中',quote:'BJ20261118-01',note:'输送带托辊，分两批交付'},
      {id:2,no:'HT2026-1102',customer:'广西建工集团第三建筑工程有限公司',amount:17200,sign:'2026-11-16',expire:'2026-12-31',status:'履约中',quote:'BJ20261115-01',note:'竹跳板，工地直送'},
      {id:3,no:'HT2026-1001',customer:'广西建工集团第三建筑工程有限公司',amount:60000,sign:'2026-10-08',expire:'2027-10-07',status:'履约中',quote:'',note:'轴承年度框架协议，按月下单'},
      {id:4,no:'HT2025-1201',customer:'南宁轨道交通集团有限责任公司',amount:88000,sign:'2025-12-15',expire:'2026-12-14',status:'履约中',quote:'',note:'紧固件年度供货'},
      {id:5,no:'HT2026-0901',customer:'广西糖业集团',amount:42000,sign:'2026-09-10',expire:'2026-10-31',status:'已完成',quote:'',note:'检修季备件，已结清'},
      {id:6,no:'HT2026-0601',customer:'桂林旅游发展集团有限公司',amount:30000,sign:'2026-06-01',expire:'2026-09-30',status:'已终止',quote:'',note:'客户项目暂停，合同终止'}
    ],
    payments:[
      {id:1,no:'FK20261119-01',supplier:'上海卓凯机电设备有限公司',amount:12500,purpose:'采购货款',applicant:'夏雨乐',approver:'老板',date:'2026-11-19',status:'待审批',contract:'HT2026-1102',note:'SKF 轴承一批，待审批'},
      {id:2,no:'FK20261118-01',supplier:'广州市创联五金制品有限公司',amount:4320,purpose:'采购货款',applicant:'夏雨乐',approver:'老板',date:'2026-11-18',status:'已付款',contract:'',note:'1688 批量采购，回单已上传'},
      {id:3,no:'FK20261117-01',supplier:'江苏泰兴泵阀制造有限公司',amount:960,purpose:'采购货款',applicant:'夏雨乐',approver:'老板',date:'2026-11-17',status:'待付款',contract:'',note:'泵阀定制件预付 30% 定金'},
      {id:4,no:'FK20261115-01',supplier:'深圳恒润传动科技有限公司',amount:28000,purpose:'采购货款',applicant:'夏雨乐',approver:'老板',date:'2026-11-15',status:'已付款',contract:'HT2026-1101',note:'轴承货款，月结 60 天'},
      {id:5,no:'FK20261112-01',supplier:'广州市创联五金制品有限公司',amount:1200,purpose:'运费',applicant:'夏雨乐',approver:'老板',date:'2026-11-12',status:'已驳回',contract:'',note:'运费未提前报批，需补申请'},
      {id:6,no:'FK20261110-01',supplier:'南宁本地机电物资经营部',amount:680,purpose:'其他',applicant:'夏雨乐',approver:'老板',date:'2026-11-10',status:'已付款',contract:'',note:'应急五金采购'}
    ],
    logs:[
      {id:1,text:'付款申请 FK20261119-01 已提交，等待审批',time:'2026-11-19 09:12',color:'#f59e0b'},
      {id:2,text:'比价结果：SKF 6205-2RS 最低价 68.5 元（1688）',time:'2026-11-18 16:40',color:'#16a34a'},
      {id:3,text:'报价单 BJ20261118-01 已中标，金额 46,800 元',time:'2026-11-18 11:05',color:'#2563eb'},
      {id:4,text:'合同 HT2026-1101 已归档，履约期至 2027-05-18',time:'2026-11-18 10:20',color:'#8a94a6'}
    ]
  };
}

const STORE_KEY = 'mro_web_v1';
let db = loadDB();
let current = 'dashboard';
let editing = null;
let searchTerm = '';

function loadDB(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){ const d = JSON.parse(raw); if(d && d.customers) return d; }
  }catch(e){}
  return seed();
}
function saveDB(){
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
  pushLog();
}
function pushLog(){
  db.logs = (db.logs||[]).slice(0,30);
}
