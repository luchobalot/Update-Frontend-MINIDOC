// src/pages/Test/Test-Usuarios.jsx
import React, { useState } from "react";
import axios from "axios";

function TestUsuarios() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    passwordConfirmation: "",
    matriculaRevista: "",
    apellido: "",
    nombre: "",
    jerarquiaId: "",
    destinoId: "",
    nivelId: "",
    alcanceId: "",
    idEscalafon: "",
    idCuerpo: "",
    confianza: false,
    superConfianza: false,
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const dataToSubmit = {
        logon: formData.userName.trim(),
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        matriculaRevista: formData.matriculaRevista,
        jerarquiaId: parseInt(formData.jerarquiaId, 10),
        destinoId: parseInt(formData.destinoId, 10),
        nivelId: parseInt(formData.nivelId, 10),
        alcanceId: parseInt(formData.alcanceId, 10),
        idEscalafon: formData.idEscalafon
          ? parseInt(formData.idEscalafon, 10)
          : null,
        idCuerpo: formData.idCuerpo ? parseInt(formData.idCuerpo, 10) : null,
        confianza: Boolean(formData.confianza),
        superConfianza: Boolean(formData.superConfianza),
      };

      console.log("Enviando:", dataToSubmit);

      // ⚠️ Ajustá la URL al endpoint real de tu backend
      const res = await axios.post("http://localhost:7043/api/usuarios", dataToSubmit);
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h2>Test Crear Usuario (simple)</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px" }}>
        <input type="text" name="userName" placeholder="Usuario" value={formData.userName} onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
        <input type="password" name="passwordConfirmation" placeholder="Confirmar Contraseña" value={formData.passwordConfirmation} onChange={handleChange} />
        <input type="text" name="matriculaRevista" placeholder="Matrícula" value={formData.matriculaRevista} onChange={handleChange} />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
        <input type="number" name="jerarquiaId" placeholder="JerarquíaId" value={formData.jerarquiaId} onChange={handleChange} />
        <input type="number" name="destinoId" placeholder="DestinoId" value={formData.destinoId} onChange={handleChange} />
        <input type="number" name="nivelId" placeholder="NivelId" value={formData.nivelId} onChange={handleChange} />
        <input type="number" name="alcanceId" placeholder="AlcanceId" value={formData.alcanceId} onChange={handleChange} />
        <input type="number" name="idEscalafon" placeholder="EscalafónId (opcional)" value={formData.idEscalafon} onChange={handleChange} />
        <input type="number" name="idCuerpo" placeholder="CuerpoId (opcional)" value={formData.idCuerpo} onChange={handleChange} />
        
        <label>
          <input type="checkbox" name="confianza" checked={formData.confianza} onChange={handleChange} />
          Confianza
        </label>
        <label>
          <input type="checkbox" name="superConfianza" checked={formData.superConfianza} onChange={handleChange} />
          Super Confianza
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Respuesta del servidor</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h3>Error</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TestUsuarios;