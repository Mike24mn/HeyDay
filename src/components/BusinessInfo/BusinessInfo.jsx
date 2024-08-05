import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './BusinessInfo.css';
const BusinessInfo = () => {
    const user = useSelector(store => store.user);
    const [getAddress, setAddress] = useState('');
    const [getName, setName] = useState('');
    const [getType, setType] = useState('');
    const [getDes, setDes] = useState('');
    const [getNumber, setNumber] = useState('');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const id = user.id;
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch({
            type: 'ADD_BUS',
            payload: {
                user_id: id,
                business_name: getName,
                business_type: getType,
                address: getAddress,
                description: getDes,
                phone_number: getNumber,
              
            },
        });
    
        dispatch({ type: "UPDATE_USER" });
        setDes('');
        setAddress('');
        setName('');
        setType('');
        setNumber('');
        setOpen(false);
        history.push("/business-landing");
    };
    return (
        <>
            <h2 className="busclass">Business Form</h2>
            <div className="container">
                <div>
                    <p>
                        Welcome to HeyDay, the ultimate platform designed to elevate your business to new heights!
                    </p>
                    <p>
                        We're excited to invite you to join our community and experience the benefits of connecting with customers like never before.
                    </p>
                    <p>
                        By signing up, you'll gain access to a suite of powerful tools and features tailored to help your business thrive in today's competitive market.
                    </p>
                    <p>
                        Whether you're looking to attract new clients, enhance customer engagement, or streamline your operations, HeyDay is here to support you every step of the way.
                    </p>
                    <p>
                        Join us today and let's make your business's heyday every day!
                    </p>
                </div>
            </div>
            <Button
                className="business-button"
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
            >
                Fill Out Business Info
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle className="dialog-title">Business Fill Out Form</DialogTitle>
                <DialogContent className="dialog-content">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Name"
                            type="text"
                            fullWidth
                            value={getName}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Address"
                            type="text"
                            fullWidth
                            value={getAddress}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Type"
                            type="text"
                            fullWidth
                            value={getType}
                            onChange={(e) => setType(e.target.value)}
                        />
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            value={getDes}
                            onChange={(e) => setDes(e.target.value)}
                        />
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Phone Number"
                            type="text"
                            fullWidth
                            value={getNumber}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <TextField
                            className="text-field"
                            margin="dense"
                            label="Vibe"
                            type="text"
                            fullWidth
                        />
                            <TextField
                            className="text-field"
                            margin="dense"
                            label="Diet"
                            type="text"
                            fullWidth
                        />
                            <TextField
                            className="text-field"
                            margin="dense"
                            label="Image URL"
                            type="text"
                            fullWidth
                        />
                        
                        
                        <DialogActions className="dialog-actions">
                            <Button onClick={() => setOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Submit Info
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default BusinessInfo;