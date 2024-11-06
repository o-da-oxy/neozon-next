import Image from 'next/image';

export default function Header() {
  return (
    <header className="mb-2 flex items-center justify-between bg-white bg-opacity-60 px-4 py-4">
      <div className="flex items-center">
        <Image src="/simple_icon.png" alt="NeOzon logo" width={50} height={50} className="mr-4" />
        <div>
          <h1 className="text-2xl font-bold">NeOzon</h1>
          <h2>Система управления заказами и доставкой товаров</h2>
        </div>
      </div>
      <nav className="flex">
        <ul className="flex space-x-4">
          <li>
            <a href="/login" className="hover:text-ozonBlue">
              Вход
            </a>
          </li>
          <li>
            <a href="/signup" className="hover:text-ozonBlue">
              Регистрация
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
