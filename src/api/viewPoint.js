import request from '@/utils/request'

export function addViewPoint(data) {
  return request({
    url: '/viewpoints/addViewPionts',
    method: 'post',
    data
  })
}

export function deleteViewPoint(data) {
  return request({
    url: '/viewpoints/deleteViewPionts',
    method: 'post',
    data
  })
}

export function getViewPoints(data) {
  return request({
    url: '/viewpoints/getViewPionts',
    method: 'post',
    data
  })
}

export function updateViewPoint(data) {
  return request({
    url: '/viewpoints/updateViewPionts',
    method: 'post',
    data
  })
}
