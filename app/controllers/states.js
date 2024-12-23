import sequelize from '../../config/db.js'; 
import { httpError } from '../helpers/handleError.js';  
const getStates = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerEstados',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Envia la respuesta con los estados obtenidos
        res.status(200).send(result);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const createState = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { nombreEstado } = req.body;

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC InsertarEstado @nombreEstado=:nombreEstado',
            {
                replacements: { nombreEstado },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }
        // Envia la respuesta con el estado recién insertado
        res.status(201).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const updateState = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del estado desde los parámetros de la ruta
        const { nombreEstado } = req.body;

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC ActualizarEstado @idEstados=:id, @nombreEstado=:nombreEstado',
            {
                replacements: { id, nombreEstado },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Enviar la respuesta con el estado actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        httpError(res, e);
    }
};

const deleteState = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del estado desde los parámetros de la ruta

        // Verifica si el ID es un número válido
        const stateId = parseInt(id, 10);
        if (isNaN(stateId)) {
            throw new Error('El ID del estado no es un número válido');
        }

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC BorrarEstado @idEstados=:id',
            {
                replacements: { id: stateId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el estado actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};


export { getStates, createState, updateState, deleteState }