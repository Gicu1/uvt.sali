import { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        equipment: '',
        description: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms/add-room`, {
                ...formData,
                equipment: formData.equipment.split(',').map((item) => item.trim()),
            }, config);

            setMessage(response.data.message);
            setFormData({
                name: '',
                location: '',
                capacity: '',
                equipment: '',
                description: '',
            });
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>Add New Room</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Room Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Equipment (comma-separated)"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <Button variant="contained" color="primary" type="submit">Add Room</Button>
                    </Box>
                </form>
                {message && <Typography color="error" sx={{ marginTop: 2 }}>{message}</Typography>}
            </Paper>
        </Container>
    );
};

export default AddRoom;