import request from '@/utils/request'

export function addGoal(data) {
  return request({
    url: '/subjectgoals/addGoal',
    method: 'post',
    data
  })
}

export function deleteGoal(data) {
  return request({
    url: '/subjectgoals/deleteGoal',
    method: 'post',
    data
  })
}

export function searchGoals(data) {
  return request({
    url: '/subjectgoals/searchGoals',
    method: 'post',
    data
  })
}

export function updateGoal(data) {
  return request({
    url: '/subjectgoals/updateGoal',
    method: 'post',
    data
  })
}

export function getGoals(data) {
  return request({
    url: '/subjectgoals/getGoals',
    method: 'post',
    data
  })
}

export function getGoalsCount() {
  return request({
    url: '/subjectgoals/getGoalsCount',
    method: 'get'
  })
}
