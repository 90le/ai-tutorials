export const taskContractType = {
  goal: {
    description: '最终要交付的结果',
    type: 'string',
    required: true,
  },
  audience: {
    description: '结果的实际使用者',
    type: 'string',
    required: true,
  },
  evidence: {
    description: '允许引用的事实边界',
    type: 'string[]',
    required: true,
  },
  constraints: {
    description: '不可执行或不可推断的事项',
    type: 'string[]',
  },
} as const;
