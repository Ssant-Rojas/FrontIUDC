import  { useEffect, useState } from "react";
import '../../styles/AdminUsers.css';
import { toast } from "react-toastify";
import apiService from "../../services/api.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });
  const [newRole, setNewRole] = useState({ name: "", priority: "Media" });

    useEffect(() => {
        apiService.get('/user', 'tickets')
            .then(data => {
                const formattedUsers = data.map(user => ({
                    id: user.idPersona,
                    name: `${user.nombres} ${user.apellidos}`,
                    email: user.email,
                    role: user.tipoUsuario
                }));
                setUsers(formattedUsers);
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                toast.error('Error al cargar usuarios');
            });

        apiService.get('/tipos-usuario', 'tickets')
            .then(data => {
                console.log('Roles cargados:', data);
                setRoles(data);
            })
            .catch(error => {
                console.error('Error al cargar roles:', error);
                toast.error('Error al cargar roles');
            });
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
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    const newUserData = { ...newUser, id: users.length + 1 };
    setUsers([...users, newUserData]);

    fetch("http://localhost:8081/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });

    setNewUser({ name: "", email: "", password: "", role: "" });
    toast.success("Usuario creado exitosamente.");
  };

    const handleCreateRole = async (e) => {
        e.preventDefault();

        if (!newRole.nombre.trim()) {
            toast.error("El nombre del rol no puede estar vacío.");
            return;
        }

        try {
            const createdRole = await apiService.post('/tipos-usuario', newRole, 'tickets');
            setRoles([...roles, createdRole]);
            toast.success("Rol creado exitosamente.");
            setNewRole({ nombre: "", descripcion: "" });
        } catch (error) {
            console.error("❌ Error al crear rol:", error);
            toast.error("Error al crear el rol.");
        }
    };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;

      try {
          await apiService.delete(`/tipos-usuario/${roleId}`, 'tickets');

      if (response.ok) {
        setRoles(roles.filter((role) => role.id !== roleId));
        toast.success("Rol eliminado exitosamente.");
      } else {
        toast.error("Error al eliminar el rol.");
      }
    } catch (error) {
      console.error("❌ Error al conectar con el servidor:", error);
      toast.error("Error al conectar con el servidor.");
    }
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
                      {roles.map((rol) => (
                          <option key={rol.id} value={rol.nombre}>
                              {rol.nombre}
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
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
      />

      <select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      >
        <option value="">Seleccionar Rol</option>
          {roles.map((role) => (
              <option key={role.id} value={role.nombre}>
                  {role.nombre}
              </option>
          ))}
      </select>
      <button onClick={handleCreateUser}>Crear Usuario</button>
        <h1>Gestión de Roles</h1>
        <form className="role-form" onSubmit={handleCreateRole}>
            <h2>Agregar Nuevo Rol</h2>
            <input
                type="text"
                placeholder="Nombre del rol"
                value={newRole.nombre}
                onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Descripción del rol"
                value={newRole.descripcion}
                onChange={(e) => setNewRole({ ...newRole, descripcion: e.target.value })}
            />
            <button type="submit">Crear Rol</button>
        </form>
      <div className="roles-list">
        <h2>Lista de Roles</h2>
        {roles.length > 0 ? (
          roles.map((role) => (
              <div key={role.id} className="role-card">
                  <p><strong>Nombre:</strong> {role.nombre}</p>
                  <p><strong>Descripción:</strong> {role.descripcion}</p>
                  <button className="delete-button" onClick={() => handleDeleteRole(role.id)}>
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay roles registrados.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
