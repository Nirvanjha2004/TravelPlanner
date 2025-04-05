import ExperienceForm from '../components/experiences/ExperienceForm';

const AddExperience = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Share Your Travel Experience</h1>
        <p className="text-muted-foreground">
          Share your journey details, tips, and photos with fellow travelers
        </p>
      </div>
      <ExperienceForm />
    </div>
  );
};

export default AddExperience;
