
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { TokenAccount } from '@/types/tokenTypes';
import { logError } from '@/utils/errorUtils';

const useTokenAccounts = (pubKey: string | null | undefined) => {
  const { connection } = useConnection();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      if (!connection || !pubKey) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(
          new PublicKey(pubKey),
          { programId: TOKEN_PROGRAM_ID }
        );

        const parsedAccounts: TokenAccount[] = accounts.value.map((account) => {
          const parsedInfo = account.account.data.parsed.info;
          return {
            address: account.pubkey.toBase58(),
            mint: parsedInfo.mint,
            owner: parsedInfo.owner,
            tokenAmount: parsedInfo.tokenAmount.amount,
            decimals: parsedInfo.tokenAmount.decimals,
            uiAmount: parsedInfo.tokenAmount.uiAmount,
            uiAmountString: parsedInfo.tokenAmount.uiAmountString,
          };
        });

        setTokenAccounts(parsedAccounts);
      } catch (err: any) {
        setError(err);
        logError(err, 'useTokenAccounts', { publicKey: pubKey });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenAccounts();
  }, [connection, pubKey]);

  return { tokenAccounts, isLoading, error };
};

export default useTokenAccounts;
