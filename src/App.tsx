import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeProvider";
import { DocumentTitle } from "./components/DocumentTitle";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DocumentTitle />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
