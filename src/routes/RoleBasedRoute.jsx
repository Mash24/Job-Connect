import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const RoleBasedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return navigate('/login');

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'jobSeeker') navigate('/dashboard/seeker');
        else if (role === 'employer') navigate('/dashboard/employer');
        else navigate('/select-role');
      }
    };

    checkRole();
  }, [navigate]);

  return null;
};

export default RoleBasedRoute;