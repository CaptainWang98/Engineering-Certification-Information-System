import request from '@/utils/request'

export function addScore(data) {
  return request({
    url: '/scores/addScore',
    method: 'post',
    data
  })
}

export function deleteScore(data) {
  return request({
    url: '/scores/deleteScore',
    method: 'post',
    data
  })
}

export function searchScores(data) {
  return request({
    url: '/scores/searchScores',
    method: 'post',
    data
  })
}

export function updateScore(data) {
  return request({
    url: '/scores/updateScore',
    method: 'post',
    data
  })
}

export function getScores(data) {
  return request({
    url: '/scores/getScores',
    method: 'post',
    data
  })
}
