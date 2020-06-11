import request from '@/utils/request'

export function addReqs(data) {
  return request({
    url: '/reqs/addReqs',
    method: 'post',
    data
  })
}

export function deleteReq(data) {
  return request({
    url: '/reqs/deleteReq',
    method: 'post',
    data
  })
}

export function searchReqs(data) {
  return request({
    url: '/reqs/searchReqs',
    method: 'post',
    data
  })
}

export function updateReqs(data) {
  return request({
    url: '/reqs/updateReqs',
    method: 'post',
    data
  })
}

export function getReqs(data) {
  return request({
    url: '/reqs/getReqs',
    method: 'post',
    data
  })
}

export function getReqCount() {
  return request({
    url: '/reqs/getReqCount',
    method: 'get'
  })
}

export function getAllReqs() {
  return request({
    url: '/reqs/getAllReqs',
    method: 'get'
  })
}

export function downloadReqReport() {
  return request({
    url: '/report/reqReport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
