import './Details.scss'
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

function Details() {
    const {id} = useParams();

    const [activity, setActivity] = useState(null)

    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        const getActivity = async () => {
            const response = await fetch(`${apiUrl}/${id}`)
            const data = await response.json()

            if (response.ok) {
                setActivity(data)
            }
        }
        getActivity()
    }, [apiUrl, id])

    return (
        <>

            <div className={"details-container"}>

                <div className="details-header">
                    <Link to={'/'} className="btn btn-outline-light btn-sm">← Back to home</Link>
                </div>

                {activity &&
                <div className={"details-content"}>
                    <h2 className="details-title">{activity.ActivityName}</h2>
                    <p>{activity.Description}</p>
                    <img className="details-hero" src={activity.ImageName || "/placeholder-square.jpg"} alt={activity.ActivityName}/>

                    <div className={"details-additional"}>


                        <div>
                            <p>Starts: </p>
                            <p>{activity.EventStart}</p>
                        </div>

                        <div>
                            <p>Ends:</p>
                            <p>{activity.EventEnd}</p>
                        </div>

                        <div>
                            <p>Organized by:</p>
                            <p>{activity.Organizer}</p>
                        </div>

                        <div>
                            <p>Category:</p>
                            <p>{activity.Category}</p>
                        </div>

                    </div>

                </div>}
            </div>

            {activity && (
                <div className="details-cta">
                    <Link to={`/Purchase?event_name=${activity.ActivityName}&event_id=${id}`}
                          className="btn btn-ticket">
                        Buy Ticket
                    </Link>
                </div>
            )}

        </>

    )
}

export default Details