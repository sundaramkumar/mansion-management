-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2014 at 03:47 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mansion`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountheads`
--

CREATE TABLE IF NOT EXISTS `accountheads` (
  `accountHeadId` int(11) NOT NULL AUTO_INCREMENT,
  `accountHeadName` varchar(255) DEFAULT NULL,
  `type` enum('C','D') DEFAULT 'C',
  `opBalance` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`accountHeadId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `accountheads`
--

INSERT INTO `accountheads` (`accountHeadId`, `accountHeadName`, `type`, `opBalance`) VALUES
(1, 'Tea Expenses', 'D', NULL),
(2, 'EB Charges', 'C', NULL),
(3, 'Cleaning Charges', 'C', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE IF NOT EXISTS `expenses` (
  `expensesId` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `accountHeadId` int(11) DEFAULT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `addedBy` int(11) NOT NULL,
  `addedOn` date NOT NULL,
  PRIMARY KEY (`expensesId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expensesId`, `date`, `accountHeadId`, `amount`, `description`, `addedBy`, `addedOn`) VALUES
(1, '2014-11-11', 1, '64.00', NULL, 1, '2014-11-11'),
(2, '2014-11-11', 2, '1500.50', 'by cheque', 1, '2014-11-11'),
(3, '2014-11-11', 3, '300.00', NULL, 1, '2014-11-11'),
(4, '2014-11-11', 3, '48.00', NULL, 1, '2014-11-11'),
(5, '2014-11-11', 3, '100.50', '', 1, '2014-11-11'),
(6, '2014-11-11', 3, '190.00', '', 1, '2014-11-11'),
(7, '2014-11-11', 2, '30000.00', 'by cash', 1, '2014-11-11');

-- --------------------------------------------------------

--
-- Table structure for table `guests`
--

CREATE TABLE IF NOT EXISTS `guests` (
  `guestId` int(11) NOT NULL AUTO_INCREMENT,
  `guestName` varchar(100) DEFAULT NULL,
  `fatherName` varchar(100) DEFAULT NULL,
  `nativePlace` varchar(100) DEFAULT NULL,
  `address` tinytext,
  `nativePhone` varchar(15) DEFAULT NULL,
  `permanentAddress` tinytext,
  `permanentPhone` varchar(15) DEFAULT NULL,
  `localAddress` tinytext,
  `localPhone` varchar(15) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `occupationPhone` varchar(15) DEFAULT NULL,
  `mobile` varchar(12) NOT NULL,
  `lastResidenceAddress` tinytext,
  `lastResidencePhone` varchar(15) DEFAULT NULL,
  `reasonOfStay` enum('B','R','S','E') DEFAULT 'R',
  `joiningDate` date DEFAULT NULL,
  `vacatingDate` date DEFAULT NULL,
  `advanceAmount` decimal(6,2) DEFAULT NULL,
  `advanceDate` date DEFAULT NULL,
  `roomId` int(11) NOT NULL,
  `vehicleNo` varchar(15) DEFAULT NULL,
  `status` enum('S','V') DEFAULT NULL,
  `comments` tinytext,
  PRIMARY KEY (`guestId`),
  UNIQUE KEY `guestid_UNIQUE` (`guestId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `guests`
--

INSERT INTO `guests` (`guestId`, `guestName`, `fatherName`, `nativePlace`, `address`, `nativePhone`, `permanentAddress`, `permanentPhone`, `localAddress`, `localPhone`, `occupation`, `occupationPhone`, `mobile`, `lastResidenceAddress`, `lastResidencePhone`, `reasonOfStay`, `joiningDate`, `vacatingDate`, `advanceAmount`, `advanceDate`, `roomId`, `vehicleNo`, `status`, `comments`) VALUES
(1, 'Vetri Pandian', 'Mariappan', 'Tirunelveli', 'Puthuamman koil Street\r\nThatchanallur\r\nTirunelveli', '224734', 'Puthuamman koil Street\r\nThatchanallur\r\nTirunelveli', '224734', 'Ellaiamman Koil Street\r\nAdyar', '9003227717', 'Medical Rep', '78945621325', '78945621325', '51, Ellaiamman Koil Street\r\nAdyar', '4634645547', 'E', '2013-11-01', NULL, '1000.00', '2013-11-01', 1, 'TN09 BD 2768', 'S', NULL),
(2, 'Kumar', 'Sundaram', 'TVL', 'ovk street,\nviravanallur', '287004', 'ovk street,\nviravanallur', '287004', 'ellaiamman koil st\nadyar', '22353803', NULL, NULL, '9003013381', '22 cross street\nbesant nagar', '78437649', 'R', '2014-11-07', '0000-00-00', '1000.00', '2014-11-07', 1, 'tn09bd 2768', 'S', 'my comments\nis to test the textarea\nnewlines'),
(3, 'asd', 'asd', 'dfsdfsd', 'gsdgsdg', '234234', 'gsdgsdg', '234234', '', '', NULL, NULL, '234234', 'sdfsdfsd', '24234234', 'R', '2014-11-07', '0000-00-00', '9999.99', '2014-11-07', 1, '4g7y67', 'S', ''),
(4, 'asdjkjkjk', 'asd', 'dfsdfsd', 'gsdgsdg', '234234', 'gsdgsdg', '234234', '', '', NULL, NULL, '23423433', 'sdfsdfsd', '24234234', 'R', '2014-11-07', '0000-00-00', '9999.99', '2014-11-07', 1, '4g7y67', 'S', ''),
(5, 'tester', 'asd', 'dfsdfsd', 'gsdgsdg', '234234', 'gsdgsdg', '234234', '', '', NULL, NULL, '555555557', 'sdfsdfsd', '24234234', 'R', '2014-11-07', '0000-00-00', '9999.99', '2014-11-07', 1, '4g7y67', 'S', ''),
(6, 'newtester', 'newtester', 'asdasd', 'asfsdf', '23423243', 'asfsdf', '23423243', '', '', NULL, NULL, '23423467', 'asfdas  fsaf', '2143213', 'R', '2014-11-07', '0000-00-00', '3454.00', '2014-11-07', 8, '124', 'S', ''),
(7, 'Akash', 'Kumar', 'ksdlfn;sdl', 'q;klsdnf;lksdnf', '34534534', 'q;klsdnf;lksdnf', '34534534', '', '', 'student', '2342342', '923455923', 'gdfgdfgd', '23423423', 'S', '2014-11-07', '0000-00-00', '2345.00', '2014-11-07', 8, '343ge', 'S', ''),
(8, 'sruthi', 'kumar', 'sdjkvnsd', ';klnsd;klnsd;kls\nsadflksdlsd', '239u23', ';klnsd;klnsd;kls\nsadflksdlsd', '239u23', '', '', NULL, NULL, '9725638401', 'sdfsdfsd', '234r234234', 'R', '2014-11-06', '0000-00-00', '3543.00', '2014-11-07', 7, 'dfg43', 'S', ''),
(9, 'mani', 'pama', 'sdjksdfjksdjk', 'sdjkfjksdf\nsdlfjskdf\nsdfjsdf', '3848394389', 'sdjkfjksdf\nsdlfjskdf\nsdfjsdf', '3848394389', '', '', NULL, NULL, '23423423543', 'sdjkfjksdf\nsdlfjskdf\nsdfjsdf', '234678333', 'R', '2014-11-07', '0000-00-00', '1000.00', '2014-11-07', 7, '43fd54', 'S', '');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE IF NOT EXISTS `receipts` (
  `receiptId` int(11) NOT NULL AUTO_INCREMENT,
  `receiptNo` varchar(45) DEFAULT NULL,
  `billDate` date NOT NULL,
  `guestId` int(11) DEFAULT NULL,
  `month` varchar(15) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `addedBy` int(11) NOT NULL,
  `addedOn` date NOT NULL,
  PRIMARY KEY (`receiptId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`receiptId`, `receiptNo`, `billDate`, `guestId`, `month`, `amount`, `addedBy`, `addedOn`) VALUES
(1, 'BMA1', '2014-11-13', 7, 'Nov 2014', '1700.00', 1, '2014-11-13'),
(2, 'BMA2', '2014-10-13', 7, 'Oct 2014', '1700.00', 1, '2014-11-13'),
(3, 'BMA3', '2014-09-13', 7, 'Sep 2014', '1700.00', 1, '2014-11-13'),
(4, 'BMA4', '2014-08-13', 7, 'Aug 2014', '1600.00', 1, '2014-11-13'),
(5, 'BMA5', '2014-08-13', 1, 'Aug 2014', '1600.00', 1, '2014-11-13'),
(6, 'BMA6', '2014-10-13', 8, 'Oct 2014', '1600.00', 1, '2014-11-13'),
(10, 'BMA10', '2014-09-13', 8, 'Sep 2014', '1500.00', 1, '2014-11-13');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE IF NOT EXISTS `rooms` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT,
  `roomNo` varchar(5) NOT NULL,
  `roomCapacity` decimal(2,0) DEFAULT NULL,
  `roomStatus` enum('E','F','P') DEFAULT 'E',
  `noOfGuests` decimal(2,0) DEFAULT '0',
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `roomid_UNIQUE` (`roomId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`roomId`, `roomNo`, `roomCapacity`, `roomStatus`, `noOfGuests`) VALUES
(1, '101', '5', 'P', '5'),
(2, '102', '6', 'F', '5'),
(4, '104', '6', 'E', '0'),
(5, '106', '4', 'E', '0'),
(6, '105', '6', 'E', '0'),
(7, '103', '5', 'E', '2'),
(8, '107', '2', 'E', '2'),
(9, '305', '5', 'E', '0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `salname` varchar(5) NOT NULL,
  `realname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `addedon` date DEFAULT NULL,
  `addedby` int(11) DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `failedcount` int(11) DEFAULT '0',
  `usertype` enum('A','U') DEFAULT 'U',
  `status` enum('E','D') DEFAULT 'E' COMMENT 'If disabled cannot login',
  `loginip` varchar(25) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='maintain users of the customers for loging into control pane' AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `salname`, `realname`, `username`, `password`, `email`, `mobile`, `addedon`, `addedby`, `lastlogin`, `failedcount`, `usertype`, `status`, `loginip`) VALUES
(1, 'Mr.', 'Admin', 'admin', '*4ACFE3202A5FF5CF467898FC58AAB1D615029441', 'guyfromchennai@gmail.com', '9003013383', '2014-09-28', 1, NULL, 0, 'A', 'E', '::1');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
