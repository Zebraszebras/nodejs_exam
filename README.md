Node.js Exam
This is a Node.js web application built as part of an assignment. The application provides features such as user authentication, email verification, and CRUD operations for different resources. It uses Node.js, Express.js, EJS, and MongoDB, among other technologies.

Features
User authentication: Allows users to register, login, and logout with email and password credentials.
Email verification: Users must verify their email addresses by clicking on a verification link sent via email.
CRUD operations: Supports Create, Read, Update, and Delete operations for various resources.
Session management: Manages user sessions and ensures authenticated access to protected routes.
Error handling: Provides custom error handling and error messages for a better user experience.
Validation: Implements form validation to validate and sanitize user inputs.
Testing: Includes unit tests to verify the correctness of application functionality.

Technologies Used
Node.js
Express.js
EJS (Embedded JavaScript)
MongoDB
Mongoose
Passport
Bcrypt
Nodemailer

Getting Started
To run the application locally, follow these steps:

Clone the repository: git clone https://github.com/Zebraszebras/nodejs_exam.git
Install the dependencies: npm install
Set up the environment variables:
Create a .env file in the root directory.
Provide the necessary environment variables such as database connection details, session secret, and email credentials. Refer to the .env.example file for reference.
Start the server: npm start
Open a web browser and navigate to http://localhost:3000 to access the application.

Usage
Register a new user account using a valid email address and password.
Verify your email address by clicking on the verification link sent to your registered email.
Log in to the application using your credentials.
Explore the different features and functionalities available.
Create, update, or delete resources as required.
Log out of the application when finished.

Testing
To run the unit tests included in the project, follow these steps:

Ensure that the application dependencies are installed: npm install
Run the test suite: npm test

Contributing
Contributions to this project are welcome. If you have suggestions, bug reports, or feature requests, please open an issue on the GitHub repository.

When contributing code, please follow the existing code style and conventions. Before submitting a pull request, make sure to run the tests and ensure that they pass without any failures.
