# SAPUI5 CRUD Application

A simple **CRUD (Create, Read, Update, Delete) application built using SAPUI5**.
This project demonstrates how to manage customer data using **SAPUI5 with JSON Model**, implementing operations like **adding, updating, listing, and deleting records**.

The application follows the **MVC (Model–View–Controller)** architecture used in SAPUI5 and uses **XML Views, Controllers, and Fragments** for UI and logic separation.

---

# Features

* Add new customer records
* View customer list
* Update customer details
* Delete customer records
* Dialog-based form using **SAPUI5 Fragment**
* Data stored in **JSON Model**
* MVC architecture implementation

---

# Project Structure

```
UI5APP_CRUD
│
├── node_modules
│
├── webapp
│   │
│   ├── controller
│   │   ├── App.controller.js
│   │   ├── View1.controller.js
│   │   └── View2.controller.js
│   │
│   ├── view
│   │   ├── App.view.xml
│   │   ├── View1.view.xml
│   │   ├── View2.view.xml
│   │   └── CustomerDialog.fragment.xml
│   │
│   ├── model
│   │   ├── data.json
│   │   └── models.js
│   │
│   ├── css
│   │
│   ├── i18n
│   │   └── i18n.properties
│   │
│   ├── Component.js
│   ├── index.html
│   └── manifest.json
│
├── test
├── package.json
├── package-lock.json
├── .appGenInfo.json
└── README.md
```

---

# Application Pages

### View1 – Customer List Page

Displays the list of customers retrieved from the JSON model.

Functions available:

* View customer records
* Navigate to details page
* Edit or delete customers

---

### View2 – Customer Details Page

Used for viewing and updating selected customer information.

---

### Customer Dialog Fragment

A reusable **SAPUI5 Fragment** used to:

* Add new customers
* Update existing customers

This helps maintain **clean and reusable UI components**.

---

# Data Model

Customer data is stored in:

```
webapp/model/data.json
```

Example structure:

```json
{
  "customers": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "city": "New York"
    }
  ]
}
```

The data is loaded using a **JSONModel** defined in:

```
webapp/model/models.js
```

---

# Screenshots

## Customer List Page

<img width="1876" height="928" alt="Screenshot 2026-03-07 015304" src="https://github.com/user-attachments/assets/b2b99a72-5ad1-4bf7-84a7-85f10dbb07e3" />


<img width="1886" height="815" alt="Screenshot 2026-03-07 015321" src="https://github.com/user-attachments/assets/ed9c88f3-1357-495d-9f6d-86e3b50f85f2" />



```
/screenshots/list-page.png
```

---

## Create Customer Dialog

<img width="1894" height="945" alt="Screenshot 2026-03-07 015425" src="https://github.com/user-attachments/assets/8abdc89a-03cc-461a-95e0-913bc0c4488e" />



```
/screenshots/create-customer.png
```

---

## Update Customer Dialog

<img width="1876" height="960" alt="Screenshot 2026-03-07 015451" src="https://github.com/user-attachments/assets/3447f70e-8fda-414c-9897-4000cec3853a" />


```
/screenshots/update-customer.png
```

---

## Delete Customer

<img width="1882" height="899" alt="Screenshot 2026-03-07 015512" src="https://github.com/user-attachments/assets/4cd8901f-f43e-4ec9-b52b-1962e5872054" />


```
/screenshots/delete-customer.png
```

---

# Technologies Used

* SAPUI5
* JavaScript
* XML Views
* JSON Model
* HTML5
* CSS
* SAPUI5 Fragments

---

# Installation and Run

### 1 Clone the repository

```bash
git clone https://github.com/codewith-aman88/SAPUI5-CRUD_APP.git
```

### 2 Navigate to the project folder

```bash
cd SAPUI5-CRUD_APP
```

### 3 Install dependencies

```bash
npm install
```

### 4 Run the application

```bash
npm start
```

or open:

```
webapp/index.html
```

---

# Learning Objectives

This project demonstrates:

* SAPUI5 MVC architecture
* JSON Model data binding
* CRUD operations in SAPUI5
* Fragment usage for dialogs
* Navigation between views
* SAPUI5 project structure

---

# Future Improvements

* Connect with **OData Service**
* Implement **search and filtering**
* Add **form validation**
* Implement **Fiori design guidelines**
* Add **backend database integration**
