import bcrypt from 'bcrypt';
import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js';  

const getItems = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerUsuarios',
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
        const { rol_idRol, estados_idEstados, correo_electronico, nombreUsuario, contrasenia, 
            telefono, fecha_nacimiento, clientes_idClientes } = req.body;

        // Cifra la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasenia, saltRounds);

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC InsertarUsuario @rol_idRol=:rol_idRol, @estados_idEstados=:estados_idEstados, @correo_electronico=:correo_electronico, @nombreUsuario=:nombreUsuario, @contrasenia=:contrasenia, @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento, @clientes_idClientes=:clientes_idClientes',
            {
                replacements: { rol_idRol, estados_idEstados, correo_electronico, nombreUsuario, contrasenia: hashedPassword, telefono, fecha_nacimiento, clientes_idClientes },
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
        const { rol_idRol, estados_idEstados, correo_electronico, nombreUsuario, contrasenia, telefono, fecha_nacimiento, clientes_idClientes } = req.body;
        const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la ruta
        console.log(id);

        // Verificar si el ID es un número válido
        const idUsuarios = parseInt(id, 10);
        if (isNaN(idUsuarios)) {
            throw new Error('El ID del usuario no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ActualizarUsuario @rol_idRol=:rol_idRol, @estados_idEstados=:estados_idEstados, @correo_electronico=:correo_electronico, @nombreUsuario=:nombreUsuario, @contrasenia=:contrasenia, @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento, @clientes_idClientes=:clientes_idClientes',
            {
                replacements: { rol_idRol, estados_idEstados, correo_electronico, nombreUsuario, contrasenia, telefono, fecha_nacimiento, clientes_idClientes },
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
        // Verificar si el ID es un número válido
        const idUsuarios = parseInt(id, 10);
        if (isNaN(idUsuarios)) {
            throw new Error('El ID del usuario no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC BorrarUsuario @idUsuarios=:id',
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

export { getItems, getItem, createItem, updateItem, deleteItem }