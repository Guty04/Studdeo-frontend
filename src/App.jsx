import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import RouteRenderer from './routes/RouteRenderer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteRenderer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
