import { useEffect, useState } from 'react';
import { testDataService } from '@/services/testDataService';
import { useAuth } from '@/contexts/AuthContext';

const Debug = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 Debug page - User:', user);
    
    if (user?.id) {
      console.log('🔥 Debug page - Getting courses for user:', user.id);
      const userCourses = testDataService.getCoursesForUser(user.id);
      console.log('🔥 Debug page - Received courses:', userCourses);
      setCourses(userCourses);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading debug page...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Formation Moov</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">User Info:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">All Test Courses:</h2>
        <pre>{JSON.stringify(testDataService.getTestCourses(), null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Courses for User:</h2>
        <pre>{JSON.stringify(courses, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Formation Moov Found:</h2>
        <p>{courses.find(c => c.id === 'formation-moov') ? '✅ YES' : '❌ NO'}</p>
        {courses.find(c => c.id === 'formation-moov') && (
          <pre>{JSON.stringify(courses.find(c => c.id === 'formation-moov'), null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default Debug;