export default function PageHeading({ id, title, description }) {
  return (
    <div className="page-heading">
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
