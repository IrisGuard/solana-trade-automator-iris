
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ChangeSubmitData } from '@/types/changeApproval';

interface ChangeSubmitFormProps {
  onSubmit: (data: ChangeSubmitData) => Promise<boolean>;
  isOpen: boolean;
  onClose: () => void;
}

export function ChangeSubmitForm({ onSubmit, isOpen, onClose }: ChangeSubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<{
    table_name: string;
    record_id: string;
    changes: string;
  }>({
    defaultValues: {
      table_name: '',
      record_id: '',
      changes: '{}'
    }
  });

  const handleSubmit = async (values: {
    table_name: string;
    record_id: string;
    changes: string;
  }) => {
    setIsSubmitting(true);
    try {
      let changesJson: Record<string, any>;
      
      try {
        changesJson = JSON.parse(values.changes);
      } catch (error) {
        form.setError('changes', { 
          type: 'manual', 
          message: 'Μη έγκυρο JSON' 
        });
        return;
      }
      
      const data: ChangeSubmitData = {
        table_name: values.table_name,
        record_id: values.record_id,
        changes_json: changesJson
      };
      
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Υποβολή Αιτήματος Αλλαγών</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="table_name"
              rules={{ required: 'Το όνομα του πίνακα είναι απαραίτητο' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Όνομα Πίνακα</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. api_endpoints" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="record_id"
              rules={{ required: 'Το ID της εγγραφής είναι απαραίτητο' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Εγγραφής</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. 1a2b3c4d-5e6f-7g8h-9i0j" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="changes"
              rules={{ required: 'Οι αλλαγές είναι απαραίτητες' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Αλλαγές (JSON μορφή)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='{"name": "Νέο όνομα", "is_active": false}'
                      className="min-h-32 font-mono"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Ακύρωση
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Υποβολή...' : 'Υποβολή'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
