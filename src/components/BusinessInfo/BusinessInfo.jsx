import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BussinessInfo = ()=>{
    const user = useSelector(store => store.user)
    const [getAddress, setAddress]= useState('')
    const [getName, setName ]= useState('')
    const [getType, setType] = useState('')
    const [getDes , setDes]= useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const id = user.id 
    const handleSubmit = (event  ) => {
        event.preventDefault();
        dispatch({
            type: 'ADD_BUS',
            payload: {
                business_id: user.id,
                business_name: getName,
                business_type: getType,
                address: getAddress,
                description: getDes,
                
            },
            
        });
        dispatch({type:"UPDATE_USER"})

        
        setDes('');
        setAddress(''); 
        setName('');
        setType('');

        history.push("/business-landing");
    };


    return( 
        <>
        <h1>bussiness fill out form</h1>
        <form onSubmit={handleSubmit}>

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
         onChange={(e)=> setAddress(e.target.value)}
         />

         <p> type </p>
         <input
         type="text"
         value={getType}
         onChange={(e)=> setType(e.target.value)}
         />

        <p> Description </p>
         <input
         type="text"
         value={getDes}
         onChange={(e)=> setDes(e.target.value)}
         />

         <button type="submit"> submit info </button>


        </form>
        </>
    )
}

export default BussinessInfo