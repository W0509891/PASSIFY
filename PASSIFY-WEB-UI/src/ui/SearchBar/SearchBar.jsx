import "./SearchBar.scss"
import {useState} from "react";
import SearchResultCard from "../SearchResultCard/SearchResultCard.jsx";


function SearchBar() {

    //Ctrl + K shortcut to focus on the search bar
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            console.log("Ctrl + K pressed");
            document.querySelector('#search-bar').focus()
            document.querySelector('#search-bar').focus()

        }
    })

    document.addEventListener("click", (event) => {
        if (event.target.id === "search-bar") {
            setSearchFocus(true)
        }
        else {
            setSearchFocus(false)
        }
    })


    const [searchResult, setSearchResults] = useState([]) //State for search results
    const [searchValue, setSearchValue] = useState("") //State for search value
    const [searchFocus, setSearchFocus] = useState(false) //State for search focus
    const [loading, setLoading] = useState(false) //State for loading

    const apiUrl = import.meta.env.VITE_API_URL //API URL


    async function hasFocus() {
        setSearchFocus(true)
    }


    //Function to search for events
    async function searchEvents(e) {

        //Update searchValue state
        setSearchValue(e.target.value)

        //Only search if the search value is at least 3 characters
        if (e.target.value.length >= 3) {
            setLoading(true)
            try {
                //Fetch search results from API
                let response = await fetch(apiUrl + "/search?event_name=" + e.target.value, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                //Save search results to state
                const data = await response.json()
                console.log("ResponseStatus", response.status)

                //If the response is successful, save the search results to state.
                if (response.status === 200) {
                    setSearchResults(data)
                }

                //Otherwise, set the state to an empty array.
                else {
                    setSearchResults([{ActivityId: null}])
                }
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <>
            {/*Search bar container. Contains the search bar and search results.*/}
            <div className={"search-bar-container"}>

                {/*Search bar*/}
                <input
                    id={"search-bar"}
                    value={searchValue}
                    type={"text"}
                    placeholder={"Search with \"Ctrl + K\" "}
                    onChange={searchEvents}
                    onClick={hasFocus}
                    onFocus={hasFocus}
                />

                {/*Only render the component if the search value is at least 3 characters long.*/}
                {searchFocus &&
                    searchValue.length >= 3 && (
                        <div className={"search-results"}>
                            {loading ? (
                                <div className={"search-result-item-none"}>
                                    <div className="None">
                                        <p>loading...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/*Render search results.*/}
                                    {searchResult && searchResult.map(item =>
                                        <SearchResultCard
                                            Key={item.ActivityId}
                                            ActivityId={item.ActivityId}
                                            ActivityName={item.ActivityName}
                                            ImageName={item.ImageName}
                                            Description={item.Description}
                                        />)}
                                </>
                            )}
                        </div>
                    )
                }
            </div>

        </>
    )
}

export default SearchBar