import request from '@/utils/request'

export function addTerm(data) {
  return request({
    url: '/term/addTerm',
    method: 'post',
    data
  })
}

export function deleteTerm(data) {
  return request({
    url: '/term/deleteTerm',
    method: 'post',
    data
  })
}

export function getTerms(data) {
  return request({
    url: '/term/getTerms',
    method: 'get',
  })
}

export function updateTerm() {
  return request({
    url: '/term/updateTerm',
    method: 'post',
    data
  })
}
