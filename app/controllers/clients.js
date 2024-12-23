import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js'; 

const getItems = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerClientes',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Envia la respuesta con los clientes obtenidos
        res.status(200).send(result);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const createItem = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = req.body;

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC InsertarCliente @razon_social=:razon_social, @nombre_comercial=:nombre_comercial, @direccion_entrega=:direccion_entrega, @telefono=:telefono, @email=:email',
            {
                replacements: { razon_social, nombre_comercial, direccion_entrega, telefono, email },
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

const updateItem = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { razon_social, nombre_comercial, direccion_entrega, telefono, email } = req.body;
        const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la ruta
        console.log(id);

        // Verificar si el ID es un número válido
        const idClientes = parseInt(id, 10);
        if (isNaN(idClientes)) {
            throw new Error('El ID del cliente no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ActualizarCliente @idClientes=:idClientes, @razon_social=:razon_social, @nombre_comercial=:nombre_comercial, @direccion_entrega=:direccion_entrega, @telefono=:telefono, @email=:email',
            {
                replacements: { idClientes, razon_social, nombre_comercial, direccion_entrega, telefono, email },
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

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la ruta
        console.log(id);
        // Verifica si el ID es un número válido
        const idClientes = parseInt(id, 10);
        if (isNaN(idClientes)) {
            throw new Error('El ID del cliente no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC BorrarCliente @idClientes=:id',
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

export { getItems, createItem, updateItem, deleteItem }