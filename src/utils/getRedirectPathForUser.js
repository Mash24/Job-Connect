import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getRedirectPathForUser = async (user) => {
  if (!user || !user.uid) {
    console.warn('No user provided or missing UID.');
    return '/login';
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`No user document found for UID: ${user.uid}`);
      return '/select-role';
    }

    const userData = userSnap.data();
    const role = userData.role?.toLowerCase().trim(); // Normalize role string

    if (role === 'jobseeker') {
      const seekerRef = doc(db, 'jobSeekers', user.uid);
      const seekerSnap = await getDoc(seekerRef);
      const profileCompleted = seekerSnap.exists() && seekerSnap.data().profileCompleted;

      return profileCompleted ? '/dashboard-seeker' : '/setup-seeker';
    }

    if (role === 'employer') {
      return '/dashboard-employer';
    }

    console.warn(`Unknown role for user ${user.uid}: ${role}`);
    return '/select-role';
  } catch (err) {
    console.error('Error determining redirect path:', err);
    return '/login';
  }
};