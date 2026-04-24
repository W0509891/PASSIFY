import "./PurchaseForm.scss"
import LoadingIcon from "../../ui/LoadingIcon/LoadingIcon.jsx";


import {useState} from "react";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {Disclaimer} from "../Disclaimer.jsx";

function PurchaseForm(props) {
    function $qs(queryselector) {
        return document.querySelector(queryselector)
    }

    const apiUrl = import.meta.env.VITE_API_URL
    const {register, handleSubmit, formState: {errors}} = useForm();
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoading, setIsLoading] = useState(null)

    let tregex = /^\d+$/;
    let eregex = /^(\w+\.?\w+)@(\w+(\.\w+){0,2})(\.[a-zA-Z]+)$/
    let cxpregex = /^\d{2}\/\d{2}$/;
    let cvvregex = /^\d{3,4}$/;


    var ticketHasHadFocus = false;
    var emailHasHadFocus = false;
    var cardExpHasHadFocus = false;
    var cvvHasHadFocus = false;

    function onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput(e.target.value)
    }

    // let ticketFieldValid, emailFieldValid, cardexp, cvvFieldValid = false

    // function validateField(e) {
    //     let invalidDisplay = e.target.parentNode.children[2]
    //     switch (e.target.name.toLowerCase()) {
    //         case "tickets":
    //             ticketHasHadFocus = true;
    //             ticketFieldValid = regex.test(e.target.value) && e.target.value > 0
    //             e.target.style.borderColor = (!ticketFieldValid && ticketHasHadFocus) ? "#ff0000" : "#00ff00"
    //             break;
    //
    //         case "email":
    //             //For the scope of the assignment, regex only covers:
    //             // example@domain.com | exam.ple@dom.ain.com
    //             emailHasHadFocus = true;
    //             emailFieldValid = regex.test(e.target.value) && (e.target.value.length > 0)
    //             e.target.style.borderColor = (!emailFieldValid && emailHasHadFocus) ? "#ff0000" : "#00ff00"
    //             break;
    //
    //         case "ccexp":
    //             cardExpHasHadFocus = true;
    //             e.target.style.borderColor = (!cardexp && cardExpHasHadFocus) ? "#ff0000" : "#00ff00"
    //             break;
    //
    //         case "cccvv":
    //             cvvHasHadFocus = true;
    //             cvvFieldValid = regex.test(e.target.value) && (e.target.value !== "" || e.target.value !== null)
    //             e.target.style.borderColor = (!cvvFieldValid && cvvHasHadFocus) ? "#ff0000" : "#00ff00"
    //             break;
    //     }
    // }

    async function onSubmit(e) {
        setIsLoading(true)
        console.log(e)
        // console.log(ticketFieldValid && emailFieldValid && cardexp && cvvFieldValid)
        // if (ticketFieldValid && emailFieldValid && cardexp && cvvFieldValid) {
        //     e.target.submit();
        console.log("Form submitted")

        let req = await fetch(`${apiUrl}/purchase`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(e)
        })

        let res = await req.json()

        // Source - https://stackoverflow.com/a
        // Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-12-06, License - CC BY-SA 4.0

        // setIsLoading(false)

        await new Promise(r => setTimeout(r, 2000));

        console.log(res)
        if (res.status === 200) {

            let req2 = await fetch(`${apiUrl}/createticket?event_id=${e.event_id}&user_email=${e.email}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let res2 = await req2.json()

            console.log(res2)

            if(res2.status === 200){
                setIsLoading(false)
            }
            else{
                alert("Error creating ticket")
            }
        }
    }


    return (
        <div className={"purchase-form-container"}>

            <div>
                <form method={"POST"} onSubmit={handleSubmit(onSubmit)}>
                    <Disclaimer size={"15px"} />
                    <div className={"formfieldgroup"}>

                        <input type="text" name="event_id" value={props.EventId}
                               {...register("event_id")} readOnly hidden/>
                    </div>

                    <div className={"formfieldgroup"}>
                        <label>Tickets</label>
                        <input type="number" name="tickets" max={10} placeholder={"Maximum per purchase is 10"}
                               style={{borderColor: errors.tickets ? "#dc2626" : ""}}
                               {...register("tickets", {max: 10, min:1,  required: true, pattern: tregex})}/>
                        {errors.tickets && <span className="error-message">Invalid number of tickets (max 10)</span>}
                    </div>

                    <div className={"formfieldgroup"}>
                        <label>Email</label>
                        <input type="text" name="email" placeholder={"example@domain.com"}
                               defaultValue={user.email}
                               disabled={true}
                               style={{borderColor: errors.email ? "#dc2626" : ""}}
                               {...register("email", {required: true, pattern: eregex})}/>
                    </div>

                    <div className={"formfieldgroup"}>
                        <label>Exp</label>
                        <input type="text" name="ccexp" maxLength={5} placeholder={"MM/YY"}
                               style={{borderColor: errors.ccexp ? "#dc2626" : ""}}
                               {...register("ccexp", {required: true, pattern: cxpregex})}/>
                        {errors.ccexp && <span className="error-message">Format: MM/YY</span>}
                    </div>

                    <div className={"formfieldgroup"}>
                        <label>CVV</label>
                        <input type="text" id="cccvv" name="cccvv" maxLength={4} placeholder={"123"}
                               style={{borderColor: errors.cccvv ? "#dc2626" : ""}}
                               {...register("cccvv", {required: true, pattern: cvvregex})}/>
                        {errors.cccvv && <span className="error-message">Invalid CVV</span>}
                    </div>

                    {isLoading === null ? <button>Purchase</button> :
                        isLoading ? <button className={"loading-button"}><LoadingIcon/></button> :
                            <Link to={"/tickets"}>
                                <button className={"btn-after btn-outline-light"}>See Tickets</button>
                            </Link>
                    }
                </form>
            </div>
        </div>

    )
}

export default PurchaseForm