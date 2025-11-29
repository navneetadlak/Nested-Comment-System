Running the Application
Backend Setup:
Navigate to backend directory

Run npm install

Create .env with your MongoDB URI

Run npm run dev

Frontend Setup:
Navigate to frontend directory

Run npm install

Create .env with VITE_API_BASE_URL=http://localhost:5000/api

Run npm run dev

Key Features Implemented:
✅ Backend:

MongoDB schema with proper indexing

Efficient O(n) tree building algorithm

Full CRUD operations

TypeScript throughout

Error handling and validation

✅ Frontend:

Recursive comment rendering

Reply functionality with forms

Visual nesting with indentation

Collapsible threads

Delete functionality

Responsive design

TypeScript integration

✅ Performance:

Single database query for all comments

Map-based O(n) tree building

Efficient React rendering

Proper indexing in MongoDB

The system supports infinite nesting, proper error handling, and provides a clean user experience similar to Reddit-style comment threads.