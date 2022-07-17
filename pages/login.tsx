import {useSignInWithGoogle} from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase';
const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <button onClick={()=> signInWithGoogle()} className='shadow-lg p-2 rounded-lg border-solid border-[1px] border-gray-600'>Loggin with Gooogle</button>
    </div>
  );
};

export default Login;
