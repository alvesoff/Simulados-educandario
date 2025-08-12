import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import CreateTestPage from './pages/CreateTestPage';
import EditTestPage from './pages/EditTestPage';
import TestsPage from './pages/TestsPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rota pública - Login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de Provas */}
            <Route 
              path="/tests" 
              element={
                <ProtectedRoute>
                  <TestsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/tests/create" 
              element={
                <ProtectedRoute>
                  <CreateTestPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/tests/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditTestPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota padrão - redireciona para dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rota 404 - redireciona para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;