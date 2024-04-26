-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema VehicleRentalDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema VehicleRentalDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `id22084993_vehiclerentaldb` DEFAULT CHARACTER SET utf8mb3 ;
-- -----------------------------------------------------
-- Schema vehiclerentaldb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema vehiclerentaldb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `id22084993_vehiclerentaldb` ;
USE `id22084993_vehiclerentaldb` ;

-- -----------------------------------------------------
-- Table `VehicleRentalDB`.`Customers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `id22084993_vehiclerentaldb`.`Customers` (
  `CustomerID` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(255) NOT NULL,
  `LastName` VARCHAR(255) NOT NULL,
  `DriverLicenseNumber` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(100) NOT NULL,
  `Phone` VARCHAR(15) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE INDEX `DriverLicenseNumber_UNIQUE` (`DriverLicenseNumber` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `VehicleRentalDB`.`Vehicles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `id22084993_vehiclerentaldb`.`Vehicles` (
  `VehicleID` INT NOT NULL AUTO_INCREMENT,
  `LicensePlate` VARCHAR(20) NOT NULL,
  `Make` VARCHAR(50) NOT NULL,
  `Model` VARCHAR(50) NOT NULL,
  `Year` YEAR NOT NULL,
  `Color` VARCHAR(255) NOT NULL,
  `VehicleType` VARCHAR(255) NOT NULL,
  `Status` VARCHAR(20) NOT NULL,
  `Mileage` INT NOT NULL,
  PRIMARY KEY (`VehicleID`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `VehicleRentalDB`.`Rentals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `id22084993_vehiclerentaldb`.`Rentals` (
  `RentalID` INT NOT NULL AUTO_INCREMENT,
  `VehicleID` INT NOT NULL,
  `CustomerID` INT NOT NULL,
  `StartDate` DATE NOT NULL,
  `EndDate` DATE NOT NULL,
  `ActualEndDate` DATE NOT NULL,
  `DailyRate` DECIMAL(10,2) NOT NULL,
  `TotalCost` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`RentalID`),
  INDEX `CustomerID_idx` (`CustomerID` ASC) VISIBLE,
  INDEX `VechicleID_idx` (`VehicleID` ASC) VISIBLE,
  CONSTRAINT `CustomerID`
    FOREIGN KEY (`CustomerID`)
    REFERENCES `id22084993_vehiclerentaldb`.`Customers` (`CustomerID`),
  CONSTRAINT `VechicleID`
    FOREIGN KEY (`VehicleID`)
    REFERENCES `id22084993_vehiclerentaldb`.`Vehicles` (`VehicleID`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb3;

USE `id22084993_vehiclerentaldb` ;
USE `id22084993_vehiclerentaldb` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
