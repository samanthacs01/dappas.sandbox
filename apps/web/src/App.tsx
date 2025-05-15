
import '@workspace/ui/globals.css';
import { RouterProvider } from 'react-router';
import { router } from './core/routes/routes';
import './styles.css';

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
