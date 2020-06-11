import request from '@/utils/request'

export function addSubject(data) {
  return request({
    url: '/subjects/addSubject',
    method: 'post',
    data
  })
}

export function addAllSubject(data) {
  return request({
    url: '/subjects/addAll',
    method: 'post',
    data
  })
}

export function deleteSubject(data) {
  return request({
    url: '/subjects/deleteSubject',
    method: 'post',
    data
  })
}

export function searchSubjects(data) {
  return request({
    url: '/subjects/searchSubjects',
    method: 'post',
    data
  })
}

export function updateSubject(data) {
  return request({
    url: '/subjects/updateSubject',
    method: 'post',
    data
  })
}

export function getSubjects(data) {
  return request({
    url: '/subjects/getSubjects',
    method: 'post',
    data
  })
}

export function getSubjectCount() {
  return request({
    url: '/subjects/getSubjectsCount',
    method: 'get'
  })
}

export function getAllSubjects() {
  return request({
    url: '/subjects/getAllSubjects',
    method: 'get'
  })
}