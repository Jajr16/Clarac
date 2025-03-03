-- PROCEDURES Y TRANSACTIONS
-- Para dar de alta los equipos
DELIMITER |
CREATE PROCEDURE AgregarEquipos(
    IN NS VARCHAR(45), 
    IN EQP VARCHAR(45),
    IN MRC VARCHAR(45), 
    IN MDO VARCHAR(45),
    IN ENC VARCHAR(45),
    IN UB VARCHAR(50),
    IN HDW VARCHAR(100),
    IN SFT VARCHAR(100), 
    IN NSCPU VARCHAR(45),
    IN MSE VARCHAR(45), 
    IN TLD VARCHAR(45), 
    IN ACS VARCHAR(45))
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		SHOW ERRORS;
        ROLLBACK;
    END;

    START TRANSACTION;
		-- INICIAR INSERCIÓN
		INSERT INTO equipo VALUES (NULL,NS,EQP,MRC,MDO,
        (SELECT empleado.Num_Emp FROM empleado 
        WHERE empleado.Num_Emp = (SELECT Num_Emp FROM empleado WHERE Nom = ENC)),UB);
        -- INICIAR CONDICIONALES
        IF EQP = 'CPU' THEN
			IF HDW IS NOT NULL AND SFT IS NOT NULL THEN
				INSERT INTO pcs VALUES (NS, HDW, SFT);
            END IF;
            
            IF MSE IS NOT NULL THEN
				INSERT INTO mouse VALUES (NS, MSE);
            END IF;
            
            IF TLD IS NOT NULL THEN
				INSERT INTO teclado VALUES (NS, TLD);
            END IF;
            
            IF ACS IS NOT NULL THEN
				INSERT INTO accesorio VALUES (NS, ACS);
            END IF;
            
		END IF;
        
        IF EQP = 'MONITOR' THEN
			IF NSCPU IS NOT NULL THEN
				INSERT INTO monitor VALUES (NS, NSCPU);
            END IF;
        END IF;
        
    
	SELECT 'Success' AS status;
	COMMIT;
END |
DELIMITER  ;

-- Para actualizar los equipos
DELIMITER |
CREATE PROCEDURE ActualizarEquipos(
    IN NSN VARCHAR(45), 
    IN Eqp VARCHAR(45),
    IN MRC VARCHAR(45),
    IN MDO VARCHAR(45),
    IN UB VARCHAR(50),
    IN NSO VARCHAR(45),
    IN ENCAR VARCHAR(45),
    IN OLDENCAR VARCHAR(45),
    IN HDW VARCHAR(100),
    IN SFT VARCHAR(100), 
    IN NSCPU VARCHAR(45),
    IN MSE VARCHAR(45), 
    IN TLD VARCHAR(45), 
    IN ACS VARCHAR(45))
