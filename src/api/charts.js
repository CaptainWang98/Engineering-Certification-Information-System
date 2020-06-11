import request from '@/utils/request'

export function getGoalScore(data) {
  return request({
    url: '/scores/getGoalScore',
    method: 'post',
    data
  })
}

export function getClassBarChart(data) {
  return request({
    url: '/scores/getClassBarChart',
    method: 'post',
    data
  })
}