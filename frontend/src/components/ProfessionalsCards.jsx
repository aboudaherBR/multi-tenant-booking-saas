export default function ProfessionalCard({ professional, onSelect, isSelected }) {
  console.log("FOTO:", professional.photo_url);

  return (
    <div
      style={{
        ...cardContainer,
        border: isSelected ? "2px solid #fff" : "none",
        transform: isSelected ? "scale(0.98)" : "scale(1)"
      }}
      onClick={() => onSelect(professional)}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* BACKGROUND */}
      <div style={backgroundStyle} />

      {/* FOTO */}
      <div style={avatarWrapper}>
        <img
          src={professional.photo_url || "/photos/avatar.png"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/avatar.png";
          }}
          alt={professional.name}
          style={avatarStyle}
        />
      </div>

      {/* CONTEÚDO */}
      <div style={contentStyle}>
        <h3 style={nameStyle}>{professional.name}</h3>

        <p style={subtitleStyle}>
          Toque para ver serviços
        </p>

        {/* BOTÃO */}
        <button
          style={buttonStyle}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(professional);
          }}
        >
          Ver serviços
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const cardContainer = {
  position: "relative",
  background: "#0f172a",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "16px",
  textAlign: "center",
  color: "#fff",
  cursor: "pointer",
  overflow: "hidden",
  transition: "all 0.2s ease",
  boxShadow: "0 15px 20px rgba(0,0,0,0.4)"
};

const backgroundStyle = {
  position: "absolute",
  top: "-40px",
  left: "-40px",
  width: "120px",
  height: "120px",
  background: "#f8faf8",
  borderRadius: "50%"
};

const avatarWrapper = {
  position: "relative",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "center"
};

const avatarStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #fff",
  display: "block"
};

const contentStyle = {
  position: "relative",
  zIndex: 1
};

const nameStyle = {
  margin: "10px 0 5px 0"
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#cbd5f5",
  marginBottom: "12px"
};

const buttonStyle = {
  background: "#f3f8f5",
  border: "none",
  padding: "10px 14px",
  borderRadius: "20px",
  cursor: "pointer",
  color: "#000",
  fontWeight: "bold"
};