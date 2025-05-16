
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { sendToken } from "@/services/solana/wallet/transfer";
import { jupiterService } from "@/services/solana/jupiterService";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { TransactionConfirmationModal, TransactionDetails } from "../transactions/TransactionConfirmationModal";

interface TransactionCardProps {
  onComplete?: () => void;
}

export function TransactionCard({ onComplete }: TransactionCardProps) {
  const { walletAddress, refreshWalletData } = useWalletConnection();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<TransactionDetails | null>(null);
  
  const onSubmit = async (data: any) => {
    if (!walletAddress) return;
    
    // Prepare transaction details for confirmation
    const transaction: TransactionDetails = {
      type: 'send',
      fromWallet: walletAddress,
      toWallet: data.recipient,
      amount: parseFloat(data.amount),
      token: 'SOL', // Default to SOL for now
      fee: 0.000005 // Approximate network fee
    };
    
    setPendingTransaction(transaction);
    setIsConfirmationOpen(true);
  };
  
  const executeTransaction = async () => {
    if (!pendingTransaction || !walletAddress) return false;
    
    try {
      const result = await sendToken(
        walletAddress,
        pendingTransaction.toWallet || '',
        pendingTransaction.amount,
        undefined // Use SOL by default
      );
      
      if (result) {
        // Refresh wallet data after transaction
        await refreshWalletData();
        
        // Reset form if transaction was successful
        reset();
        
        // Notify parent component
        if (onComplete) {
          onComplete();
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Transaction error:', error);
      return false;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Αποστολή SOL</CardTitle>
          <CardDescription>Στείλτε SOL σε οποιοδήποτε πορτοφόλι Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Διεύθυνση Παραλήπτη</Label>
              <Input
                id="recipient"
                placeholder="Εισάγετε διεύθυνση Solana"
                className="w-full"
                {...register("recipient", { 
                  required: "Η διεύθυνση είναι υποχρεωτική",
                  pattern: {
                    value: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
                    message: "Μη έγκυρη διεύθυνση Solana"
                  }
                })}
              />
              {errors.recipient && (
                <p className="text-sm text-red-500">
                  {errors.recipient.message?.toString()}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Ποσό SOL</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="0.0"
                className="w-full"
                {...register("amount", { 
                  required: "Το ποσό είναι υποχρεωτικό",
                  min: {
                    value: 0.000001,
                    message: "Το ποσό πρέπει να είναι μεγαλύτερο από 0"
                  }
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">
                  {errors.amount.message?.toString()}
                </p>
              )}
            </div>
            
            <Button type="submit" className="w-full">
              Αποστολή
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            Η συναλλαγή θα χρειαστεί έγκριση από το πορτοφόλι σας
          </p>
        </CardFooter>
      </Card>
      
      {pendingTransaction && (
        <TransactionConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={executeTransaction}
          transaction={pendingTransaction}
        />
      )}
    </>
  );
}
