import {useSignInWithGoogle} from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase';
const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  return (
    <div className="flex justify-center items-center">
      <button onClick={()=> signInWithGoogle()}>Loggin with Gooogle</button>
    </div>
  );
};

export default Login;
