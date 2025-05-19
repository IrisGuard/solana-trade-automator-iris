
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface Wallet {
  id: string;
  user_id: string;
  address: string;
  blockchain: string;
  is_primary: boolean;
}

interface Token {
  id: string;
  user_id: string;
  token_address: string;
  name: string;
  symbol: string;
  amount: number;
  logo?: string;
}

interface Bot {
  id: string;
  user_id: string;
  name: string;
  strategy: string;
  active: boolean;
  config: any;
}

interface BotPerformance {
  id: string;
  bot_id: string;
  profit_percentage: number;
  profit_amount: number;
  total_trades: number;
  successful_trades: number;
}

interface BotTransaction {
  id: string;
  bot_id: string;
  transaction_type: string;
  token_symbol: string;
  amount: number;
  price?: number;
  signature?: string;
  status: string;
}

export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Αρχικοποίηση βάσης δεδομένων...');
    
    // Έλεγχος σύνδεσης
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Χρειάζεται σύνδεση για αρχικοποίηση της βάσης δεδομένων');
      toast.error('Παρακαλώ συνδεθείτε πρώτα για να αρχικοποιήσετε τα δεδομένα');
      return false;
    }
    
    const userId = session.user.id;
    console.log('Χρήστης για αρχικοποίηση:', userId);
    
    // Έλεγχος αν υπάρχει ήδη το προφίλ
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (!existingProfile) {
      // Δημιουργία προφίλ
      const profile: Profile = {
        id: userId,
        full_name: 'Demo User',
        avatar_url: 'https://github.com/shadcn.png'
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profile);
        
      if (profileError) {
        console.error('Σφάλμα δημιουργίας προφίλ:', profileError);
        return false;
      }
      
      console.log('Προφίλ δημιουργήθηκε επιτυχώς');
    } else {
      console.log('Το προφίλ υπάρχει ήδη');
    }
    
    // Έλεγχος αν υπάρχει ήδη πορτοφόλι
    const { data: existingWallets } = await supabase
      .from('wallets')
      .select('id, address')
      .eq('user_id', userId);
    
    let walletAddress = '';
    
    if (!existingWallets || existingWallets.length === 0) {
      // Δημιουργία πορτοφολιού
      walletAddress = '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8'; // Demo address
      const wallet: Wallet = {
        id: uuidv4(),
        user_id: userId,
        address: walletAddress,
        blockchain: 'solana',
        is_primary: true
      };
      
      const { error: walletError } = await supabase
        .from('wallets')
        .insert(wallet);
        
      if (walletError) {
        console.error('Σφάλμα δημιουργίας πορτοφολιού:', walletError);
        return false;
      }
      
      console.log('Πορτοφόλι δημιουργήθηκε επιτυχώς');
    } else {
      console.log('Πορτοφόλια που υπάρχουν ήδη:', existingWallets.length);
      walletAddress = existingWallets[0].address;
    }
    
    // Έλεγχος αν υπάρχουν ήδη tokens
    const { data: existingTokens } = await supabase
      .from('tokens')
      .select('id')
      .eq('user_id', userId);
    
    if (!existingTokens || existingTokens.length === 0) {
      // Δημιουργία tokens
      const tokens: Token[] = [
        {
          id: uuidv4(),
          user_id: userId,
          token_address: 'So11111111111111111111111111111111111111112',
          name: 'Solana',
          symbol: 'SOL',
          amount: 10.5,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          id: uuidv4(),
          user_id: userId,
          token_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          name: 'USD Coin',
          symbol: 'USDC',
          amount: 350.75,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          id: uuidv4(),
          user_id: userId,
          token_address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          name: 'USDT',
          symbol: 'USDT',
          amount: 250.25,
          logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
        }
      ];
      
      const { error: tokensError } = await supabase
        .from('tokens')
        .insert(tokens);
        
      if (tokensError) {
        console.error('Σφάλμα δημιουργίας tokens:', tokensError);
        return false;
      }
      
      console.log('Tokens δημιουργήθηκαν επιτυχώς');
    } else {
      console.log('Tokens που υπάρχουν ήδη:', existingTokens.length);
    }
    
    // Λήψη templates για δημιουργία bots
    const { data: botTemplates } = await supabase
      .from('bot_templates')
      .select('*');
      
    if (!botTemplates || botTemplates.length === 0) {
      console.error('Δεν βρέθηκαν πρότυπα bot για να δημιουργηθούν bots');
      return false;
    }
    
    // Έλεγχος αν υπάρχουν ήδη bots
    const { data: existingBots } = await supabase
      .from('bots')
      .select('id')
      .eq('user_id', userId);
    
    if (!existingBots || existingBots.length === 0) {
      // Δημιουργία bots από τα πρότυπα
      const bots: Bot[] = botTemplates.map(template => ({
        id: uuidv4(),
        user_id: userId,
        name: `My ${template.name}`,
        strategy: template.strategy,
        active: Math.random() > 0.5, // Τυχαία ενεργοποίηση
        config: template.default_config
      }));
      
      const { error: botsError } = await supabase
        .from('bots')
        .insert(bots);
        
      if (botsError) {
        console.error('Σφάλμα δημιουργίας bots:', botsError);
        return false;
      }
      
      console.log('Bots δημιουργήθηκαν επιτυχώς');
      
      // Δημιουργία δεδομένων απόδοσης για κάθε bot
      const botPerformances: BotPerformance[] = bots.map(bot => ({
        id: uuidv4(),
        bot_id: bot.id,
        profit_percentage: Math.random() * 20 - 5, // Από -5% έως 15%
        profit_amount: Math.random() * 1000,
        total_trades: Math.floor(Math.random() * 50),
        successful_trades: Math.floor(Math.random() * 40)
      }));
      
      const { error: performancesError } = await supabase
        .from('bot_performance')
        .insert(botPerformances);
        
      if (performancesError) {
        console.error('Σφάλμα δημιουργίας δεδομένων απόδοσης:', performancesError);
        return false;
      }
      
      console.log('Δεδομένα απόδοσης δημιουργήθηκαν επιτυχώς');
      
      // Δημιουργία συναλλαγών για κάθε bot
      const transactionTypes = ['buy', 'sell'];
      const tokenSymbols = ['SOL', 'USDC', 'USDT'];
      const statuses = ['completed', 'pending', 'failed'];
      
      const botTransactions: BotTransaction[] = [];
      
      bots.forEach(bot => {
        const numTransactions = Math.floor(Math.random() * 10) + 1;
        
        for (let i = 0; i < numTransactions; i++) {
          botTransactions.push({
            id: uuidv4(),
            bot_id: bot.id,
            transaction_type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            token_symbol: tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)],
            amount: Math.random() * 10,
            price: Math.random() * 100,
            signature: `${bot.id.substring(0, 8)}-${Math.random().toString(36).substring(2, 10)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)]
          });
        }
      });
      
      if (botTransactions.length > 0) {
        const { error: transactionsError } = await supabase
          .from('bot_transactions')
          .insert(botTransactions);
          
        if (transactionsError) {
          console.error('Σφάλμα δημιουργίας συναλλαγών:', transactionsError);
          return false;
        }
        
        console.log('Συναλλαγές δημιουργήθηκαν επιτυχώς');
      }
    } else {
      console.log('Bots που υπάρχουν ήδη:', existingBots.length);
    }
    
    console.log('Η βάση δεδομένων αρχικοποιήθηκε επιτυχώς!');
    toast.success('Η βάση δεδομένων αρχικοποιήθηκε επιτυχώς!');
    return true;
  } catch (error) {
    console.error('Σφάλμα κατά την αρχικοποίηση της βάσης δεδομένων:', error);
    toast.error('Σφάλμα κατά την αρχικοποίηση της βάσης δεδομένων');
    return false;
  }
};

// Επιπλέον βοηθητική συνάρτηση για έλεγχο και ενημέρωση των Helius API keys
export const syncHeliusKeys = async (): Promise<boolean> => {
  try {
    console.log('Συγχρονισμός κλειδιών Helius...');
    
    // Έλεγχος σύνδεσης
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Χρειάζεται σύνδεση για συγχρονισμό των κλειδιών API');
      toast.error('Παρακαλώ συνδεθείτε πρώτα για να συγχρονίσετε τα κλειδιά API');
      return false;
    }
    
    const userId = session.user.id;
    
    // Λήψη των κλειδιών Helius
    const { data: heliusKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Σφάλμα λήψης κλειδιών Helius:', error);
      return false;
    }
    
    if (!heliusKeys || heliusKeys.length === 0) {
      console.warn('Δεν βρέθηκαν κλειδιά Helius');
      return false;
    }
    
    // Αποθήκευση του πρώτου ενεργού κλειδιού στο localStorage
    const activeKey = heliusKeys.find(key => key.status === 'active');
    
    if (activeKey) {
      localStorage.setItem('api_key_helius', JSON.stringify({
        key: activeKey.key_value,
        timestamp: Date.now()
      }));
      
      console.log('Το κλειδί Helius αποθηκεύτηκε στο localStorage');
      
      // Επαναρχικοποίηση της υπηρεσίας Helius
      const { heliusService } = await import('@/services/helius/HeliusService');
      heliusService.reinitialize();
      
      toast.success('Τα κλειδιά Helius συγχρονίστηκαν επιτυχώς');
      return true;
    } else {
      console.warn('Δεν βρέθηκαν ενεργά κλειδιά Helius');
      return false;
    }
  } catch (error) {
    console.error('Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius:', error);
    toast.error('Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius');
    return false;
  }
};
