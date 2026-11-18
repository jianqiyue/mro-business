/* ============ 数据模型 ============ */
const SCHEMA = {
  customers:{
    name:'客户档案', icon:'客', single:'客户',
    desc:'客户主档：联系人、归属销售、合作状态与等级',
    fields:[
      {key:'name',  label:'客户名称', type:'text',   required:true, wide:true},
      {key:'contact',label:'联系人',  type:'text',   required:true},
      {key:'phone', label:'联系电话', type:'text'},
      {key:'city',  label:'所在城市', type:'text'},
      {key:'owner', label:'归属销售', type:'text'},
      {key:'status',label:'合作状态', type:'select', options:['合作中','待开发','暂停合作'], required:true},
      {key:'level', label:'客户等级', type:'select', options:['A','B','C']},
      {key:'note',  label:'备注',    type:'textarea'}
    ],
    table:['name','contact','phone','city','owner','status','level','note'],
    search:['name','contact','phone','city','owner','note']
  },
  suppliers:{
    name:'供应商档案', icon:'供', single:'供应商',
    desc:'供应商主档：主营品牌、账期、付款方式与评级',
    fields:[
      {key:'name',  label:'供应商名称', type:'text', required:true, wide:true},
      {key:'brands',label:'主营品牌',  type:'text'},
      {key:'contact',label:'联系人',   type:'text'},
      {key:'phone', label:'联系电话',  type:'text'},
      {key:'term',  label:'账期',     type:'select', options:['现结','月结30天','月结60天','预付']},
      {key:'pay',   label:'付款方式',  type:'select', options:['对公转账','银行承兑','现金']},
      {key:'level', label:'供应商评级', type:'select', options:['A','B','C']},
      {key:'note',  label:'备注',     type:'textarea'}
    ],
    table:['name','brands','contact','phone','term','pay','level','note'],
    search:['name','brands','contact','phone','note']
  },
  sources:{
    name:'货源比价', icon:'比', single:'货源',
    desc:'多平台货源与单价，可按物料自动找出最低价',
    fields:[
      {key:'item',  label:'物料名称', type:'text', required:true, wide:true},
      {key:'brand', label:'品牌',     type:'text'},
      {key:'spec',  label:'规格型号', type:'text'},
      {key:'platform',label:'渠道平台', type:'select', options:['1688','淘宝','京东','拼多多','线下供应商'], required:true},
      {key:'price', label:'单价',     type:'number', step:'0.01'},
      {key:'moq',   label:'起订量',   type:'number', step:'1'},
      {key:'supplier',label:'供应商', type:'text'},
      {key:'url',   label:'商品链接', type:'text'},
      {key:'date',  label:'询价日期', type:'date'},
      {key:'note',  label:'备注',     type:'textarea'}
    ],
    table:['item','brand','spec','platform','price','moq','supplier','date','note'],
    search:['item','brand','spec','platform','supplier','note']
  },
  bids:{
    name:'投标管理', icon:'标', single:'投标项目',
    desc:'招标平台、报名截止、开标时间、保证金与结果',
    fields:[
      {key:'project',label:'项目名称', type:'text', required:true, wide:true},
      {key:'platform',label:'招标平台', type:'select', options:['海螺','广投','北港','其他'], required:true},
      {key:'customer',label:'客户',   type:'text'},
      {key:'deadline',label:'报名截止', type:'date'},
      {key:'opendate',label:'开标时间', type:'date'},
      {key:'deposit',label:'保证金',   type:'number', step:'0.01'},
      {key:'status',label:'状态',     type:'select', options:['报名中','已投标','已中标','未中标'], required:true},
      {key:'owner',label:'负责人',    type:'text'},
      {key:'note', label:'备注',      type:'textarea'}
    ],
    table:['project','platform','customer','deadline','opendate','deposit','status','owner','note'],
    search:['project','platform','customer','owner','note']
  },
  quotes:{
    name:'报价单', icon:'报', single:'报价单',
    desc:'成本→报价→毛利率自动计算，贯穿投标到合同',
    fields:[
      {key:'no',    label:'报价单号', type:'text', required:true},
      {key:'customer',label:'客户',   type:'text', required:true},
      {key:'content',label:'项目内容', type:'text', wide:true},
      {key:'cost',  label:'成本金额', type:'number', step:'0.01'},
      {key:'price', label:'报价金额', type:'number', step:'0.01'},
      {key:'date',  label:'报价日期', type:'date', required:true},
      {key:'status',label:'状态',     type:'select', options:['草稿','已发出','已中标','已丢单'], required:true},
      {key:'owner', label:'销售',     type:'text'},
      {key:'note',  label:'备注',     type:'textarea'}
    ],
    table:['no','customer','content','cost','price','profit','date','status','owner'],
    search:['no','customer','content','owner','note']
  },
  contracts:{
    name:'合同', icon:'合', single:'合同',
    desc:'合同金额、履约期与到期提醒',
    fields:[
      {key:'no',    label:'合同编号', type:'text', required:true},
      {key:'customer',label:'客户',   type:'text', required:true},
      {key:'amount',label:'合同金额', type:'number', step:'0.01'},
      {key:'sign',  label:'签约日期', type:'date'},
      {key:'expire',label:'到期日期', type:'date'},
      {key:'status',label:'状态',     type:'select', options:['履约中','已完成','已终止'], required:true},
      {key:'quote', label:'关联报价单',type:'text'},
      {key:'note',  label:'备注',     type:'textarea'}
    ],
    table:['no','customer','amount','sign','expire','status','quote','note'],
    search:['no','customer','quote','note']
  },
  payments:{
    name:'付款申请', icon:'付', single:'付款申请',
    desc:'申请→审批→待付款→已付款，全程留痕',
    fields:[
      {key:'no',    label:'申请单号', type:'text', required:true},
      {key:'supplier',label:'收款方', type:'text', required:true},
      {key:'amount',label:'付款金额', type:'number', step:'0.01', required:true},
      {key:'purpose',label:'用途',   type:'select', options:['采购货款','运费','投标保证金','其他'], required:true},
      {key:'applicant',label:'申请人', type:'text'},
      {key:'approver',label:'审批人', type:'text'},
      {key:'date',  label:'申请日期', type:'date', required:true},
      {key:'status',label:'状态',     type:'select', options:['待审批','已驳回','待付款','已付款'], required:true},
      {key:'contract',label:'关联合同',type:'text'},
      {key:'note',  label:'备注',     type:'textarea'}
    ],
    table:['no','supplier','amount','purpose','applicant','date','status','contract','note'],
    search:['no','supplier','purpose','applicant','contract','note']
  }
};

const NAV = [
  {key:'dashboard', name:'工作台', icon:'台', label:'业务导航'},
  {key:'customers', name:'客户档案', icon:'客'},
  {key:'suppliers', name:'供应商档案', icon:'供'},
  {key:'sources',   name:'货源比价', icon:'比'},
  {key:'bids',      name:'投标管理', icon:'标'},
  {key:'quotes',    name:'报价单',   icon:'报'},
  {key:'contracts', name:'合同',     icon:'合'},
  {key:'payments',  name:'付款申请', icon:'付'}
];
