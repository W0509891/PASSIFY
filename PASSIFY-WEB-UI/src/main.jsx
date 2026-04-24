import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
//Router
import { HashRouter as Router, Routes, Route} from 'react-router-dom'

//Components
import Navbar from "./ui/Navbar/Navbar.jsx";

//Route Components
import App from './routes/App.jsx'
import Event from './routes/Event/Event.jsx';
import Ticket from './routes/Ticket/Ticket.jsx';
import Details from "./routes/Details/Details.jsx";
import Purchase from "./routes/Purchase/Purchase.jsx";
import {Auth} from "./routes/Auth/login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
       <Router>
        <Navbar />
           <Routes>
               <Route path="/" element={<App />} />
               <Route path="/details/:id" element={<Details />} />
               <Route path="/Purchase" element={<Purchase />} />
               <Route path="/event" element={<Event />} />
               <Route path="/tickets" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
               <Route path="/auth" element={<Auth />} />
           </Routes>
       </Router>
    </AuthProvider>
  </StrictMode>
)
