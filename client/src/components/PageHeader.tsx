export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className={"bg-orange-100 p-4 rounded-lg flex flex-col gap-2"}>
      <div className={"text-2xl font-bold "}>{title}</div>
      {description && (
        <div className={"text-md font-semibold"}>{description}</div>
      )}
    </div>
  );
}
