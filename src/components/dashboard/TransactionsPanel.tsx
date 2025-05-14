
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TransactionsPanel() {
  // Sample transaction data for demonstration
  const recentTransactions = [
    {
      id: '1',
      type: 'receive',
      amount: 1.2,
      token: 'SOL',
      date: new Date(Date.now() - 30000000),
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'send',
      amount: 0.5,
      token: 'SOL',
      date: new Date(Date.now() - 86400000),
      status: 'confirmed'
    },
    {
      id: '3',
      type: 'swap',
      amount: 10,
      token: 'USDC',
      date: new Date(Date.now() - 172800000),
      status: 'confirmed'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'receive' ? 'bg-green-500/10 text-green-500' :
                  tx.type === 'send' ? 'bg-red-500/10 text-red-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {tx.type === 'receive' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                  ) : tx.type === 'send' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5" />
                      <path d="m5 12 7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m17 10-5-6-5 6" />
                      <path d="m17 14-5 6-5-6" />
                    </svg>
                  )}
                </div>
                
                <div>
                  <div className="font-medium capitalize">{tx.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {tx.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${
                  tx.type === 'receive' ? 'text-green-500' :
                  tx.type === 'send' ? 'text-red-500' : ''
                }`}>
                  {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}
                  {tx.amount} {tx.token}
                </div>
                <div className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full inline-block">
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full flex items-center justify-center" asChild>
            <Link to="/transactions">
              <span>View all transactions</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
