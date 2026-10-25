import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/user/profile`, {}, { headers: { token } });
        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          console.error(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [backendUrl, navigate, token]);

  return (
    <div className="border-t pt-16 min-h-[50vh]">
      <div className="text-2xl mb-8"><Title text1="MY" text2="PROFILE" /></div>
      {loading ? (
        <div className="flex items-center gap-3 py-8 text-gray-500" aria-live="polite">
          <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
          Loading your profile...
        </div>
      ) : profile ? (
        <div className="max-w-md border rounded p-6 text-gray-700 space-y-3">
          <p><span className="font-medium">Name:</span> {profile.name}</p>
          <p><span className="font-medium">Email:</span> {profile.email}</p>
        </div>
      ) : (
        <p className="text-gray-500">Unable to load your profile. Please try again.</p>
      )}
    </div>
  );
};

export default Profile;
