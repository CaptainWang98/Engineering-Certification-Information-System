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

export function searchScoreByStu(data) {
  return request({
    url: '/scores/searchScoreByStu',
    method: 'post',
    data
  })
}

export function deleteScoresByClass(data) {
  return request({
    url: '/scores/deleteScoresByClass',
    method: 'get',
    params: data
  })
}

export function getAveScore(data) {
  return request({
    url: '/scores/getAveScore',
    method: 'get',
    params: data
  })
}

export function getStudentGoalScore(data) {
  return request({
    url: '/scores/getStudentGoalScore',
    method: 'get',
    params: data
  })
}