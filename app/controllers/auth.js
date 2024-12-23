import { httpError } from '../helpers/handleError.js'; 
import {encrypt, compare} from '../helpers/handleBcrypt.js';
import {tokenSign } from '../helpers/generateTokens.js';
import sequelize from '../../config/db.js'; 

const loginCtrl = async (req, res) => {
    try {
        const { correo_electronico, contrasenia } = req.body;

        // Verifica que ambos campos están presentes en el cuerpo de la solicitud
        if (!correo_electronico || !contrasenia) {
            res.status(400).send({ error: 'Correo electrónico y contraseña son requeridos' });
            return;
        }

        // Obtiene el usuario por correo electrónico utilizando procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerUsuarioPorEmail @correo_electronico=:correo_electronico',
            {
                replacements: { correo_electronico },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el usuario existe
        if (result.length === 0) {
            res.status(404).send({ error: 'Usuario no encontrado' });
            return;
        }

        const user = result[0];

        // Verifica que la contraseña cifrada está presente
        if (!user.contrasenia) {
            res.status(500).send({ error: 'Error interno del servidor: contraseña no encontrada' });
            return;
        }
        console.log('Contraseña cifrada almacenada:', user.contrasenia);

        // Compara la contraseña proporcionada con la contraseña cifrada almacenada
        const checkPassword = await compare(contrasenia, user.contrasenia);
        console.log('¿Las contraseñas coinciden?', checkPassword);
        if (!checkPassword) {
            res.status(409).send({ error: 'Contraseña inválida' });
            return;
        }

        // Genera el token JWT
        const tokenSession = await tokenSign(user);

        // Filtra los datos del usuario para no enviar información sensible
        const { idUsuarios, nombreUsuario, correo, rol_idRol, estados_idEstados } = user;
        res.send({
            data: { idUsuarios, nombreUsuario, correo, rol_idRol, estados_idEstados },
            tokenSession
        });
    } catch (e) {
        httpError(res, e);
    }
};



const registerCtrl = async (req, res) => {
    try {
        const { rol_idRol, estados_idEstados, correo_electronico, nombreUsuario, contrasenia, telefono, fecha_nacimiento, clientes_idClientes } = req.body;

        // Cifra la contraseña
        const hashedPassword = await encrypt(contrasenia);
        console.log('Contraseña cifrada al registrar:', hashedPassword);

        // Ejecuta el procedimiento almacenado para insertar el usuario
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

        // Envia la respuesta con el nuevo usuario creado
        res.status(201).send(result[0]);
    } catch (e) {
        httpError(res, e);
    }
};


export {loginCtrl, registerCtrl};