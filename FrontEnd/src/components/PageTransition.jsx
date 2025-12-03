import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Empieza invisible y 20px abajo
      animate={{ opacity: 1, y: 0 }}  // Termina visible y en su lugar
      exit={{ opacity: 0, y: -20 }}   // Se va hacia arriba (si configuras exit)
      transition={{ duration: 0.5, ease: "easeOut" }} // Dura medio segundo
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;