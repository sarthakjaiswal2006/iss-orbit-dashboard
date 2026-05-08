import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;
