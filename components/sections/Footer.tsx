import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-orange-50 border-t border-orange-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-orange-700 font-bold mb-4">Consagrados a Jesús</h3>
            <p className="text-gray-600">
              Conferencia anual de Consagrados a Jesús
            </p>
          </div>
          <div>
            <h3 className="text-orange-700 font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cronograma" className="text-gray-600 hover:text-orange-700">
                  Cronograma
                </Link>
              </li>
              <li>
                <Link href="/invitados" className="text-gray-600 hover:text-orange-700">
                  Invitados
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="text-gray-600 hover:text-orange-700">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-orange-700 font-bold mb-4">Contacto</h3>
            <p className="text-gray-600">
              Email: info@consagradosajesus.com
            </p>
            <p className="text-gray-600">
              Teléfono: (54) 9 11 1234-5678
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-orange-200 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Consagrados a Jesús. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
