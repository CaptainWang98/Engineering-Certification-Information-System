import request from '@/utils/request'

export function addCourse(data) {
  return request({
    url: '/class/addClass',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/class/deleteClass',
    method: 'post',
    data
  })
}

export function searchCourses(data) {
  return request({
    url: '/class/searchClasses',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request({
    url: '/class/updateClass',
    method: 'post',
    data
  })
}

export function getCourses(data) {
  return request({
    url: '/class/getClasses',
    method: 'post',
    data
  })
}

export function getCourseCount() {
  return request({
    url: '/class/getClassCount',
    method: 'get'
  })
}

export function downloadReport() {
  return request({
    url: '/report/classReport',
    method: 'post',
    data, 
    responseType: 'blob'
  })
}

export function getSelStudents(data) {
  return request({
    url: '/class/getStudents',
    method: 'post',
    data
  })
}

export function getCoursesByTeacher(data) {
  return request({
    url: '/class/getClassesByTeacher',
    method: 'post',
    data
  })
}