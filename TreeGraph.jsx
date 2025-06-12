import React, { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import jsPDF from 'jspdf'

function TreeGraph({ data }) {
  const ref = useRef()

  const buildGraphElements = (node) => {
    const elements = []
    const stack = [{ node, parent: null }]

    while (stack.length) {
      const { node, parent } = stack.pop()
      const color =
        node.type === 'UK Company' ? '#0074D9' :
        node.type === 'Non-UK Company' ? '#FF851B' :
        '#2ECC40'

      elements.push({
        data: { id: node.id, label: node.label },
        style: { backgroundColor: color }
      })

      if (parent) {
        elements.push({
          data: { source: parent.id, target: node.id }
        })
      }

      for (const child of node.children || []) {
        stack.push({ node: child, parent: node })
      }
    }

    return elements
  }

  useEffect(() => {
    const cy = cytoscape({
      container: ref.current,
      elements: buildGraphElements(data),
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'color': '#fff',
            'text-outline-color': '#000',
            'text-outline-width': 1,
            'background-color': 'data(color)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10
      }
    })

    return () => cy.destroy()
  }, [data])

  const exportPDF = () => {
    const pdf = new jsPDF()
    pdf.text("Ownership Tree (export manually from screenshot)", 10, 10)
    pdf.save("ownership_tree.pdf")
  }

  return (
    <div className="mt-4">
      <div ref={ref} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}></div>
      <button onClick={exportPDF} className="mt-2 bg-green-500 text-white p-2">Export as PDF</button>
    </div>
  )
}

export default TreeGraph
