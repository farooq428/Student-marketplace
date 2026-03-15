import { useEffect, useState } from "react";
import { getAllUsers, verifyUser, deleteUserAdmin } from "../../api/adminApi";

const VerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalSrc, setModalSrc] = useState("");
  const [modalAlt, setModalAlt] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      // keep only unverified sellers
      const sellers = data.filter((u) => u.role === "seller" && !u.isVerified);
      setUsers(sellers);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Verify failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserAdmin(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Inline SVG data URI used as a local placeholder to avoid external DNS calls
  const placeholder = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect fill='%23f3f4f6' width='100%' height='100%' rx='8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'>No Image</text></svg>`;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Verify Sellers</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No unverified sellers</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <div key={u._id} className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setModalSrc(u.profileImage || placeholder); setModalAlt(`${u.name} profile`); setModalOpen(true); }}
                  className="flex-shrink-0"
                  aria-label={`View ${u.name} profile image`}
                >
                  <img
                    src={u.profileImage || placeholder}
                    alt={`${u.name} profile`}
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                </button>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{u.name}</h2>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-700 mt-2">{u.university || "University not provided"}</p>
                  <p className="text-sm text-gray-700">{u.department || "Department not provided"}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Student Card</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setModalSrc(u.studentCardImage || u.cardFront || placeholder); setModalAlt(`${u.name} student card front`); setModalOpen(true); }}
                    className="w-40 h-24 bg-gray-100 border rounded overflow-hidden flex-shrink-0"
                    aria-label={`View ${u.name} student card front`}
                  >
                    <img
                      src={u.studentCardImage || u.cardFront || placeholder}
                      alt={`${u.name} student card front`}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <button
                    onClick={() => { setModalSrc(u.cardBackImage || u.cardBack || placeholder); setModalAlt(`${u.name} student card back`); setModalOpen(true); }}
                    className="w-40 h-24 bg-gray-100 border rounded overflow-hidden flex-shrink-0"
                    aria-label={`View ${u.name} student card back`}
                  >
                    <img
                      src={u.cardBackImage || u.cardBack || placeholder}
                      alt={`${u.name} student card back`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleVerify(u._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image preview modal (outside of the users listing conditional) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 flex justify-end">
              <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-800">Close</button>
            </div>
            <div className="p-4 flex justify-center">
              <img src={modalSrc} alt={modalAlt} className="max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyUsers;