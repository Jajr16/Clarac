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

create table permisos(
permiso enum("1","2","3","4", "5") not null, #Tambien se puede set 1 Altas 2 Bajas 3 Cambios 4 Consultas
usuario varchar(25),
modulo enum("ALMACÉN", "MOBILIARIO", "EQUIPOS","RESPONSIVAS","USUARIOS","EMPLEADOS", "PETICIONES") not null,
primary key(permiso, usuario, modulo),
foreign key (usuario) references usuario(Usuario) on delete cascade on update cascade
);

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


CREATE TABLE status_soli(
	sol_id int not null,
    delivered_ware tinyint(1) DEFAULT 0,
    sended tinyint(1) DEFAULT 0,
    delivered_soli tinyint(1) DEFAULT 0,
	foreign key (sol_id) references soli_car(sol_id)
    on update cascade on delete cascade
);

DELETE FROM mobiliario where Num_Inventario = 75;
select*from almacen;