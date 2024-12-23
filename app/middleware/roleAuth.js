import { verifyToken } from '../helpers/generateTokens.js';
import sequelize from '../../config/db.js';  // Asegúrate de importar correctamente desde db.js

const checkRoleAuth = (roles) => async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        // Verificar que el encabezado Authorization está presente
        if (!authorizationHeader) {
            res.status(401).send({ error: 'No autorizado: falta el encabezado Authorization' });
            return;
        }

        const token = authorizationHeader.split(' ').pop();
        const tokenData = await verifyToken(token);

        // Verificar que el token es válido
        if (!tokenData) {
            res.status(401).send({ error: 'No autorizado: token inválido' });
            return;
        }

        // Obtener el usuario por ID utilizando el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerUsuarioPorId @idUsuarios=:idUsuarios',
            {
                replacements: { idUsuarios: tokenData._id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verificar si el usuario existe
        if (result.length === 0) {
            res.status(404).send({ error: 'Usuario no encontrado' });
            return;
        }

        const userData = result[0];

        // Verificar si el rol del usuario está incluido en los roles permitidos
        if ([].concat(roles).includes(userData.rol_idRol)) {
            next();
        } else {
            res.status(409).send({ error: 'No tienes permisos' });
        }

    } catch (e) {
        console.log(e);
        res.status(409).send({ error: 'No puedes acceder' });
    }
};

export { checkRoleAuth };