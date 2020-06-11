import request from '@/utils/request'

export function addEval(data) {
  return request({
    url: '/evals/addEval',
    method: 'post',
    data
  })
}

export function deleteEval(data) {
  return request({
    url: '/evals/deleteEval',
    method: 'post',
    data
  })
}

export function getEval(data) {
  return request({
    url: '/evals/getEvals',
    method: 'post',
    data
  })
}

export function updateEval() {
  return request({
    url: '/evals/updateEval',
    method: 'post',
    data
  })
}
