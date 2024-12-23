export const httpError = (res, err) => {
    console.log(err);
    res.status(500);
    res.send({
        error: 'Algo ocurrio',
        message: err.message || 'Error desconocido',
        details: err
    });
};
