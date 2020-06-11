import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/login/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'get',
    params: { token }
  })
}
