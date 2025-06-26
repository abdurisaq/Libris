import DocumentManager from './components/DocumentManager'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Document Uploader & Viewer</h1>
      <DocumentManager />
    </div>
  )
}

export default App
