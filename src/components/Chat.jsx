import React, { useState, useEffect } from "react";
import axios from "axios";
import image from "../assets/robot.png";
import Prism from "prismjs"; // Bibliothèque pour la coloration syntaxique
import "prismjs/themes/prism.css"; // Style de Prism.js
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup"; // Pour HTML

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction pour formater la réponse
  const formatResponse = (responseText) => {
    // Remplacer les liens markdown [texte](url) par des balises <a>
    let formattedText = responseText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Remplacer les listes markdown * ou - par des balises <ul><li>
    formattedText = formattedText.replace(/^\s*[-\*]\s+(.*)$/gm, "<li>$1</li>");
    formattedText = formattedText.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

    // Remplacer les titres markdown (par exemple, **Titre**) par des balises <strong>
    formattedText = formattedText.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // Remplacer les blocs de code markdown (```) par des balises <pre><code>
    formattedText = formattedText
      .replace(/```(\w+)/g, '<pre><code class="language-$1">') // Détecte la langue (e.g., ```javascript)
      .replace(/```/g, "</code></pre>"); // Remplace les balises de fin de code

    return formattedText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true); // Affiche le statut de chargement
    setError(""); // Réinitialise l'erreur
    setResponse(""); // Efface la réponse précédente

    try {
      const res = await axios.post("https://api-wz4n.onrender.com/send/message", {
        message,
      });

      if (res.status === 200 && res.data && res.data.response) {
        // Formater la réponse avant de la stocker
        const formattedResponse = formatResponse(res.data.response);
        setResponse(formattedResponse); // Stocke la réponse formatée
      } else {
        setError("La réponse de l'API est invalide ou incomplète.");
      }
    } catch (err) {
      if (err.response) {
        setError(`Erreur de l'API : ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        setError("Aucune réponse de l'API. Vérifiez votre connexion réseau.");
      } else {
        setError("Une erreur inconnue s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false); // Désactive le statut de chargement
    }
  };

  // Applique la coloration syntaxique à chaque mise à jour de la réponse
  useEffect(() => {
    Prism.highlightAll();
  }, [response]);

  return (
    <div className="container mt-5">
      <center>
        <img src={image} alt="img" width={100} />
      </center>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-2">
          <input
            type="text"
            id="messageInput"
            className="form-control"
            placeholder="Posez votre question ici..."
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
            dangerouslySetInnerHTML={{ __html: response }} // Affiche le contenu enrichi
          ></div>
        )}
      </div>
    </div>
  );
};

export default Chat;
