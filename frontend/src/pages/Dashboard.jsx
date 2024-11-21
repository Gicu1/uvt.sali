import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/auth.context"; // Adjust the import path as per your project structure
import "../styles/Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(response.data.rooms);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                setMessage("Failed to load rooms");
            }
        };

        fetchRooms();
    }, []);

    const handleDelete = async (roomId) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/rooms/delete-room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(rooms.filter((room) => room._id !== roomId));
            } catch (error) {
                console.error("Failed to delete room:", error);
                setMessage("Failed to delete the room");
            }
        }
    };

    const handleAdd = () => {
        navigate("/admin/add-room");
    };

    const handleEdit = (roomId) => {
        navigate(`/admin/edit-room/${roomId}`);
    };

    /**
     * Demo booking
     * **/
    const [bookings, setBookings] = useState([
        { id: 1, date: "2024-02-10", time: "14:00-16:00", room: "Conference Hall" },
        { id: 2, date: "2024-02-15", time: "10:00-12:00", room: "Workshop Room" },
    ]);

    const handleCancelBooking = (id) => {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
    };

    return (
        <div className="container">
            <nav>
                <img src="../../public/images/uvt-logo.jpeg" alt="Logo" />
                <button onClick={logout}>Logout</button>
            </nav>
            <div className="profile">
                <div className="user-info">
                    <h1>Personal Dashboard</h1>
                    <p>Name: {user.username}</p>
                    <p>Status: {user.role}</p> {/* Replace with user role */}
                    <p>User ID: {user.id}</p>
                    <p>Today: {new Date().toLocaleString("en-US")}</p>
                </div>
                <img src="../../public/images/uvt-logo.jpeg" alt="Profile Logo" />
            </div>
            {/* Main Section */}
            <div className="main">
                {/* Admin Section */}
                {user.role === "admin" && (
                    <div className="admin-section">
                        <h2>Admin Section</h2>
                        <p>You have admin privileges. Manage rooms below:</p>
                        <button className="add-room-btn" onClick={handleAdd}>
                            Add Room
                        </button>
                    </div>
                )}

                <div className="info-section">
                    {/* User Bookings */}
                    {user.role === "user" && (
                        <div className="bookings">
                            <h2>Your Bookings:</h2>
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="booking-item text-dynamic">
                                        <p>Дата: {booking.date}</p>
                                        <p>Время: {booking.time}</p>
                                        <p>Комната: {booking.room}</p>
                                        <button onClick={() => handleCancelBooking(booking.id)}>
                                            Отменить бронь
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-dynamic">Нет активных бронирований</p>
                            )}
                        </div>
                    )}
                    {/* Available Rooms */}
                    <div className="available-rooms paper">
                        <h2>Rooms</h2>
                        {message && <p className="error-message">{message}</p>}
                        <ul className="room-list">
                            {rooms.map((room) => (
                                <li key={room._id} className="room-item">
                                    <h3>{room.name}</h3>
                                    <p><strong>Location:</strong> {room.location}</p>
                                    <p><strong>Capacity:</strong> {room.capacity}</p>
                                    {room.equipment.length > 0 && room.equipment[0] !== "" && (
                                        <p><strong>Equipment:</strong> {room.equipment.filter(e => e).join(", ")}</p>
                                    )}
                                    {room.description && (
                                        <p><strong>Description:</strong> {room.description}</p>
                                    )}
                                    {user.role === "admin" && (
                                        <div className="room-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(room._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(room._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
