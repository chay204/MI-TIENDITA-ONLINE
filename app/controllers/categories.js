import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js';  

const getAllCategories = async (req, res) => {
    try {
        // Ejecuta procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerCategoria',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );
        
        // Verifica si el resultado contiene un error
        if (result.length === 0) {
            throw new Error('No se encontraron categrías');
        }
        
        // Envia la respuesta con los clientes obtenidos
        res.status(200).send(result);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const createCategories = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { usuarios_idUsuarios, nombreCategoria, estados_idEstados } = req.body;

        
        // Ejecuta procedimiento almacenado
        const result = await sequelize.query(
            'EXEC InsertarCategoriaProducto @usuarios_idUsuarios=:usuarios_idUsuarios, @nombreCategoria=:nombreCategoria, @estados_idEstados=:estados_idEstados',
            {
                replacements: { usuarios_idUsuarios, nombreCategoria, estados_idEstados},
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el nuevo cliente creado
        res.status(201).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const updateCategories = async (req, res) => {
    try {
        const { id } = req.params;  // Obtiene el ID de la categoría desde los parámetros de la ruta
        const { usuarios_idUsuarios, nombreCategoria, estados_idEstados } = req.body;

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ActualizarCategoriaProducto @idCategoriaProductos=:id, @usuarios_idUsuarios=:usuarios_idUsuarios, @nombreCategoria=:nombreCategoria, @estados_idEstados=:estados_idEstados',
            {
                replacements: { id, usuarios_idUsuarios, nombreCategoria, estados_idEstados },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con la categoría actualizada
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const deleteCategories = async (req, res) => {
    try {
        const { id } = req.params;  // Obtiene el ID del cliente desde los parámetros de la ruta
        console.log(id);
        // Verificar si el ID es un número válido
        const idUsuarios = parseInt(id, 10);
        if (isNaN(idUsuarios)) {
            throw new Error('El ID de la categoria no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC BorrarCategoriaProducto @idCategoriaProductos=:id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el cliente actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

export { getAllCategories, createCategories , updateCategories, deleteCategories}