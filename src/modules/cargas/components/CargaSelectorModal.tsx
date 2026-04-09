import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carga } from "@/modules/cargas/types";

interface CargaSelectorModalProps {
  cargas: Carga[];
  selectedCargaId?: number;
  onSelect: (idCarga: number) => void;
}

export function CargaSelectorModal({ cargas, selectedCargaId, onSelect }: CargaSelectorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtramos las cargas dinámicamente según lo que escriba el usuario
  const cargasFiltradas = useMemo(() => {
    if (!searchTerm) return cargas;
    
    const lowerSearch = searchTerm.toLowerCase();
    return cargas.filter((c) => 
      c.codigoSeguimiento?.toLowerCase().includes(lowerSearch) ||
      c.tipoCarga.toLowerCase().includes(lowerSearch)
      // Si tuvieras el nombre del cliente en el objeto Carga, lo agregarías aquí:
      // || c.cliente?.nombresRazonSocial?.toLowerCase().includes(lowerSearch)
    );
  }, [cargas, searchTerm]);

  // Buscamos la carga actualmente seleccionada para mostrarla en el botón que abre el modal
  const cargaSeleccionada = cargas.find(c => c.idCarga === selectedCargaId);

  const handleSelect = (idCarga: number) => {
    onSelect(idCarga);
    setIsOpen(false); // Cerramos el modal automáticamente al elegir
    setSearchTerm(""); // Limpiamos el buscador
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={`w-full justify-start text-left font-normal px-3 py-2 border border-input rounded-md bg-background hover:bg-accent ${!cargaSeleccionada ? "text-muted-foreground" : ""}`}>
        {cargaSeleccionada 
          ? `${cargaSeleccionada.tipoCarga} (${cargaSeleccionada.codigoSeguimiento})` 
          : "Haz click para buscar y seleccionar una carga..."}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar Carga</DialogTitle>
        </DialogHeader>

        {/* El Buscador */}
        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por código de seguimiento o tipo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* La Tabla de Resultados */}
        <div className="border rounded-md overflow-y-auto flex-1">
          <Table>
            <TableHeader className="bg-zinc-100 sticky top-0 z-10">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No se encontraron cargas.
                  </TableCell>
                </TableRow>
              ) : (
                cargasFiltradas.map((carga) => (
                  <TableRow key={carga.idCarga} className="hover:bg-zinc-50">
                    <TableCell className="font-medium">{carga.codigoSeguimiento}</TableCell>
                    <TableCell>{carga.tipoCarga}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{carga.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleSelect(carga.idCarga!)}
                        variant={selectedCargaId === carga.idCarga ? "default" : "secondary"}
                      >
                        {selectedCargaId === carga.idCarga ? "Seleccionada" : "Seleccionar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}