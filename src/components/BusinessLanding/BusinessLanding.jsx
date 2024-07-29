import React from 'react';
import BusinessNavBar from '../BusinessNavBar/BusinessNavBar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useState } from 'react';



function BusinessLanding() {
  const [getHappy, setHappy]= useState('')
  const [happyHourTime, setHappyHourTime] = useState(''); 
  const [happyHourDate, setHappyHourDate] = useState('');
  

  // const to hold stores
  const business = useSelector(store=> store.business)
  console.log("CHECKING BUSINESS", business);
  const user = useSelector(store=> store.user)
  const happy= useSelector(store => store.happy)
  console.log("checking happy", happy)

  
  const dispatch = useDispatch()

  const id = user.id
  
 const busFilter = business.filter((bus)=> Number(bus.business_id)=== Number(user.id))

 const happyFilter = happy.filter((hap)=>Number(hap.business_id)=== Number(user.id))
 
 console.log("checking filter", busFilter);
 console.log("checking filter", happyFilter);


  useEffect(()=>{
    dispatch({type:"SET_BUS"});
      dispatch({type:"SET_HAPPY"});
    
  }, [dispatch])

  const handleHappy = (event)=>{
    event.preventDefault()

        if (busFilter.length > 0) {
          const businessId = busFilter[0].business_id;
          
          dispatch({
            type: 'ADD_HAPPY',
            payload: {
              business_id: businessId,
              description: getHappy,
              date: happyHourDate,
              time: happyHourTime,
            }
          });
             setHappy('');
             setHappyHourTime(''); 
             setHappyHourDate(''); 
        }}
  
  

  return (
    
    <>
      <div>
        <center>
          <h1>Welcome {user.username}</h1>
        </center>
        <h2>
          {busFilter.map((bus) => (
            <p key={bus.id}>
              <center>{bus.business_name}</center>
            </p>
          ))}
        </h2>
        <div>
          <input
            type="text"
            value={getHappy}
            onChange={(event) => setHappy(event.target.value)}
            placeholder="Enter description"
          />
          <input
            type="date" 
            value={happyHourDate}
            onChange={(event) => setHappyHourDate(event.target.value)}
            placeholder="Enter date"
          />
          <input
            type="time" 
            value={happyHourTime}
            onChange={(event) => setHappyHourTime(event.target.value)}
            placeholder="Enter time"
          />
          <button onClick={handleHappy}>SUBMIT</button>
        </div>
        <footer>
          <BusinessNavBar />
        </footer>
      </div>

      <div>
        {happyFilter.map((hap )=>(
          <ol>
            <li key={hap.id}>description:{hap.description}, time: {hap.time}, date: {hap.date} </li>
          </ol>
        ))}
      </div>
    </>
  );
}

export default BusinessLanding;