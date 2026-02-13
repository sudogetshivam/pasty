# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='w-screen h-screen bg-black'>
      <h1 className='text-white text-center p-6 text-4xl font-mono'>Pasty-Online Clipboard</h1>
      <div className='flex flex-col items-center w-200 h-100 p-6'>
      <div className='text-left text-white w-200 p-6 text-xl font-mono'>Send to online clipboard</div>
      <div className='flex ml-8'>
      <textarea 
      type="textarea"
      placeholder='Type your message here...'
      className='w-200 h-40 p-4 border border-gray-400 rounded-lg text-white'/>
      </div>
      <div className=' w-full flex'>
        <button
        className='w-20 p-2 mt-4 bg-white rounded-lg hover:bg-gray-300'>Send</button>
        <span
        className='font-mono pl-4 pt-5 text-xl text-white '>Code:</span>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
