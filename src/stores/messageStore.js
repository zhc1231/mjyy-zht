import { reactive, computed } from 'vue'

/**
 * 企业后台站内信全局状态
 * 类型：recharge（充值到账）、settle（结算）、insurance（保险消耗）、task（任务通知）、system（系统通知）
 */

const state = reactive({
  messages: [
    {
      id: 1,
      type: 'recharge',
      typeLabel: '充值到账',
      title: '账户充值成功',
      content: '您于 2026-08-03 14:30 提交的充值请求已成功到账，金额 ¥50,000.00，当前账户余额 ¥120,000.00。',
      amount: 50000,
      time: '2026-08-03 14:32:10',
      read: false,
      link: '/company/account'
    },
    {
      id: 2,
      type: 'settle',
      typeLabel: '结算',
      title: '任务结算成功',
      content: '任务「2026年春季电商平台运营推广项目」中 5 名灵工的结算已完成，结算总额 ¥18,500.00。',
      amount: 18500,
      time: '2026-08-03 11:20:45',
      read: false,
      link: '/company/settlement'
    },
    {
      id: 3,
      type: 'insurance',
      typeLabel: '保险消耗',
      title: '保险费用扣除',
      content: '任务「设备安装调试」投保 8 人，保险费 ¥320.00 已从账户余额扣除，保单号 INS20260803001。',
      amount: 320,
      time: '2026-08-03 09:15:20',
      read: false,
      link: '/company/attendance'
    },
    {
      id: 4,
      type: 'recharge',
      typeLabel: '充值到账',
      title: '账户充值成功',
      content: '您于 2026-08-02 16:00 提交的充值请求已成功到账，金额 ¥30,000.00，当前账户余额 ¥70,000.00。',
      amount: 30000,
      time: '2026-08-02 16:02:33',
      read: true,
      link: '/company/account'
    },
    {
      id: 5,
      type: 'settle',
      typeLabel: '结算',
      title: '预结算待确认',
      content: '任务「培训课程助教」3 名灵工预结算已提交，等待灵工确认中，请关注确认进度。',
      amount: 600,
      time: '2026-08-02 14:10:00',
      read: true,
      link: '/company/task-list-guide'
    },
    {
      id: 6,
      type: 'system',
      typeLabel: '系统通知',
      title: '系统维护通知',
      content: '系统将于 2026-08-05 02:00-04:00 进行例行维护升级，期间部分功能可能不可用，请提前安排相关操作。',
      amount: null,
      time: '2026-08-02 10:00:00',
      read: true,
      link: '/company/notice'
    },
    {
      id: 7,
      type: 'insurance',
      typeLabel: '保险消耗',
      title: '保险到期提醒',
      content: '任务「保洁服务」投保 10 人的保单将于 2026-08-10 到期，请及时续保。',
      amount: null,
      time: '2026-08-01 18:30:00',
      read: true,
      link: '/company/attendance'
    },
    {
      id: 8,
      type: 'task',
      typeLabel: '任务通知',
      title: '新成员加入任务',
      content: '灵工「王五」已加入任务「2026年春季电商平台运营推广项目」，当前任务参与人数 10 人。',
      amount: null,
      time: '2026-08-01 15:20:00',
      read: true,
      link: '/company/task-list-guide'
    }
  ],
  nextId: 100
})

export function useMessageStore() {
  const unreadCount = computed(() => state.messages.filter(m => !m.read).length)

  const typeCount = (type) => {
    if (type === 'all') return state.messages.length
    return state.messages.filter(m => m.type === type).length
  }

  const unreadCountByType = (type) => {
    if (type === 'all') return unreadCount.value
    return state.messages.filter(m => m.type === type && !m.read).length
  }

  const getList = (params = {}) => {
    const { type = 'all', read = 'all', keyword = '' } = params
    return state.messages.filter(m => {
      if (type !== 'all' && m.type !== type) return false
      if (read !== 'all' && (read === 'unread' ? m.read : !m.read)) return false
      if (keyword) {
        const kw = keyword.toLowerCase()
        return m.title.toLowerCase().includes(kw) || m.content.toLowerCase().includes(kw)
      }
      return true
    })
  }

  const markRead = (id) => {
    const m = state.messages.find(x => x.id === id)
    if (m) m.read = true
  }

  const markAllRead = () => {
    state.messages.forEach(m => { m.read = true })
  }

  const markTypeRead = (type) => {
    state.messages.forEach(m => {
      if (type === 'all' || m.type === type) m.read = true
    })
  }

  const removeMessage = (id) => {
    const idx = state.messages.findIndex(x => x.id === id)
    if (idx >= 0) state.messages.splice(idx, 1)
  }

  const batchRemove = (ids) => {
    state.messages = state.messages.filter(m => !ids.includes(m.id))
  }

  const addMessage = (msg) => {
    const id = state.nextId++
    state.messages.unshift({
      id,
      read: false,
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...msg
    })
    return id
  }

  return {
    state,
    unreadCount,
    typeCount,
    unreadCountByType,
    getList,
    markRead,
    markAllRead,
    markTypeRead,
    removeMessage,
    batchRemove,
    addMessage
  }
}
