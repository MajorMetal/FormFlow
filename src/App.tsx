import { FormFlow } from './components/FormFlow';
import { coachingForm } from './demo/coachingForm';

function App() {
  const handleSubmit = (answers: Record<string, string | string[] | number>) => {
    console.log('Form submitted!', answers);
    // In production, this would send to your backend/Supabase
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FormFlow config={coachingForm} onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
