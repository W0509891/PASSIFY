const Disclaimer = (
    {
        message = "This is a demonstration project. To ensure your privacy, please do not use real-world personal or financial data.",
        size,
        color
    }) => {

    const style = {
        color: color ?? "red",
        fontSize: size ?? "10px",
        textWrap: "wrap",
        marginBottom: "0",
    }


    return <p style={style}>{message}</p>
}

export {Disclaimer}