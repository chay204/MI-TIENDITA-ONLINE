import sequelize from '../../config/db.js';  
import { httpError } from '../helpers/handleError.js';           

const getProducts = async (req, res) => {
    try {
        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ObtenerProductos',
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

const createProduct = async (req, res) => {
    try {
        // Desestructuramos el cuerpo de la solicitud
        const { categoriaProductos_idCategoriaProductos, usuarios_idUsuarios, nombreProducto, marca, codigo, stock, estados_idEstados, precio, foto } = req.body;

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC InsertarProducto @categoriaProductos_idCategoriaProductos=:categoriaProductos_idCategoriaProductos, @usuarios_idUsuarios=:usuarios_idUsuarios, @nombreProducto=:nombreProducto, @marca=:marca, @codigo=:codigo, @stock=:stock, @estados_idEstados=:estados_idEstados, @precio=:precio, @foto=:foto',
            {
                replacements: { categoriaProductos_idCategoriaProductos, usuarios_idUsuarios, nombreProducto, marca, codigo, stock, estados_idEstados, precio, foto },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el producto recién insertado
        res.status(201).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del producto desde los parámetros de la ruta
        const idProducto = parseInt(id, 10);
        
        console.log("idProducto", idProducto);
        const { categoriaProductos_idCategoriaProductos, usuarios_idUsuarios, nombreProducto, marca, codigo, stock, estados_idEstados, precio, foto } = req.body;

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC ActualizarProducto @idProductos=:idProducto, @categoriaProductos_idCategoriaProductos=:categoriaProductos_idCategoriaProductos, @usuarios_idUsuarios=:usuarios_idUsuarios, @nombreProducto=:nombreProducto, @marca=:marca, @codigo=:codigo, @stock=:stock, @estados_idEstados=:estados_idEstados, @precio=:precio, @foto=:foto',
            {
                replacements: { idProducto, categoriaProductos_idCategoriaProductos, usuarios_idUsuarios, nombreProducto, marca, codigo, stock, estados_idEstados, precio, foto },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el producto actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del producto desde los parámetros de la ruta

        // Verifica si el ID es un número válido
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new Error('El ID del producto no es un número válido');
        }

        // Ejecuta el procedimiento almacenado
        const result = await sequelize.query(
            'EXEC BorrarProducto @idProductos=:id',
            {
                replacements: { id: productId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verifica si el resultado contiene un error
        if (result.length > 0 && result[0].ErrorNumber) {
            throw new Error(result[0].ErrorMessage);
        }

        // Envia la respuesta con el producto actualizado
        res.status(200).send(result[0]);
    } catch (e) {
        // Manejo de errores
        httpError(res, e);
    }
};

export { getProducts, createProduct, updateProduct, deleteProduct};  