import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-6">
      <div className="flex justify-center space-x-4 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 hover:scale-110 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 hover:scale-110 transition-transform" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold underline text-blue-600 text-center mb-4">
        Vite + React + Tailwind
      </h1>
      <div className="bg-gray-100 p-6 rounded shadow text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-4 text-gray-500 text-center">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
