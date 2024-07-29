import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BusinessInfo = ()=>{
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
<<<<<<< HEAD
        <h1>bussiness fill out form</h1>
        <h2><center>Welcome to HeyDay, 
            the ultimate platform designed to elevate your business to new heights!
            We're excited to invite you to join our community and experience the benefits of connecting with customers like never before.
            By signing up, you'll gain access to a suite of powerful tools and features tailored to help your business thrive in today's competitive market.
            Whether you're looking to attract new clients, enhance customer engagement, or streamline your operations, 
            HeyDay is here to support you every step of the way. 
            Join us today and let's make your business's heyday every day!</center></h2>
=======
        <h1>Business fill out form</h1>
>>>>>>> main
        <form onSubmit={handleSubmit}>

        <p><center><b>Name</b></center></p>
        <center><input
        type="text"
        value={getName}
        onChange={(e) => setName(e.target.value)}
         /></center>

         <p> <center><b> address</b></center></p>
         <center><input
         type="text"
         value={getAddress}
         onChange={(e)=> setAddress(e.target.value)}
         /></center>

         <p><center><b> type</b></center> </p>
         <center><input 
         type="text"
         value={getType}
         onChange={(e)=> setType(e.target.value)}
        /> </center>

        <p><center><b> Description</b></center> </p>
         <center><input
         type="text"
         value={getDes}
         onChange={(e)=> setDes(e.target.value)}
         /> </center>

         <center><button type="submit"> submit info </button></center>


        </form>
        </>
    )
}

export default BusinessInfo