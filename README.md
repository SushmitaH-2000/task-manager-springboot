# Task Manager – Full-Stack Web Application 

A full-stack Task Manager application built using **React, Spring Boot, Java, and REST APIs**. The application helps users create, view, search, update, and manage tasks through an interactive web interface.

## 🚀 Technologies Used

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- HTML5 and CSS3
- Bootstrap
- Axios
- React Router (if configured)

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- RESTful APIs
- Maven

### Database
- H2 Database (development/testing)
- MySQL (if configured)

### Development Tools
- Visual Studio Code
- Eclipse IDE
- Git and GitHub
- Node.js and npm
- Postman (API testing)

## ✨ Features

- Create and add new tasks.
- View the list of tasks.
- Update task completion status.
- Search tasks by title.
- Filter tasks based on their status.
- Track completed and pending tasks.
- Display task completion progress.
- Communicate between React and Spring Boot through REST APIs.
- Persist task data using the configured database.

## 🏗️ Project Structure

```text
task-manager-springboot/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── pom.xml
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the application:

- Java 17 or a compatible version required by the backend.
- Node.js and npm.
- Maven, or use the Maven Wrapper if available.
- A database configured in the Spring Boot application.

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SushmitaH-2000/task-manager-springboot.git
cd task-manager-springboot
```

### 2. Run the Spring Boot Backend

From the project root, run:

```bash
mvn spring-boot:run
```

The backend normally starts at:

`http://localhost:8080`

### 3. Run the React Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:

`http://localhost:5173`

## 🔗 REST API

The backend exposes task-related endpoints under:

`/api/tasks`

The API supports operations such as retrieving tasks, adding tasks, and updating task status, depending on the controller implementation.

Example endpoint:

```http
GET http://localhost:8080/api/tasks
```

Use Postman or a browser to test the GET endpoint.

## 🔄 Application Workflow

1. The user interacts with the React frontend.
2. React sends HTTP requests using Axios.
3. Spring Boot receives requests through REST controllers.
4. Spring Data JPA handles database operations.
5. The backend returns responses to the frontend.
6. React updates the user interface with the latest task information.

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Java and Spring Boot application development.
- REST API design and integration.
- React components, state management, and event handling.
- Frontend-backend communication using Axios.
- Database integration and persistence.
- Git version control and GitHub repository management.
- Full-stack application development and debugging.

## 👩‍💻 Author

**Sushmita Hanchinal**

GitHub: [SushmitaH-2000](https://github.com/SushmitaH-2000)

## 📄 License

This project is intended for learning and portfolio demonstration. Add a license file if you choose to distribute it under a specific open-source license.
