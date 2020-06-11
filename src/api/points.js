import request from '@/utils/request'

export function addPoint(data) {
  return request({
    url: '/points/addPoint',
    method: 'post',
    data
  })
}

export function deletePoint(data) {
  return request({
    url: '/points/deletePoint',
    method: 'post',
    data
  })
}

export function searchPoints(data) {
  return request({
    url: '/points/searchPoints',
    method: 'post',
    data
  })
}

export function updatePoint(data) {
  return request({
    url: '/points/updatePoint',
    method: 'post',
    data
  })
}

export function getPoints(data) {
  return request({
    url: '/points/getPoints',
    method: 'post',
    data
  })
}

export function getPointCount() {
  return request({
    url: '/points/getPointCount',
    method: 'get'
  })
}

export function getCascaderPoints() {
  return request({
    url: '/points/cascaderPoints',
    method: 'get'
  })
}