import Mock from 'mockjs'
import data from './data.json'

Mock.mock('/mock/report/data', {
  status: 2000,
  data
})
