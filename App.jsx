import React, { useState } from 'react'
import TreeGraph from './TreeGraph'
import axios from 'axios'

function App() {
  const [company, setCompany] = useState('')
  const [treeData, setTreeData] = useState(null)
  const [loading, setLoading] = useState(false)

  const getTree = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tree`, {
        params: { company_name: company }
      })
      setTreeData(res.data.tree)
    } catch (err) {
      alert('Error fetching data')
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">PSC Ownership Structure</h1>
      <input
        className="border p-2 mr-2"
        placeholder="Enter Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2" onClick={getTree}>
        Generate Tree
      </button>
      {loading && <p className="mt-4">Loading...</p>}
      {treeData && <TreeGraph data={treeData} />}
    </div>
  )
}

export default App
