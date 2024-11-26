import React, { useState } from "react";
import axios from "axios";
import image from '../assets/robot.png';
const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true); // Affiche le statut de chargement
    setError(""); // Réinitialise l'erreur
    setResponse(""); // Efface la réponse précédente
  
    try {
      const res = await axios.post("https://api-wz4n.onrender.com/send/message", {
        message,
      });
      console.log(res)
  
      // Vérifie si la requête a réussi
      if (res.status === 200 && res.data && res.data.response) {
        setResponse(res.data.response); // Stocke la réponse retournée par l'API
      } else {
        setError("La réponse de l'API est invalide ou incomplète.");
      }
    } catch (err) {
      // Gère les erreurs réseau ou les réponses avec un status >= 400
      if (err.response) {
        // L'API a répondu avec un status d'erreur (ex: 4xx ou 5xx)
        setError(`Erreur de l'API : ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        // Aucun retour de l'API (erreur réseau)
        setError("Aucune réponse de l'API. Vérifiez votre connexion réseau.");
      } else {
        // Erreur inattendue
        setError("Une erreur inconnue s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false); // Désactive le statut de chargement
    }
  };
  

  return (
    <div className="container mt-5">
      {/* <h1 className="text-center mb-4">Vient discutez avec moi !!!</h1> */}
      <center>
      <img  src={image} alt="img" width={100} />
       </center>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-2">
          <input
            type="text"
            id="messageInput"
            className="form-control"
            placeholder=" Posez votre question ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <center>
        <button type="submit" className="btn btn-primary w-50">
          Envoyer
        </button>
        </center>
      </form>

      <div className="mt-4">
        {loading && <div className="alert alert-info">Chargement...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {response && (
          <div
            className="shadow-lg p-3 mb-5 bg-body-tertiary rounded"
            style={{ minHeight: "100px" }}
          >
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
