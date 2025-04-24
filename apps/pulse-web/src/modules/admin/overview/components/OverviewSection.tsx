type OverviewSectionProps = {
  title: string;
  children: React.ReactNode;
};

const OverviewSection: React.FC<OverviewSectionProps> = ({
  children,
  title,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </div>
  );
};

export default OverviewSection;
