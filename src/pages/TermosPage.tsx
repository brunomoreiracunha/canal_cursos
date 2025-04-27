import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

export function TermosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 pt-32">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 mb-8 group border border-gray-700 hover:border-gray-600 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Voltar para a página inicial</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-red-600">Termos de Uso</h1>
            <div className="w-24 h-1 mx-auto bg-red-600 rounded-full mb-6"></div>
            <div className="text-gray-400 space-y-4">
              <p className="text-lg">Última atualização: 16/04/2025</p>
              <p className="text-lg">Bem-vindo ao CanalCursos.com.br!</p>
              <p className="text-lg">Ao acessar este site, você concorda com os seguintes Termos de Uso...</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="space-y-8">
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">1. Objeto</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">O CanalCursos.com.br é uma plataforma que recomenda cursos online...</p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">2. Uso do Site</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">Você se compromete a utilizar o site de forma ética...</p>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">3. Afiliados e Comissões</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">O CanalCursos.com.br participa de programas de afiliados...</p>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">4. Responsabilidades e Garantias</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">Todos os cursos são analisados previamente...</p>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">Todo o conteúdo deste site é protegido por direitos autorais...</p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">6. Modificações</h2>
                  <p className="text-gray-400 leading-relaxed mb-4">Reservamo-nos o direito de alterar estes Termos de Uso...</p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">7. Contato</h2>
                  <p className="text-gray-400 leading-relaxed">contato@canalcursos.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}