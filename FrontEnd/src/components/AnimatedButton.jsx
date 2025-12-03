import { motion } from "framer-motion";

const AnimatedButton = ({ children, onClick, type = "button", style }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      // Animación: Al pasar el mouse sube un poco, al clickear se hunde
      whileHover={{ translate: "0px -2px", boxShadow: "7px 7px 0px 0px #222f3e" }} 
      whileTap={{ translate: "2px 2px", boxShadow: "2px 2px 0px 0px #222f3e" }}
      style={{
        padding: "12px 24px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        cursor: "pointer",
        
        // Estilo Brutalista
        backgroundColor: "#ff6b6b", // Color rojo
        color: "white",
        border: "3px solid #222f3e", // Borde negro grueso
        borderRadius: "8px",         // Bordes un poco redondeados
        boxShadow: "5px 5px 0px 0px #222f3e", // Sombra dura inicial
        
        transition: "all 0.1s",
        textTransform: "uppercase",
        letterSpacing: "1px",
        ...style
      }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;