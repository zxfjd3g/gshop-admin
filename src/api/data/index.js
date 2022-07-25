/* 
数据可视化接口请求函数模块
*/
import request from '@/utils/requestData'

export function getReportData() {
  return request('/report/data')
}