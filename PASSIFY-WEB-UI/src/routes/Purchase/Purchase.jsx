import PurchaseForm from "../../ui/PurchaseForm/PurchaseForm.jsx";
import {useParams, useSearchParams, useNavigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";

import "./Purchase.scss";

function Purchase() {

    const [searchParams, setSearchParams] = useSearchParams();
    let eventName = searchParams.get("event_name");
    let event_id = searchParams.get("event_id");
    const navigate = useNavigate()

    useEffect(() => {
        if (!event_id && !eventName) {
            navigate("/")
        }
    }, [event_id, eventName, navigate])

    return (
        <>
            <div className={"purchase-container"}>
                <h1 >Purchase tickets for {eventName}</h1>
                <div className="details-header">
                    <Link to={'/'} className="btn btn-outline-light btn-sm">← Back to home</Link>
                </div>
                <PurchaseForm EventId={event_id}/>
            </div>
        </>
    )
}

export default Purchase;