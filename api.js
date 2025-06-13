import api from './api'

const response = await api.get(`/ownership-structure/?company_name=${companyName}`)
