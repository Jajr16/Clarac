-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Inventarios
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Inventarios
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Inventarios` DEFAULT CHARACTER SET utf8 ;
USE `Inventarios` ;

-- -----------------------------------------------------
-- Table `Inventarios`.`Empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Empleado` (
  `Num_emp` INT NOT NULL AUTO_INCREMENT,
  `Nom` NVARCHAR(45) NULL,
  `Área` VARCHAR(45) NULL,
  `Num_Jefe` INT NULL,
  PRIMARY KEY (`Num_emp`),
  INDEX `Num_Jefe_idx` (`Num_Jefe` ASC),
  CONSTRAINT `Num_Jefe`
    FOREIGN KEY (`Num_Jefe`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
COMMENT = '			';

-- -----------------------------------------------------
-- Table `Inventarios`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Usuario` (
  `Num_Emp` INT NULL,
  `Usuario` VARCHAR(45) NOT NULL,
  `Pass` VARCHAR(45) not NULL,
  PRIMARY KEY (`Usuario`),
  INDEX `Num_emp_idx` (`Num_Emp` ASC),
  CONSTRAINT `Num_EmpUser`
    FOREIGN KEY (`Num_Emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Inventarios`.`Equipo`
-- -----------------------------------------------------

CREATE TABLE `Inventarios`.`Equipo` (
  `N_Inventario` int not null auto_increment,
  `Num_Serie` VARCHAR(45) NOT NULL,
  `Equipo` VARCHAR(45) NOT NULL,
  `Marca` VARCHAR(45) NOT NULL,
  `Modelo` VARCHAR(45) NOT NULL,
  `Num_emp` INT NOT NULL,
  `Ubi` nvarchar(50) not null,
  PRIMARY KEY (`Num_Serie`),
  key auto (N_Inventario),
  INDEX `Num_emp_idx` (`Num_emp` ASC),
  CONSTRAINT `Num_RespE`
    FOREIGN KEY (`Num_emp`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

create table PCs(
	Num_Serie VARCHAR(45) not null,
    Hardware varchar(100),
    Software varchar(100),
    primary key(Num_Serie),
    foreign key (Num_Serie) references equipo(Num_Serie)
    ON DELETE CASCADE
	ON UPDATE CASCADE
);

create table Monitor(
	Num_Serie_Monitor VARCHAR(45) not null not null,
    Num_Serie_CPU varchar(45),
    primary key(Num_Serie_Monitor),
    foreign key (Num_Serie_CPU) references equipo(Num_Serie)
    ON DELETE CASCADE
	ON UPDATE CASCADE
);

create table Mouse(
	Num_Serie VARCHAR(45) not null not null,
    Mouse varchar(45),
    primary key(Num_Serie),
    foreign key (Num_Serie) references equipo(Num_Serie)
    ON DELETE CASCADE
	ON UPDATE CASCADE
);

create table Teclado(
	Num_Serie VARCHAR(45) not null not null,
    Teclado varchar(45),
    primary key(Num_Serie),
    foreign key (Num_Serie) references equipo(Num_Serie)
    ON DELETE CASCADE
	ON UPDATE CASCADE
);

create table Accesorio(
	Num_Serie VARCHAR(45) not null not null,
    Accesorio varchar(45),
    primary key(Num_Serie),
    foreign key (Num_Serie) references equipo(Num_Serie)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `Inventarios`.`Mobiliario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Inventarios.`Mobiliario` (
  Num_Inventario INT AUTO_INCREMENT UNIQUE,
  Articulo varchar(100) NOT NULL,
  Descripcion VARCHAR(400) NOT NULL,
  Num_emp INT NOT NULL,
  Ubicacion varchar(400),
  Cantidad int,
  Área VARCHAR(200) NULL,
  PRIMARY KEY (Articulo, Descripcion, Num_emp),
  INDEX Num_emp_idx (Num_emp ASC),
  CONSTRAINT Num_RespM
    FOREIGN KEY (Num_emp)
    REFERENCES Inventarios.`Empleado` (Num_emp)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Inventarios`.`Facturas_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Facturas_Almacen` (
  `Num_Fact` varchar(10) NOT NULL,
  `Ffact` DATE NULL,
  `Proveedor` varchar(45),
  PRIMARY KEY (`Num_Fact`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Inventarios`.`Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Almacen` (
  `Cod_Barras` NVARCHAR(45) NOT NULL,
  `Categoria` VARCHAR(45) NULL,
  `Articulo` VARCHAR(45) NULL,
  `Marca` VARCHAR(100) NULL,
  `Descripcion` VARCHAR(400) NULL,
  `Unidad` VARCHAR(45) NULL,
  `Existencia` INT NULL,
  `eliminado` tinyint(1) not null default 0,
  PRIMARY KEY (`Cod_Barras`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Inventarios`.`Salida_Almacen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Salida_Almacen` (
  `N_Reporte` INT NOT NULL AUTO_INCREMENT,
  `Solicitante` INT NOT NULL,
  `Cod_Barras` NVARCHAR(45) NOT NULL,
  `FSalida` DATE NULL,
  `Proveedor` INT NULL,
  `Cantidad` INT NULL,
  PRIMARY KEY (`N_Reporte`, `Solicitante`, `Cod_Barras`),
  INDEX `Cod_Barras_idx` (`Cod_Barras` ASC),
  INDEX `Proveedor_idx` (`Proveedor` ASC),
  CONSTRAINT `Cod_BarrasBaja`
    FOREIGN KEY (`Cod_Barras`)
    REFERENCES `Inventarios`.`Almacen` (`Cod_Barras`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Solicitante`
    FOREIGN KEY (`Solicitante`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Proveedor`
    FOREIGN KEY (`Proveedor`)
    REFERENCES `Inventarios`.`Empleado` (`Num_emp`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Inventarios`.`Peticion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventarios`.`Peticion` (
  `Num_Pet` INT NOT NULL AUTO_INCREMENT,
  `User` VARCHAR(45) NULL,
  `Cod_Barras` NVARCHAR(45) NULL,
  `Cantidad` VARCHAR(45) NULL,
  PRIMARY KEY (`Num_Pet`),
  INDEX `User_idx` (`User` ASC),
  INDEX `Cod_Barras_idx` (`Cod_Barras` ASC),
  CONSTRAINT `User`
    FOREIGN KEY (`User`)
    REFERENCES `Inventarios`.`Usuario` (`Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Cod_BarrasPedido`
    FOREIGN KEY (`Cod_Barras`)
    REFERENCES `Inventarios`.`Almacen` (`Cod_Barras`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

drop table permisos;
create table permisos(
permiso enum("1","2","3","4", "5") not null, #Tambien se puede set 1 Altas 2 Bajas 3 Cambios 4 Consultas
usuario varchar(25),
modulo enum("ALMACÉN", "MOBILIARIO", "EQUIPOS","RESPONSIVAS","USUARIOS","EMPLEADOS", "PETICIONES") not null,
primary key(permiso, usuario, modulo),
foreign key (usuario) references usuario(Usuario) on delete cascade on update cascade
);

-- Para añadir permiso
ALTER TABLE permisos MODIFY permiso ENUM('1', '2', '3', '4', '5') NOT NULL;

insert into permisos values
(1,"ajimenez","ALMACÉN"),#Altas
(2,"ajimenez","ALMACÉN"),#Bajas
(3,"ajimenez","ALMACÉN"),#Cambios
(4,"ajimenez","ALMACÉN"),#Consultas
(1,"ajimenez","MOBILIARIO"),#Altas
(2,"ajimenez","MOBILIARIO"),#Bajas
(3,"ajimenez","MOBILIARIO"),#Cambios
(4,"ajimenez","MOBILIARIO"),#Consultas
(1,"ajimenez","EQUIPOS"),#Altas
(2,"ajimenez","EQUIPOS"),#Bajas
(3,"ajimenez","EQUIPOS"),#Cambios
(4,"ajimenez","EQUIPOS"),#Consultas
(1,"ajimenez","EMPLEADOS"),#Altas
(2,"ajimenez","EMPLEADOS"),#Bajas
(3,"ajimenez","EMPLEADOS"),#Cambios
(4,"ajimenez","EMPLEADOS"),#Consultas
(1,"ajimenez","USUARIOS"),#Altas
(2,"ajimenez","USUARIOS"),#Bajas
(3,"ajimenez","USUARIOS"),#Cambios
(4,"ajimenez","USUARIOS"),#Consultas
(1,"ajimenez","RESPONSIVAS"),#Altas
(2,"ajimenez","RESPONSIVAS"),#Bajas
(3,"ajimenez","RESPONSIVAS"),#Cambios
(4,"ajimenez","RESPONSIVAS"),
(1, "ajimenez", "PETICIONES");#Consultas

insert into permisos values
(1,"MNAVARRO","ALMACÉN"),#Altas
(2,"MNAVARRO","ALMACÉN"),#Bajas
(3,"MNAVARRO","ALMACÉN"),#Cambios
(4,"MNAVARRO","ALMACÉN"),#Consultas
(1,"MNAVARRO","MOBILIARIO"),#Altas
(2,"MNAVARRO","MOBILIARIO"),#Bajas
(3,"MNAVARRO","MOBILIARIO"),#Cambios
(4,"MNAVARRO","MOBILIARIO"),#Consultas
(1,"MNAVARRO","EQUIPOS"),#Altas
(2,"MNAVARRO","EQUIPOS"),#Bajas
(3,"MNAVARRO","EQUIPOS"),#Cambios
(4,"MNAVARRO","EQUIPOS"),#Consultas
(1,"MNAVARRO","USUARIOS"),#Altas
(2,"MNAVARRO","USUARIOS"),#Bajas
(3,"MNAVARRO","USUARIOS"),#Cambios
(4,"MNAVARRO","USUARIOS"),#Consultas
(1,"MNAVARRO","EMPLEADOS"),#Altas
(2,"MNAVARRO","EMPLEADOS"),#Bajas
(3,"MNAVARRO","EMPLEADOS"),#Cambios
(4,"MNAVARRO","EMPLEADOS"),#Consultas
(1,"MNAVARRO","RESPONSIVAS"),#Altas
(2,"MNAVARRO","RESPONSIVAS"),#Bajas
(3,"MNAVARRO","RESPONSIVAS"),#Cambios
(4,"MNAVARRO","RESPONSIVAS");#Consultas

insert into permisos values
(1,"armando","ALMACÉN"),#Altas
(2,"armando","ALMACÉN"),#Bajas
(3,"armando","ALMACÉN"),#Cambios
(4,"armando","ALMACÉN"),#Consultas
(1,"armando","MOBILIARIO"),#Altas
(2,"armando","MOBILIARIO"),#Bajas
(3,"armando","MOBILIARIO"),#Cambios
(4,"armando","MOBILIARIO"),#Consultas
(1,"armando","EQUIPOS"),#Altas
(2,"armando","EQUIPOS"),#Bajas
(3,"armando","EQUIPOS"),#Cambios
(4,"armando","EQUIPOS"),#Consultas
(1,"armando","USUARIOS"),#Altas
(2,"armando","USUARIOS"),#Bajas
(3,"armando","USUARIOS"),#Cambios
(4,"armando","USUARIOS"),#Consultas
(1,"armando","EMPLEADOS"),#Altas
(2,"armando","EMPLEADOS"),#Bajas
(3,"armando","EMPLEADOS"),#Cambios
(4,"armando","EMPLEADOS"),#Consultas
(1,"armando","RESPONSIVAS"),#Altas
(2,"armando","RESPONSIVAS"),#Bajas
(3,"armando","RESPONSIVAS"),#Cambios
(4,"armando","RESPONSIVAS"),#Consultas
(1,"armando","PETICIONES");#Consultas

insert into permisos values
(1,"martha","ALMACÉN"),#Altas
(2,"martha","ALMACÉN"),#Bajas
(3,"martha","ALMACÉN"),#Cambios
(4,"martha","ALMACÉN"),#Consultas
(1,"martha","MOBILIARIO"),#Altas
(2,"martha","MOBILIARIO"),#Bajas
(3,"martha","MOBILIARIO"),#Cambios
(4,"martha","MOBILIARIO"),#Consultas
(1,"martha","EQUIPOS"),#Altas
(2,"martha","EQUIPOS"),#Bajas
(3,"martha","EQUIPOS"),#Cambios
(4,"martha","EQUIPOS"),#Consultas
(1,"martha","USUARIOS"),#Altas
(2,"martha","USUARIOS"),#Bajas
(3,"martha","USUARIOS"),#Cambios
(4,"martha","USUARIOS"),#Consultas
(1,"martha","EMPLEADOS"),#Altas
(2,"martha","EMPLEADOS"),#Bajas
(3,"martha","EMPLEADOS"),#Cambios
(4,"martha","EMPLEADOS"),#Consultas
(1,"martha","RESPONSIVAS"),#Altas
(2,"martha","RESPONSIVAS"),#Bajas
(3,"martha","RESPONSIVAS"),#Cambios
(4,"martha","RESPONSIVAS"),#Consultas
(1,"martha","PETICIONES");#Consultas

insert into permisos values
(1,"Moises","ALMACÉN"),#Altas
(2,"Moises","ALMACÉN"),#Bajas
(3,"Moises","ALMACÉN"),#Cambios
(4,"Moises","ALMACÉN"),#Consultas
(1,"Moises","MOBILIARIO"),#Altas
(2,"Moises","MOBILIARIO"),#Bajas
(3,"Moises","MOBILIARIO"),#Cambios
(4,"Moises","MOBILIARIO"),#Consultas
(1,"Moises","EQUIPOS"),#Altas
(2,"Moises","EQUIPOS"),#Bajas
(3,"Moises","EQUIPOS"),#Cambios
(4,"Moises","EQUIPOS"),#Consultas
(1,"Moises","USUARIOS"),#Altas
(2,"Moises","USUARIOS"),#Bajas
(3,"Moises","USUARIOS"),#Cambios
(4,"Moises","USUARIOS"),#Consultas
(1,"Moises","EMPLEADOS"),#Altas
(2,"Moises","EMPLEADOS"),#Bajas
(3,"Moises","EMPLEADOS"),#Cambios
(4,"Moises","EMPLEADOS"),#Consultas
(1,"Moises","RESPONSIVAS"),#Altas
(2,"Moises","RESPONSIVAS"),#Bajas
(3,"Moises","RESPONSIVAS"),#Cambios
(4,"Moises","RESPONSIVAS"),#Consultas
(1,"Moises","PETICIONES");#Consultas

create table factus_Productos(
Cod_Barras nvarchar(45) not null,
Nfactura nvarchar(10) not null,
Cantidad int not null,
FIngreso date not null,
 constraint cPFPS primary key(Cod_Barras, Nfactura),
 foreign key(Cod_Barras) references almacen(Cod_Barras)
 on delete cascade on update cascade,
 foreign key(Nfactura) references facturas_almacen(Num_Fact)
 on delete cascade on update cascade
);

create table Salidas_Productos(
Cod_BarrasS nvarchar(45) not null,
FSalida datetime,
Num_EmpS int,
Cantidad_Salida int,
constraint CPSP primary key(Cod_BarrasS, FSalida, Num_EmpS),
foreign key (Cod_BarrasS) references almacen(Cod_Barras)
on delete cascade on update cascade,
foreign key(Num_EmpS) references empleado(Num_emp)
on delete cascade on update cascade
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'n0m3l0';
flush privileges;

update empleado set Num_Jefe = 663;
insert into usuario values(
758, "ajimenez", "Clarac2017", '4dnM3k0nl9s'
);

drop table if exists soli_car;
CREATE TABLE soli_car (
	sol_id int auto_increment not null primary key,
    Cod_Barras_SC VARCHAR(45),
    cantidad_SC INT(10),
    emp_SC int,
    request_date datetime,
    cerrada BOOLEAN DEFAULT 0, -- Si la solicitud ya fue cerrada
    foreign key (Cod_Barras_SC) references almacen(Cod_Barras)
    on update cascade on delete cascade,
    foreign key (emp_SC) references usuario(Num_Emp)
    on update cascade on delete cascade
);

drop table if exists status_soli;
CREATE TABLE status_soli(
	sol_id int not null,
    delivered_ware tinyint(1) DEFAULT 0,
    sended tinyint(1) DEFAULT 0,
    delivered_soli tinyint(1) DEFAULT 0,
    delivered_ware tinyint(1) DEFAULT 0,
    sended tinyint(1) DEFAULT 0,
    delivered_soli tinyint(1) DEFAULT 0,
	foreign key (sol_id) references soli_car(sol_id)
    on update cascade on delete cascade
);

DELIMITER |
create trigger ASEPSE before update on soli_car
	FOR EACH ROW BEGIN
		IF NEW.delivered_ware = 1 AND NEW.delivered_soli = 1 THEN
        SET NEW.cerrada = 1;
		end if;
	END
| DELIMITER ;

-- PROCEDURES Y TRANSACTIONS
-- Para dar de alta los equipos
DROP PROCEDURE IF EXISTS AgregarEquipos;
DELIMITER |
CREATE PROCEDURE AgregarEquipos(
    IN NS VARCHAR(45), 
    IN EQP VARCHAR(45),
    IN MRC VARCHAR(45), 
    IN MDO VARCHAR(45),
    IN USU VARCHAR(45),
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
		insert into equipo values (NULL,NS,EQP,MRC,MDO,
        (SELECT empleado.Num_Emp FROM empleado 
        where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = USU)),UB);
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


DELIMITER //

CREATE PROCEDURE test_error()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Mensaje de error personalizado al capturar una excepción SQL
        SHOW ERRORS;
    END;

    -- Probar lanzando un error (ejemplo: tabla inexistente)
    SELECT * FROM tabla_inexistente;

END//

DELIMITER ;
call test_error();

-- Para actualizar los equipos
-- DROP PROCEDURE IF EXISTS ActualizarEquipos;
DELIMITER |
CREATE PROCEDURE ActualizarEquipos(
    IN NSN VARCHAR(45), 
    IN Eqp VARCHAR(45),
    IN MRC VARCHAR(45),
    IN MDO VARCHAR(45),
    IN UB VARCHAR(50),
    IN NSO VARCHAR(45),
    IN usu VARCHAR(45),
    IN HDW VARCHAR(100),
    IN SFT VARCHAR(100), 
    IN NSCPU VARCHAR(45),
    IN MSE VARCHAR(45), 
    IN TLD VARCHAR(45), 
    IN ACS VARCHAR(45))
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

	START TRANSACTION;
    UPDATE equipo SET 
        Num_Serie = NSN, Equipo = Eqp, Marca = MRC,
        Modelo = MDO, Ubi = UB 
    WHERE 
        Num_Serie = NSO AND Num_emp = (SELECT Num_emp FROM usuario WHERE Usuario = usu);
    
    SELECT ROW_COUNT() AS Filas_Afectadas_Equipo;
    
    IF Eqp = 'CPU' THEN
        IF HDW IS NOT NULL AND SFT IS NOT NULL THEN
            UPDATE pcs SET Num_Serie = NSN, Hardware = HDW, Software = SFT WHERE Num_Serie = NSO;
			SELECT ROW_COUNT() AS Filas_Afectadas_PCS;
        END IF;
        
        IF MSE IS NOT NULL THEN
            UPDATE Mouse SET Num_Serie = NSN, Mouse = MSE WHERE Num_Serie = NSO;
            SELECT ROW_COUNT() AS Filas_Afectadas_Mouse;
        END IF;
        
        IF TLD IS NOT NULL THEN
            UPDATE Teclado SET Num_Serie = NSN, Teclado = TLD WHERE Num_Serie = NSO;
            SELECT ROW_COUNT() AS Filas_Afectadas_Teclado;
        END IF;
        
        IF ACS IS NOT NULL THEN
            UPDATE Accesorio SET Num_Serie = NSN, Accesorio = ACS WHERE Num_Serie = NSO;
			SELECT ROW_COUNT() AS Filas_Afectadas_Accesorio;
        END IF;
    END IF;
    
    IF Eqp = 'MONITOR' THEN
        IF NSCPU IS NOT NULL THEN
            UPDATE monitor SET Num_Serie = NSN, Num_Serie_CPU = NSCPU WHERE Num_Serie = NSO;
			SELECT ROW_COUNT() AS Filas_Afectadas_Monitor;
        END IF;
    END IF;
	
    SELECT 'Success' AS status;
    COMMIT;
END |

DELIMITER ;

select*from usuario;
select*from mobiliario;
select*from soli_car;
select*from soli_com;
select*from almacen;
select*from facturas_almacen;
select*from factus_productos;
select*from almacen;
select*from equipo;
select*from permisos;

delete from equipo where N_Inventario = 11;

CREATE TABLE soli_com (
    Cod_Barras_SCom VARCHAR(45),
    emp_SCom int,
    request_date_SCom datetime,
    Acept BOOLEAN, -- Si la solicitud fue aceptada o no
    recibida tinyint(1), -- Si ya se recibió el pedido
    almacenada tinyint(1) -- Si el pedido ya fue almacenado
    almacenada tinyint(1) -- Si el pedido ya fue almacenado
);

-- Modify table soli_com
alter table soli_com add constraint SoliComPK primary key(Cod_Barras_SCom, emp_SCom, request_date_SCom);
alter table soli_com add constraint CodBFK foreign key(Cod_Barras_SCom) references almacen(Cod_Barras);
alter table soli_com add constraint EmpFK foreign key(emp_SCom) references empleado(Num_emp);

select*from equipo;
select*from monitor;
select*from pcs;
select*from teclado;
select*from mouse;
select*from accesorio;
delete from equipo where Num_Serie = 'DWA1';
delete from monitor where Num_Serie_Monitor = 'DWA1';

update soli_car set delivered_soli = 0, delivered_ware = 0;
select soli_car.request_date, soli_car.Cod_Barras_SC, almacen.Articulo, soli_car.cantidad_SC, almacen.Marca, empleado.Nom, soli_car.cerrada, soli_car.Acept from soli_car inner join almacen on soli_car.Cod_Barras_SC = almacen.Cod_Barras inner join empleado on empleado.Num_emp = soli_car.emp_SC order by cerrada, Acept;

select equipo.Num_Serie, pcs.Hardware, pcs.Software, monitor.Num_Serie_CPU, mouse.Mouse, teclado.Teclado, accesorio.Accesorio from equipo left join monitor on equipo.Num_Serie = monitor.Num_Serie_CPU left join mouse on equipo.Num_Serie = mouse.Num_Serie left join pcs on equipo.Num_Serie = pcs.Num_Serie left join Teclado on equipo.Num_Serie = teclado.Num_Serie left join accesorio on equipo.Num_Serie = accesorio.Num_Serie where equipo = "CPU";
SELECT eqp.*, e.Nom FROM equipo eqp JOIN empleado e ON eqp.Num_emp = e.Num_emp;

SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Ubi, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Monitor.Num_Serie_Monitor = Equipo.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie;
SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Ubi, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio, e.Nom FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie join empleado e on Equipo.Num_emp = e.Num_emp;


DROP PROCEDURE IF EXISTS AgregarEmpleados;
DELIMITER //

CREATE PROCEDURE AgregarEmpleados(
    IN Num_emp VARCHAR(45), 
    IN Nom VARCHAR(45),
    IN Area VARCHAR(45), 
    IN Num_Jefe VARCHAR(45))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al insertar el empleado' AS status;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Realizar la inserción
    INSERT INTO empleado (Num_emp, Nom, Área, Num_Jefe) VALUES (NULL, Nom, Area, Num_Jefe);

    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;

    -- Confirmar los cambios
    COMMIT;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS AgregarUsuarios;
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
        SELECT 'Error: Ocurrió un error al insertar el usuario' AS status;
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
        COMMIT;
        SELECT 'Success' AS status;
    END IF;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS AgregarPermisos;
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

    -- Confirmar los cambios
    COMMIT;

    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS AgregarPeticiones;
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
    INSERT INTO soli_car VALUES (NULL, CBS, CANT, (SELECT Num_Emp FROM usuario
    WHERE Usuario = USR), NOW(), 0);

    -- Confirmar los cambios
    COMMIT;

    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
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

    -- Confirmar los cambios
    COMMIT;

    -- Confirmar si la inserción fue exitosa
    SELECT 'Success' AS status;
END //

DELIMITER ;


drop procedure extractPE;
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

DROP PROCEDURE IF EXISTS AgregarProdExistentes;
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
    COALESCE(fp.total_entrada, 0) - COALESCE(sp.total_salida, 0) as Existencia
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
	) sp ON a.Cod_Barras = sp.Cod_BarrasS;
    COMMIT;
END |
DELIMITER ;

drop procedure if exists consulPet;
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
			soli_car.request_date AS fecha,
			
			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.delivered_ware IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.delivered_ware = 1 THEN 'Entregado'
				ELSE 'Pendiente'
			END AS delivered_ware,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.delivered_soli IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.delivered_soli = 1 THEN 'Recibido'
				ELSE 'Pendiente'
			END AS delivered_soli,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.sended IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.sended = 1 THEN 'Enviado'
				ELSE 'No enviado'
			END AS sended,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.sol_id IS NULL THEN 'En espera de confirmación'
				ELSE 'Abierta'
			END AS cerrada

			soli_car.Cod_Barras_SC AS CBSC,
			almacen.Articulo AS artic,
			soli_car.cantidad_SC AS Cant,
			soli_car.request_date AS fecha,
			
			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.delivered_ware IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.delivered_ware = 1 THEN 'Entregado'
				ELSE 'Pendiente'
			END AS delivered_ware,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.delivered_soli IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.delivered_soli = 1 THEN 'Recibido'
				ELSE 'Pendiente'
			END AS delivered_soli,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.sended IS NULL THEN 'En espera de confirmación'
				WHEN status_soli.sended = 1 THEN 'Enviado'
				ELSE 'No enviado'
			END AS sended,

			CASE 
				WHEN soli_car.cerrada = 1 THEN 'Rechazada'
				WHEN status_soli.sol_id IS NULL THEN 'En espera de confirmación'
				ELSE 'Abierta'
			END AS cerrada

		FROM soli_car
		LEFT JOIN status_soli ON soli_car.sol_id = status_soli.sol_id
		INNER JOIN almacen ON soli_car.Cod_Barras_SC = almacen.Cod_Barras
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
	
		SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp;

    -- Confirmar los cambios
    COMMIT;
END //
DELIMITER ;

drop procedure if exists ConfirmPet;
DELIMITER //
CREATE PROCEDURE ConfirmPet(
	IN usu varchar(45),
    IN CBP varchar(45),
    IN FECHA DATETIME)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Manejo del error: devolver un mensaje de error y hacer rollback
        ROLLBACK;
        SELECT 'Error: Ocurrió un error al mostrar el mobiliario' AS status;
    END;
    
    -- Iniciar la transacción
    START TRANSACTION;
	
		IF EXISTS (SELECT 1 FROM status_soli WHERE sol_id = (SELECT sol_id FROM soli_car WHERE
			Cod_Barras_SC = CBP and emp_SC = (SELECT Num_emp FROM Usuario WHERE usuario = usu) and
            request_date = FECHA)) THEN
				UPDATE status_soli SET delivered_soli = 1 WHERE sol_id = (SELECT sol_id FROM soli_car WHERE
				Cod_Barras_SC = CBP and emp_SC = (SELECT Num_emp FROM Usuario WHERE usuario = usu) and
				request_date = FECHA
				);
                SELECT 'Success' AS status, 'Operación exitosa' AS message;
		ELSE
			SELECT 'Empty' as status, 'Aún no han aceptado tu petición, para más información consulta a dirección' AS message;
		END IF;
    -- Confirmar los cambios
    COMMIT;
END //
DELIMITER ;

drop procedure if exists consulPetDir;
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

drop procedure if exists ConfirmPetDir;
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

    -- Confirmar los cambios si no hay errores
    COMMIT;

    -- Devolver el estado de éxito solo si la transacción fue exitosa
    SELECT 'Success' AS status, 'Operación exitosa' AS message;
END //
DELIMITER ;


drop procedure if exists consulPetDir;
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

drop procedure if exists ConfirmPetDir;
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

    -- Confirmar los cambios si no hay errores
    COMMIT;

    -- Devolver el estado de éxito solo si la transacción fue exitosa
    SELECT 'Success' AS status, 'Operación exitosa' AS message;
END //
DELIMITER ;

select*from soli_Car;
select*from status_soli;
select*from empleado;

-- Modificar Registro Usuarios
DROP PROCEDURE IF EXISTS ActualizarRegUsu;
DELIMITER |
CREATE PROCEDURE ActualizarRegUsu(
    IN emp_num VARCHAR(45),
    IN usuario VARCHAR(45),
    IN contra VARCHAR(45)
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
    SET Usuario = usuario, Pass = contra
    WHERE Num_emp = emp_num;

    COMMIT;
    SELECT 'Success' AS status;
END |
DELIMITER ;

CALL ActualizarRegUsu('797', 'NuevoUsuario', 'NuevaContrasena');

-- Modificar Registro Empleados
DROP PROCEDURE IF EXISTS ActualizarRegEmp;
DELIMITER |
CREATE PROCEDURE ActualizarRegEmp(
    IN emp_num VARCHAR(45),
    IN nombre VARCHAR(45),
    IN area VARCHAR(45)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS status, 'Transaction failed' AS message;
    END;

    START TRANSACTION;
    
    -- Actualiza el usuario y la contraseña en la tabla usuario
    UPDATE empleado
    SET Nom = nombre, Área = area
    WHERE Num_emp = emp_num;

    COMMIT;
    SELECT 'Success' AS status;
END |
DELIMITER ;
CALL ActualizarRegEmp('813', 'editado', 'editado');