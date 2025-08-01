import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes /> 
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#000",
            border: "1px solid #e2e8f0",
            padding: "12px",
          },
          duration: 8000,
        }}
      />
    </BrowserRouter>
  );
}
