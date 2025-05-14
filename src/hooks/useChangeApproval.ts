
import { useState, useEffect } from 'react';
import { changeApprovalService } from '@/services/changeApprovalService';
import type { PendingChange, ChangeSubmitData } from '@/types/changeApproval';
import { useAuth } from '@/hooks/useAuth';

export function useChangeApproval() {
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [userChanges, setUserChanges] = useState<PendingChange[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Check if user is admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (isAuthenticated) {
        const adminStatus = await changeApprovalService.isUserAdmin();
        setIsAdmin(adminStatus);
      }
    }
    
    checkAdminStatus();
  }, [isAuthenticated]);

  // Load pending changes for admins
  const loadPendingChanges = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      if (isAdmin) {
        const changes = await changeApprovalService.getPendingChanges();
        setPendingChanges(changes);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load current user's changes
  const loadUserChanges = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const changes = await changeApprovalService.getUserChanges();
      setUserChanges(changes);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new change
  const submitChange = async (changeData: ChangeSubmitData) => {
    const result = await changeApprovalService.submitChange(changeData);
    if (result) {
      await loadUserChanges();
      return true;
    }
    return false;
  };

  // Approve a change (admin only)
  const approveChange = async (changeId: string) => {
    if (!isAdmin) return false;
    
    const success = await changeApprovalService.approveChange(changeId);
    if (success) {
      await loadPendingChanges();
      return true;
    }
    return false;
  };

  // Reject a change (admin only)
  const rejectChange = async (changeId: string, comments?: string) => {
    if (!isAdmin) return false;
    
    const success = await changeApprovalService.rejectChange(changeId, comments);
    if (success) {
      await loadPendingChanges();
      return true;
    }
    return false;
  };

  return {
    isAdmin,
    loading,
    pendingChanges,
    userChanges,
    loadPendingChanges,
    loadUserChanges,
    submitChange,
    approveChange,
    rejectChange
  };
}
