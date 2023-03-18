# Intrepid - Outdoor Adventure App
A web app that connects outdoor enthusiasts with each other based on their shared interests, preferences, and experience level, allowing them to communicate and plan activities together.

## SWE 6733 - Emerging Software Engineering Practices
## Group 1 Members & Roles
- Developer: Jeffrey Ganulin
- Developer: Justin Hall
- Developer: Edward Jesinsky III
- Developer: Arbern Lim
- Product Owner: Alexis McNeill
- Scrum Master: Milly Namukasa

## Technology Stack
- Frontend: React, JavaScript, HTML, CSS, ...TBD
- Backend: TBD (Node.js, Express ??)
- Database: TBD (MongoDB ??)
- External APIs: Social-media Providers TBD

## Product Vision
- Our ultimate goal for Intrepid is to empower users to explore the outdoors safely, while also building a connection to other outdoor enthusiasts who share a passion for adventure and the natural world. Our product will be designed to meet the needs of a broad range of users, from beginners to experienced adventurers. A range of features allowing users to plan and organize their outdoor activities with their matched partners will be provided to users. The goal is to build a strong community of outdoor adventurers who can connect and share experiences with each other. 

1. Near Vision
  - Our near vision for Intrepid is to create a minimum viable product that provides a basic set of features and functionality for users to connect with each other and plan outdoor activities. To achieve this vision, the development team will focus on 
    1. Creating a user-friendly interface to easily create profiles and find mutual peers, 
    2. Building a robust algorithm that considers users' interests, experience level, and location,
    3. Establishing a scalable architecture and database schema,
    4. Implementing privacy,
    5. Conducting user testing and gather feedback

2. Far Vision
  - Our far vision for Intrepid is to offer product with a wide range of features and functionality to support the needs of a large community of outdoor adventurists. In order to achieve this vision team members will intend to
    1. Expand the app's matching algorithm for a wider range of user preferences and criteria,
    2. Offer advanced weather forecasting and risk assessment tools to help users make informed decisions about when and where to plan activities,
    3. Build a social networking component that allows users to connect with other outdoor enthusiasts, share their experiences, and form virtual and in-person communities.

## Stakeholders
- Intrepid's stakeholders include end-users, the product owner, and the Intrepid development team members. 

## Product Backlog
- Our team decided to use Jira as our primary tool for task tracking throughout the project. The product backlog can be found here 
https://intrepidemerg.atlassian.net/jira/software/projects/IN/boards/1/backlog

1. Ordering Rationale 
- Intrepid's product backlog will be ordered by stages of development, which can help the development team prioritize tasks, manage complexity, and deliver value to stakeholders more efficiently. By focusing on frontend development tasks first, the team can create a user-friendly and engaging interface that meets the needs and expectations of its target audience, while also gathering feedback and iterating quickly to improve the app's design and functionality. After ordering the backlog by stages of development each task will then be prioritized by risk, helping the team prioritize the most critical and high-risk tasks first, reducing the likelihood of delays, failures, or unforeseen issues that may impact the overall project timeline and success.

........

# Building and Running the Application
## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
* Ensure that Node.js is available on your PATH. You can test it by running:
```bash
node --version
```

## Installation
1. Clone the repository
2. Install dependencies
* From the root project directory run:
```bash
npm run prepare-environment
```
- This will install the dependencies needed by the frontend (and backend TBD).
3. Start the application
* From the root project directory run:
```bash
npm start
```
- This will start the frontend development server. A browser window should open automatically and navigate to http://localhost:3000. If it does not, you can manually navigate to that URL.
