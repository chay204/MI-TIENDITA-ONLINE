import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js';  

const getAllOrders = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerTodasLasOrdenes',
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length === 0) {
            throw new Error('No se encontraron órdenes');
        }

        // Separa los resultados en información de las órdenes y detalles de las órdenes
        const orders = result.filter(item => item.idOrden !== undefined);
        const orderDetails = result.filter(item => item.idOrdenDetalles !== undefined);

        // Agrupa los detalles por orden
        const ordersWithDetails = orders.map(order => {
            return {
                ...order,
                details: orderDetails.filter(detail => detail.orden_idOrden === order.idOrden)
            };
        });

        // Envia la respuesta con la información de las órdenes y los detalles de las órdenes obtenidos
        res.status(200).send(ordersWithDetails);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID de la orden desde los parámetros de la ruta

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerOrden @idOrden=:id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length === 0) {
            throw new Error('No se encontraron detalles para la orden especificada');
        }

        // Separa los resultados en información de la orden y detalles de la orden
        const orderInfo = result[0];
        const orderDetails = result.slice(1);

        // Envia la respuesta con la información de la orden y los detalles de la orden obtenidos
        res.status(200).send({
            order: orderInfo,
            details: orderDetails
        });
    } catch (e) {
        // Manejo de errores
        console.error(e);
        res.status(500).json({
            message: 'Error al obtener la orden con sus detalles.',
            error: e.message
        });
    }
};

const createOrder = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { usuarios_idUsuarios, estados_idEstados, nombre_completo, direccion, telefono, 
            correo_electronico, fecha_entrega, total_orden, detalle_orden } = req.body;

        // Convierte los detalles de la orden a JSON si no lo están
        const json_detalle_orden = JSON.stringify(detalle_orden);

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            `EXEC InsertarOrden 
             @usuarios_idUsuarios=:usuarios_idUsuarios, 
             @estados_idEstados=:estados_idEstados, 
             @nombre_completo=:nombre_completo, 
             @direccion=:direccion, 
             @telefono=:telefono, 
             @correo_electronico=:correo_electronico, 
             @fecha_entrega=:fecha_entrega, 
             @total_orden=:total_orden, 
             @json_detalle_orden=:json_detalle_orden`,
            {
                replacements: { 
                    usuarios_idUsuarios, 
                    estados_idEstados, 
                    nombre_completo, 
                    direccion, 
                    telefono, 
                    correo_electronico, 
                    fecha_entrega, 
                    total_orden, 
                    json_detalle_orden 
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con la orden y sus detalles creados
        res.status(201).send(result);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};


const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID de la orden desde los parámetros de la ruta
        const { usuarios_idUsuarios, estados_idEstados, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, total_orden, detalle_orden } = req.body;

        const json_detalle_orden = JSON.stringify(detalle_orden);

        // Verifica que json_detalle_orden está presente
        if (!json_detalle_orden) {
            throw new Error('El parámetro json_detalle_orden es requerido');
        }

        // Ejecuta el procedimiento almacenado dentro de la transacción
        const result = await sequelize.query(
            'EXEC ActualizarOrden @idOrden=:id, @usuarios_idUsuarios=:usuarios_idUsuarios, @estados_idEstados=:estados_idEstados, @nombre_completo=:nombre_completo, @direccion=:direccion, @telefono=:telefono, @correo_electronico=:correo_electronico, @fecha_entrega=:fecha_entrega, @total_orden=:total_orden, @json_detalle_orden=:json_detalle_orden',
            {
                replacements: { id, usuarios_idUsuarios, estados_idEstados, nombre_completo, direccion, telefono, correo_electronico, fecha_entrega, total_orden, json_detalle_orden },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }


        // Envia la respuesta con la orden actualizada y sus detalles
        res.status(200).send({
            order: result[0],
            orderDetails: result.slice(1)
        });
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};



const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID de la orden desde los parámetros de la ruta
        console.log(id);
        // Verifica si el ID es un número válido
        const idOrden = parseInt(id, 10);
        if (isNaN(idOrden)) {
            throw new Error('El ID del usuario no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC BorrarOrden @idOrden=:id',
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
}



export { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder }