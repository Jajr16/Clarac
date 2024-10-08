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

-- Nuevo cambio en monitor
ALTER TABLE Monitor
add Num_Inv_Mon int;
-- Borrar todos los datos de la tabla
DELETE FROM Monitor;
-- Consultar tabla de monitor
select*from Monitor;

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
	
select*from empleado;
select*from usuario;
select*from Mobiliario;
SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp where e.nom = (select empleado.nom from empleado inner join usuario on empleado.Num_emp = usuario.Num_Emp where usuario.Usuario = 'ajimenez');

insert into mobiliario values (3,"Mesa",759,'PRUEBA',4,'FARMACIA');

ALTER TABLE `Inventarios`.`Mobiliario`
ADD COLUMN `Area` VARCHAR(200) NULL;

alter table Mobiliario drop column Area;

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

-- -----------------------------------------------------
-- Data for table `Inventarios`.`Facturas_Almacen`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Facturas_Almacen` (`Num_Fact`, `Ffact`) VALUES (1, '2023-03-15');
INSERT INTO `Inventarios`.`Facturas_Almacen` (`Num_Fact`, `Ffact`) VALUES (2, '2023-03-15');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Inventarios`.`Responsivas_M`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Responsivas_M` (`Num_Emp`, `Num_Inventario`) VALUES (758, 2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `Inventarios`.`Responsivas_E`
-- -----------------------------------------------------
START TRANSACTION;
USE `Inventarios`;
INSERT INTO `Inventarios`.`Responsivas_E` (`Num_emp`, `Num_Serie`) VALUES (758, '5415');

COMMIT;

-- TABLAS

create table tokens(
token nvarchar(20) not null primary key,
area nvarchar(45) not null
);

drop table permisos;
create table permisos(
permiso enum("1","2","3","4") not null, #Tambien se puede set 1 Altas 2 Bajas 3 Cambios 4 Consultas
usuario varchar(25),
modulo enum("ALMACÉN", "MOBILIARIO", "EQUIPOS","RESPONSIVAS","USUARIOS","EMPLEADOS", "PETICIONES") not null,
primary key(permiso, usuario, modulo),
foreign key (usuario) references usuario(Usuario) on delete cascade on update cascade
);

select*from peticion;
select*from permisos;

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
(1,"ajimenez","USUARIOS"),#Altas
(2,"ajimenez","USUARIOS"),#Bajas
(3,"ajimenez","USUARIOS"),#Cambios
(4,"ajimenez","USUARIOS"),#Consultas
(1,"ajimenez","EMPLEADOS"),#Altas
(2,"ajimenez","EMPLEADOS"),#Bajas
(3,"ajimenez","EMPLEADOS"),#Cambios
(4,"ajimenez","EMPLEADOS"),#Consultas
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

delete from permisos where usuario = "armando";

create table factus_Productos(
Cod_Barras nvarchar(45) not null,
Nfactura nvarchar(10) not null,
Cantidad int not null,
FIngreso date not null,
 constraint cPFPS primary key(Cod_Barras, Nfactura)
);

create table Salidas_Productos(
Cod_BarrasS nvarchar(45) not null,
FSalida datetime,
Num_EmpS int,
Cantidad_Salida int,
constraint CPSP primary key(Cod_BarrasS, FSalida, Num_EmpS)
);
select*from empleado;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'n0m3l0';
flush privileges;

ALTER TABLE empleado AUTO_INCREMENT = 841;
########################DROPS#########################################
alter table Salidas_Productos add constraint FKCBS foreign key(Cod_BarrasS) references almacen(Cod_Barras);
alter table Salidas_Productos add constraint FKNES foreign key(Num_EmpS) references empleado(Num_emp);

alter table Factus_Productos add constraint FK_CBA foreign key(Cod_Barras) references almacen(Cod_Barras);

alter table Factus_Productos add constraint FK_NDFA foreign key(Nfactura) references facturas_almacen(Num_Fact);

########################## UPDATES ###################################
update almacen set Existencia = 10 where Cod_Barras = 'b';
update empleado set Num_Jefe = 1 where Num_emp = 1;
update empleado set Num_emp = 2 where Num_emp = 758;
update empleado set Num_Jefe = 663;
update almacen set eliminado = 0 where eliminado = 1;

-- DELETES
delete from factus_productos where FIngreso = "2023-04-28";
delete from facturas_almacen where Ffact = "2023-05-07";
delete from almacen where eliminado = 0;
delete from almacen where eliminado = 1;
delete from salidas_productos where Cod_BarrasS = 'JDFK35J2';
delete from salidas_productos where FSalida = '2023-05-15';
delete from almacen where Cod_Barras = "684F4GFR8";
delete from empleado where Num_emp > 840;
delete from usuario where Num_emp = 107;
delete from equipo;
-- almacen.Cod_Barras, almacen.FIngreso, almacen.Categoria, almacen.Articulo, almacen.Marca, almacen.Descripcion, almacen.Proveedor, almacen.NFact
#select*from usuario where User = "armando" and Pass = "clarac";

#select *from almacen order by eliminado;
#select almacen.Cod_Barras, factus_productos.FIngreso, almacen.Categoria, almacen.Articulo, almacen.Marca, almacen.Descripcion, almacen.Unidad, almacen.Existencia, facturas_almacen.Proveedor, facturas_almacen.Num_Fact, facturas_almacen.Ffact, almacen.eliminado from factus_productos inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras inner join facturas_almacen on factus_productos.Nfactura = facturas_almacen.Num_Fact  order by almacen.eliminado;

#select almacen.Articulo, factus_productos.Nfactura, factus_productos.Cantidad, factus_productos.FIngreso, facturas_almacen.Ffact, facturas_almacen.Proveedor from factus_productos inner join facturas_almacen on facturas_almacen.Num_Fact = factus_productos.Nfactura inner join almacen on factus_productos.Cod_Barras = almacen.Cod_Barras where factus_productos.Cod_Barras = 's';
#select*from almacen where Cod_Barras = 'd' and eliminado = 1;
#update almacen set eliminado = 1 where Cod_Barras = 'd';
#select*from usuario where Usuario = 'a' and Pass = '123';

#select sum(Cantidad) as suma from factus_productos where Cod_Barras = "s";
#update almacen set Existencia = ((select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = 'c') - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = 'c')) where Cod_Barras = 'c';
#select  sum(factus_productos.Cantidad) - sum(salidas_productos.Cantidad_Salida) from factus_productos inner join salidas_productos on factus_productos.Cod_Barras = salidas_productos.Cod_BarrasS where factus_productos.Cod_Barras = 'c';
#select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = 'JDFK35J2';
#select sum(factus_productos.Cantidad) - sum(salidas_productos.Cantidad_Salida) from salidas_productos where factus_productos.Cod_Barras = salidas_productos.Cod_BarrasS;

#UPDATE tabla1
#    -> INNER JOIN tabla2 ON tabla1.sala = tabla2.sala
#    -> SET tabla1.asientos_disponibles = tabla1.asientos_disponibles - tabla2.asientos_ocupados;

#select num_emp from empleado where concat(Nom, " ", AP, " ", AM) = "Armando Jiménez Rivera";
#select Num_emp from Empleado where Nom = "Armando" and AP = "Jiménez" and AM = "Rivera";

#drop trigger Token;
#DELIMITER |
#create trigger Token before insert on Usuario 
#	for each row begin
#		update usuario set token = (select tokens.token from tokens inner join empleado on tokens.area = empleado.Área where empleado.Num_Emp = 758);
#    END
#| DELIMITER ;

####################################TRIGGERS###################################
DELIMITER |
create trigger Actualizar_Existencias after update on factus_productos
  FOR EACH ROW BEGIN
  if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_Barras) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_Barras) where Cod_Barras = old.Cod_Barras;
  end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_ExistenciasInsert after insert on factus_productos
  FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_Barras) P) = 1) then
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
		else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_Barras) where Cod_Barras = new.Cod_Barras;
	end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_Existencias2 after update on salidas_productos
  FOR EACH ROW BEGIN
	if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) P) = 1) then
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  else
	update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = old.Cod_BarrasS) where Cod_Barras = old.Cod_BarrasS;
  end if; 
  END
| DELIMITER ;

DELIMITER |
create trigger Actualizar_ExistenciasInsercion2 after insert on salidas_productos
	FOR EACH ROW BEGIN
		if ((select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) P) = 1) then
            update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) - (select sum(salidas_productos.Cantidad_Salida) from salidas_productos where Cod_BarrasS = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        else
			update almacen set Existencia = (select sum(factus_productos.Cantidad) from factus_productos where Cod_Barras = new.Cod_BarrasS) where Cod_Barras = new.Cod_BarrasS;
        end if; 
	END
| DELIMITER ;

-- BUSQUEDAS
select count(suma) from (select sum(salidas_productos.Cantidad_Salida) as suma from salidas_productos where Cod_BarrasS = 'c') P;
-- Busquedas almacen
select*from facturas_almacen;
select*from factus_productos;
select*from almacen;
select count(Cod_BarrasS) from salidas_productos;
select*from salidas_productos;
select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp;
select count(Salidas_Productos.Cod_BarrasS), almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp;

select empleado.Nom, usuario.Usuario, usuario.Pass from usuario inner join empleado on usuario.Num_Emp = empleado.Num_emp;

select*from salida_almacen;
select*from empleado;
select empleado.Nom, empleado.Área, (select Nom from empleado as Jefe where Jefe.Num_emp = empleado.Num_Jefe) Nom_Jefe from empleado;
select distinct(Área) from empleado;
select*from usuario;
-- Equipos Consultas
select*from almacen;
select*from mobiliario;
select mobiliario.Num_Inventario, mobiliario.Descripcion, empleado.Nom from mobiliario inner join empleado on mobiliario.Num_emp = empleado.Num_emp;
select equipo.Num_Serie, pcs.Hardware, pcs.Software, monitor.Monitor, monitor.Num_Serie_Monitor, monitor.Num_Inv_Mon, mouse.Mouse, teclado.Teclado, accesorio.Accesorio from equipo left join monitor on equipo.Num_Serie = monitor.Num_Serie left join mouse on equipo.Num_Serie = mouse.Num_Serie left join pcs on equipo.Num_Serie = pcs.Num_Serie left join Teclado on equipo.Num_Serie = teclado.Num_Serie left join accesorio on equipo.Num_Serie = accesorio.Num_Serie where equipo = "CPU";
select*from equipo;
select*from pcs;
select*from mouse;
select*from monitor;
select*from teclado;
select*from accesorio;

select*from permisos;
select usuario.Usuario, usuario.token, permisos.permiso from usuario inner join permisos;
SELECT IFNULL(NULL, 2);
#select equipo.N_Inventario, equipo.Num_Serie, pcs.Hardware, pcs.Software, monitor.Monitor, monitor.Num_Serie_Monitor, mouse.Mouse, teclado.Teclado, accesorio.Accesorio from equipo left join monitor on equipo.Num_Serie = monitor.Num_Serie left join mouse on equipo.Num_Serie = mouse.Num_Serie left join pcs on equipo.Num_Serie = pcs.Num_Serie left join Teclado on equipo.Num_Serie = teclado.Num_Serie left join accesorio on equipo.Num_Serie = accesorio.Num_Serie; #where equipo = 'CPU' and equipo.Num_Serie = 'ADWAD';
#select equipo.N_Inventario, equipo.Num_Serie, equipo.Equipo, IFNULL(pcs.Hardware,"-") Hardware, IFNULL(pcs.Software,"-") Software, IFNULL(monitor.Monitor,"-") Monitor, IFNULL(monitor.Num_Serie_Monitor,"-") NSM, IFNULL(mouse.Mouse,"-") Mouse, IFNULL(teclado.Teclado,"-") Teclado, IFNULL(accesorio.Accesorio,"-") Accesorio, empleado.Nom from equipo left join monitor on equipo.Num_Serie = monitor.Num_Serie left join mouse on equipo.Num_Serie = mouse.Num_Serie left join pcs on equipo.Num_Serie = pcs.Num_Serie left join Teclado on equipo.Num_Serie = teclado.Num_Serie left join accesorio on equipo.Num_Serie = accesorio.Num_Serie inner join empleado on equipo.Num_emp = empleado.Num_emp;
SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Empleado.Nom, IFNULL(pcs.Hardware,"-") Hardware, IFNULL(pcs.Software,"-") Software, IFNULL(monitor.Monitor,"-") Monitor, IFNULL(monitor.Num_Serie_Monitor,"-") NSM, monitor.Num_Inv_Mon NIM, IFNULL(mouse.Mouse,"-") Mouse, IFNULL(teclado.Teclado,"-") Teclado, IFNULL(accesorio.Accesorio,"-") Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie inner join empleado on equipo.Num_emp = empleado.Num_emp;
#SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Monitor, Monitor.Num_Serie_Monitor, Monitor.Num_Inv_Mon, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie;
select*from equipo where Equipo = 'CPU';
select*from Usuario;
select*from mobiliario;
delete from mobiliario where Num_Inventario = 4;
insert into Usuario (Num_Emp, Usuario, Pass) values(758, "ajimenez", "clarac1");
delete from Usuario where Usuario = "a";
update Usuario set Usuario = "ajimenez", Num_Emp = 758, Pass = "Clarac2017" where Usuario = "ajimenez";
select * from Salidas_Productos where FSalida BETWEEN "2023-05-16" and "2023-05-17";

SELECT m.*, e.Nom
FROM mobiliario m
JOIN empleado e ON m.Num_emp = e.Num_emp;

SELECT eqp.*, e.Nom FROM equipo eqp JOIN empleado e ON eqp.Num_emp = e.Num_emp;

SELECT * FROM empleado WHERE Nom = "JIMENEZ RIVERA ARMANDO";

insert into equipo (N_Inventario, Num_Serie, Equipo, Marca, Modelo, Num_emp, Ubi) values(1, "213sa", "Monitor", "PC", "Pc", (select Num_emp from empleado where Nom = "JIMENEZ RIVERA ARMANDO"), "A");

insert into usuario values(
758, "ajimenez", "Clarac2017", '4dnM3k0nl9s'
);

select*from almacen;
select*from mobiliario;
select*from equipo;
select*from permisos;

SELECT * FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie WHERE Equipo.Num_Serie = 12345;

SELECT * FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie WHERE Num_emp = 777;

SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Monitor, Monitor.Num_Serie_Monitor, Monitor.Num_Inv_Mon, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie WHERE Num_emp = 777;


SELECT mob.*, e.Nom FROM mobiliario mob JOIN empleado e ON mob.Num_emp = e.Num_emp;

#insert into usuario values(
#1, 'Prueba','123', '4dnM3k0nl9s');
#select*from empleado;
#insert into empleado values(
#1, 'Prueba', 'Prueba', 758
#);
#delete from empleado where Num_emp = 1;
#select empleado.Nom from empleado inner join usuario on empleado.Num_emp = usuario.Num_Emp where usuario.Usuario = 'ajimenez'; 
#update empleado set Nom = 'A', Área = 'B', Num_Jefe = (select Num_emp from (select Num_Emp from empleado where Nom = 'NAVARRO JIMENEZ MARTHA LIDIA') Jefe) where Num_emp = (select Num_emp from (select Num_Emp from empleado where Nom = 'Prueba') Empleado);
#delete from empleado where Num_emp in (select Num_Emp from (select Num_Emp from empleado where Nom = 'Prueba') Emp);
#select Salidas_Productos.Cod_BarrasS, almacen.Articulo, almacen.Existencia, empleado.Nom, salidas_productos.Cantidad_Salida, salidas_productos.FSalida from salidas_productos inner join almacen on salidas_productos.Cod_BarrasS = almacen.Cod_Barras inner join empleado on salidas_productos.Num_EmpS = empleado.Num_emp;

#select tokens.token from tokens inner join empleado on tokens.area = empleado.Área where empleado.Num_Emp = 760;

#select concat(Nom, " ", AP, " ", AM) NombreCompleto from empleado;
#update factus_productos set Cantidad = 700 where Nfactura = 'ASKDFJ7';
#update salidas_productos set Cantidad_Salida = 2 where Cod_BarrasS = 'R' and FSalida = "2023-04-22" and Num_EmpS = 758;
#############################BUSQUEDAS DE MOBILIARIO################################

select*from mobiliario;
UPDATE `inventarios`.`mobiliario` SET `Articulo` = 'PRUEBA1' WHERE (`Articulo` = 'PRUEBA1K') and (`Descripcion` = 'PRUEBA1') and (`Num_emp` = '758');

select empleado.Nom, empleado.Área, empleado.Num_emp from empleado;
select*from usuario;
select*from empleado;
SELECT empleado.Num_Emp, empleado.Área FROM empleado where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = 'ajimenez');
insert into Empleado values(663, 'NAVARRO JIMENEZ MARTHA LIDIA', 'DIRECCION GENERAL', 663);
insert into Empleado values(775, 'Moises', 'SISTEMAS', 663);
insert into usuario values(775, 'Moises', 'clarac');
update empleado set Num_Jefe = 663;

update empleado set Nom = replace(Nom,'Ã‘','Ñ');

ALTER TABLE `Inventarios`.`Mobiliario`
ADD COLUMN `articulos` VARCHAR(100) NULL AFTER `Num_Inventario`;

ALTER TABLE `Inventarios`.`Mobiliario`
CHANGE COLUMN `articulos` `Articulo` VARCHAR(100) NULL;

ALTER TABLE `Inventarios`.`Mobiliario`
DROP COLUMN `NombreCom`;

SELECT empleado.Num_Emp FROM empleado inner join usuario on usuario.Num_Emp = empleado.Num_emp;

SELECT empleado.Num_Emp, empleado.Área FROM empleado inner join usuario on usuario.Num_Emp = empleado.Num_emp;

DELETE FROM `Mobiliario`;

-- Cambio de llave primaria de Mobiliario
select*from Mobiliario;

-- Se quita el autoincrement
ALTER TABLE Mobiliario
MODIFY COLUMN Num_Inventario INT;

-- Se elimina la anterior llave primaria
ALTER TABLE Mobiliario
DROP PRIMARY KEY;

-- Se crea una llave primaria de 3 columnas
ALTER TABLE Mobiliario
ADD PRIMARY KEY (Articulo, Descripcion, Num_emp);

-- Se busca una tabla que tenga referenciada la llave primaria
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  REFERENCED_TABLE_NAME = 'Mobiliario' AND
  REFERENCED_COLUMN_NAME = 'Num_Inventario';
  
-- Tabla de solicitudes de almacen

CREATE TABLE soli_car (
    Cod_Barras_SC VARCHAR(45),
    cantidad_SC INT(10),
    emp_SC int,
    Acept BOOLEAN, -- Si la solicitud fue aceptada o no
    request_date datetime,
    delivered_ware tinyint(1),
    sended tinyint(1),
    delivered_soli tinyint(1),
    cerrada BOOLEAN -- Si la solicitud ya fue cerrada
    -- FOREIGN KEY (emp_SC) REFERENCES otra_tabla_emp_SC(emp_SC), -- Reemplazar "otra_tabla_emp_SC" con el nombre de la tabla de usuario o empleado y la columna correspondiente
    -- FOREIGN KEY (dir_LLSC) REFERENCES otra_tabla_dir_LLSC(dir_LLSC) -- Reemplazar "otra_tabla_dir_LLSC" con el nombre de la tabla donde se encuentre el director y la columna correspondiente
);

-- Modify table soli_car
alter table soli_car add constraint PKSC primary key(Cod_Barras_SC, emp_SC, request_date);
alter table soli_car add constraint FKSC_CB foreign key(Cod_Barras_SC) references almacen(Cod_Barras);
alter table soli_car add constraint FKSC_EM foreign key(emp_SC) references empleado(Num_emp);

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

CREATE TABLE soli_com (
    Cod_Barras_SCom VARCHAR(45),
    emp_SCom int,
    request_date_SCom datetime,
    Acept BOOLEAN, -- Si la solicitud fue aceptada o no
    recibida tinyint(1), -- Si ya se recibió el pedido
    almacenada tinyint(1), -- Si el pedido ya fue almacenado
    cerrada BOOLEAN -- Si la solicitud ya fue cerrada
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