BEGIN
	DECLARE exit_msg VARCHAR(255) DEFAULT '';

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        IF exit_msg != '' THEN
            SELECT exit_msg AS Error;
        ELSE
            SELECT 'Se produjo un error inesperado.' AS Error;
        END IF;
    END;

	START TRANSACTION;
    SELECT NSN, Eqp, MRC, MDO, UB, NSO, ENCAR, OLDENCAR, HDW, SFT, NSCPU, MSE, TLD, ACS;
    UPDATE equipo SET 
        Num_Serie = NSN, Equipo = Eqp, Marca = MRC,
        Modelo = MDO, Ubi = UB, Num_emp = (SELECT Num_emp FROM empleado WHERE Nom = ENCAR)
    WHERE 
        Num_Serie = NSO AND Num_emp = (SELECT Num_emp FROM empleado WHERE Nom = OLDENCAR);
    SELECT ROW_COUNT() AS Filas_Afectadas_Equipo;
    
    IF Eqp = 'CPU' THEN
        IF HDW IS NOT NULL AND SFT IS NOT NULL THEN
			IF EXISTS (SELECT 1 FROM pcs WHERE Num_Serie = NSO) THEN
				UPDATE pcs SET Num_Serie = NSN, Hardware = HDW, Software = SFT WHERE Num_Serie = NSO;
			ELSE 
				INSERT INTO pcs VALUES (NSN, HDW, SFT);
            END IF;
			SELECT ROW_COUNT() AS Filas_Afectadas_PCS;
        END IF;
        
        IF MSE IS NOT NULL THEN
			IF EXISTS (SELECT 1 FROM Mouse WHERE Num_Serie = NSO) THEN
				UPDATE Mouse SET Num_Serie = NSN, Mouse = MSE WHERE Num_Serie = NSO;
			ELSE 
				INSERT INTO Mouse VALUES (NSN, MSE);
            END IF;
			SELECT ROW_COUNT() AS Filas_Afectadas_Mouse;
        END IF;
        
        IF TLD IS NOT NULL THEN
			IF EXISTS (SELECT 1 FROM Teclado WHERE Num_Serie = NSO) THEN
				UPDATE Teclado SET Num_Serie = NSN, Teclado = TLD WHERE Num_Serie = NSO;
			ELSE 
				INSERT INTO Teclado VALUES (NSN, TLD);
            END IF;
			SELECT ROW_COUNT() AS Filas_Afectadas_Teclado;
        END IF;
        
        IF ACS IS NOT NULL THEN
			IF EXISTS (SELECT 1 FROM Accesorio WHERE Num_Serie = NSO) THEN
				UPDATE Accesorio SET Num_Serie = NSN, Accesorio = ACS WHERE Num_Serie = NSO;
			ELSE 
				INSERT INTO Accesorio VALUES (NSN, ACS);
            END IF;
            SELECT ROW_COUNT() AS Filas_Afectadas_Accesorio;
        END IF;
    END IF;
    
    IF Eqp = 'MONITOR' THEN
        IF NSCPU IS NOT NULL THEN
			IF EXISTS (SELECT 1 FROM equipo WHERE Num_Serie = NSCPU AND Equipo = 'CPU') THEN
                IF EXISTS (SELECT 1 FROM monitor WHERE Num_Serie_CPU = NSCPU AND Num_Serie_Monitor != NSO) THEN
					SET exit_msg = 'El número de serie del CPU ya está asociado a otro monitor, 
                    intente con otro número de serie';
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = exit_msg;
				ELSE
					IF EXISTS (SELECT 1 FROM monitor WHERE Num_Serie_Monitor = NSO) THEN
						UPDATE monitor SET Num_Serie_Monitor = NSN, Num_Serie_CPU = NSCPU WHERE Num_Serie_Monitor = NSO;
                    ELSE
						INSERT INTO monitor VALUES (NSN, NSCPU);
                    END IF;
                END IF;
				SELECT ROW_COUNT() AS Filas_Afectadas_Monitor;
            ELSE
				SET exit_msg = 'No hay un CPU con ese número de serie, inténtalo de nuevo';
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = exit_msg;
            END IF;
        END IF;
    END IF;
	
    SELECT 'Success' AS status;
    COMMIT;
END |

DELIMITER ;
-- drop procedure AgregarEmpleados;
DELIMITER //

CREATE PROCEDURE AgregarEmpleados(
    IN p_Num_emp VARCHAR(45), 
    IN p_Nom VARCHAR(45),
    IN p_Area VARCHAR(45), 
    IN p_Jefe_nombre VARCHAR(45)
)
BEGIN
    DECLARE jefe_num_emp VARCHAR(45);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al insertar el empleado' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Mostrar los valores de entrada recibidos (para depuración)
    SELECT 'Valores de entrada:', p_Num_emp AS 'Num_emp recibido', p_Nom AS 'Nom recibido', p_Area AS 'Area recibida', p_Jefe_nombre AS 'Jefe recibido';

    -- Buscar el Num_emp del jefe basado en su nombre
    SELECT Num_emp INTO jefe_num_emp
    FROM empleado
    WHERE Nom = p_Jefe_nombre
    LIMIT 1;

    -- Mostrar el resultado de la búsqueda del jefe
    SELECT 'Resultado de búsqueda de jefe:', jefe_num_emp AS 'Num_emp del jefe encontrado';

    -- Verificar si se encontró el jefe
    IF jefe_num_emp IS NULL THEN
        SET jefe_num_emp = NULL;
        SELECT 'Advertencia: No se encontró el jefe, asignando NULL a Num_Jefe' AS status;
    ELSE
        SELECT 'Jefe encontrado con Num_emp:' AS status, jefe_num_emp;
    END IF;

    -- Realizar la inserción y mostrar los valores que se van a insertar
    SELECT 'Realizando inserción con valores:', p_Num_emp AS 'Num_emp a insertar', p_Nom AS 'Nom a insertar', p_Area AS 'Área a insertar', jefe_num_emp AS 'Num_Jefe a insertar';

    INSERT INTO empleado (Num_emp, Nom, Área, Num_Jefe)
    VALUES (p_Num_emp, p_Nom, p_Area, jefe_num_emp);

    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;

    -- Confirmar los cambios
    COMMIT;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE AgregarUsuarios(
    IN NomUsuario VARCHAR(45), 
    IN Usuario VARCHAR(45),
    IN Pass VARCHAR(45)) 
