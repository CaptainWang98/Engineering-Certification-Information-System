import request from '@/utils/request'

export function addEvaltoGoal(data) {
  return request({
    url: '/EvalToGoals/addEvalToGoal',
    method: 'post',
    data
  })
}

export function deleteEvaltoGoal(data) {
  return request({
    url: '/EvalToGoals/deleteEvalToGoal',
    method: 'post',
    data
  })
}

export function getEvaltoGoals(data) {
  return request({
    url: '/EvalToGoals/getEvalToGoals',
    method: 'post',
    data
  })
}

export function updateEvaltoGoal() {
  return request({
    url: '/EvalToGoals/updateEvalToGoal',
    method: 'post',
    data
  })
}