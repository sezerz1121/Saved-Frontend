import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Saver from './Saver.jsx';
function App() {

  return (
<GoogleOAuthProvider clientId={`204317580424-55evmnoj421b4kp2km0onj5oq7g2fel0.apps.googleusercontent.com`}>
<Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path='/home' element={<Saver/>} />
      </Routes>
</Router>
</GoogleOAuthProvider>
  )
}

export default App