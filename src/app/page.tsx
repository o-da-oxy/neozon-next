import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative">
      <h1 className="w-1/2 text-8xl font-bold">Система управления заказами и доставкой товаров</h1>
      <div className="moon-container">
        <Image
          src="/moon.png"
          alt="Луна"
          width={700}
          height={700}
          className="object-fit-cover animate-moon object-bottom"
        />
      </div>
    </main>
  );
}
