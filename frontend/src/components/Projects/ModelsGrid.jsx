import ModelCard from './ModelCard';

const ModelsGrid = ({ models, title = "Recent Models" }) => {
  return (
    <div>
      <h2 className="text-white text-2xl font-display font-bold tracking-tight mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
};

export default ModelsGrid;