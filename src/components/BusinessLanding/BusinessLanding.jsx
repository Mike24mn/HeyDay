import React from 'react';
import BusinessNavBar from '../BusinessNavBar/BusinessNavBar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';



function BusinessLanding() {
  // const to hold stores
  const business = useSelector(store=> store.business)
  console.log("CHECKING BUSINESS", business);
  const user = useSelector(store=> store.user)

  
  const dispatch = useDispatch()

  const id = user.id
  // variable that holds filter info to be mapped 
 const busFilter = business.filter((bus)=> Number(bus.business_id)=== Number(user.id))
 
 console.log("checking filter", busFilter);

  useEffect(()=>{
    dispatch({type:"SET_BUS"})
  }, [dispatch])
  return (
    <div>
   <center> <h1> welcome {user.username}</h1> </center>

    <h2>
      {busFilter.map((bus)=>(
        <p><center> {bus.business_name}</center> </p>
      ))}
    </h2>

      <footer><BusinessNavBar/></footer>
    </div>
  );
}

export default BusinessLanding;