BEGIN
    DECLARE NumEmp INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: El nombre del usuario ya esta siendo utilizado' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Buscar el número de empleado basado en el nombre
    SELECT Num_emp INTO NumEmp FROM empleado WHERE Nom = NomUsuario;

    -- Verificar si el número de empleado es NULL (no encontrado)
    IF NumEmp IS NULL THEN
        -- Si no existe el empleado, devolver un error y hacer rollback
        ROLLBACK;
        SELECT 'Error: El empleado no existe' AS status;
    ELSE
        -- Insertar el nuevo usuario en la tabla 'usuario'
        INSERT INTO usuario (Num_Emp, Usuario, Pass)
        VALUES (NumEmp, Usuario, Pass);

        -- Confirmar los cambios si todo fue exitoso
        SELECT 'Success' AS status;
        COMMIT;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE AgregarPermisos(
    IN permiso VARCHAR(45), 
    IN usuario VARCHAR(45),
    IN modulo VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al insertar el permiso' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Insertar el permiso en la tabla de permisos
    INSERT INTO permisos (permiso, usuario, modulo) 
    VALUES (permiso, usuario, modulo);
	
    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE AgregarPeticiones(
    IN CBS VARCHAR(45),
    IN CANT INT,
    IN USR VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'error' AS status, 'Ocurrió un error al agregar la petición' as message;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    INSERT INTO soli_car VALUES (NULL, CBS, CANT, (SELECT Num_Emp FROM usuario
    WHERE Usuario = USR), NOW(), 0);

	-- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE PeticionesAceptadas(
    IN CBS VARCHAR(45),
    IN CANT INT,
    IN USR VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al agregar la petición' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    INSERT INTO soli_car VALUES (NULL, CBS, CANT, (SELECT Num_Emp FROM usuario WHERE Usuario = USR), NOW());

	-- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //

DELIMITER ;

DELIMITER | 
CREATE PROCEDURE extractPE(
    IN CBSP VARCHAR(45),
    IN NES VARCHAR(45),
    IN CNTS INT
)
BEGIN
    DECLARE error_message TEXT DEFAULT 'Unknown error';
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Capturar el mensaje de error
        GET DIAGNOSTICS CONDITION 1 
            error_message = MESSAGE_TEXT;
            
        -- Verificar si el error fue causado por el TRIGGER
        IF error_message = 'No hay suficiente existencia para realizar la salida' THEN
            -- Enviar el mensaje específico del TRIGGER
            SELECT 'error' AS status, error_message AS message;
        ELSE
            -- Enviar un mensaje genérico de error
            SELECT 'error' AS status, 'Error al procesar la solicitud' AS message;
        END IF;
        
        -- Rollback de la transacción
        ROLLBACK;
    END;

    START TRANSACTION;
        -- Intentar la inserción
        INSERT INTO salidas_productos VALUES (CBSP, NOW(), (SELECT Num_emp FROM empleado WHERE Nom = NES), CNTS);
        
        -- Si se realiza la inserción, enviar un mensaje de éxito
        SELECT 'Success' AS status, 'Producto sacado con éxito' AS message;
    COMMIT;
END |
DELIMITER ;

DELIMITER | 
CREATE PROCEDURE AgregarProdExistentes(
	IN NFP VARCHAR(10),
    IN CDBP VARCHAR(45),
    IN CANT INT,
    IN FFACT DATE,
    IN PROVDR VARCHAR(45)
)
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Declarar variables para capturar el error
        DECLARE error_message TEXT DEFAULT 'Unknown error';
        DECLARE error_code INT DEFAULT 0;
        
        -- Obtener el código de error y el mensaje de error
        GET DIAGNOSTICS CONDITION 1 
            error_code = RETURNED_SQLSTATE, 
            error_message = MESSAGE_TEXT;
        
        -- Imprimir el error (puede ser almacenado en una tabla de logs)
        SELECT CONCAT('Error Code: ', error_code, ', Message: ', error_message) AS Error;
        
        -- Rollback de la transacción
        ROLLBACK;
    END;

	START TRANSACTION;
    
	IF NOT EXISTS (SELECT 1 FROM facturas_almacen WHERE Num_Fact = NFP) THEN
		INSERT INTO facturas_almacen VALUES (NFP, FFACT, PROVDR, CURDATE());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM factus_productos WHERE Cod_Barras = CDBP AND Nfactura = NFP) THEN
		INSERT INTO factus_productos VALUES (CDBP, NFP, CANT);
        SELECT 'Success' AS status;
	ELSE
		SELECT 'error' as status, 'La factura ingresada ya había sido registrada.' as message;
    END IF;
    COMMIT;
END |
DELIMITER ;

DELIMITER | 
CREATE PROCEDURE consulPE()
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
	START TRANSACTION;
	SELECT 
    a.Cod_Barras as CB, 
    a.Articulo as Arti, 
    COALESCE(fp.total_entrada, 0) - COALESCE(sp.total_salida, 0) as Existencia,
    a.eliminado
	FROM 
		almacen a
	LEFT JOIN (
		-- Subconsulta para sumar las cantidades de entradas
		SELECT Cod_Barras, SUM(Cantidad) as total_entrada
		FROM factus_productos
		GROUP BY Cod_Barras
	) fp ON a.Cod_Barras = fp.Cod_Barras
	LEFT JOIN (
		-- Subconsulta para sumar las cantidades de salidas
		SELECT Cod_BarrasS, SUM(Cantidad_Salida) as total_salida
		FROM salidas_productos
		GROUP BY Cod_BarrasS
	) sp ON a.Cod_Barras = sp.Cod_BarrasS ORDER BY eliminado ASC;
    COMMIT;
END |
DELIMITER ;

DELIMITER | 
CREATE PROCEDURE consulPet(
	IN USR VARCHAR(45)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    
	START TRANSACTION;
		
		SELECT 
			soli_car.Cod_Barras_SC AS CBSC,
			almacen.Articulo AS artic,
			soli_car.cantidad_SC AS Cant,
			DATE_FORMAT(soli_car.request_date, '%Y-%m-%d %H:%i:%s') AS fecha,
			CASE 
				WHEN soli_car.cerrada = 1 AND status_soli.sol_id IS NULL THEN 'Solicitud rechazada'
                WHEN status_soli.sol_id IS NULL THEN 'En espera de confirmación'
                WHEN 
					status_soli.delivered_ware = 1 AND 
                    status_soli.delivered_soli = 0 
				THEN 
					'Entregado por el almacenista, esperando tu confirmación.'
				WHEN 
					status_soli.delivered_ware = 0 AND 
                    status_soli.delivered_soli = 1
				THEN 
					'Artículo recibido, esperando confirmación del almacenista.'
				WHEN 
					status_soli.delivered_ware = 0 AND 
                    status_soli.delivered_soli = 0
				THEN 
					'Esperando entrega del almacenista.'
				WHEN 
					status_soli.delivered_ware = 1 AND 
                    status_soli.delivered_soli = 1
				THEN 
					'Entrega completa.'
				ELSE 'Pendiente'
			END AS status_peti

			FROM soli_car
				LEFT JOIN status_soli ON soli_car.sol_id = status_soli.sol_id
				INNER JOIN almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
		WHERE soli_car.emp_SC = (
			SELECT Num_Emp 
			FROM usuario 
			WHERE Usuario = USR
		);
    COMMIT;
END |
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AgregarUEMob(
	IN arti varchar(100),
    IN descrip varchar(400),
    IN usuar varchar(45), 
    IN encargado varchar(45),
    IN ubi varchar(400),
    IN Cant int)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al añadir usuario o empleado' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;
	
    IF encargado IS NOT NULL THEN
		-- Insertar el mobiliario en la tabla de mobiliario
		INSERT INTO mobiliario VALUES (NULL, arti, descrip, (
			SELECT Num_emp from empleado where Nom = encargado
        ), ubi, Cant, (select Área from empleado where Num_emp = (SELECT Num_emp from empleado where Nom = encargado)));
        
    ELSE
        -- Insertar el mobiliario en la tabla de mobiliario
		INSERT INTO mobiliario VALUES (NULL, arti, descrip, (
			SELECT Num_emp from usuario where Usuario = usuar
        ), ubi, Cant, (select Área from empleado where Num_emp = (SELECT Num_emp from usuario where Usuario = usuar)));

    END IF;

	-- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE showMob(
    IN usu varchar(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
		IF EXISTS (SELECT 1 FROM permisos WHERE usuario = usu AND permiso = 5 AND modulo = 'MOBILIARIO') THEN
			SELECT m.*, e.Nom, u.usuario FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp INNER JOIN usuario u ON u.Num_Emp = m.Num_emp;
		ELSE
			SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp WHERE m.Num_emp = (SELECT Num_Emp from usuario WHERE Usuario = usu);
		END IF;
        
	 -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

   
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getUserMob(
    IN NomEnc varchar(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
		SELECT Usuario FROM usuario WHERE Num_Emp = (SELECT num_emp FROM empleado WHERE Nom = NomEnc);
        
	-- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE EliminarUEMob(
    IN arti VARCHAR(100),
    IN descri VARCHAR (400),
    IN usuar VARCHAR(45),
    IN encargado VARCHAR(45)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al eliminar el mobiliario' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    IF encargado IS NOT NULL THEN        
        -- Eliminar el mobiliario de la tabla de mobiliario
        DELETE FROM mobiliario 
        WHERE Articulo = arti AND Descripcion = descri AND Num_emp IN (
            SELECT Num_emp FROM empleado WHERE Nom = encargado
        );
    ELSE
        -- Eliminar el mobiliario de la tabla de mobiliario
        DELETE FROM mobiliario 
        WHERE Articulo = arti AND Descripcion = descri AND Num_emp IN (
            SELECT Num_emp FROM usuario WHERE Usuario = usuar
        );
    END IF;

	-- Confirmar si la eliminación fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;

    
END //
DELIMITER ;

drop procedure if exists ModificarUEMob;
DELIMITER //
CREATE PROCEDURE ModificarUEMob(
    IN nuevoArticulo VARCHAR(100),
    IN nuevaDescripcion VARCHAR(400),
    IN usuar VARCHAR(45),
    IN encargado VARCHAR(45),
    IN nuevaUbicacion VARCHAR(400),
    IN nuevaCantidad INT,
    IN articuloAntiguo VARCHAR(100),
    IN descripcionAntigua VARCHAR(400),
    IN usuarioAntiguo VARCHAR(45)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al modificar el mobiliario' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    IF encargado IS NOT NULL THEN
        -- Modificar el mobiliario en la tabla de mobiliario utilizando el encargado
        UPDATE mobiliario
        SET 
            Articulo = nuevoArticulo,
            Descripcion = nuevaDescripcion,
            Num_emp = (SELECT Num_emp from empleado where Nom = encargado),
            Ubicacion = nuevaUbicacion,
            Cantidad = nuevaCantidad
        WHERE 
            Articulo = articuloAntiguo 
            AND Descripcion = descripcionAntigua 
            AND Num_emp = (SELECT Num_emp from empleado where Nom = usuarioAntiguo);
            
		select Num_emp from mobiliario;
        
    ELSE
        -- Modificar el mobiliario en la tabla de mobiliario utilizando el usuario
        UPDATE mobiliario
        SET 
            Articulo = nuevoArticulo,
            Descripcion = nuevaDescripcion,
            Num_emp = (SELECT Num_emp FROM usuario WHERE Usuario = usuar),
            Ubicacion = nuevaUbicacion,
            Cantidad = nuevaCantidad
        WHERE 
            Articulo = articuloAntiguo 
            AND Descripcion = descripcionAntigua
            AND Num_emp = (SELECT Num_emp FROM usuario WHERE Usuario = usuarioAntiguo);
    END IF;

	-- Confirmar si la modificación fue exitosa
    SELECT 'Success' AS status;
    -- Confirmar los cambios
    COMMIT;
    
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ConfirmPet(
    IN usu VARCHAR(45),
    IN CBP VARCHAR(45),
    IN FECHA DATETIME
)
BEGIN
    DECLARE solId INT;
    DECLARE empNum INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: rollback y mensaje de error
        ROLLBACK;
        SELECT 'Error' AS status, 'Ocurrió un error al procesar la solicitud' AS message;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Obtener el Num_emp del usuario y el sol_id de soli_car en variables
    SELECT Num_emp INTO empNum 
    FROM Usuario 
    WHERE usuario = usu;

    SELECT sol_id INTO solId
    FROM soli_car
    WHERE Cod_Barras_SC = CBP 
      AND emp_SC = empNum 
      AND request_date = FECHA;

    -- Verificar si el sol_id existe en status_soli
    IF solId IS NOT NULL AND EXISTS (SELECT 1 FROM status_soli WHERE sol_id = solId) THEN
        -- Actualizar delivered_soli a 1 en status_soli
        UPDATE status_soli 
        SET delivered_soli = 1 
        WHERE sol_id = solId;

        SELECT 'Success' AS status, 'Operación exitosa' AS message;
    ELSE
        SELECT 'Empty' AS status, 'Aún no han aceptado tu petición, para más información consulta a dirección' AS message;
    END IF;

    -- Confirmar los cambios
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE consulPetDir(
	IN usu varchar(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
    
    IF 'DIRECCION GENERAL' = (SELECT Área FROM empleado WHERE Num_emp = (SELECT Num_Emp FROM Usuario
    WHERE Usuario = usu)) THEN
		SELECT soli_car.Cod_Barras_SC, almacen.Articulo, soli_car.cantidad_SC, empleado.Nom, 
        soli_car.request_date FROM soli_car 
        INNER JOIN almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
        INNER JOIN empleado ON empleado.Num_emp = soli_car.emp_SC 
        LEFT JOIN status_soli ON soli_car.sol_id = status_soli.sol_id WHERE status_soli.sol_id IS NULL
        AND soli_car.cerrada = 0;
        
    END IF;
		
    -- Confirmar los cambios
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ConfirmPetDir(
    IN CBD VARCHAR(45),
    IN EMP VARCHAR(45),
    IN FPS DATETIME,
    IN OP TINYINT(1)
)
BEGIN
    DECLARE solID INT DEFAULT NULL;
    DECLARE empID INT DEFAULT NULL;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Verificar si el empleado existe y asignar empID
    SET empID = (SELECT Num_emp FROM empleado WHERE Nom = EMP);
    -- Comprobar si empID es NULL-- Esto mostrará el valor de empID para depuración
    IF empID IS NULL THEN
        -- Si empID es NULL, cancelar la operación y regresar un mensaje claro
        SELECT 'Error: Empleado no encontrado' AS status;
        ROLLBACK;
    END IF;

    -- Verificar si el producto existe en soli_car y asignar solID
    SET solID = (SELECT sol_id FROM soli_car WHERE Cod_Barras_SC = CBD AND emp_SC = empID 
    AND request_date = FPS);
    -- Comprobar si solID es NULL
    IF solID IS NULL THEN
        -- Si solID es NULL, cancelar la operación y regresar un mensaje claro
        SELECT 'Error: Solicitud no encontrada' AS status;
        ROLLBACK;
    END IF;

    -- Proceder con la operación solicitada
    IF OP = 1 THEN
        INSERT INTO status_soli (sol_id) VALUES (solID);
    ELSE 
        UPDATE soli_car SET cerrada = 1 WHERE sol_id = solID;
    END IF;

	-- Devolver el estado de éxito solo si la transacción fue exitosa
    SELECT 'Success' AS status, 'Operación exitosa' AS message;
    -- Confirmar los cambios si no hay errores
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE statusSolicitudesDir(
IN usu VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
    
		IF 'DIRECCION GENERAL' = (SELECT Área FROM empleado WHERE Num_emp = (SELECT Num_Emp FROM Usuario
		WHERE Usuario = usu)) THEN
			SELECT 
				almacen.Articulo AS artic,
				soli_car.cantidad_SC AS Cant,
				soli_car.request_date AS fecha,
				empleado.Nom,
				CASE 
					WHEN status_soli.delivered_ware = 0 AND delivered_soli = 0 THEN 'Esperando a que el almacenista entregue el producto.'
					WHEN status_soli.delivered_ware = 1 AND delivered_soli = 0 THEN 'Entregado por almacenista, esperando confirmación del solicitante.'
					WHEN status_soli.delivered_ware = 1 AND delivered_soli = 1 THEN 'Entrega confirmada por ambas partes.'
					WHEN status_soli.delivered_ware = 0 AND delivered_soli = 1 THEN 'Artículo recibido por el solicitante, esperando confirmación del almacenista.'
				END AS status_solicitudes
			FROM 
				status_soli
			LEFT JOIN 
				soli_car ON soli_car.sol_id = status_soli.sol_id
			INNER JOIN 
				almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
			INNER JOIN 
				empleado ON soli_car.emp_SC = empleado.Num_emp
			WHERE 
				soli_car.cerrada != 1;
		END IF;
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE HistorySolicitudesDir(
IN usu VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
    
		IF 'DIRECCION GENERAL' = (SELECT Área FROM empleado WHERE Num_emp = (SELECT Num_Emp FROM Usuario
		WHERE Usuario = usu)) THEN
			SELECT 
				almacen.Articulo AS artic,
				soli_car.cantidad_SC AS Cant,
				soli_car.request_date AS fecha,
				empleado.Nom,
				CASE 
					WHEN soli_car.cerrada = 1 THEN 'Proceso finalizado.'
				END AS status_solicitudes
			FROM 
				soli_car
			LEFT JOIN 
				status_soli ON soli_car.sol_id = status_soli.sol_id
			INNER JOIN 
				almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
			INNER JOIN 
				empleado ON soli_car.emp_SC = empleado.Num_emp
			WHERE 
				soli_car.cerrada = 1;
		END IF;
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ConfirmPetAlmacen(
    IN FECHA DATETIME,
    IN CBP VARCHAR(45),
    IN SOLN VARCHAR(45)
)
BEGIN
    DECLARE solId INT;
    DECLARE empNum INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error' AS status, 'Ocurrió un error al procesar la solicitud' AS message;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Obtener el Num_emp del empleado y el sol_id de soli_car en variables
    SELECT Num_emp INTO empNum 
    FROM empleado 
    WHERE Nom = SOLN;

    SELECT sol_id INTO solId
    FROM soli_car
    WHERE Cod_Barras_SC = CBP 
      AND emp_SC = empNum 
      AND request_date = FECHA;

    -- Verificar si existe el registro en status_soli
    IF solId IS NOT NULL AND EXISTS (SELECT 1 FROM status_soli WHERE sol_id = solId) THEN
        -- Actualizar delivered_soli a 1 en status_soli
        UPDATE status_soli 
        SET delivered_ware = 1 
        WHERE sol_id = solId;

        SELECT 'Success' AS status, 'Operación exitosa' AS message;
    ELSE
        SELECT 'Empty' AS status, 'Aún no han aceptado tu petición, para más información consulta a dirección' AS message;
    END IF;

    -- Confirmar los cambios
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE statusSolicitudesAlmacen()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
		SELECT 
			soli_car.Cod_Barras_SC as CBA,
			almacen.Articulo AS artic,
			soli_car.cantidad_SC AS Cant,
			soli_car.request_date AS fecha,
			empleado.Nom,
			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Entrega finalizada'
				WHEN status_soli.delivered_ware = 0 AND delivered_soli = 0 THEN 'Proceso no iniciado, por favor, vaya a entregar este artículo.'
				WHEN status_soli.delivered_ware = 1 AND delivered_soli = 0 THEN 'Artículo entregado, falta confirmación del solicitante.'
				WHEN status_soli.delivered_ware = 1 AND delivered_soli = 1 THEN 'Entrega confirmada por ambas partes.'
				WHEN status_soli.delivered_ware = 0 AND delivered_soli = 1 THEN 'Artículo recibido por el solicitante, esperando tu confirmación.'
			END AS status_solicitudes
		FROM 
			status_soli
		LEFT JOIN 
			soli_car ON soli_car.sol_id = status_soli.sol_id
		INNER JOIN 
			almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
		INNER JOIN 
			empleado ON soli_car.emp_SC = empleado.Num_emp
		WHERE 
			soli_car.cerrada != 1;
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE HistorySolicitudesAlmacen()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    -- Iniciar la transacción
    START TRANSACTION;
		SELECT 
			soli_car.Cod_Barras_SC as CBA,
			almacen.Articulo AS artic,
			soli_car.cantidad_SC AS Cant,
			soli_car.request_date AS fecha,
			empleado.Nom,
			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Entrega finalizada.'
			END AS status_solicitudes
		FROM 
			status_soli
		LEFT JOIN 
			soli_car ON soli_car.sol_id = status_soli.sol_id
		INNER JOIN 
			almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
		INNER JOIN 
			empleado ON soli_car.emp_SC = empleado.Num_emp
		WHERE 
			soli_car.cerrada = 1;
    COMMIT;
END //
DELIMITER ;

-- Modificar Registro Usuarios
DELIMITER //
CREATE PROCEDURE ActualizarRegUsu(
    IN in_emp_num VARCHAR(45),
    IN in_usuario VARCHAR(45),
    IN in_contra VARCHAR(45)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS status, 'Transaction failed' AS message;
    END;

    START TRANSACTION;

    -- Actualiza el usuario y la contraseña en la tabla usuario
    UPDATE usuario 
    SET `Usuario` = in_usuario, `Pass` = in_contra
    WHERE `Num_emp` = in_emp_num;

    -- Confirmación de éxito
    SELECT 'Success' AS status;

    COMMIT;
END //
DELIMITER ;

-- Drop procedure actualizarRegEmp;
-- Modificar Registro Empleados
DELIMITER //
CREATE PROCEDURE ActualizarRegEmp(
    IN emp_num VARCHAR(45),
    IN e_nombre VARCHAR(45),
    IN e_area VARCHAR(45),
    IN jefe_mod VARCHAR(45)
)
BEGIN
    DECLARE jefe_num VARCHAR(45);

    -- Manejador de excepciones
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS status, 'Transaction failed' AS message;
    END;

    -- Iniciar transacción
    START TRANSACTION;

    -- Obtener el Num_emp del jefe usando su nombre
    SELECT Num_emp INTO jefe_num
    FROM empleado
    WHERE Nom = jefe_mod
    LIMIT 1;

    -- Actualizar los datos del empleado y establecer el Num_Jefe encontrado
    UPDATE empleado
    SET Nom = e_nombre, Área = e_area, Num_Jefe = jefe_num
    WHERE Num_emp = emp_num;

    -- Confirmación de éxito
    SELECT 'Success' AS status;

    -- Finalizar transacción
    COMMIT;
END //

DELIMITER ;

-- Modificar Permisos
-- drop procedure ModificarPermisos;
DELIMITER $$
CREATE PROCEDURE ModificarPermisos(
    IN user VARCHAR(255),
    IN permisos JSON
)
BEGIN
    DECLARE permiso INT;
    DECLARE modulo VARCHAR(255);
    DECLARE permisoIndex INT DEFAULT 0;
    DECLARE permisoCount INT;

    -- Error handler to rollback on exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS status, 'Transaction failed' AS message;
    END;
    START TRANSACTION;

    -- Delete existing permissions for the user
    DELETE FROM permisos WHERE usuario = user;

    -- Get the length of the JSON array
    SET permisoCount = JSON_LENGTH(permisos);

    -- Loop through the JSON array
    WHILE permisoIndex < permisoCount DO
        SET permiso = JSON_UNQUOTE(JSON_EXTRACT(permisos, CONCAT('$[', permisoIndex, '].permiso')));
        SET modulo = JSON_UNQUOTE(JSON_EXTRACT(permisos, CONCAT('$[', permisoIndex, '].modulo')));

        -- Insert new permission
        INSERT INTO permisos (permiso, usuario, modulo) VALUES (permiso, user, modulo);

        SET permisoIndex = permisoIndex + 1;
    END WHILE;

    -- Commit the transaction
    SELECT 'Success' AS status;
    COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE showEqp(
    IN usu VARCHAR(255)
)
BEGIN
    DECLARE areaEmp VARCHAR(45);
    
    -- Error handler to rollback on exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS status, 'Transaction failed' AS message;
    END;
    START TRANSACTION;
    
	SELECT Área INTO areaEmp FROM empleado INNER JOIN usuario ON empleado.Num_emp = usuario.Num_emp 
    WHERE usuario = usu;
    
    IF areaEmp = 'SISTEMAS' THEN
		SELECT DISTINCT 
			Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo,
			empleado.Nom,
            equipo.Ubi,
			pcs.Hardware,
			pcs.Software,
			Monitor.Num_Serie_CPU,
			mouse.Mouse,
			teclado.Teclado,
			accesorio.Accesorio
		FROM Equipo
		LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie
		LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor
		LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie
		LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie 
		LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie 
		JOIN empleado ON Equipo.Num_emp = empleado.Num_emp;
	ELSE
		SELECT DISTINCT 
			Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo,
            equipo.Ubi,
			pcs.Hardware,
			pcs.Software,
			Monitor.Num_Serie_CPU,
			mouse.Mouse,
			teclado.Teclado,
			accesorio.Accesorio
		FROM Equipo
		LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie
		LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor
		LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie
		LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie 
		LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie;
    END IF;

    -- Commit the transaction
    SELECT 'Success' AS status;
    COMMIT;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS consulRPS;
DELIMITER | 
CREATE PROCEDURE consulRPS()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    START TRANSACTION;
    SELECT sp.*, a.Articulo, e.Nom AS Nombre_Empleado
    FROM salidas_productos sp
    JOIN almacen a ON sp.Cod_BarrasS = a.Cod_Barras
    JOIN empleado e ON sp.Num_EmpS = e.Num_Emp;
END |
DELIMITER ;

DELIMITER |
CREATE PROCEDURE deletePeticion(
	IN fecha datetime,
    IN CB VARCHAR(45),
    IN usu VARCHAR(45),
    IN cantidad INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
	END;
    START TRANSACTION;
    
    DELETE FROM soli_car WHERE request_date = fecha AND Cod_Barras_SC = CB AND emp_SC = (SELECT Num_Emp FROM usuario WHERE Usuario = usu) AND cantidad_SC = cantidad;
    
    
END |
DELIMITER ;

####################### TRIGGERS ########################
DELIMITER | 
CREATE TRIGGER EPE BEFORE INSERT ON salidas_productos
	FOR EACH ROW BEGIN
    
    DECLARE current_stock INT;
    -- Consultar la cantidad actual en el almacén
    SELECT COALESCE(fp.total_entrada, 0) - COALESCE(sp.total_salida, 0)
    as Existencia INTO current_stock FROM almacen a LEFT JOIN (SELECT Cod_Barras, SUM(Cantidad)
    as total_entrada FROM factus_productos GROUP BY Cod_Barras) fp ON a.Cod_Barras = fp.Cod_Barras
	LEFT JOIN (SELECT Cod_BarrasS, SUM(Cantidad_Salida) as total_salida FROM salidas_productos
    GROUP BY Cod_BarrasS) sp ON a.Cod_Barras = sp.Cod_BarrasS where Cod_BarrasS = new.Cod_BarrasS;
    
    IF NEW.Cantidad_Salida > current_stock THEN
        SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = 'No hay suficiente existencia para realizar la salida';
	END IF;
    END
| DELIMITER;

DELIMITER |
CREATE TRIGGER ASEPSE BEFORE UPDATE ON status_soli
	FOR EACH ROW BEGIN
		IF NEW.delivered_ware = 1 AND NEW.delivered_soli = 1 THEN
			UPDATE soli_car 
			SET cerrada = 1
			WHERE sol_id = NEW.sol_id;  
		END IF;
	END
| DELIMITER ;

DELIMITER |
CREATE TRIGGER AUAP AFTER INSERT ON usuario
	FOR EACH ROW BEGIN
		INSERT INTO permisos VALUES (1, NEW.Usuario,'PETICIONES');
	END
| DELIMITER ;