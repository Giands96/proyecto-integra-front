"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import api from "@/lib/axios";

// Tipado de mensaje para el chat
type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [idCarga, setIdCarga] = useState("");
  const [documento, setDocumento] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "¡Hola! Soy el asistente virtual de Ransa. Ingresa tu ID de Carga y Nro. de Documento arriba, y hazme tu pregunta.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia el último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregunta.trim() || !idCarga.trim() || !documento.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: pregunta };
    setMessages((prev) => [...prev, userMessage]);
    setPregunta("");
    setLoading(true);

    try {
      // Usamos tu instancia de axios configurada
      const response = await api.get("/api/chat/consulta-carga", {
        params: {
          idSeguimiento: idCarga.trim(), 
          documento: documento.trim(),
          pregunta: userMessage.text,
        },
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: response.data,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: "Lo siento, ocurrió un error al consultar el sistema. Verifica que el ID de Carga y Documento sean correctos.",
      };
      console.log("Error en consulta de carga:", error);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón Flotante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-xl"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Ventana del Chat */}
      {isOpen && (
        <Card className="w-[350px] shadow-2xl flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between py-3 rounded-t-xl">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Asistente Ransa
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          {/* Formulario de credenciales de carga (Fijo en la parte superior) */}
          <div className="p-3 border-b bg-zinc-50 flex gap-2">
            <Input
              placeholder="ID Carga (Ej: 1)"
              className="h-8 text-xs"
              value={idCarga}
              onChange={(e) => setIdCarga(e.target.value)}
            />
            <Input
              placeholder="DNI / RUC"
              className="h-8 text-xs"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />
          </div>

          <CardContent className="flex-1 p-4 overflow-y-auto bg-zinc-50/50" ref={scrollRef}>
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-zinc-600"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white border text-zinc-700 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 flex-row">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow bg-white text-zinc-600">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-lg px-3 py-2 text-sm bg-white border text-zinc-700 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                placeholder="Escribe tu consulta..."
                className="flex-1"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !pregunta || !idCarga || !documento}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}