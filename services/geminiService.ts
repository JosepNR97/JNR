// Servicio neutralizado para versión estática sin IA.
export const sendMessageToGemini = async (message: string): Promise<string> => {
  console.warn("El servicio de IA está desactivado en esta versión.");
  return "El asistente virtual está temporalmente deshabilitado.";
};
