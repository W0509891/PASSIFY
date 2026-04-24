import './Ticket.scss'
import {useEffect, useState} from "react";
import LoadingIcon from "../../ui/LoadingIcon/LoadingIcon.jsx";


function Ticket() {

    const [tickets, setTickets] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getTickets() {
            setLoading(true)
            const apiUrl = import.meta.env.VITE_AUTH_API
            try {
                const response = await fetch(`${apiUrl}/tickets`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
                const data = await response.json()
                console.log(data)
                setTickets(data)
            } catch (error) {
                console.error("Failed to fetch tickets:", error)
            } finally {
                setLoading(false)
            }
        }
        getTickets()
    },[])


    //pulldata from local storage to display data

    return (
        <div className="tickets-page">
            <div className="header-section">
                <h1>Your Tickets</h1>
                <p className="note">
                    Feel free to <span style={{color: "blue", cursor: "pointer"}}>contact us</span> if you have any questions or need assistance with your tickets.
                </p>
            </div>

            <div className="ticket-container">
                {loading ? (
                    <LoadingIcon />
                ) : (
                    tickets === null || tickets.length === 0 ? (
                        <div className="no-tickets">
                            <p>No tickets purchased yet.</p>
                        </div>
                    ) : (
                        tickets.map((ticket, index) => (
                            <div className="ticket-card" key={index}>
                                <div className="image-section">
                                    <img src={ticket.ImageName} className="ticket-image" alt="Event Cover" />
                                </div>
                                
                                <div className="qr-section">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ActivityId}-${index}`} 
                                        className="ticket-qr" 
                                        alt="QR Code" 
                                    />
                                </div>

                                <div className="content-section">
                                    <p className="ticket-title">{ticket.ActivityName}</p>
                                    <p className="ticket-description">{ticket.Description}</p>
                                    <p className="ticket-location">5355 Leeds Street, Halifax, NS</p>
                                </div>

                                <div className="times-section">
                                    <div className="ticket-start">
                                        {ticket.EventStart.replace("-", " ")}
                                    </div>
                                    <div className="ticket-end">
                                        {ticket.EventEnd.replace("-", " ")}
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    )
}

export default Ticket