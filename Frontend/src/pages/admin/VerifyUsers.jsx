import { useEffect, useState } from "react";
import { getAllUsers, verifyUser, deleteUserAdmin } from "../../api/adminApi";

const VerifyUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    const sellers = data.filter((u) => u.role === "seller" && !u.isVerified);
    setUsers(sellers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id) => {
    await verifyUser(id);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await deleteUserAdmin(id);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Verify Sellers</h1>
      {users.length === 0 && <p>No unverified sellers</p>}
      <ul>
        {users.map((u) => (
          <li key={u._id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{u.name} ({u.email})</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleVerify(u._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Verify
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifyUsers;