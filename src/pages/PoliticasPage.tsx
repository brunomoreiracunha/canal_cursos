import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

export function PoliticasPage() {
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-red-600">Políticas e Termos</h1>
            <div className="w-24 h-1 mx-auto bg-red-600 rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Documentos importantes para entender como o CanalCursos.com.br opera e protege seus dados.
            </p>
          </div>

          <div className="space-y-12">
            {/* Política de Afiliados */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Política de Afiliados e Isenção de Responsabilidade</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">1. O que são links de afiliado?</h3>
                  <p className="text-gray-400 leading-relaxed">Podemos receber comissões por cursos vendidos via links no site...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">2. Análise de qualidade</h3>
                  <p className="text-gray-400 leading-relaxed">Todos os cursos são avaliados antes de serem indicados...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">3. Isenção de responsabilidade</h3>
                  <p className="text-gray-400 leading-relaxed">Não somos os produtores dos cursos e não oferecemos suporte direto...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">4. Declaração de boa-fé</h3>
                  <p className="text-gray-400 leading-relaxed">Nosso objetivo é indicar apenas cursos confiáveis e de qualidade...</p>
                </div>
              </div>
            </div>

            {/* Política de Reembolso */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">1. Reembolsos e Garantias</h3>
                  <p className="text-gray-400 leading-relaxed">Responsabilidade exclusiva do produtor ou plataforma do curso...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">2. Como proceder</h3>
                  <p className="text-gray-400 leading-relaxed">Entre em contato diretamente com o suporte do curso comprado...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">3. Suporte do CanalCursos</h3>
                  <p className="text-gray-400 leading-relaxed">Podemos orientar você sobre o procedimento correto pelo e-mail contato@canalcursos.com.br...</p>
                </div>
              </div>
            </div>

            {/* Política de Cookies */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Política de Cookies</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">1. O que são cookies?</h3>
                  <p className="text-gray-400 leading-relaxed">Cookies são arquivos de texto armazenados no seu navegador...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">2. Para que usamos cookies?</h3>
                  <p className="text-gray-400 leading-relaxed">Usamos cookies para entender o comportamento do usuário...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">3. Tipos de cookies</h3>
                  <p className="text-gray-400 leading-relaxed">Essenciais, de desempenho, publicidade e terceiros...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">4. Como controlar?</h3>
                  <p className="text-gray-400 leading-relaxed">Você pode desativar os cookies nas configurações do navegador...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">5. Consentimento</h3>
                  <p className="text-gray-400 leading-relaxed">Ao usar o site, você concorda com o uso de cookies...</p>
                </div>
              </div>
            </div>

            {/* Política de Privacidade */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Política de Privacidade</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">1. Coleta de Informações</h3>
                  <p className="text-gray-400 leading-relaxed">Podemos coletar nome, e-mail, cookies e dados de navegação...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">2. Uso das Informações</h3>
                  <p className="text-gray-400 leading-relaxed">As informações são usadas para melhorar sua experiência...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">3. Compartilhamento de Dados</h3>
                  <p className="text-gray-400 leading-relaxed">Não vendemos nem compartilhamos suas informações pessoais...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">4. Cookies</h3>
                  <p className="text-gray-400 leading-relaxed">Utilizamos cookies para analisar o tráfego e personalizar conteúdo...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">5. Segurança</h3>
                  <p className="text-gray-400 leading-relaxed">Adotamos medidas para proteger seus dados...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">6. Direitos do Usuário</h3>
                  <p className="text-gray-400 leading-relaxed">Você pode solicitar acesso, correção ou exclusão de seus dados...</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">7. Alterações</h3>
                  <p className="text-gray-400 leading-relaxed">Última atualização: 16/04/2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
