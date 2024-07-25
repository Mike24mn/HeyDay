import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BussinessInfo = ()=>{
    const user = useSelector(store => store.users)
    const [getAddress, setAddress]= useState('')
    const [getName, setName ]= useState('')
    const [getType, setType] = useState('')
    const [getDes , setDes]= useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const id = user.id 

    const handlesubmit = (event)=>{
        event.preventDefault()
    dispatch({type: 'ADD_BUS', payload: {name: getName, type: getType, address: getAddress, des: getDes , id: user.id}})

        setAddress('')
        setDes('')
        setName('')
        setType('')

        history.push('/bussinessLanding')
        

    }

    return( 
        <>
        <h1>bussiness fill out form</h1>
        <form onSubmit={handlesubmit}>

        <p>name</p>
        <input
        type="text"
        value={getName}
        onChange={(e) => setName(e.target.value)}
         />

         <p> address</p>
         <input
         type="text"
         value={getAddress}
         onChange={(e)=> setName(e.target.value)}
         />

         <p> type </p>
         <input
         type="text"
         value={getType}
         onChange={(e)=> setType(e.target.value)}
         />

        <p> des</p>
         <input
         type="text"
         value={getDes}
         onChange={(e)=> setDes(e.target.value)}
         />


        </form>
        </>
    )
}

export default BussinessInfo