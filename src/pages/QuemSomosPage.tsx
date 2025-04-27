import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

export function QuemSomosPage() {

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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-red-600">Quem Somos</h1>
            <div className="w-24 h-1 mx-auto bg-red-600 rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              No CanalCursos.com.br, acreditamos que a educação transforma vidas. Nosso compromisso é oferecer a você uma seleção criteriosa de cursos online, escolhidos com base na qualidade do conteúdo, experiência dos instrutores e relevância dos módulos.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
              <p className="text-gray-300 leading-relaxed">
                Sabemos que, no vasto universo de cursos disponíveis na internet, encontrar opções confiáveis pode ser desafiador. Por isso, nossa equipe dedica-se a analisar e validar cada curso antes de recomendá-lo, garantindo que você tenha acesso apenas ao melhor em educação online.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Nosso Propósito</h2>
              <p className="text-gray-300 leading-relaxed">
                Nosso objetivo é ser mais do que um site de indicações; queremos ser seu parceiro na jornada de aprendizado e crescimento profissional. Aqui, você encontrará cursos que realmente fazem a diferença, com a confiança de que cada recomendação foi cuidadosamente avaliada.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Junte-se a Nós</h2>
              <p className="text-gray-300 leading-relaxed">
                Junte-se a nós e descubra como o CanalCursos.com.br pode ser o ponto de partida para alcançar seus objetivos educacionais e profissionais.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
