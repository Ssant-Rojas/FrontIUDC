import React, { useEffect, useState } from "react";
import '../../styles/AdminUsers.css'

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then(setUsers);

    fetch("http://localhost:8081/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);

    fetch(`http://localhost:8081/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newUserData = { ...newUser, id: users.length + 1 };
    setUsers([...users, newUserData]);

    fetch("http://localhost:8081/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });

    setNewUser({ name: "", email: "", role: "" });
  };

  return (
    <div className="admin-users-container">
      <h1>Gestión de Usuarios</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleRoleChange(user.id, "admin")}>
                  Hacer Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Crear Nuevo Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input 
        type="password"
        placeholder="Contraseña"
        value={newUser.password || "" }
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
        />

      <select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      >
        <option value="">Seleccionar Rol</option>
        {roles.map((role) => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <button onClick={handleCreateUser}>Crear Usuario</button>
    </div>
  );
};

export default AdminUsers;
