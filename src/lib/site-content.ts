export const authorContacts = [
  {
    id: 'wechat',
    label: '添加微信',
    handle: 'binStudy',
    imageSrc: '/images/site/wechat-bin-study.jpg',
    imageAlt: '丘彬彬的微信二维码，微信号 binStudy',
  },
  {
    id: 'official',
    label: '关注公众号',
    handle: '彬彬说',
    imageSrc: '/images/site/wechat-official-binbinshuo.jpg',
    imageAlt: '微信公众号彬彬说的二维码',
  },
] as const;

export type AuthorContact = (typeof authorContacts)[number];
