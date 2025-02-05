import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Pet } from "../db/schema";

const petSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  edad: z.number().min(1, "La edad es requerida"),
  raza: z.string().min(1, "La raza es requerida"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  imageFile: z.any(),
  requisitos: z.array(z.string()).min(1, "Debe especificar al menos un requisito"),
  estadosDeSalud: z.array(z.string()).min(1, "Debe especificar al menos un estado de salud"),
  personalidad: z.array(z.string()).min(1, "Debe especificar al menos un rasgo de personalidad"),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: Pet;
}

export function PetFormDialog({ isOpen, onClose, pet }: PetFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRequirement, setNewRequirement] = useState("");
  const [newHealthStatus, setNewHealthStatus] = useState("");
  const [newPersonality, setNewPersonality] = useState("");

  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      nombre: pet?.nombre ?? "",
      edad: pet?.edad ? Number(pet.edad) : undefined,
      raza: pet?.raza ?? "", 
      ubicacion: pet?.ubicacion ?? "",
      requisitos: pet?.requisitos ?? [],
      estadosDeSalud: pet?.estadosDeSalud ?? [],
      personalidad: pet?.personalidad ?? [],
    },
  });

  const createPetMutation = useMutation({
    mutationFn: async (data: PetFormData) => {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("edad", data.edad.toString());
      formData.append("raza", data.raza);
      formData.append("ubicacion", data.ubicacion);
      formData.append("requisitos", JSON.stringify(data.requisitos));
      formData.append("estadosDeSalud", JSON.stringify(data.estadosDeSalud));
      formData.append("personalidad", JSON.stringify(data.personalidad));

      if (data.imageFile instanceof File) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch("/mascotas", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al crear la mascota");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/mascotas"] });
      toast({
        title: "¡Éxito!",
        description: "Mascota creada correctamente",
      });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async (data: PetFormData & { id: number }) => {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("edad", data.edad.toString());
      formData.append("raza", data.raza);
      formData.append("ubicacion", data.ubicacion);
      formData.append("requisitos", JSON.stringify(data.requisitos));
      formData.append("estadosDeSalud", JSON.stringify(data.estadosDeSalud));
      formData.append("personalidad", JSON.stringify(data.personalidad));

      if (data.imageFile instanceof File) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(`/mascotas/${data.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar la mascota");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/mascotas"] });
      toast({
        title: "¡Éxito!",
        description: "Mascota actualizada correctamente",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: PetFormData) => {
    if (pet) {
      await updatePetMutation.mutateAsync({ ...data, id: pet.id });
    } else {
      await createPetMutation.mutateAsync(data);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const currentRequirements = form.getValues("requisitos") || [];
      form.setValue("requisitos", [...currentRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleAddHealthStatus = () => {
    if (newHealthStatus.trim()) {
      const currentStatus = form.getValues("estadosDeSalud") || [];
      form.setValue("estadosDeSalud", [...currentStatus, newHealthStatus.trim()]);
      setNewHealthStatus("");
    }
  };

  const handleAddPersonality = () => {
    if (newPersonality.trim()) {
      const currentPersonality = form.getValues("personalidad") || [];
      form.setValue("personalidad", [...currentPersonality, newPersonality.trim()]);
      setNewPersonality("");
    }
  };

  const handleRemoveItem = (field: "requisitos" | "estadosDeSalud" | "personalidad", index: number) => {
    const current = form.getValues(field) || [];
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pet ? "Editar" : "Agregar"} Mascota</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="edad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="raza"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raza</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requisitos"
              render={() => (
                <FormItem>
                  <FormLabel>Requisitos de Adopción</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Agregar requisito"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    />
                    <Button type="button" onClick={handleAddRequirement}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("requisitos")?.map((req, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("requisitos", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estadosDeSalud"
              render={() => (
                <FormItem>
                  <FormLabel>Estado de Salud</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newHealthStatus}
                      onChange={(e) => setNewHealthStatus(e.target.value)}
                      placeholder="Agregar estado de salud"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHealthStatus())}
                    />
                    <Button type="button" onClick={handleAddHealthStatus}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("estadosDeSalud")?.map((status, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{status}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("estadosDeSalud", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalidad"
              render={() => (
                <FormItem>
                  <FormLabel>Personalidad</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      placeholder="Agregar rasgo de personalidad"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPersonality())}
                    />
                    <Button type="button" onClick={handleAddPersonality}>
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("personalidad")?.map((trait, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span>{trait}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem("personalidad", index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Imagen de la mascota</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {pet ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}