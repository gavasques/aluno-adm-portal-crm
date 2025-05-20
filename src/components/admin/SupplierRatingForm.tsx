
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  rating: z.number().min(1, "É necessário selecionar uma classificação").max(5),
  comment: z.string().min(5, "Por favor, explique o motivo de sua avaliação em pelo menos 5 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierRatingFormProps {
  onSubmit: (data: FormValues) => void;
}

const SupplierRatingForm: React.FC<SupplierRatingFormProps> = ({ onSubmit }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating, { shouldValidate: true });
  };

  const currentRating = form.watch("rating");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={() => (
            <FormItem>
              <FormLabel>Classificação</FormLabel>
              <div 
                className="flex items-center" 
                onMouseLeave={handleStarLeave}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    size={32}
                    className={`cursor-pointer mr-1 ${
                      (hoverRating || currentRating) >= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => handleStarHover(rating)}
                    onClick={() => handleStarClick(rating)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentário da Avaliação</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Por favor, explique por que você está dando esta avaliação..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Enviar Avaliação</Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierRatingForm;
