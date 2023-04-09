# Software Requirements Specification
## For In-form-atiX 
Version 1.0 approved
Prepared by Alexa Constantin-Cosmin
09.04.2023

Table of Contents
=================
  * [Revision History](#revision-history)
  * [Introduction](#1-introduction)
    * 1.1 [Purpose](#11-purpose)
    * 1.2 [Intended Audience and Reading Suggestions](#12-intended-audience-and-reading-suggestions)
    * 1.3 [Product Scope](#13-product-scope)
    * 1.4 [References](#14-references)
  * [Overall Description](#overall-description)
    * 2.1 [Product Perspective](#21-product-perspective)
    * 2.2 [Product Functions](#22-product-functions)
    * 2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    * 2.4 [Operating Environment](#24-operating-environment)
    * 2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
    * 2.6 [User Documentation](#26-user-documentation)
    * 2.7 [Assumptions and Dependencies](#27-assumptions-and-dependencies)
  * [External Interface Requirements](#external-interface-requirements)
    * 3.1 [User Interfaces](#31-user-interfaces)
    * 3.2 [Hardware Interfaces](#32-hardware-interfaces)
    * 3.3 [Software Interfaces](#33-software-interfaces)
    * 3.4 [Communications Interfaces](#34-communications-interfaces)
  * [System Features](#system-features)
    * 4.1 [Frontend](#41-system-feature-1)
    * 4.2 [Backend](#42-system-feature-2-and-so-on)
  * [Other Nonfunctional Requirements](#other-nonfunctional-requirements)
    * 5.1 [Performance Requirements](#51-performance-requirements)
    * 5.2 [Safety Requirements](#52-safety-requirements)
    * 5.3 [Security Requirements](#53-security-requirements)
    * 5.4 [Software Quality Attributes](#54-software-quality-attributes)

## Revision History
| Name | Date    | Reason For Changes  | Version   |
| ---- | ------- | ------------------- | --------- |
|      |         |                     |           |
|      |         |                     |           |
|      |         |                     |           |

## 1. Introduction
### 1.1 Purpose 
The purpose of the product is to help highschool students in solving **algorithmic** problems for a future career in the IT industry and help teachers in managing their class by setting homeworks.

### 1.2 Intended Audience and Reading Suggestions
This document is intended for developers, administrators and users. 

### 1.3 Product Scope
The scope of the product is to improve the education system and the teacher-student relation.

### 1.4 References
[PBinfo](https://pbinfo.ro)

## Overall Description

### 2.1 Product Perspective
This project is inspired by pbinfo.ro with the object to make the platform more appealing to the new generation.

### 2.2 Product Functions
This product will let the teachers to propose problems and the problems proposed will be evaluated by a admin, the teacher can set homeworks for students. The students can see their solved problems, statistics on their success rate, rating of the problems proposed and comments. The solution accepted will be wrote in C/C++.

### 2.3 User Classes and Characteristics
The product consists of 3 user classes: administrator, teacher and student. The administrator approves problems proposed by teachers and manages the site (like rude comments on the problem). The teacher can manage their classes of students and can set homeworks for them, based on the problems on the site. The student can solve problems on the site, rate and comment on problems.

### 2.4 Operating Environment
The operating system used for this product is a Debian GNU/Linux server running on DigitalOcean with a php backend and postgres database server and the webserver ngnix. For checking the solution of a problem it will be used docker with the **official solution** of the problem.

### 2.5 Design and Implementation Constraints
* Server: Debian GNU/Linux
* WebServer: nginx
* Database: postgres
* Backend: php

### 2.6 User Documentation
TODO: Final video with showcase of the web application.

### 2.7 Assumptions and Dependencies
The user knows how to use a web brower and solve a problem :D.

## External Interface Requirements

### 3.1 User Interfaces
The user interface is composed of a web application.

### 3.2 Hardware Interfaces
The hardware interface in this project is flexible, not being dependend on anything.

### 3.3 Software Interfaces
The software will use the Model, View, Controller mode of operation being independent and open to modifications. The operating system is Debian GNU/Linux, the controller will use the database postgres for managing persistent data.
The persistend data consists of:

* algorithmic problems, rating, comments
* username, password 

The solution of the problem is stored on the local storage with the filename as the id of the problem in which the controller will use to compare the solution submitted by a student. The controller will run both to solutions of the problem inside a docker container and will compare the output and the time took for the problem to the solution to appear.

### 3.4 Communications Interfaces
The product will use as a protocol of communication with the user the HTTP protocol, so a web browser is required. The communication with the database made by the controller it will be done eighter by UNIX local sockets or TCP. The controller will use commands to send the solution to be checked by the docker instance. The choice for a docker instance is because of security, in which a malitious user can send a program and be run directly on the server. The docker container in which the problem solution is being run does **not have access to Internet**.

## System Features
This template illustrates organizing the functional requirements for the product by system features, the major services provided by the product. You may prefer to organize this section by use case, mode of operation, user class, object class, functional hierarchy, or combinations of these, whatever makes the most logical sense for your product.

### 4.1 Frontend

4.1.1   Description and Priority
 Create the interface that the user will see and use.
 Priority: high

4.1.2   Stimulus/Response Sequences
 The aspect of the interface and the usability of it should atttract the user to engage with the product.

4.1.3   Functional Requirements
 
 * Create all the user pages.

### 4.2 Backend

4.2.1   Description and Priority
 Create the backend of the site which will verify a solution provided by the user and display information for the user by creating generated pages for the user making the site dinamic.
 Priority: high

4.2.2   Stimulus/Response Sequences
 
 * User register with username (email maybe), password.
 * User login using username and password.
 * Teacher submission of problems and checking them with an administrator.
 * Student submission of solution to problems.
 * Student homework assignment by the teacher.

4.2.3   Functional Requirements

 * Should be open for extension.
 * Secure.
 * Fast.

## Other Nonfunctional Requirements

### 5.1 Performance Requirements
In the docker container if the problem that is being run by the container takes more than 10 minutes, the container should be destroyed and give 0 points to the problem. 

### 5.2 Safety Requirements
Security and GDPR compliance.

### 5.3 Security Requirements
Always use HTTPS with certbot.

### 5.4 Software Quality Attributes
Adaptability, availability, maintainability.
