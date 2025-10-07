import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api.js";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });
    const [newRole, setNewRole] = useState({ nombre: "", descripcion: "" });

    // 🔹 Cargar usuarios y roles al inicio
    useEffect(() => {
        apiService.get("/user", "tickets")
            .then((data) => {
                const formattedUsers = data.map((user) => ({
                    id: user.idPersona,
                    name: `${user.nombres} ${user.apellidos}`,
                    email: user.email,
                    role: user.tipoUsuario,
                }));
                setUsers(formattedUsers);
            })
            .catch((error) => {
                console.error("Error al cargar usuarios:", error);
                toast.error("Error al cargar usuarios");
            });

        apiService.get("/tipos-usuario", "tickets")
            .then((data) => {
                setRoles(data);
            })
            .catch((error) => {
                console.error("Error al cargar roles:", error);
                toast.error("Error al cargar roles");
            });
    }, []);

    // 🔹 Cambiar rol de usuario
    const handleRoleChange = async (userId, newRole) => {
        try {
            await apiService.put(`/users/${userId}`, { role: newRole }, "tickets");

            setUsers((prev) =>
                prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
            );

            toast.success("Rol actualizado correctamente.");
        } catch (error) {
            console.error("❌ Error al actualizar rol:", error);
            toast.error("No se pudo actualizar el rol.");
        }
    };

    // 🔹 Crear nuevo usuario
    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        try {
            const createdUser = await apiService.post("/users", newUser, "tickets");
            setUsers([...users, createdUser]);
            setNewUser({ name: "", email: "", password: "", role: "" });
            toast.success("Usuario creado exitosamente.");
        } catch (error) {
            console.error("❌ Error al crear usuario:", error);
            toast.error("Error al crear usuario.");
        }
    };

    // 🔹 Crear rol
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRole.nombre.trim()) {
            toast.error("El nombre del rol no puede estar vacío.");
            return;
        }

        try {
            const createdRole = await apiService.post("/tipos-usuario", newRole, "tickets");
            setRoles([...roles, createdRole]);
            setNewRole({ nombre: "", descripcion: "" });
            toast.success("Rol creado exitosamente.");
        } catch (error) {
            console.error("❌ Error al crear rol:", error);
            toast.error("Error al crear el rol.");
        }
    };

    // 🔹 Eliminar rol
    const handleDeleteRole = async (roleId) => {
        if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
        try {
            await apiService.delete(`/tipos-usuario/${roleId}`, "tickets");
            setRoles(roles.filter((role) => role.id !== roleId));
            toast.success("Rol eliminado exitosamente.");
        } catch (error) {
            console.error("❌ Error al eliminar rol:", error);
            toast.error("Error al eliminar el rol.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-10">
            {/* Gestión de Usuarios */}
            <section>
                <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Nombre</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Rol</th>
                        <th className="border p-2">Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="text-center hover:bg-gray-50">
                                <td className="border p-2">{user.name}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        {roles.map((rol) => (
                                            <option key={rol.id} value={rol.nombre}>
                                                {rol.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleRoleChange(user.id, "admin")}
                                        className="px-3 py-1 bg-accent text-white rounded hover:bg-accent-hover"
                                    >
                                        Hacer Admin
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-gray-500">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Crear Usuario */}
                <div className="mt-6 space-y-3">
                    <h2 className="text-xl font-semibold">Crear Nuevo Usuario</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="border rounded px-3 py-2"
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Seleccionar Rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.nombre}>
                                    {role.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleCreateUser}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Crear Usuario
                    </button>
                </div>
            </section>

            {/* Gestión de Roles */}
            <section>
                <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>

                {/* Crear rol */}
                <form className="space-y-3" onSubmit={handleCreateRole}>
                    <h2 className="text-xl font-semibold">Agregar Nuevo Rol</h2>
                    <input
                        type="text"
                        placeholder="Nombre del rol"
                        value={newRole.nombre}
                        onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Descripción del rol"
                        value={newRole.descripcion}
                        onChange={(e) => setNewRole({ ...newRole, descripcion: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Crear Rol
                    </button>
                </form>

                {/* Lista de roles */}
                <div className="mt-6 space-y-4">
                    <h2 className="text-xl font-semibold">Lista de Roles</h2>
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <div
                                key={role.id}
                                className="p-4 border rounded shadow flex justify-between items-center"
                            >
                                <div>
                                    <p><strong>Nombre:</strong> {role.nombre}</p>
                                    <p><strong>Descripción:</strong> {role.descripcion}</p>
                                </div>
                                <button
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={() => handleDeleteRole(role.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay roles registrados.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminUsers;
