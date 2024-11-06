interface Params {
  params: { id: string };
}

export default function Card({ params }: Params) {
  return (
    <div>
      <p>Card with id {params.id}</p>
    </div>
  );
}
