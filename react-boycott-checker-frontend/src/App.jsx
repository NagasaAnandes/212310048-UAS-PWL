import { BrowserRouter } from 'react-router-dom';
import BaseRoute from './apps/baseRoute';

function App() {

  return (
    <BrowserRouter>
      <BaseRoute />
    </BrowserRouter>
  );
}

export default App;
