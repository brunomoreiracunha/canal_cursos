import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CourseCategoryPage } from './pages/CoursesCategoryPage';
import { AllCoursesPage } from './pages/AllCoursesPage';
import { CourseFormPage } from './pages/CourseFormPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { AllCategoriesPage } from './pages/AllCategoriesPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
import { QuemSomosPage } from './pages/QuemSomosPage';
import { PoliticasPage } from './pages/PoliticasPage';
import { TermosPage } from './pages/TermosPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/curso/:id" element={<CourseDetailsPage />} />
            <Route path="/categoria/:categoryId" element={<CourseCategoryPage />} />
            <Route path="/cursos" element={<AllCoursesPage />} />
            <Route path="/curso/novo" element={<CourseFormPage />} />
            <Route path="/curso/:id/editar" element={<CourseFormPage />} />
            <Route path="/categorias" element={<AllCategoriesPage />} />
            <Route path="/categorias/novo" element={<CategoryFormPage />} />
            <Route path="/categorias/:id/editar" element={<CategoryFormPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/sobre" element={<QuemSomosPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/politicas" element={<PoliticasPage />} />
            <Route path="/termos" element={<TermosPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;