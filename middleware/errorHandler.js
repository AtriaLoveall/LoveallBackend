const errorHandler = (err, req, res, next ) => {
    const statusCode = err.status || 500;
    const message = err.message || "Unknown error occured";
    res.status(statusCode).json({
        "success": false,
        "message": message
    })
}

export default errorHandler;