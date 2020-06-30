import request from '@/utils/request'

export function addTeacher(data) {
  return request({
    url: '/course/addTeacher',
    method: 'post',
    data
  })
}

export function deleteTeacher(data) {
  return request({
    url: '/course/deleteTeacher',
    method: 'post',
    data
  })
}

export function updateTeacher(data) {
  return request({
    url: '/course/updateTeacher',
    method: 'post',
    data
  })
}

export function getTeachers(data) {
  return request({
    url: '/course/getTeachers',
    method: 'post',
    data
  })
}

export function searchTeachers(data) {
  return request({
    url: '/course/searchTeachers',
    method: 'post',
    data
  })
}

export function getTeacherCount() {
  return request({
    url: '/course/getTeacherCount',
    method: 'get'
  })
}

export function getAllTeachers() {
  return request({
    url: '/course/getAllTeachers',
    method: 'get'
  })
}