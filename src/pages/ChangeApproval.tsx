
import React, { useState, useEffect } from 'react';
import { useChangeApproval } from '@/hooks/useChangeApproval';
import { ChangeItem } from '@/components/change-approval/ChangeItem';
import { ChangeSubmitForm } from '@/components/change-approval/ChangeSubmitForm';
import { RejectDialog } from '@/components/change-approval/RejectDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

export default function ChangeApproval() {
  const { 
    isAdmin,
    loading,
    pendingChanges,
    userChanges,
    loadPendingChanges,
    loadUserChanges,
    submitChange,
    approveChange,
    rejectChange
  } = useChangeApproval();

  const [activeTab, setActiveTab] = useState('my-changes');
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(null);

  useEffect(() => {
    loadUserChanges();
    if (isAdmin) {
      loadPendingChanges();
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id: string) => {
    await approveChange(id);
  };

  const handleOpenRejectDialog = (id: string) => {
    setSelectedChangeId(id);
    setIsRejectDialogOpen(true);
  };

  const handleReject = async (comments: string) => {
    if (selectedChangeId) {
      await rejectChange(selectedChangeId, comments);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Σύστημα Εγκρίσεων Αλλαγών</h1>
        <Button 
          onClick={() => setIsSubmitFormOpen(true)}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Νέα Αλλαγή
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-changes">Οι Αλλαγές μου</TabsTrigger>
          {isAdmin && <TabsTrigger value="pending-changes">Εκκρεμείς Αλλαγές</TabsTrigger>}
        </TabsList>

        <TabsContent value="my-changes">
          {loading ? (
            <div className="text-center py-10">Φόρτωση...</div>
          ) : userChanges.length > 0 ? (
            <div className="space-y-4">
              {userChanges.map(change => (
                <ChangeItem 
                  key={change.id} 
                  change={change}
                  isAdmin={isAdmin}
                  onApprove={handleApprove}
                  onReject={handleOpenRejectDialog}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Δεν έχετε υποβάλει αλλαγές ακόμα.</p>
            </div>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="pending-changes">
            {loading ? (
              <div className="text-center py-10">Φόρτωση...</div>
            ) : pendingChanges.length > 0 ? (
              <div className="space-y-4">
                {pendingChanges.map(change => (
                  <ChangeItem 
                    key={change.id} 
                    change={change}
                    isAdmin={isAdmin}
                    onApprove={handleApprove}
                    onReject={handleOpenRejectDialog}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Δεν υπάρχουν εκκρεμείς αλλαγές.</p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <ChangeSubmitForm 
        isOpen={isSubmitFormOpen}
        onClose={() => setIsSubmitFormOpen(false)}
        onSubmit={submitChange}
      />

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onReject={handleReject}
      />
    </div>
  );
}
