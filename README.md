
---

# Utopia Hire API

A RESTful API for job posting and application management, supporting both employers and job seekers.

---

## **Table of Contents**
1. [Local Setup](#local-setup)
2. [Endpoints](#endpoints)
3. [Environment Variables](#environment-variables)
4. [Authentication](#authentication)
5. [Contributing](#contributing)

---

## **Local Setup**
To run the API locally, follow these steps:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the required environment variables (see [Environment Variables](#environment-variables)).
4. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.


---

## **Endpoints**
### **Authentication**
| Method | Route                      | Description                          |
|--------|----------------------------|--------------------------------------|
| POST   | `/api/v1/auth/register`    | Register (employer/jobseeker)        |
| POST   | `/api/v1/auth/login`       | Login (employer/jobseeker)           |

### **Jobs**
| Method | Route                                      | Description                          |
|--------|--------------------------------------------|--------------------------------------|
| GET    | `/api/v1/jobs/`                           | List all jobs                        |
| GET    | `/api/v1/jobs/:id`                        | Get job by ID                        |
| GET    | `/api/v1/search/jobs?query=<title>`       | Search jobs by title                 |
| GET    | `/api/v1/jobs?minSalary=<value>`          | Filter jobs by salary                |
| GET    | `/api/v1/jobs/employer/myjobs`            | List jobs posted by an employer      |
| POST   | `/api/v1/jobs`                            | Create a job post                    |
| PUT    | `/api/v1/jobs/:id`                        | Update a job post                    |
| DELETE | `/api/v1/jobs/:id`                        | Delete a job post                    |

### **Applications**
| Method | Route                                      | Description                          |
|--------|--------------------------------------------|--------------------------------------|
| POST   | `/api/v1/jobs/apply`                      | Apply for a job                      |
| GET    | `/api/v1/applications/my-applications`    | List personal applications           |
| GET    | `/api/v1/applications/:id`                | Get application by ID                |
| PUT    | `/api/v1/applications/:id`                | Update an application                |
| DELETE | `/api/v1/applications/:id`                | Delete an application                |
| GET    | `/api/v1/jobs/:id/applications`           | List applications for a job          |
| PUT    | `/api/v1/applications/:id/status`         | Update application status            |

### **Profiles**
| Method | Route                                      | Description                          |
|--------|--------------------------------------------|--------------------------------------|
| GET    | `/api/v1/jobseeker/profile`               | Get jobseeker profile                |
| PUT    | `/api/v1/jobseeker/profile`               | Update jobseeker profile             |
| PUT    | `/api/v1/jobseeker/update-password`       | Update jobseeker password            |
| DELETE | `/api/v1/jobseeker/profile`               | Delete jobseeker account             |
| GET    | `/api/v1/employer/profile`                | Get employer profile                 |
| PUT    | `/api/v1/employer/profile`                | Update employer profile              |
| PUT    | `/api/v1/employer/update-password`        | Update employer password             |
| DELETE | `/api/v1/employer/profile`                | Delete employer account              |

---

## **Environment Variables**
Create a `.env` file in the root directory with the following variables:
```env
DB_NAME="jobfinder_db"
DB_USER="your db username"
DB_PASS="your db password"
DB_HOST="localhost"
RESEND_API_KEY="your_resend_api_key"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
NODE_ENV="development"
PORT="5000"
```


---

## **Authentication**
- All endpoints (except `/api/v1/auth/register` and `/api/v1/auth/login`) require a valid JWT token in the `Authorization` header.
- Example:
    ```bash
       curl -H "Authorization: Bearer <token>" http://localhost:5000/api/v1/jobs
  


---

## **Contributing**
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a clear description of changes.



