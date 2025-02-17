export default function PageHeader ({title}: {title: string}) {
  return (
    <div className={'text-2xl font-bold mb-12 bg-orange-100 p-4 rounded-lg flex'}>{title}</div>
  )
}
