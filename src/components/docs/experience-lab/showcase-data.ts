export const showcaseColumns = [
  { key: 'claim', label: '主张' },
  { key: 'evidence', label: '证据' },
  { key: 'status', label: '状态' },
] as const;

export const showcaseRows = [
  { claim: '保留原始上下文', evidence: '材料卡与原文位置', status: '已核验' },
  { claim: '区分事实与推断', evidence: '证据卡类型字段', status: '已核验' },
  { claim: '暴露来源冲突', evidence: '冲突来源并列记录', status: '待判断' },
  { claim: '标记缺失信息', evidence: '待确认事项清单', status: '待补充' },
  { claim: '面向真实读者', evidence: '交付对象与使用场景', status: '已核验' },
  { claim: '保留回查入口', evidence: '来源、日期与原文链接', status: '已核验' },
] as const;

export const showcaseScenarios = [
  {
    label: '原始材料',
    title: '保留上下文',
    content: '记录原句、来源与时间，不提前合并互相冲突的说法。',
  },
  {
    label: '证据卡',
    title: '主张与依据对应',
    content: '为每个主张保留证据、限制、日期与当前可信状态。',
  },
  {
    label: '交付稿',
    title: '面向真实读者',
    content: '按决策顺序组织内容，同时留下来源和原文回查入口。',
  },
] as const;
