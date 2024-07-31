import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";



const HappyMapping = () => {
    const happy = useSelector(store => store.happy);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
    }, [dispatch]);

    const handlelike = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handlelike');
            return;
        }
        dispatch({ type: "UPDATE_LIKE", payload: { id } });
    };

    const handleInt = (event, id) => {
        event.preventDefault();
        if (id === undefined) {
            console.error('ID is undefined in handleInt');
            return;
        }
        dispatch({ type: 'UPDATE_INT', payload: { id } });
    };

    return (
        <>
            <h1>Happy Hour Offers</h1>
            {happy.map((item) => (
                <ul key={item.id}>
                    <li>
                        {item.date}, {item.address}
                        <button onClick={(event) => handlelike(event, item.id)}>Add Like</button>
                        <button onClick={(event) => handleInt(event, item.id)}>Add Interest</button>
                    </li>
                </ul>
            ))}
        </>
    );
};

export default HappyMapping;
