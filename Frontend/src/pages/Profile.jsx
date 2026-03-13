import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/authApi";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(user._id);
      setProfile(data);
    };
    fetchProfile();
  }, [user._id]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const data = await updateUserProfile(user._id, profile);
    setProfile(data);
    setUser(data);
    setEditing(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="mb-2">
        <label>Name:</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Email:</label>
        <input
          name="email"
          value={profile.email}
          disabled
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>University:</label>
        <input
          name="university"
          value={profile.university}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Department:</label>
        <input
          name="department"
          value={profile.department}
          onChange={handleChange}
          disabled={!editing}
          className="w-full p-2 border rounded"
        />
      </div>
      {editing ? (
        <button
          onClick={handleUpdate}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Profile;