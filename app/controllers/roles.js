import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js';  

const getRoles = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado para obtener todos los roles no eliminados
        const result = await sequelize.query(
            'EXEC ObtenerRoles',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Envia la respuesta con los roles obtenidos
        res.status(200).send(result);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const createRol = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { nombreRol } = req.body;

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC InsertarRol @nombreRol=:nombreRol',
            {
                replacements: { nombreRol },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }
        // Envia la respuesta con el rol recién insertado
        res.status(201).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const updateRol = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del rol desde los parámetros de la ruta
        const { nombreRol } = req.body;

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC ActualizarRol @idRol=:id, @nombreRol=:nombreRol',
            {
                replacements: { id, nombreRol },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }
        // Envia la respuesta con el rol actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del rol desde los parámetros de la ruta

        // Verifica si el ID es un número válido
        const rolId = parseInt(id, 10);
        if (isNaN(rolId)) {
            throw new Error('El ID del rol no es un número válido');
        }

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC BorrarRol @idRol=:id',
            {
                replacements: { id: rolId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }
        // Enviar la respuesta con el rol actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

export { getRoles, createRol, updateRol, deleteRol }