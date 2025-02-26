# INSTALLATION GUIDE

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (Includes npm)
- Git
- MongoDB tools (for `mongoimport`)

## Setting Up a Development Environment

You can set up the project in two ways:

### **Option 1: Local Development**

1. **Clone the Repository**

   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install Dependencies**

   Navigate to the frontend and backend directories separately and install the required packages.

   ```sh
   cd Code/frontend
   npm install
   ```

   ```sh
   cd ../backend
   npm install
   ```

3. **Set Up Environment Variables**

   In order for the software to run, create a `.env` file inside `Code/backend/` and add the following:

   ```env
   RECIPES_DB_URI=<MongoDB-ATLAS-URI>
   RECIPES_NS=<name of database>
   PORT=1000
   GMAIL=<email address>
   GEMINI_API_KEY=<api key to google gemini>
   ```
   
   **Note:** The application uses the `gemini-2.0-flash` model. If this model changes, make appropriate updates to the API routes as well.

4. **Populate the MongoDB Database**

   The database requires a dataset to function correctly. The CSV file containing the recipes is located at `Data/final_recipe_recommender.csv`. To load the data into MongoDB, use `mongoimport`:

   ```sh
   mongoimport --uri=<MongoDB-ATLAS-URI> --db=<name of database> --collection=recipes --type=csv --headerline --file=<Path-to-dataset>
   ```

5. **Start the Frontend**

   Run the following command inside the `frontend` directory:

   ```sh
   npm start
   ```

6. **Start the Backend**

   Run the following command inside the `backend` directory:

   ```sh
   npx nodemon
   ```

7. **Ensure Both are Running**

   - Use **separate terminal windows** for frontend and backend services.
   - The frontend should be accessible at `http://localhost:3000` (unless configured otherwise).
   - The backend will run at the specified port in your project configuration.

### **Option 2: Deploying on AWS EC2**

1. **Launch an AWS EC2 Instance**

   - Use an Amazon Linux, Ubuntu, or any preferred Linux distribution.

2. **Install Node.js**

   ```sh
   sudo apt update && sudo apt install -y nodejs npm
   ```

3. **Clone the Repository**

   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```

4. **Install Dependencies**

   ```sh
   npm install
   ```

5. **Start the Application**

   ```sh
   npm start
   ```

## Contribution Guidelines

Before you contribute, please review:
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE-OF-CONDUCT.md](./CODE-OF-CONDUCT.md)

### **Contribution Best Practices**

✅ Ensure your code **runs locally** before committing.

✅ Do **not** use proprietary code without the proper license.

✅ Do **not** claim someone else’s work as your own.

✅ Be respectful and collaborate effectively—report issues and suggest improvements.

---

🎉 **You’re all set!** Happy coding!

![Success](https://tenor.com/view/success-kid-hells-yes-i-did-it-fuck-yeah-success-gif-5207407.gif)

