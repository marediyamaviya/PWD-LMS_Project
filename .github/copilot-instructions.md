# PWD LMS repository instructions

## Repository shape

This is a multi-application PWD Learning Management System. There is no root build:

- `Frontend/Pwd-lms-frontend` is a React 19 + Vite frontend using JSX, React Router, Axios, and Bootstrap.
- `Backends/service-registry` is the Eureka server on port `8761`.
- `Backends/api-gateway` is the Spring Cloud Gateway MVC application on port `9000`.
- `Backends/identity-service` owns registration, login, users, roles, and JWT issuance on port `8081`.
- `Backends/assessment-service` owns courses, quizzes, questions, options, and candidate attempts on port `8082`.
- `attendance-service` is a separate Spring Boot/JPA/MySQL service for attendance, QR check-in, geo check-in, overrides, and scheduled absence marking.

The normal local request path is:

```text
React (localhost:5173)
  -> API gateway (localhost:9000)
     -> Eureka-discovered identity-service / assessment-service
```

The gateway exposes identity requests under `/api/identity/**` and assessment requests under `/api/assessment/**`. The gateway strips or rewrites those prefixes before forwarding. Assessment controllers therefore use `/api/quizzes` and `/api/courses` internally, while the browser calls them through the gateway client base URL.

The frontend currently defines routes in `src/App.jsx` for login/registration, candidate assessment, trainer dashboard, assessment management, and admin screens. Role-aware UI behavior is based on the `role` value stored after login; route elements themselves are not a substitute for backend authorization.

## Build, test, and lint

Run commands from the module directory being worked on. Maven wrapper scripts are present in each Java module, so prefer them over a globally installed Maven.

### Frontend

```powershell
cd Frontend\Pwd-lms-frontend
npm install                 # only when dependencies are missing or package manifests changed
npm run dev                 # Vite development server
npm run build               # production build
npm run lint                # ESLint over the frontend
npm run preview             # serve the production build locally
```

There is currently no frontend test script or frontend test suite in `package.json`. Do not invent a test command; use the running Vite app and the existing lint/build commands for frontend validation.

### Spring Boot services

Each service is built and tested independently:

```powershell
cd Backends\service-registry
.\mvnw.cmd clean test

cd ..\api-gateway
.\mvnw.cmd clean test

cd ..\identity-service
.\mvnw.cmd clean test

cd ..\assessment-service
.\mvnw.cmd clean test

cd ..\..\attendance-service
.\mvnw.cmd clean test
```

To run one Java test class without running the entire module suite:

```powershell
.\mvnw.cmd -Dtest=IdentityServiceApplicationTests test
.\mvnw.cmd -Dtest=ApiGatewayApplicationTests test
.\mvnw.cmd -Dtest=ServiceRegistryApplicationTests test
.\mvnw.cmd -Dtest=AttendanceServiceApplicationTests test
```

Use the relevant module's test class name for a new or existing test. The current Java tests are primarily Spring Boot context smoke tests; assessment-service currently has no checked-in test source under `src/test`.

For a package/build without tests, use:

```powershell
.\mvnw.cmd clean package -DskipTests
```

Java services target Java 17 or 21 as declared in their individual `pom.xml` files. Check the module POM before changing compiler settings; the versions are not uniform across modules.

## Architecture and data flow

- Identity authentication is implemented in `identity-service`. `POST /auth/login` authenticates a user, derives the role, and returns a JWT. The frontend stores `token`, `role`, and `email` in `localStorage`.
- `apiClient` is the Axios client for identity calls and uses the gateway base URL `http://localhost:9000/api/identity/`. `assessmentClient` uses `http://localhost:9000/api/assessment/`. Both clients attach the JWT from `localStorage`; keep authentication behavior centralized in these clients.
- Assessment CRUD and attempt scoring are concentrated in `assessment-service`'s `AssessmentService`, with controllers translating HTTP requests into service calls. JPA entities model `Quiz -> Question -> Option` and `Quiz -> QuizAttempt`; repositories own persistence queries.
- Candidate assessment UI enforces the visible three-attempt experience, while the backend also enforces the maximum attempt count. Preserve both layers when changing attempt behavior.
- Admin/trainer assessment management uses the same assessment API as candidate assessment. `ManageAssessment.jsx` handles quiz creation/edit/delete, question/options editing, and viewing attempts; `Assessment.jsx` handles candidate search, quiz loading, answer submission, and results.
- Attendance is not currently wired into the gateway/frontend flow. Treat it as an independent service and do not assume the gateway routes it unless you add and verify that integration.
- Java services use conventional Spring layers: controllers for HTTP boundaries, services for business rules, repositories for JPA access, DTOs for request/response payloads, entities for persistence, and security/configuration packages for JWT and authorization.

## Codebase-specific conventions

- Preserve module boundaries. A frontend change normally belongs under `Frontend/Pwd-lms-frontend`; backend behavior belongs in the owning service rather than being duplicated in the gateway.
- Keep gateway paths and downstream controller paths in sync. When changing an endpoint, update the gateway route/rewrite and the matching Axios client call together.
- Use the existing Axios clients rather than creating ad-hoc `fetch`/Axios instances. API errors are generally surfaced from `error.response?.data?.message` with a page-specific fallback.
- Frontend role strings are uppercase (`ADMIN`, `TRAINER`, `CANDIDATE`, and backend-defined roles). Do not silently introduce a second spelling or casing.
- Frontend pages use functional React components and local `useState` for page/form state. Shared admin navigation lives in `src/components/admin`; assessment styling is shared through `src/pages/Assessment.css`.
- Assessment request fields and response shapes are represented by Java records/classes in `assessment-service/src/main/java/.../dto`. Update the DTO, service mapping, controller, and affected JSX together when changing a payload.
- Quiz/question validation is enforced in both the management UI and `AssessmentService` (required title/text, option validity, correct option, and attempt limits). Preserve backend validation even if the UI validates first.
- Spring Security uses JWT filters and role-based matchers. New protected endpoints need an explicit authorization decision in the service's `SecurityConfig`; do not rely only on frontend visibility.
- Service discovery uses Eureka names (`IDENTITY-SERVICE`, `ASSESSMENT-SERVICE`) and local configuration. Keep `spring.application.name`, Eureka URLs, ports, and gateway route URIs consistent.
- Development persistence is MySQL on port `3307`, with separate `identity_db` and `assessment_db` databases. Module `application.properties` files contain local connection/JWT settings; use local/environment-specific values and never commit real credentials or secrets.
- JPA schema management is currently `spring.jpa.hibernate.ddl-auto=update` in the database-backed services. Be cautious with entity/relationship changes because they affect the local schema and API DTO mapping.
- The repository includes generated `target`, `dist`, and dependency directories locally but they are ignored. Do not edit generated output; change source files and rerun the appropriate build.
- Use lowercase module directory names when adding a new module, consistent with the repository's existing service naming and the root README guidance.
