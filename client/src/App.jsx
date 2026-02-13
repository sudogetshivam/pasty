import { useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import { sendMessage,retrieveMessage } from '../server/controller/message.controller.js'

function App() {
  
  const API_URL = import.meta.env.VITE_API_URL

  const [message, setMessage] = useState("")
  const [code,setCode] = useState("")
  const [writeCode,setwriteCode] = useState("")
  const[getMessage,setgetMessage] = useState("")

  const copyMessage = ()=>{
    window.navigator.clipboard.writeText(getMessage)
  }

  const showCode = (data)=>{
    const output=data.message
    const originalCode = output.slice(-4)
    console.log("Original Code:",typeof originalCode)
    setCode(originalCode)
  }

  const displayMessage = (data)=>{
    setgetMessage(data)
  }
  const handleSendMessage = async(e)=>{
    // e.preventDefault();
    try{
      const response =await fetch(`${API_URL}/api/auth/send-message`,{
        method: 'POST',
       headers: {
        'Content-Type': 'application/json',
    }, 
        body:JSON.stringify({message})
      });

      const data= await response.json();
      if(data.success){
        showCode(data);
      }
      else{
        console.error("Message Sending Failed")
      }
    }catch(error){
      console.error("Something went wrong",error)
    }
  }
  const publishMessage = ()=>{
    // const getMessage = window.navigator.clipboard.writeText(message)
    handleSendMessage()
    setMessage("")
    }

  const subscribeMessage = async(e)=>{
    try { 
      const response = await fetch(`${API_URL}/api/auth/retrieve-message`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          code: Number(writeCode)})
      })  
      const data=await response.json();
      if(data.success){
        displayMessage(data.message)
      }
      else{
        console.log("Invalid Code")
      }

      
    } catch (error) {
            console.error("Something went wrong",error)
    }
    setwriteCode("")
  }
  return (
    <>
      
      <div className='w-screen h-screen bg-black'>
      <h1 className='text-white text-center p-6 text-4xl font-mono'>Pasty-Online Clipboard</h1>
      <div className='flex flex-col items-center w-200 h-100 p-6'>
      <div className='text-left text-white w-200 p-6 text-xl font-mono'>Send to online clipboard</div>
      <div className='flex ml-8'>
      <textarea 
      type="textarea"
      value={message}
      placeholder='Type your message here...'
      className='w-200 h-40 p-4 border border-gray-400 rounded-lg text-white'
      onChange={(e) => {
        setMessage(e.target.value)
      }}/>
      </div>
      <div className=' w-full flex'>
        <button
        onClick={publishMessage}
        className='w-20 p-2 mt-4 bg-white rounded-lg hover:bg-gray-300'
        >Send</button>
        <span
        className='font-mono pl-4 pt-5 text-xl text-white '>Code:{code}</span>
        </div>
      </div>




      <div className='flex flex-col items-center w-200 h-100 p-6'>
      <div className='text-left text-white w-200 p-6 text-xl font-mono'>Retrieve your message</div>
      <div className='flex w-full'>
      <input 
      type="text"
      placeholder='Enter 4-digit Code'
      value={writeCode}
      className='w-50 h-10 p-4 border border-gray-400 rounded-lg text-white'
      onChange={(e)=>{
        const value = e.target.value;
        if (value.length <= 4) {  // Limit to 4 digits
          setwriteCode(value);
        }
      }}/>
       <button
        className='w-20 p-2 ml-4 bg-white rounded-lg hover:bg-gray-300'
        onClick={subscribeMessage}>Retrieve</button>
      </div>
      <div className='flex ml-8'>
      <textarea 
      type="textarea"
      placeholder=''
      value={getMessage}
      className='w-200 h-40 p-4 mt-6 border border-gray-400 rounded-lg text-white'
      readOnly/>
      </div>
      <div className=' w-full flex'>
        <button
        className='w-20 p-2 mt-4 bg-white rounded-lg hover:bg-gray-300'
        onClick={copyMessage}>Copy</button>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
