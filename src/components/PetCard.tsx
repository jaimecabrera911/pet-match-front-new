import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { cn } from "../lib/utils";
import { useState } from "react";

interface PetCardProps {
  nombre: string;
  edad: string;
  raza: string;
  ubicacion: string;
  imagenUrl: string;
  requisitos: string[];
  estadosDeSalud: string[];
  personalidad: string[];
  onAdopt?: () => void;
}

export function PetCard({ 
  nombre, 
  edad, 
  raza, 
  ubicacion, 
  imagenUrl, 
  requisitos,
  estadosDeSalud,
  personalidad,
  onAdopt 
}: PetCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAdoptDialog, setShowAdoptDialog] = useState(false);

  const handleAdopt = () => {
    if (onAdopt) {
      onAdopt();
    }
    setShowAdoptDialog(false);
  };

  return (
    <>
      <div 
        className="relative h-[500px] w-full [perspective:1000px]"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        role="group"
        aria-label={`Tarjeta de ${name}`}
      >
        <div className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}>
          {/* Frente de la tarjeta */}
          <Card className="absolute inset-0 overflow-hidden bg-[#FFD868] border-none [backface-visibility:hidden]">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="aspect-square overflow-hidden rounded-t-xl flex-shrink-0">
                <img
                  src={imagenUrl}
                  alt={`Foto de ${name}`}
                  className="h-full w-full object-cover"
                  role="img"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{nombre}</h3>
                  <div className="mt-2 space-y-2 text-base text-gray-700">
                    <p aria-label={`Edad: ${edad}`}>Edad: {edad}</p>
                    <p aria-label={`Raza: ${raza}`}>Raza: {raza}</p>
                    <p aria-label={`Ubicación: ${ubicacion}`}>Ubicación: {ubicacion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reverso de la tarjeta */}
          <Card className="absolute inset-0 overflow-hidden bg-[#FFD868] border-none [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-4">{nombre}</h3>
                <div className="space-y-4">
                  {personalidad && personalidad.length > 0 && (
                    <div role="region" aria-label="Personalidad">
                      <h4 className="text-base font-semibold mb-1">Personalidad</h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {personalidad.map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {estadosDeSalud && estadosDeSalud.length > 0 && (
                    <div role="region" aria-label="Información de salud">
                      <h4 className="text-base font-semibold mb-1">Salud</h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {estadosDeSalud.map((status, index) => (
                          <li key={index}>{status}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {requisitos && requisitos.length > 0 && (
                    <div role="region" aria-label="Requisitos de adopción">
                      <h4 className="text-base font-semibold mb-1">Requisitos</h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {requisitos.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-[#FF5C7F] hover:bg-[#FF5C7F]/90 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-md" 
                size="lg"
                aria-label={`Adoptar a ${name}`}
                role="button"
                onClick={() => setShowAdoptDialog(true)}
              >
                Adoptar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showAdoptDialog} onOpenChange={setShowAdoptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Adopción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas adoptar a {nombre}? Al confirmar, iniciarás el proceso de adopción.
              Nuestro equipo se pondrá en contacto contigo para los siguientes pasos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdopt}>Confirmar Adopción</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}