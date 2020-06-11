import request from '@/utils/request'

export function addStudent(data) {
  return request({
    url: '/students/addStudent',
    method: 'post',
    data
  })
}

export function deleteStudent(data) {
  return request({
    url: '/students/deleteStudent',
    method: 'post',
    data
  })
}

export function searchStudents(data) {
  return request({
    url: '/students/searchStudents',
    method: 'post',
    data
  })
}

export function updateStudent(data) {
  return request({
    url: '/students/updateStudent',
    method: 'post',
    data
  })
}

export function getStudents(data) {
  return request({
    url: '/students/getStudents',
    method: 'post',
    data
  })
}

export function getStudentsCount() {
  return request({
    url: '/students/getStudentsCount',
    method: 'get'
  })
}
