import request from '@/utils/request'

export function addMajor(data) {
  return request({
    url: '/major/addMajor',
    method: 'post',
    data
  })
}

export function deleteMajor(data) {
  return request({
    url: '/major/deleteMajor',
    method: 'post',
    data
  })
}

export function searchMajors(data) {
  return request({
    url: '/major/searchMajors',
    method: 'post',
    data
  })
}

export function updateMajor(data) {
  return request({
    url: '/major/updateMajor',
    method: 'post',
    data
  })
}

export function getMajor(data) {
  return request({
    url: '/major',
    method: 'post',
    data
  })
}

export function getMajorCount() {
  return request({
    url: '/major/count',
    method: 'get'
  })
}

export function getAllMajors() {
  return request({
    url: '/major/all',
    method: 'get'
  })
}
